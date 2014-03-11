;(function(){

  var state = window.__codeswarm = {
    ended: false,
    results: {
      results: [],
      errors: []
    }
  };

  QUnit.log(function(res) {
    if (res && ! res.result) {
      state.results.errors.push(JSON.stringify(res));
    }
  });

  QUnit.done(function(results){
    state.ended = true;
    state.results.results = results;
  });

})();