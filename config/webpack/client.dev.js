/**
 * Client Webpack Development Configuration
 */

/**
 * Helpers
 */
const helpers = require('../helpers.utils');

/**
 * Webpack Merge
 */
const webpackMerge = require('webpack-merge');

/**
 * Common webpack configuration for development and production
 */
const commonConfig = require('./client.common.js');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');

/**
 * Environment Configuration Object
 *
 * TODO: Ensure that environment settings are optimized between server/client
 */
var envConfig = require('../config.json');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR
});

module.exports = function(options) {

  return webpackMerge(commonConfig({ env: ENV }), {

    /**
     * Developer tool to enhance debugging
     *
     * @see: http://webpack.github.io/docs/configuration.html#devtool
     * @see: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: 'cheap-module-source-map',

    /**
     * Options affecting the output of the compilation process
     *
     * @see: http://webpack.github.io/docs/configuration.html#output
     */
    output: {

      /**
       * The output directory as an absolute path (required)
       *
       * @see: http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist/client'),

      /**
       * Specifies the name of each output file on disk
       * IMPORTANT: You must not specify an absolute path here!
       *
       * @see: http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files
       * They are inside the output.path directory
       *
       * @see: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[name].map',

      /**
       * The filename of non-entry chunks as relative path inside the
       * output.path directory.
       *
       * @see: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].chunk.js',

      /**
       * TODO: Add documentation
       */
      library: 'ac_[name]',

      /**
       * TODO: Add documentation
       */
      libraryTarget: 'var'

    },

    /**
     * Add additional plugins to the compiler
     *
     * @see: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [

      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * NOTE: when adding more properties make sure you include them in custom-typings.d.ts
       *
       * @see: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR
        }
      }),

      /**
       * Plugin: NamedModulesPlugin (experimental)
       * Description: Uses file names as module name.
       *
       * @see: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
       */
      new NamedModulesPlugin(),

      /**
        * Plugin LoaderOptionsPlugin (experimental)
        *
        * See: https://gist.github.com/sokra/27b24881210b56bbaff7
        */
       new LoaderOptionsPlugin({
         debug: true,
         options: {

           /**
            * Static analysis linter for TypeScript advanced options configuration
            * Description: An extensible linter for the TypeScript language.
            *
            * @see: https://github.com/wbuchwalter/tslint-loader
            */
           tslint: {
             emitErrors: false,
             failOnHint: false,
             resourcePath: 'src/client'
           }
         }
       })

    ],

    /**
     * Other module loader configuration
     */

    /**
     * Webpack-Dev-Server Configuration
     *
     * Description: The webpack-dev-server is a little node.js Express server
     * The server emits information about the compilation state to the client,
     * which reacts to the events
     *
     * @see: https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
      /**
       * Proxy requests to our Express server
       */
      proxy: {
        '*': {
          target: 'http://localhost:' + envConfig.PORT,
          secure: false
        },
      },
      port: METADATA.port,
      host: METADATA.host,
      historyApiFallback: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * @see https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });

}
