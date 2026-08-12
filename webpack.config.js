const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');



module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  entry:{ 
    index:'./src/js/index.js',
    dashboard:'./src/js/dashboard.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  module: {
    rules: [
      { test: /\.css$/i, 
      use: ['style-loader', 'css-loader'] 
    },
    ],
  },
  plugins: [
    new Dotenv({
      systemvars:true,
    }),
    new HtmlWebpackPlugin({ 
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({ 
      template: path.resolve(__dirname, './src/html/dashboard.html'),
      filename: 'dashboard.html',
      chunks: ['dashboard']
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /^\/dashboard/, to: '/dashboard.html' },
      ],
    },
  },
};