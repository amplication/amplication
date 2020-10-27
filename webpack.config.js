const webpack = require('webpack');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const config = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
        {
            enforce: 'pre',
            test: /\.jsx?$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
        },
        { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
        {
            test: /\.scss$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx'
    ],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  plugins: [
    new LodashModuleReplacementPlugin
  ],
  devServer: {
    contentBase: './dist'
  },
  loaders: [
    {
        test: /\.(scss|sass)$/i,
        include: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'path/to/imported/file/dir'), <== This solved the issue
        ],
        loaders: ["css", "sass"]
    },
]
};

module.exports = config;