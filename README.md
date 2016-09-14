# loopback-glue

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
          "gluePrefix" : "api1", //this prefix will be added to the childApp Url's
          "exclude" : true/false //[optional]
        }
      ]
    };
    ```

3. Replace boot loading by the following code:

    ```javascript
    // Bootstrap the application, configure models, datasources and middleware.
    // Sub-apps like REST API are mounted via boot scripts.
    glue(app, options, function(err,instructions) {
      if (err) throw err;

      // start the server if $ node server.js
      if (require.main === module)
        app.start();

    });
    ```


 Roadmap
 --------------------------
 - Improve documentation
 - Loading models and datasources based on usage from model.json and datasources.json
 - Test coverage

 See Also
 --------------------------

 - [Loopback][loopback]
 - [Loopback-boot][loopback-boot]

 [option]: https://apidocs.strongloop.com/loopback-boot/
 [loopback-boot]: https://apidocs.strongloop.com/loopback-boot/
 [loopback]: http://loopback.io
