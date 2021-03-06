'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    app: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'main.js',
    publicPath: 'http://localhost:8080/',
  },
  module: {
    loaders: [
      {test: /\.vue$/, loader: 'vue-loader', options: {loaders: {sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'}}},
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
    new UglifyJsPlugin()
  ]
};
