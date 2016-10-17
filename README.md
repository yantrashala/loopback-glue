# loopback-glue
----------------

[![NPM](https://nodei.co/npm/loopback-glue.png?downloads=true)](https://nodei.co/npm/loopback-glue/)

 [![NPM](https://nodei.co/npm-dl/loopback-glue.png?months=3&height=3)](https://nodei.co/npm/loopback-glue/)
 
 [![Build status](https://api.travis-ci.org/yantrashala/loopback-glue.svg?branch=v1.0.0)](https://api.travis-ci.org/yantrashala/loopback-glue.svg?branch=v1.0.0) [![codecov](https://codecov.io/gh/yantrashala/loopback-glue/branch/v1.0.0/graph/badge.svg)](https://codecov.io/gh/yantrashala/loopback-glue)

Note loopback-glue has upgraded to v1.0.0, Please find the old implementation details here [loopback-glue-Old-Implementation]

Whats New!

 * Your code can be more modularized.
 * Glue now supports middleware.
 * You can find examples here [loopback-glue-example].
 * You can now maintain shared configuration for production deployments.
 
 

Booting utility to glue multiple loopback projects together

To use the module:

1. Load loopback-glue in place of loopback-boot

    ```js
    var glue = require('loopback-glue'); //var boot = require('loopback-boot');
    ```

2. Create an options object for glue. The option object inherits the loopback-boot [option][Option] object. On top of the original option object we are adding a new attribute called subapps.

    The "subapps" attribute is an array of glue based [loopback] projects. Each element of the array should have the loopback project name, prefix.

    ```js
    var options = {
      "appRootDir" : __dirname,
      "subapps" : [
        {
          "name" : "app-name",
          "app" : [loopback-app-object], [optional]
          "gluePrefix" : "api1", //this prefix will be added to the childApp Url's
          "exclude" : true/false //[optional]
        }
      ]
    };
    ```
    
  app - You can specify an app object by require when the subapp is located in a different location, if you dont specify app then glue will search a loopback project in the node-modules.
  
  gluePrefix - You can specify the path where the subapp could be mounted on, if you dont specify a path glue considers api with an index (ie. api1, api2) as the path to mount.
  
  exclude - You can exlude a subapp with this flag.

3. Replace boot loading by the following code:

    ```javascript
    // Sub-apps like REST API are mounted via boot scripts.
    glue(app, options, function(err,instructions) {
      if (err) throw err;

      // start the server if $ node server.js
      if (require.main === module)
        app.start();

    });
    ```

4. Example
 [loopback-glue-example]


See Also
--------------------------

- [Loopback][loopback]
- [Loopback-boot][loopback-boot]

[option]: https://apidocs.strongloop.com/loopback-boot/
[loopback-boot]: https://apidocs.strongloop.com/loopback-boot/
[loopback]: http://loopback.io
[loopback-glue-example]: https://github.com/yantrashala/loopback-glue-example
[loopback-glue-Old-Implementation]: https://github.com/yantrashala/loopback-glue/wiki/ReadMe--0.2.1
