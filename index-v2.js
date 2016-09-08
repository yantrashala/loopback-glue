var index = 1;
var explorer = require('loopback-component-explorer');
var boot = require('loopback-boot');
module.exports = function glue(app, options, callback) {
  console.log("executing V2")
  boot(app, options.appRootDir, function(err) {
    glueSubApps(app, options, callback);
  });

}

function glueSubApps(app, options, callback) {
  options.subApps && options.subApps.map(function(childAppOptions) {
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

/*

var options = {
  "subApps": [
  {
  "name": "subApp1",
  "exclude": true,
  "explorerPath": "path",
  "gluePrefix": "commerce"
}
]
}
*/
