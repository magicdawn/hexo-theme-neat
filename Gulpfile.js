'use strict';

/**
 * module dependencies
 */

GLOBAL.Promise = require('bluebird');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserify = require('browserify');
const glob = require('glob');
const fs = require('fs-extra');
const co = require('co');
const _ = require('lodash');
const through = require('through2');
const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['watch'],
  alias: {
    'w': 'watch'
  }
});

// less plugins
const LessPluginCleanCss = require('less-plugin-clean-css');
const LessPluginNpmImport = require('less-plugin-npm-import');
const LessPluginAutoprefix = require('less-plugin-autoprefix');

/**
 * patch
 */

// browserify
const Browserify = browserify;
Browserify.prototype.bundleAsync = Promise.promisify(Browserify.prototype.bundle);

// env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * consts
 */
const jsConfig = {
  base: [
    { require: 'jquery', expose: 'jquery' },
    { require: 'bootstrap', expose: 'bootstrap' },
    { require: 'highlight.js', expose: 'highlight.js' }
  ],
  baseDest: 'source/build/js/base.js'
};


/**
 * js browserify
 */

gulp.task('bundle', ['bundle:base', 'bundle:page']);

gulp.task('bundle:base', (cb) => {
  let b = browserify({
    debug: process.env.NODE_ENV !== 'production'
  });
  const baseJs = fs.createOutputStream(`${ __dirname }/${ jsConfig.baseDest }`);

  for (let lib of jsConfig.base) {
    b.require(lib.require, { expose: lib.expose });
  }


  b.bundle().on('error', cb)
    .pipe(baseJs).on('close', cb);
});

gulp.task('bundle:page', () => {
  const jss = glob.sync('*.js', { cwd: __dirname + '/source/_src/js' });

  return co(function* () {
    for (let js of jss) {
      const src = `${ __dirname }/source/_src/js/${ js }`;
      const dest = `${ __dirname }/source/build/js/${ js }`;
      const b = browserify(src, {
        debug: process.env.NODE_ENV !== 'production'
      });

      for (let libname of _.pluck(jsConfig.base, 'expose')) {
        b.external(libname);
      }

      let content = yield b.bundleAsync();
      content = content.toString('utf8');
      fs.outputFileSync(dest, content, 'utf8');
    }
  });
});

gulp.task('less', () => {
  return gulp.src('source/_src/css/*.less')
    .pipe($.less({
      plugins: [
        new LessPluginCleanCss(),
        new LessPluginNpmImport(),
        new LessPluginAutoprefix({
          browsers: ['last 10 versions']
        })
      ]
    }))
    .pipe(through.obj((row, enc, cb) => {
      row.path = row.path.replace(/\.less/, '.css');
      cb(null, row);
    }))
    .pipe(gulp.dest('source/build/css/'))
});

let watched = false;
gulp.task('build', ['less', 'bundle'], function () {
  if (!watched && argv.watch) {
    watched = true;
    gulp.watch([
      'source/_src/**/*.less',
      'source/_src/**/*.js'
    ], ['build']);
  }
});