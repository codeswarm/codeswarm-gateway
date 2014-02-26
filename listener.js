var Static = require('node-static');

module.exports = Listener;

function Listener(gateway, docroot) {
  var staticFileServer = new Static.Server(docroot);

  return function(req, res) {
    gateway(req, res, next);

    function next(err) {
      if (err) return error(err);

      staticFileServer.serve(req, res);
    }

    function error(err) {
      res.statusCode = 500;
      res.end(err.message);
    }
  }
}