// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = {
  mode: 'development',

  entry: {
    app: './app.js'
  },

  plugins: [new HtmlWebpackPlugin({title: 'deck.gl example'})]
};

module.exports = {
  // ...
  externalsType: 'script',
  externals: {
    gclient: [
      'https://apis.google.com/js/api.js',
      '_',
      'gapi',
    ],
  },
};
// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../../../webpack.config.local')(CONFIG)(env) : CONFIG);
