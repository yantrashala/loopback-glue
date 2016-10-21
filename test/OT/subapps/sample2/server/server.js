var loopback = require('loopback');
//var boot = require('loopback-boot');
var glue = require('../../../../../index');
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
  "appRootDir" : __dirname
};

glue(app, options, function(err,instructions) {
  if (err) throw err;

  // start the server if $ node server.js
  if (require.main === module)
    app.start();
  else {
    // in case its not the parent app, exporting instructions to load from parent
    app.glue = {'instructions' : instructions, glueOption : options};
  }

});
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
// boot(app, __dirname, function(err) {
//   if (err) throw err;
//
//   // start the server if `$ node server.js`
//   if (require.main === module)
//     app.start();
// });
