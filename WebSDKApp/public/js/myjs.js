// Filename: main.js

// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    ibmmfpfanalytics: '../js/analytics/ibmmfpfanalytics',
    ibmmfpf: '../js/ibmmfpf',
  }

});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
      demoApp = App;
});


