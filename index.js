'use strict';

var option1 = require('./option1');
var option2 = require('./option2');
var boot = require('loopback-boot');

module.exports = function glue(app, options, callback) {

    if (typeof options === 'string') {
        options = { appRootDir: options };
    }

    var option2Flag = false;

    if (options.subapps) {
        options.subapps.map(function (childApp) {
            if (childApp.name) {
                option2Flag = true;
            }
        });
    }

    if (option2Flag) {
        option2(app, options, callback);
    } else {
        option1(app, options, callback);
    }

};
