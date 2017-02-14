/**
 * Client Webpack Production Configuration
 */

/**
 * Common Configuration and Helpers
 */
const helpers = require('../helpers.utils');

/**
 * Webpack Merge
 * Used to merge webpack configurations
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
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'production';
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;
const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: false
});

module.exports = function(env) {

  return webpackMerge(commonConfig({ env: ENV }), {
    /**
     * Developer tool to enhance debugging
     *
     * @see http://webpack.github.io/docs/configuration.html#devtool
     * @see https://github.com/webpack/docs/wiki/build-performance#sourcemaps\
     */
    devtool: 'source-map',

    /**
     * Options affecting the output of the compilation
     *
     * @see http://webpack.github.io/docs/configuration.html#output
     */
    output: {

      /**
       * The output directory as absolute path (required)
       *
       * @see http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist/client'),

      /**
       * Specifies the name of each output file on disk.
       * IMPORTANT: You must not specify an absolute path here!
       *
       * @see http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].[chunkhash].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files
       * They are inside the output.path directory
       *
       * @see http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[name].[chunkhash].bundle.map',

      /**
       * The filename of non-entry chunks as relative path inside the
       * output.path directory
       *
       * @see http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].[chunkhash].chunk.js'
    },

    /**
     * Add additional plugins to the compiler
     *
     * @see http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [

      /**
       * Plugin: WebpackMd5Hash
       * Description: Plugin to replace a standard webpack chunkhash with md5
       *
       * @see https://www.npmjs.com/package/webpack-md5-hash
       */
      new WebpackMd5Hash(),

      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding'
       * global constants.
       *
       * Environment helpers
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       * NOTE: when adding more properties make sure you include them in
       * custom-typings.d.ts
       */
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR
        }
      }),

      /**
       * Plugin: UglifyJsPlugin
       * Description: Minimize all JavaScript output of chunks
       * Loaders are switched into minimizing mode
       *
       * @see https:*webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
       * NOTE: To debug prod builds uncomment //debug lines and comment
       * //prod lines
       */
      new UglifyJsPlugin({
        // beautify: true, //debug
        // mangle: false, //debug
        // dead_code: false, //debug
        // unused: false, //debug
        // deadCode: false, //debug
        // compress: {
        //   screw_ie8: true,
        //   keep_fnames: true,
        //   drop_debugger: false,
        //   dead_code: false,
        //   unused: false
        // }, //debug
        // comments: true, //debug

        mangle: {
          screw_ie8: true,
          keep_fnames: true
        }, //prod
        compress: {
          screw_ie8: true
        }, //prod
        comments: false //prod
      }),

      /**
       * Plugin: NormalModuleReplacementPlugin
       * Description: Replace resources that matches resourceRegExp with
       * newResource
       *
       * @see http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
       *
       */
      new NormalModuleReplacementPlugin(
        /angular2-hmr/,
        helpers.root('config/modules/angular2-hmr-prod.js')
      ),

      /**
       * Plugin: IgnorePlugin
       * Description: Don’t generate modules for requests matching the
       * provided RegExp
       *
       * @see http://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
       */
      // new IgnorePlugin(/angular2-hmr/),

      /**
       * Plugin: CompressionPlugin
       * Description: Prepares compressed versions of assets to serve
       * them with Content-Encoding
       *
       * @see https://github.com/webpack/compression-webpack-plugin
       *
       * NOTE: install compression-webpack-plugin
       */
      // new CompressionPlugin({
      //   regExp: /\.css$|\.html$|\.js$|\.map$/,
      //   threshold: 2 * 1024
      // }),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * @see: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: false,
        options: {

          /**
           * Static analysis linter for TypeScript advanced options configuration
           * Description: An extensible linter for the TypeScript language
           *
           * @see https://github.com/wbuchwalter/tslint-loader
           */
          tslint: {
            emitErrors: true,
            failOnHint: true,
            resourcePath: 'src/client'
          },

          /*
           * Html loader advanced options
           *
           * @see https://github.com/webpack/html-loader#advanced-options
           * TODO: Need to workaround Angular 2's html syntax => #id [bind]
           * (event) *ngFor
           */
          htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
            ],
            customAttrAssign: [/\)?\]?=/]
          }
        }
      })

    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * @see https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });

}
