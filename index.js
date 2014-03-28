#!/usr/bin/env node

var Injector = require('./injector');

process.on('uncaughtException', onProcessUncaughtException);

require('colors');

var argv           = require('minimist')(process.argv.slice(2));
var Gateway        = require('./gateway');
var GatewayOptions = require('./gateway_options');
var Listener       = require('./listener');
var proxy          = require('./proxy');

/// docroot

var docroot = argv.docroot;
if (!docroot) return error('Must supply --docroot argument containing the root directory');


/// inject
var injections = argv.inject;
if (! injections) injections = [];
else if (! Array.isArray(injections)) injections = [injections];
var injector = new Injector(injections);

console.log('INJECTOR:', injector);


/// proxy

var proxyPort = argv.proxy;
if (proxyPort) {
  proxy(proxyPort, injector);
  return; // stop setup, we have what we need
}


/// file types

var types = argv.type || 'php';
if (!Array.isArray(types)) types = [types];


/// Gateway
var options = GatewayOptions(types);
var gateway = Gateway(docroot, options);


/// Server
var listenerOptions = {
  injector: injector
};

var listener = Listener(gateway, docroot, listenerOptions);
var server = require('http').createServer(listener);


/// Listen

var port = Number(argv.port) || 8080;
server.listen(8080, function() {
  console.log('Gateway server on docroot %j listening on port %d'.green, docroot, port);
});


/// Misc


function error(msg) {
  console.error(msg.red);
  process.exit(1);
}

function onProcessUncaughtException(err) {
  console.error(err.stack || err);
  error(err.message || err);
}