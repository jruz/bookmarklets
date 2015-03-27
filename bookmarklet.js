(function(){
  if (typeof(REPLACE_VARNAME) === 'undefined'){
    var base_url  = 'http://jruz.github.io/bookmarklets/',
        random    = Math.floor((Math.random() * 100) + 1),
        ending    = '.js?vi=' + random,
        url       = base_url + 'REPLACE_FILENAME' + ending,
        script    = document.createElement('script');
    script.src= url;
    document.body.appendChild(script);
  }
  REPLACE_VARNAME.run();
})();
