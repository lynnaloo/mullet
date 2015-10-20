var Hapi = require('hapi');
var Inert = require('inert');
var Vision = require('vision');
var HapiReactViews = require('hapi-react-views');

// Create the Walmart Labs Hapi Server
var PORT = process.env.PORT || 8000;
var server = new Hapi.Server();

server.connection({ port: PORT });
server.register([Inert, Vision], function() {
  server.views({
    engines: {
      jsx: HapiReactViews
    },
    relativeTo: __dirname,
    path: './src/react_components/serverside'
  });

  server.route({
    method: 'get',
    path: '/serverside',
    handler: function(request, reply) {
      var ctx = {
        fruits: [
          'apple'
        ]
      };
      var renderOptions = {
        runtimeOptions: {
          renderMethod: 'renderToString'
        }
      };
      server.render('facebook', ctx, renderOptions, function(err, appOutput){
        var htmlCtx = {
          children: appOutput,
          state: 'window.state = ' + JSON.stringify(ctx) + ';'
        };
        server.render('layout/default', htmlCtx, renderOptions, function(err, htmlOutput){
          reply(htmlOutput);
        });
      });
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
