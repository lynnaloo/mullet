'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

const init = async () => {
    // create the [formerly] Walmart Labs Hapi Server
    const server = Hapi.server({
      port: process.env.PORT || 8000,
      host: 'localhost'
    });

    await server.register(Inert);

    // serve up all static content in public folder
    server.route({
      method: 'GET',
      path: '/{path*}',
      handler: {
        directory: {
          path: './public',
          listing: false
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/greeting',
      handler: (request, h) => {
        return 'Hi World!';
      }
    });

    await server.start();
    console.log(`=> Mullet Stack running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
