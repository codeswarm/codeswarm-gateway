var InjectorTypes = require('./types');

module.exports = Injector;

function Injector(injections) {
  this._map = {};

  this.parseInjections(injections);
}


var I = Injector.prototype;

I.parseInjections = function parseInjections(injections) {
  injections.map(this.parseInjection.bind(this));
};

I.parseInjection = function parseInjection(injection) {
  var self = this;

  var idx = injection.lastIndexOf(':');
  if (! idx < 0) throw new Error('illegal injector syntax. should be <path>:<type>');
  var url = injection.substring(0, idx);
  if (url.charAt(0) != '/') url = '/' + url;
  var type = injection.substring(idx + 1);

  var injectorType = InjectorTypes[type];

  if (! injectorType) throw new Error('Unknown injector type:')

  this._map[url] = injectorType;
  if (injectorType.urls) {
    injectorType.urls.forEach(function(url) {
      self._map[url] = injectorType;
    });
  }
}

I.match = function match(url) {
  var injector = this._map[url];
  return injector;
};