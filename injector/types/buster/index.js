var fs = require('fs');
var path = require('path');

/// Also intercept these URLs:

var urls = exports.urls = [
  '/__codeswarm-gateway/buster/plugin.js',
  '/__codeswarm-gateway/buster/json2.js'
];

var scripts = urls.map(function(scriptPath) {
  return '<script src="' + scriptPath + '"></script>';
});

/// inject

exports.inject = inject;

function inject(req, res, docRoot) {
  if (urls.indexOf(req.url) >= 0) {
    var p = path.join(__dirname, path.basename(req.url));
    fs.createReadStream(p).pipe(res);
  } else {
    fs.readFile(path.join(docRoot, req.url), { encoding: 'utf8'}, readFile);
  }

  function readFile(err, file) {
    if (err) {
      res.writeHead(500, err.message);
      res.end();
      return;
    }

    file = file.replace(/(.*)<\/body>/, "$1" + scripts.join('') + '</body>');

    res.end(file);
  }
}