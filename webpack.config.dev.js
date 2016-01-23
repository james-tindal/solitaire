var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  resolve: {
    root: path.join(__dirname, 'source')
  },
  entry: [
    'webpack-hot-middleware/client',
    './source/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-0', 'react']
      }
    }]
  }
};
