var webpack = require('webpack');
var path = require('path');

var DEV_SERVER = process.argv[1].indexOf('webpack-dev-server') !== -1;
var DEV = DEV_SERVER || process.env.DEV;

module.exports = {
  mode: DEV ? 'development' : 'production',

  devtool: DEV ? 'eval' :'source-map',

  entry: path.resolve(__dirname, 'app') + '/app.js',

  output: {
    path: path.join(__dirname, "_bundles"),
    publicPath: '_bundles/',
    filename: "[name].js",
  },

  resolve: {
    extensions: ['.js']
  },

  optimization: {
    splitChunks: { chunks: 'all', },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
        exclude: [/@uirouter/]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: { loader: 'babel-loader' },
      }
    ]

  },
   devServer:{
    port: 4100,
     proxy: {
      "/cip/api": {
         target: "http://192.168.1.15:8100",
         "changeOrigin": true
       }
     }
   }
};
