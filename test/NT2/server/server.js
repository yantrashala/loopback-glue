var loopback = require('loopback');
//var boot = require('loopback-boot');
//var glue = require('loopback-glue');
var glue = require('../../../index');
var app = module.exports = loopback();
app.start = function() {
  // start the web server
  //glue(app, child1, child2);
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
  subapps: []
}
glue(app, options, function(err) {
    if(err) throw err;

    if(require.main === module)
      app.start();
})
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
// boot(app, __dirname, function(err) {
//   if (err) throw err;
//
//   // start the server if `$ node server.js`
//   if (require.main === module)
//     app.start();
// });
