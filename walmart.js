'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const pkg = require('./package.json');

// create the [formerly] Walmart Labs Hapi Server
const PORT = process.env.PORT || 8000;
const server = new Hapi.Server();
server.connection({ port: PORT });

// useful Hapi plugins
// to generate API documentation, use the hapi-swagger plugin
var plugins = [
  require('h2o2'),
  require('inert'),
  require('vision'),
  require('blipp')
];

server.register(plugins, (err) => {

  if (err) {
    throw err;
  }

  console.log('=> Registered plugins:', { plugins: _.keysIn(server.registrations).join(', ') });

  // serve up all static content in public folder
  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: './public',
        listing: false,
        index: true
      }
    }
  });

  // serve up some sample JSON data
  server.route({
    method: 'GET',
    path: '/data',
    handler: (request, reply) => {
      reply({
        name: pkg.name,
        version: pkg.version,
        message: 'Welcome to Mullet!'
      });
    }
  });

  server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`=> Mullet Stack running at: ${server.info.uri}`);
  });
});

// for server inject in Lab tests
module.exports = server;
