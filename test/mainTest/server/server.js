var loopback = require('loopback');
//var boot = require('loopback-boot');
var glue = require('../../../index');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};


var options = {
  appRootDir: __dirname,
  subapps: [{
    name: "child1",
    app: require("../../subApps/child1")
  },
  {
    name: "child2",
    app: require("../../subApps/child2")
  }]
}
glue(app, options, function() {
    app.start();
})
