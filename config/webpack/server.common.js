/**
 * Server Webpack Development Configuration
 */

/**
 * Webpack
 */
const webpack = require('webpack');

/**
 * Helpers
 */
const helpers = require('../helpers.utils');
const path = require('path');

/**
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

/**
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');

/**
 * Webpack Configuration
 *
 * @see: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {

  return {

    /**
     * Cache generated modules and chunks to improve performance for multiple
     * incremental builds
     * This is enabled by default in watch mode
     * You can pass false to disable it
     *
     * @see: http://webpack.github.io/docs/configuration.html#cache
     */
    // cache: false,

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
    },

    /**
     * Options affecting the resolving of modules
     *
     * @see: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {

      /**
       * An array of extensions that should be used to resolve modules
       *
       * @see: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.js', '.json', '.ts']
    },

    /**
     * Options affecting the normal modules
     *
     * @see: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      rules: [

        /**
         * Source map loader support for *.js files
         *
         * @see https://github.com/webpack/source-map-loader
         */
         {
           enforce: 'pre',
           test: /\.js$/,
           loader: 'source-map-loader',
           exclude: [
             // these packages have problems with their sourcemaps
             helpers.root('node_modules/rxjs')
           ]
         },

        /**
         * TypeScript loader support for .ts
         *
         * @see https://github.com/s-panferov/awesome-typescript-loader
         * @see https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          loaders: [
            'awesome-typescript-loader'
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        /**
         * JSON loader support for *.json files
         *
         * @see https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          loader: 'json-loader'
        },

        /**
         * JavaScript loader support for .js
         *
         * @see https://github.com/babel/babel-loader
         */
        {
          test: /\.js$/,
          loaders: [
            'babel-loader'
          ],
          exclude: [
            helpers.root('node_modules')
          ]
        },
      ]
    },

    /**
     * Add additional plugins to the compiler
     *
     * @see: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [

      /**
       * Plugin: AssetsPlugin
       * Description: Emits a json file with assets paths.
       *
       * @see https://github.com/kossnocorp/assets-webpack-plugin
       */
      new AssetsPlugin({
        path: helpers.root('dist/server'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),

      /**
       * Plugin: ForkCheckerPlugin
       * Description: Perform type checking in a separate process, so webpack
       * doesn't need to wait
       *
       * @see https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
       */
      new ForkCheckerPlugin(),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * @see: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({ })
    ]

  }

};
