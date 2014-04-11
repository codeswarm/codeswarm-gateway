var fs = require('fs');
var path = require('path');

/// Also intercept these URLs:

var urls = exports.urls = [
  '/__codeswarm-gateway/qunit/plugin.js',
  '/__codeswarm-gateway/qunit/json2.js'
];

var scripts = urls.map(function(scriptPath) {
  return '<script src="' + scriptPath + '"></script>';
});

/// inject

exports.inject = inject;

function inject(req, res, docRoot, options) {
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

    var reply = transform(req.url, file, options);
    console.log('injecting reply to %s %s: %j', req.method, req.url, reply);
    res.end(reply);
  }
}

/// transform

exports.transform = transform;

function transform(url, body, options) {

  console.log('TRANSFORM OPTIONS', options);

  var postResultsURL = options.postResultsURL;
  var _scripts = scripts.slice(0);
  if (postResultsURL) {
    _scripts.unshift(injectPostResultsURLScript(postResultsURL));
  }
  return body.replace(/(.*)<\/body>/, "$1" + _scripts.join('') + '</body>');
}

function injectPostResultsURLScript(postResultsURL) {
  return '<script>__codeswarm_postResultsURL = "' + postResultsURL + '";</script>'
}