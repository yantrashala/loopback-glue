var index = 1;
var explorer = require('loopback-component-explorer');
var oldImplementation = require('./index-old');
var boot = require('loopback-boot');
module.exports = function glue(app, options, callback) {

if(options.appRootDir) {
  if( options.subapps && options.subapps.length>0 ) {
    var current = true,old = true;
    options.subapps.map(function(ca) {
      if(!ca.name) {
        current = false;
      }
    })

    if(current) {
      boot(app, options.appRootDir, function(err) {
        glueSubApps(app, options, callback);
      });
    } else {
      oldImplementation(app, options, callback);
    }

    function glueSubApps(app, options, callback) {
      options.subapps && options.subapps.map(function(childAppOptions) {
        if(!childAppOptions.exclude) {
          var childApp = childAppOptions.app || require(childAppOptions.name);
          var prefix = childAppOptions.gluePrefix || childApp.get('gluePrefix') || "/api"+index++;
          app.use(prefix, childApp);
          console.log("Mounting subapp ("+childAppOptions.name+") at " +prefix);
          var stack = childApp._router.stack;
          stack.forEach(removeAttachedExplorer);
          function removeAttachedExplorer(route, i, routes) {
              if(route && route.name=="router" && route.regexp.toString().indexOf("explorer")>0) {
                routes.splice(i, 1);
              }
          }
          var childExplorerOptions = childApp.get("loopback-component-explorer");
          if(childExplorerOptions && childExplorerOptions.mountPath) {
            explorer(childApp, {
                basePath: prefix+childApp.get('restApiRoot'),
                mountPath: childExplorerOptions.mountPath
            })
          }
        }
      })
      callback();
    }
  }
  else {
    oldImplementation(app, options, callback);
  }
} else {
  throw new Error("Please provide valid options.")
}

}
