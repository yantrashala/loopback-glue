var chai = require('chai');
var expect = chai.assert;
var app = require('./glueTest/server/server');
var supertest = require('supertest');
var api = supertest.agent(app);

describe('Server status checks', function() {
console.log(api)
  it('Check for parent server status', function(done) {
    api.get('/').expect(200, done);
  });

  it('Check for child api status', function(done) {
    api.get('/child1').expect(200, done);
  });

  it('Check for child api status', function(done) {
    api.get('/child2').expect(200, done);
  });

  it('Check for child api status', function(done) {
    api.get('/child1/explorer/').expect(200, done);
  });

  it('Check for child api status', function(done) {
    api.get('/child2/explorer/').expect(200, done);
  });

  it('Check for child api response', function(done) {
    var body = {
                  "greeting": "Sender says hello to receiver"
                };
    api.get('/child1/Messages/greet?msg=hello').expect(200, body, done);
  });

});
