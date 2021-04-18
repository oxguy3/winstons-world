const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/Game.js',
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
    path: path.join(__dirname, '../dist/'),
    clean: true,
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    port: 8000
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: '*.json',
        context: 'assets',
        to: 'assets'
      },
      {
        from: '**/*.{fnt,png}',
        context: 'assets/fonts',
        to: 'assets/fonts'
      },
      {
        from: '**/*.png',
        context: 'assets/images',
        to: 'assets/images'
      },
      {
        from: '**/*.{mp3,m4a,ogg,opus}',
        context: 'assets/sound',
        to: 'assets/sound'
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
      {
        from: '**/*',
        context: 'public',
        to: './'
      },
    ]),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      title: "Winston's World",
      template: "./src/index.html"
    })
  ]
};
