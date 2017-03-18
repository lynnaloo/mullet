'use strict';

const Code = require('code'); // assertion library for Lab
const Lab = require('lab');
const lab = (exports.lab = Lab.script());
const server = require('../walmart');

lab.experiment('General Endpoint Tests', () => {
  lab.test('GET / (default test)', done => {
    const options = {
      method: 'GET',
      url: '/'
    };
    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      done();
    });
  });

  lab.test('GET /images/mullet_600.png', done => {
    const options = {
      method: 'GET',
      url: '/images/mullet_600.png'
    };
    server.inject(options, response => {
      Code.expect(response.statusCode).to.equal(200);
      done();
    });
  });

  lab.test('GET /data', done => {
    const options = {
      method: 'GET',
      url: '/data'
    };
    server.inject(options, response => {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.be.an.object();
      Code.expect(response.result.message).to.equal('Welcome to Mullet!');
      done();
    });
  });
});
