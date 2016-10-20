var index = 1;
var explorer = require('loopback-component-explorer');
var boot = require('loopback-boot');
module.exports = function glueSubApps(app, options, callback) {
  options.subapps && options.subapps.map(function(childAppOptions) {
    var childApp = childAppOptions.app || require(childAppOptions.name);
    var prefix = childAppOptions.mountPath || childApp.get('mountPath') || "/api"+index++;
    app.use(prefix, childApp);
    console.log("Mounting subapp ("+childAppOptions.name+") at " +prefix);
    mountExplorerforChildApp(childApp,prefix);
  })
  callback();
};

function mountExplorerforChildApp(childApp,prefix) {
  childApp.lazyrouter();
  var stack = childApp._router.stack;
  stack.forEach(removeAttachedExplorer);
  function removeAttachedExplorer(route, i, routes) {
      if(route && route.name=="router" && route.regexp.toString().indexOf("explorer")>0) {
        routes.splice(i, 1);
      }
  }
  var explorerOptions = childApp.get("loopback-component-explorer");
  if(explorerOptions && explorerOptions.mountPath) {
    explorer(childApp, {
        basePath: prefix+childApp.get('restApiRoot'),
        mountPath: explorerOptions.mountPath
    })
  }
}
