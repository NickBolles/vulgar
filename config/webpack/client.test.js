/**
 * Client Webpack Test Configuration
 */

/**
 * Common Configuration and Helpers
 */
const helpers = require('../helpers.utils');
const path = require('path');

/**
 * Webpack Plugins
 */
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin  = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

/**
 * postcss-loader
 */
const autoprefixer = require('autoprefixer');
const precss       = require('precss');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

/**
 * Webpack Configuration
 * @see http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {

  return {

    /**
     * Developer tool to enhance debugging
     *
     * @see http://webpack.github.io/docs/configuration.html#devtool
     * @see https://github.com/webpack/docs/wiki/build-performance#sourcemaps\
     *
     * Do not change, leave as is or it wont work!
     * @see https://github.com/webpack/karma-webpack#source-maps
     */
    devtool: 'inline-source-map',

    /**
     *  Options affecting the resolving of modules.
     *  @see http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {

      /**
       * An array of extensions that should be used to resolve modules
       *
       * @see http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.js', '.scss'],

      /**
       * Ensure that root is our client source directory
       */
      root: [ path.resolve(__dirname, 'client/src'), 'node_modules' ]
    },

    /**
     * Options affecting the normal modules
     *
     * @see http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      rules: [

        /**
         * TypeScript loaders support for .ts and Angular 2 async routes via .async.ts
         *
         * @see https://github.com/s-panferov/awesome-typescript-loader
         * @see https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: [
            helpers.root('node_modules')
          ]
        },

        /**
         * JavaScript loaders support for .js
         *
         * @see https://github.com/webpack/source-map-loader
         */
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            // These packages have problems with their `sourcemaps`
            helpers.root('node_modules/rxjs'),
            helpers.root('node_modules/@angular')
          ]
        },

        /**
         * TypeScript loaders support for .ts and Angular 2 async routes via .async.ts
         *
         * @see https://github.com/s-panferov/awesome-typescript-loader
         * @see https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          exclude: [ /\.e2e\.ts$/ ]
        },

        /**
         * JSON loader support for *.json files
         *
         * @see https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          loader: 'json-loader',
          exclude: [ helpers.root('src/client/index.html') ]
        },

        /**
         * Raw loader support for *.html
         * Returns file content as a string
         *
         * @see https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [ helpers.root('src/client/index.html') ]
        },

        /**
         * to-string and css-loader support for *.css files
         * Returns file content as string
         *
         * @see https://github.com/gajus/to-string-loader
         * @see https://github.com/webpack/css-loader
         */
        {
          test: /\.css$/,
          loaders: ['to-string-loader', 'css-loader'],
          exclude: [helpers.root('src/client/index.html')]
        },

        /**
         * Support for Sass imports
         *
         * TODO: get postcss-loader working
         */
        {
          test: /\.scss$/,
          loader: 'style!css!postcss-loader!sass',
          exclude: [ helpers.root('src/client/index.html') ],
        },

        /**
         * Instruments JS files with Istanbul for subsequent code coverage reporting.
         * Instrument only testing sources.
         *
         * @see https://github.com/deepsweet/istanbul-instrumenter-loader
         */
        {
          enforce: 'post',
          test: /\.(js|ts)$/,
          include: helpers.root('src/client'),
          loader: 'istanbul-instrumenter-loader',
          exclude: [
            /\.(e2e|spec)\.ts$/,
            /node_modules/
          ]
        }

      ]

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
        // Environment helpers
        'ENV': JSON.stringify(ENV),
        'HMR': false,
        'process.env': {
          'ENV': JSON.stringify(ENV),
          'NODE_ENV': JSON.stringify(ENV),
          'HMR': false
        }
      }),

      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
       */
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        helpers.root('src') // location of your src
      ),

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
           * See: https://github.com/wbuchwalter/tslint-loader
          */
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src/client'
          },

          /**
           * TypeScript loaders support for .ts and Angular 2 async routes via .async.ts
           *
           * @see https://github.com/s-panferov/awesome-typescript-loader
           * @see https://github.com/TheLarkInn/angular2-template-loader
           */
          'awesome-typescript-loader': {
            // use inline sourcemaps for "karma-remap-coverage" reporter
            sourceMap: false,
            inlineSourceMap: true,
            compilerOptions: {
              // Remove TypeScript helpers to be injected
              // below by DefinePlugin
              removeComments: true
            }
          }
        }
      })

    ],

    /**
     * Other module loader config
     */

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * @see https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  }

};
