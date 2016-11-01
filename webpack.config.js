'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    app: './frontend/main.js',
  },
  output: {
    path: './public',
    filename: 'main.js',
    publicPath: 'http://localhost:8080/',
  },
  externals: { vue: 'Vue' },
  vue: {
    loaders: {
      sass: "vue-style!css!sass?indentedSyntax"
    }
  },
  postcss: [
    autoprefixer({browsers: ['last 3 versions', '> 1%']})
  ],
  module: {
    loaders: [
      {test: /\.vue$/,  loader: 'vue'},
      {test: /\.json$/, loader: 'json'},
      {test: /\.js$/,   loader: 'babel?presets[]=es2015', exclude: /node_modules/},
      {test: /\.css$/,  loader: 'vue-style!css'},
      {test: /\.sass$/, loader: 'vue-style!css!sass'}
    ]
  },
  resolve: { extenstions: ['', '.js'] },
  resolveLoader: { root: path.join(__dirname, 'node_modules') },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
  ]
};
