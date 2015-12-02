var Hapi = require('hapi');
var Inert = require('inert');

// Create the Walmart Labs Hapi Server
var PORT = process.env.PORT || 8000;
var server = new Hapi.Server();

server.register(Inert, function() {
  server.connection({ port: PORT });

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

  // Start your Mullet Server
  server.start(function () {
    console.log('The Mullet Stack is running on port:', PORT);
  });
});
