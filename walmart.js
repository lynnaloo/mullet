var Hapi = require('hapi');

// Create the Walmart Labs Hapi Server
var server = new Hapi.Server('localhost', 8000);


// server.route({
//     method: 'GET',
//     path: '/',
//     handler: function (request, reply) {
//       reply('hello world');
//     }
// });

server.route({
  method: 'GET',
  path: '/static/{path*}',
  handler: {
    directory: {
      path: './public',
      listing: false,
      index: false
    }
  }
});

// Start your Mullet Server
server.start();
