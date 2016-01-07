var Hapi = require('hapi');
var pkg = require('./package.json');

// Create the Walmart Labs Hapi Server
var PORT = process.env.PORT || 8000;
var server = new Hapi.Server();
var goodOptions = {
  opsInterval: 1000,
  reporters: [{
    reporter: require('good-console'),
    events: {
      log: '*',
      response: '*'
    }
  }]
};

// Useful Hapi plugins
// To generate documentation, use the hapi-swagger plugin
var plugins = [
  require('h2o2'),
  require('inert'),
  require('vision'),
  {
    register: require('good'),
    options: goodOptions
  },
];

server.register(plugins, function() {
  server.connection({ port: PORT });

  // Serve up all static content in public folder
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

  // Serve up some sample JSON data
  server.route({
    method: 'GET',
    path: '/data',
    handler: function (request, reply) {
      reply({
        name: pkg.name,
        version: pkg.version,
        message: 'Welcome to Mullet!'
      });
    }
  });

  // Start your Mullet Server
  server.start(function () {
    console.log('The Mullet Stack is running on port:', PORT);
  });
});

// For server inject in Lab tests
module.exports = server;
