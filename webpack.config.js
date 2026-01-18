const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: 'cheap-module-source-map',

  // 👇 Add entries for popup, options, background, contentScript
  entry: {
    main: ['./src/assets/js/index.js', './src/assets/css/index.scss'],
    background: './src/background.js',
    popup: './src/popup.js',
    options: './src/options.js',
    contentScript: './src/contentScript.js',
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: (pathData) => {
      // Put your app bundle inside assets/js, keep others at root
      return pathData.chunk.name === 'main'
        ? 'assets/js/bundle.js'
        : '[name].js';
    },
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
    ],
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      bootstrap: path.resolve(__dirname, 'node_modules', 'bootstrap-sass', 'assets'),
    },
  },

  plugins: [
    // Extract CSS bundle
    new ExtractTextPlugin('assets/css/bundle.css'),

    // 🔁 Copy updated Manifest V3, and your icons/images
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json', to: 'manifest.json' },
        { from: './src/icons', to: 'icons' },
        { from: './src/assets/images', to: 'assets/images' },
      ],
    }),

    // 🔁 HTML pages for popup & options
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: './src/options.html',
      chunks: ['options'],
    }),
  ].concat(
    isProd
      ? [
          new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('production') },
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            output: { comments: false },
          }),
        ]
      : []
  ),
};
