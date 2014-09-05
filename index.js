var Hapi = require('hapi');

// Create the Walmart Labs Hapi Server
var server = new Hapi.Server('localhost', 8000);

server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
        reply('hello world');
    }
});

// Start your Mullet Server
server.start();
