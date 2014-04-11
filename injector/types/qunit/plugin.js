;(function(){

  function post(url, json, cb){
    var req;

    if (window.ActiveXObject)
      req = new ActiveXObject('Microsoft.XMLHTTP');
    else if (window.XMLHttpRequest)
      req = new XMLHttpRequest();
    else
      throw "Strider: No ajax"

    var data = JSON.stringify(json)
    req.open("POST", url, true);
    // req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // req.setRequestHeader('Content-length',  data.length);
    // req.setRequestHeader('Connection', 'close');
    req.send(data);
  }


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

    if (window.__codeswarm_postResultsURL) {
      post(window.__codeswarm_postResultsURL, state.results)
    }
  });

})();