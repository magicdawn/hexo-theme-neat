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

/**
 * patch
 */
const Browserify = browserify;
Browserify.prototype.bundleAsync = Promise.promisify(Browserify.prototype.bundle);

/**
 * consts
 */
const jsConfig = {
  base: [
    { require: 'jquery', expose: 'jquery' },
    { require: 'bootstrap', expose: 'bootstrap' }
  ],
  baseDest: 'source/build/js/base.js'
};


/**
 * js browserify
 */

gulp.task('bundle', ['bundle:base', 'bundle:page']);

gulp.task('bundle:base', (cb) => {
  let b = browserify();
  const baseJs = fs.createOutputStream(`${ __dirname }/${ jsConfig.baseDest }`);

  for(let lib of jsConfig.base){
    b.require(lib.require, { expose: lib.expose });
  }


  b.bundle().on('error', cb)
    .pipe(baseJs).on('close', cb);
});

gulp.task('bundle:page', () => {
  const jss = glob.sync('*.js', { cwd: __dirname + '/source/_src/js' });

  return co(function *() {
    for(let js of jss){
      const src = `${ __dirname }/source/_src/js/${ js }`;
      const dest = `${ __dirname }/source/build/js/${ js }`;
      const b = browserify(src);

      for(let libname of _.pluck(jsConfig.base, 'expose')){
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
    .pipe(through.obj((row, enc, cb) => {
      row.path = row.path.replace(/\.less/, '.css');
      cb(null, row);
    }))
    .pipe(gulp.dest('source/build/css/'))
});