var chai = require('chai');
var expect = chai.expect;
var app = require('./glueTest/server/server');
var supertest = require('supertest');
var api = supertest.agent(app);

describe('Check glue module by passing options in all possible ways', function() {

  it('Check if options doesnt contain appRootDir', function(done) {
    expect(function() {
      require('./NT1/server/server')
    }).to.throw(Error);
    done();
  })

  it('Check if options provided are old implementation', function(done) {
    var oldApp = require('./OT/server/server');
    expect(oldApp.glue.instructions).to.exist;
    expect(oldApp.glue.glueOption).to.exist;
     done();
  })

  it('Check if subapps are empty', function(done) {
    var oldImp = require('./NT2/server/server');
    expect(oldImp.glue.instructions).to.exist;
    expect(oldImp.glue.glueOption).to.exist;
    done();
  })

  it('Check for parent server status', function(done) {
    api.get('/').expect(200, done);
  });

  it('Check for child api status', function(done) {
    api.get('/api1').expect(200, done);
  });

  it('Check for child api status', function(done) {
    api.get('/api2').expect(200, done);
  });

  it('Check for child api status', function(done) {
    api.get('/api1/explorer/').expect(200, done);
  });

  it('Check for child api status', function(done) {
    api.get('/api2/explorer/').expect(200, done);
  });

  it('Check for child api response', function(done) {
    var body = {
                  "greeting": "Sender says hello to receiver"
                };
    api.get('/api1/Messages/greet?msg=hello').expect(200, body, done);
  });

});
