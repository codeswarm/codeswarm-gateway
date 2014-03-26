;(function(){

  var state = window.__codeswarm = {
    ended: false,
    results: {
      results: {
        failed: 0,
        total: 0,
        passed: 0
      },
      errors: []
    }
  };

  var runner = {
    create: function (options) {
      return Object.create(this);
    },

    listen: function (runner) {
      var oldEmit = runner.emit;
      runner.emit = function(ev) {
        console.log('emitting', ev);
        oldEmit.apply(runner, arguments);
      };

      runner.on('test:start', function() {
        state.results.results.total += 1;
      });

      runner.on("test:failure", function (error) {
        state.results.results.failed += 1;
        state.results.errors.push(error.message || JSON.stringify(error));
      });

      runner.on("test:success", function (test) {
        state.results.results.passed += 1;
      });

      runner.on('suite:end', function() {
        state.ended = true;
      });
    }
  };

  runner.listen(buster.testRunner);

})();