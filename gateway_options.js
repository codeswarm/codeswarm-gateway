var extend = require('util')._extend;
module.exports = GatewayOptions;

var optionsMap = {
  'php': {
    '.php': 'php-cgi'
  }
}

function GatewayOptions(types) {
  var options = {};

  types.forEach(function(type) {
    var newOptions = optionsMap[type];
    if (! newOptions) throw new Error('Unsupported type: ' + type);
    options = extend(options, newOptions);
  });

  return options;
}