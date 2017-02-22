//=include ../../node_modules/jquery/dist/jquery.min.js

//=include modules/animateAnchors.js
//=include modules/throttle.js

var s,
APP = {

  settings: {
    numArticles: 5,
    articleList: $("#article-list"),
    moreButton: $("#more-button")
  },

  init: function() {
    s = this.settings;
    this.bindUIActions();
  },

  bindUIActions: function() {
    s.moreButton.on("click", function() {
      APP.getMoreArticles(s.numArticles);
    });
  },

  log: function() {
    console.log("wow");
  },

  getMoreArticles: function(numToGet) {
    // $.ajax or something
    // using numToGet as param
  }

};

(function() {

  APP.init();

})();