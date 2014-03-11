;(function(){

  var state = window.__codeswarm = {
    ended: false,
    results: []
  };

  var striderErrors = []
    , i = 0

  QUnit.done(function(results){
    state.ended = true;
    state.results = results;
  });

})();