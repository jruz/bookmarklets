$( document ).ready(function() {

  var App = {
    
    createBookmark: function (file_name, var_name, button_text){
      var container = document.getElementById('container'),
          btn = document.createElement("a"),
          script;
      script = this.getScript();
      script.replace('REPLACE_VARNAME', var_name).replace('REPLACE_FILENAME', file_name);
      script = encodeURI(script);

      btn.createTextNode(button_text);
      btn.setAttribute('href', 'javascript:' + script);
      btn.className = 'btn';
      
      container.appendChild(btn);
    },

    getScript: function(){
      var script;
      $.load('/bookmarklet.js', function(res){
        script = res;
      });
      return script;
    },

    init: function(){
      this.createBookmark('story-points', 'storyPoints', 'Calculate Points');
    }

  };

  App.init();

});


