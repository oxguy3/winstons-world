const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  output: {
    path: path.join(__dirname, '../dist/')
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, '../assets/'),
    }
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    port: 8000
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: '**/*.png',
        context: 'assets/images',
        to: 'assets/images'
      },
      {
        from: '*.json',
        context: 'assets/tilemaps',
        to: 'assets/tilemaps'
      },
      {
        from: '*.png',
        context: 'assets/tilesets',
        to: 'assets/tilesets'
      },
    ]),
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../dist/")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      title: 'Kill the Baby?',
      template: "./src/index.html"
    })
  ]
};
