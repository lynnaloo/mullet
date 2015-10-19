var Hapi = require('hapi');
var Inert = require('inert');
var Vision = require('vision');

// Create the Walmart Labs Hapi Server
var PORT = process.env.PORT || 8000;
var server = new Hapi.Server();

server.register(Vision, function() {
  server.views({
    engines: {
      jsx: require('hapi-react-views')
    },
    relativeTo: __dirname,
    path: './src/react_components/serverside'
  });
});
server.register(Inert, function() {
  server.connection({ port: PORT });

  server.route({
    method: 'get',
    path: '/serverside',
    handler: function(request, reply) {
      reply.view('facebook');
    }
  });
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
