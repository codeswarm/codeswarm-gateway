module.exports = serverListen;

function serverListen(server, ports, cb) {
  var portIndex = 0;

  tryPort(ports[portIndex]);

  function tryPort(port) {
    server.on('error', onServerError);
    server.on('listening', listening);

    server.listen(port);

    function listening() {
      server.removeListener('error', onServerError);
      server.removeListener('listening', listening);
      cb(null, port);
    }

    function onServerError(err) {
      server.removeListener('error', onServerError);
      server.removeListener('listening', listening);
      if (err.code == 'EADDRINUSE' || err.code == 'EACCES') {
        portIndex ++;
        if (ports.length <= portIndex) {
          cb(new Error('Wasnt able to listen in any of the ports (' + ports.join(',') + ')'));
        } else {
          tryPort(ports[portIndex]);
        }
      } else server.emit('error', err);
    }
  }
}