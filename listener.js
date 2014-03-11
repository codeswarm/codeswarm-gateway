var Static = require('node-static');

module.exports = Listener;

function Listener(gateway, docroot, options) {
  var staticFileServer = new Static.Server(docroot);

  return function(req, res) {
    gateway(req, res, next);

    function next(err) {
      var injector;
      if (err) return error(err);

      if (options.injector && req.method.toLowerCase() == 'get')
        injector = options.injector.match(req.url);

      if (injector) injector.inject(req, res, docroot);
      else staticFileServer.serve(req, res);
    }

    function error(err) {
      res.statusCode = 500;
      res.end(err.message);
    }
  }
}