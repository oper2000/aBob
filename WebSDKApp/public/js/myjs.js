// Filename: main.js

// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    ibmmobilefirstplatformfoundationanalytics: '../js/analytics/ibmmobilefirstplatformfoundationanalytics',
    ibmmobilefirstplatformfoundationlogger: '../js/analytics/ibmmobilefirstplatformfoundationlogger',
    worklight: '../js/worklight',
  }

});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
      demoApp = App;
});


