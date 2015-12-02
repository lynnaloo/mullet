'use strict';

var Code = require('code'); // Hapi assertion library
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var server = require('../walmart');

lab.experiment('General Endpoint Tests', function() {

  lab.test('GET / (default test)', function (done) {
    var options = {
        method: 'GET',
        url: '/'
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      done();
    });
  });

  lab.test('GET /images/mullet_600.png', function (done) {
    var options = {
        method: 'GET',
        url: '/images/mullet_600.png'
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      done();
    });
  });

  lab.test('GET /data', function (done) {
    var options = {
        method: 'GET',
        url: '/data'
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.be.an.object();
      Code.expect(response.result.message).to.equal('Welcome to Mullet!');
      done();
    });
  });
});
