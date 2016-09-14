global.STRONGLOOP_GLB = null;
var index = 1;
var explorer = require('loopback-component-explorer');
var v1 = require('./ov');
var boot = require('loopback-boot');
module.exports = function glue(app, options, callback) {


  if( options.subapps && options.subapps[0].name ) {
    //consider v2
    boot(app, options.appRootDir, function(err) {
      glueSubApps(app, options, callback);
    });

    function glueSubApps(app, options, callback) {
      options.subapps && options.subapps.map(function(childAppOptions) {
        if(!childAppOptions.exclude) {
          var childApp = require(childAppOptions.name);
          var prefix = childAppOptions.gluePrefix || childApp.get('gluePrefix') || "/api"+index++;
          var explorerPath = "/explorer";
          app.use(prefix, childApp);
          console.log("Mounting subapp ("+childAppOptions.name+") at " +prefix+ "\nExplorer at " + prefix + explorerPath);
          explorer(childApp, {
            basePath: prefix+childApp.get('restApiRoot'),
            mountPath: explorerPath
          })
        }
      })
      callback();
    }
  } else {
    //consider v1
    v1(app, options, callback);
  }

}
