/**
 * Server Webpack Production Configuration
 */

const fs = require('fs');
const webpack = require('webpack');

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
const commonConfig = require('./server.common.js');

/**
 * Webpack Plugins
 */
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');

let nodeModules = {};

fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'production';

module.exports = function(options) {

  return webpackMerge(commonConfig({ env: ENV }), {

    target: 'node',

    output: {

      /**
       * The output directory as absolute path (required)
       *
       * @see http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist/server'),

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

    // Tell `webpack` that you want to preserve the values of `__dirname` and
    // `__filename`
    node: {
      __dirname: true,
      __filename: true
    },

    externals: nodeModules,

    plugins: [

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
      //   regExp: /\.js$|\.map$/,
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
            resourcePath: 'src/server'
          }
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
       * Plugin: WebpackMd5Hash
       * Description: Plugin to replace a standard webpack chunkhash with md5
       *
       * @see https://www.npmjs.com/package/webpack-md5-hash
       */
      new WebpackMd5Hash(),

      /**
       * Plugin: IgnorePlugin
       * Description: Don't generate modules for requests matching the provided RegExp
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
       */
      new webpack.IgnorePlugin(/\.(css|scss|less)$/),

      /**
       * Plugin: BannerPlugin
       * Description: Adds a banner to the top of each generated chunk
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
       */
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false
      })

    ]

  })

}
