const path = require('path');

module.exports = {
  entry: ['./src/components/Main.js'],
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: 'app.built.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
