/**
 * Server Webpack Test Configuration
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
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = function(options) {

  return webpackMerge(commonConfig({ env: ENV }), {

    target: 'node',
    /**
     * The entry point for the bundle; the location of our Angular.js app
     *
     * @see: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
      /**
       * Our Node server
       */
      'server': './src/server/server.conf.ts',
      'spec': './src/server/server.spec.ts'
    },

    output: {

      /**
       * The output directory as an absolute path (required)
       *
       * @see: http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist/server'),

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
    },
    module: {
      rules: [
          /**
           * Override sever.common rule to allow for spec to be in .ts
           */
          {
            test: /\.ts$/,
              loaders: [
            'awesome-typescript-loader'
          ],
            exclude: [/\.(e2e)\.ts$/]
          }
      ]
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
