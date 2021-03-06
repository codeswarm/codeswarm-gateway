var http    = require('http');
var request = require('request');
var Proxy   = require('http-proxy');

var server_listen = require('./server_listen');

module.exports = proxy;

function proxy(ports, proxyPort, Injector) {
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
        url: 'http://localhost:' + proxyPort + req.url,
        headers: req.headers
      }, function(err, _res, body) {
        if (err) {
          console.error(err.stack);
          res.writeHead(500);
          return res.end(err.message);
        }
        res.writeHead(_res.statusCode || 200, _res.headers);
        body = injector.transform(req.url, body);
        res.end(body);
      });

    } else {

      proxy.web(req, res, {
        target: 'http://localhost:' + proxyPort
      });

    }
  }

  server_listen(server, ports, function(err, port) {
    if (err) throw err;
    console.log('Gateway server on docroot %j listening on port %d'.green, 'PROXY:' + proxyPort, port);
  });
}