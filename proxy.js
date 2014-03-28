var http    = require('http');
var request = require('request');
var Proxy   = require('http-proxy');

module.exports = proxy;

function proxy(port, Injector) {
  var server = http.createServer(listener);

  var proxy = Proxy.createProxyServer({});

  function listener(req, res) {
    var injector;

    var injector;
    if (req.method.toLowerCase() == 'get') {
      injector = Injector.match(req.url);
    }

    if (injector) {

      console.log('proxying and injecting %s', req.url);

      request({
        url: 'http://localhost:' + port + req.url,
        headers: req.headers
      }, function(err, _res, body) {
        if (err) {
          console.error(err.stack);
          res.writeHead(500);
          return res.end(err.message);
        }
        res.writeHead(_res.statusCode || 200, _res.headers);
        console.log('INJECTOR:', injector);
        body = injector.transform(req.url, body);
        console.log('reply body:', body);
        res.end(body);
      });

    } else {

      proxy.web(req, res, {
        target: 'http://localhost:' + port
      });

    }
  }

  server.listen(8080, function() {
    console.log('Gateway server on docroot %j listening on port %d'.green, 'PROXY:' + port, port);
  });
}