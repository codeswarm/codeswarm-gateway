#!/usr/bin/env node

var Injector = require('./injector');
var server_listen = require('./server_listen');

process.on('uncaughtException', onProcessUncaughtException);

require('colors');

var argv           = require('minimist')(process.argv.slice(2));
var Gateway        = require('./gateway');
var GatewayOptions = require('./gateway_options');
var Listener       = require('./listener');
var proxy          = require('./proxy');
var server_listen  = require('./server_listen');

/// docroot

var docroot = argv.docroot;
if (!docroot) return error('Must supply --docroot argument containing the root directory');


/// inject
var injections = argv.inject;
if (! injections) injections = [];
else if (! Array.isArray(injections)) injections = [injections];
var injector = new Injector(injections);

/// ports

var ports = argv.ports || argv.port || '8080';
ports = ports.split(',');

/// proxy

var proxyPort = argv.proxy;
if (proxyPort) {
  proxy(ports, proxyPort, injector);
  return; // stop setup, we have what we need
}


/// file types

var types = argv.type || 'php';
if (!Array.isArray(types)) types = [types];


/// post results url
var postResultsURL = argv['post-results-url']


/// Gateway
var options = GatewayOptions(types);
var gateway = Gateway(docroot, options);


/// Server
var listenerOptions = {
  injector: injector,
  postResultsURL: postResultsURL
};

var listener = Listener(gateway, docroot, listenerOptions);
var server = require('http').createServer(listener);


/// Listen


server_listen(server, ports, function(err, port) {
  if (err) error(err);
  else console.log('Gateway server on docroot %j listening on port %d'.green, docroot, port);
});

/// Misc


function error(err) {
  console.error('Error:' + (err.stack || err.message || err));
  process.exit(1);
}

function onProcessUncaughtException(err) {
  console.error(err.stack || err);
  error(err.message || err);
}
