/**
 * Helpers
 */
import helpers from './helpers.utils';

/**
 * Gulp packages
 */
import del from 'del';
import docco from 'gulp-docco';
import gulp from 'gulp';
import nodemon from 'nodemon';
import path from 'path';
import scsslint from 'gulp-scss-lint';
import webpack from 'webpack';
import mocha from 'gulp-mocha';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';

/**
 * Development webpack configuration
 */
import developmentConfig from './webpack/server.dev';

/**
 * Production webpack configuration
 */
import productionConfig from './webpack/server.prod';

/**
 * Test webpack configuration
 */
import testConfig from './webpack/server.test';

/**
 * File globs for use during documentation generation with Docco
 * @type {Object}
 */
const globs = {
  sass: ['src/client/**/*.scss']
};

/**
 * Webpack Tasks
 */

/**
 * Webpack task for displaying build output.
 */
function onBuild(done) {
  return function(error, stats) {
    if(error)
      console.error('Error: ', error);
    else {
      console.log(stats.toString());
    if(done)
      done();
    }
  }
}

/**
 * Create the default task which is just a wrapper for the `serve` task
 */
gulp.task('default', ['serve']);

/**
 * Gulp task wrapper for build:server:dev task
 */
gulp.task('build:server', ['build:server:dev']);

/**
 * Gulp task wrapper for watch:server:dev task
 */
gulp.task('watch:server', ['watch:server:dev']);

/**
 * Gulp task for building the server using the development configuration
 */
gulp.task('build:server:dev', (done) => {
  /**
   * You can pass a `config` object to `webpack` and get
   * back a compiler. From there, you can call `run` or
   * `watch` on the compiler.
   */
  webpack(developmentConfig()).run(onBuild(done));
});

gulp.task('watch:server:dev', () => {
  /**
   * The first argument is a delay
   */
  webpack(developmentConfig()).watch(100, (err, stats) => {
    onBuild()(err, stats);
    nodemon.restart();
  });
});

/**
 * Gulp task for building the server using the production configuration
 */
gulp.task('build:server:prod', (done) => {
  webpack(productionConfig()).run(onBuild(done));
});

gulp.task('watch:server:prod', () => {
  webpack(productionConfig()).watch(100, (err, stats) => {
    onBuild()(err, stats);
    nodemon.restart();
  });
});

/**
 * Gulp task for building the server using the test configuration
 */
gulp.task('build:server:test', (done) => {
  webpack(testConfig()).run((err, stats) => {
    onBuild(done)(err,stats)
  });
});

gulp.task('watch:server:test', (done) => {
  webpack(testConfig()).watch(100, (err, stats) => {
    onBuild()(err, stats);
    runSequence('test:server', done);
  });
});


gulp.task('test:server', () => {
  return gulp.src(['dist/spec.bundle.js'])
  .pipe(mocha({
    reporter: 'spec'
  }))
  .on('error', gutil.log);
});

/**
 * Nodemon Configuration
 */

/**
 * This task watches the files belonging to the app for changes
 * When a change is detected the `watch:backend` task will be
 * automatically fired, which will allow `webpack` to recompile
 * the server code. After this is complete `nodemon` will restart
 * the server.
 */
gulp.task('serve', ['build:server', 'watch:server'], () => {

  nodemon({

    execMap: {
      js: 'node'
    },

    script: path.join(helpers.root('dist/server'), 'server.bundle'),

    /**
     * We don't actually want `nodemon`'s watcher to watch anything.
     * That is why we pass `ignore` `*` and give `watch` a non-existant
     * directory.
     */
    ignore: ['*'],

    watch: ['foo/'],

    ext: 'noop'

  }).on('restart', () => {
    console.warn('Changes detected; restarting server...')
  });

});

/**
 * Gulp task for linting .scss files
 */
gulp.task('lint:sass', () => {
  return gulp.src(globs.sass)
    .pipe(scsslint());
});

/**
 * Gulp task that watches .scss files and lints on file change
 */
gulp.task('watch:sass', () => {
  gulp.watch(globs.sass, function (event) {
    return gulp.src(event.path)
      .pipe(scsslint());
  });
});

/**
 * Clean out docs/ directory and generate documentation for .js and .scss files
 * using Docco
 */
gulp.task('build:docs', ['clean:docs'], () => {
  /**
   * For `gulp-docco` if the need arises
   *  Default configuration options. All of these may be extended by user-specified options.
   *
   *  defaults =
   *    layout:     'parallel'
   *    output:     'docs'
   *    template:   null
   *    css:        null
   *    extension:  null
   *    languages:  {}
   *    marked:     null
   *
   *  Example:
   *
   *  let docco = require("gulp-docco");
   *
   *  gulp.src("./src/*.js")
   *    .pipe(docco(options))
   *    .pipe(gulp.dest('./documentation-output'))
   *
   * Reference: https://www.npmjs.com/package/gulp-docco
   * Also see: https://jashkenas.github.io/docco/
   */
  const options = {
    layout:     'parallel',
    output:     'docs',
    template:    null,
    css:         null,
    extension:   null,
    languages:   {},
    marked:      null
  };

  /**
   * Take a file `glob` pattern and a file extension matching
   * the extension of the files you are trying to generate
   * documentation for
   */
  function generateDocs(fileSrc, dest) {
    if(!dest) {
      throw new Error('Destination must be passed in for documentation to be ' +
                      'generated properly!');
    }

    console.log('Generating documentation...');

    return gulp.src(fileSrc)
      .pipe(docco())
      .pipe(gulp.dest(`docs/${dest}`));
  }

  generateDocs(globs.sass, 'src/client');

  console.log('Documentation generation complete!');
  console.log('Generated documentation is stored in \'src/docs/\'.');
});

/**
 * Use the 'del' module to clear all traces of documentation
 * Useful before regenerating documentation
 */
gulp.task('clean:docs', (callback) => {
  console.log('Cleaning documentation...');
  del(['./docs']).then((paths) => {
    console.log('Documentation successfully deleted!');
    callback(); // ok
  }, (reason) => {
    callback(`Failed to delete files: ${reason}`); // fail
  });
});
