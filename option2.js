'use strict';

var index = 0;
var explorer = require('loopback-component-explorer');
var boot = require('loopback-boot');

function mountExplorerforChildApp(childApp, prefix) {
  childApp.lazyrouter();
    var stack = childApp._router.stack, explorerOptions = childApp.get("loopback-component-explorer");
    function removeAttachedExplorer(route, i, routes) {
        if (route && route.name === "router" && route.regexp.toString().indexOf("explorer") > 0) {
            routes.splice(i, 1);
        }
    }
    stack.forEach(removeAttachedExplorer);
    if (explorerOptions && explorerOptions.mountPath) {
        explorer(childApp, {
            basePath: prefix + childApp.get('restApiRoot'),
            mountPath: explorerOptions.mountPath
        });
    }
}

module.exports = function glueSubApps(app, options, callback) {
    options.subapps.map(function (childAppOptions) {
        index = index + 1;
        var childApp = childAppOptions.app || require(childAppOptions.name), prefix = childAppOptions.mountPath || childApp.get('mountPath') || "/api" + index;
        app.use(prefix, childApp);
        app[childAppOptions.name] = childApp;
        console.log("Mounting subapp (" + childAppOptions.name + ") at " + prefix);
        mountExplorerforChildApp(childApp, prefix);
    });
    boot(app, options.appRootDir, callback);
};
