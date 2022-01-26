// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

const webpack = require('webpack');

const CONFIG = {
  mode: 'development',

  entry: {
    app: './app.js'
  },
  plugins: [
    // Read google maps token from environment variable
    new webpack.EnvironmentPlugin(['GoogleMapsAPIKey', 'GoogleMapsMapId']),
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/, // may apply this only for some modules
      options: {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
      }
    })
  ]
};

// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../../../webpack.config.local')(CONFIG)(env) : CONFIG);
