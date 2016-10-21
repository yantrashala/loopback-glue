# loopback-glue
----------------

[![NPM](https://nodei.co/npm/loopback-glue.png?downloads=true)](https://nodei.co/npm/loopback-glue/)

 [![NPM](https://nodei.co/npm-dl/loopback-glue.png?months=3&height=3)](https://nodei.co/npm/loopback-glue/)

 [![Build status](https://img.shields.io/travis/yantrashala/loopback-glue/master.svg?style=flat-square)](https://travis-ci.org/yantrashala/loopback-glue)

 [![Codecov](https://codecov.io/gh/yantrashala/loopback-glue/branch/master/graph/badge.svg)](https://github.com/yantrashala/loopback-glue)

 [![David](https://img.shields.io/david/yantrashala/loopback-glue.svg)]()


Booting utility to glue multiple loopback projects together. This module lets you merge independent loopback projects together and deploy as one loopback project.



There are two ways in which subapps can be merged:

[Option 1](#option-1-read-boot-configurations-from-subapps-and-merge-them-as-the-boot-configuration-for-a-new-loopback-project): Read boot configurations from subapps and merge them as the boot configuration for a new loopback project
    This option is better when you just want to pull models and datasources from subapps. You cant pull and merge middleware or component configuration.

[Option 2](#option-2-boot-all-loopback-projects-independently-and-then-mount-them-on-a-new-loopback-project): Boot all loopback projects independently and then mount them on a new loopback project
    This option is better when you want to maintain request lifecycle separatly for each subapp.

### Option 1: Read boot configurations from subapps and merge them as the boot configuration for a new loopback project

To use the module:

1. Load loopback-glue in place of loopback-boot

    ```js
    var glue = require('loopback-glue'); //var boot = require('loopback-boot');
    ```

2. Create an options object for glue. The options object inherits the loopback-boot [option][Option] object. On top of the original option object we are adding a new attribute called subapps.

    The "subapps" attribute is an array of glue based [loopback] projects. Each element of the array should have the loopback project name as the key, followed by the value as the glue option flags.

    ```js
    var options = {
      "appRootDir" : __dirname,
      "subapps" : [
        {
          "name-api" : {
            "loadModels" : true,
            "loadDatasources" : true
          }
        } , {
          "address-api" : {
            "loadModels" : true,
            "loadDatasources" : false
          }
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
      else {
        // in case its not the parent app, exporting instructions to load from parent
        app.glue = {'instructions' : instructions, glueOption : options};
      }

    });
    ```

### Option 2: Boot all loopback projects independently and then mount them on a new loopback project

To use the module:

1. Load loopback-glue in place of loopback-boot

    ```js
    var glue = require('loopback-glue'); //var boot = require('loopback-boot');
    ```

2. Create an options object for glue. The option object inherits the loopback-boot [option][Option] object. On top of the original option object, add a new attribute called subapps.

    The "subapps" attribute is an array representing a loopback project. Each element of the array should have the loopback project name, prefix.

    ```js
    var options = {
      "appRootDir" : __dirname,
      "subapps" : [
        {
          "name" : "app-name",
          "app" : <object>,//[loopback-app-object], [optional]
          "mountPath" : "api1" //this prefix will be added to the childApp Url's []
        }
      ]
    };
    ```
    name: project name of the subapp
    app: Booted loopback project application instance. If this parameter is not provided than glue will try loading it from node_modules. While loading it will use the loopback project names provided as "name"
    mountPath: The URI where the loopback project will be mounted. If this parameter is not provided, glue defaults it to "api" with an index (ie. api1, api2)

3. Replace boot loading by the following code:

    ```javascript
    // Sub-apps like REST API are mounted via boot scripts.
    glue(app, options, function(err) {
      if (err) throw err;

      // start the server if $ node server.js
      if (require.main === module)
        app.start();

    });
    ```

4. Refer example
[loopback-glue-example]

 See Also
 --------------------------

 - [Loopback][loopback]
 - [Loopback-boot][loopback-boot]

 [option]: https://apidocs.strongloop.com/loopback-boot/
 [loopback-boot]: https://apidocs.strongloop.com/loopback-boot/
 [loopback]: http://loopback.io
 [loopback-glue-example]: https://github.com/yantrashala/loopback-glue-example
