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
      var err = JSON.stringify(res);
      state.results.errors.push(err);
    }
  });

  QUnit.done(function(results){
    state.ended = true;
    state.results.results = results;
  });

})();