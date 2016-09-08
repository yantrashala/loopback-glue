var v1 = require('./index-v1');
var v2 = require('./index-v2');

module.exports = function glue(app, options, callback) {

  if( options.subApps ) {
    //consider v2
    v2(app, options, callback);
  } else {
    //consider v1
    v1(app, options, callback);
  }

}
