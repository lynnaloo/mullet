var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/react_components/main.js'
  ],
  output: {
    path: __dirname + '/public/js/',
    filename: 'app.built.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', query: { presets:['react', 'es2015', 'stage-0'] }, include: path.join(__dirname, 'src') },
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
};
