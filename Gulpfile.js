'use strict';

/**
 * module dependencies
 */

const fs = require('needle-kit').fs;
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserify = require('browserify');
const glob = require('glob');
const co = require('co');
const _ = require('lodash');
const through = require('through2');
const promiseify = require('promise.ify');
var runSequence = require('run-sequence');
const UglifyJS = require('uglify-js');

/**
 * argv
 */

const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['watch'],
  alias: {
    'w': 'watch'
  }
});

/**
 * less plugins
 */

const LessPluginCleanCss = require('less-plugin-clean-css');
const LessPluginNpmImport = require('less-plugin-npm-import');
const LessPluginAutoprefix = require('less-plugin-autoprefix');

/**
 * patch
 */

// browserify
const bproto = browserify.prototype;
bproto.bundleAsync = promiseify(bproto.bundle);

// gulp
gulp.startAsync = promiseify(gulp.start);

// env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * consts
 */

const jsConfig = {
  base: [{
    require: 'jquery',
    expose: 'jquery'
  }, {
    require: 'bootstrap',
    expose: 'bootstrap'
  }, {
    require: 'highlight.js',
    expose: 'highlight.js'
  }],
  baseDest: 'source/build/js/base.js'
};


const minify = function(js){
  return UglifyJS.minify(js, {fromString: true}).code;
};

const minStream = function(){
  var buf = [];
  return through(function(chunk, enc, cb) {
    buf.push(chunk);
    cb();
  }, function(cb) {
    let js = Buffer.concat(buf).toString('utf8');
    js = minify(js);
    this.push(js, 'utf8');
    cb();
  });
};

/**
 * js browserify
 */

gulp.task('js', ['js:base', 'js:page']);

gulp.task('js:base', (cb) => {
  let b = browserify({
    debug: process.env.NODE_ENV !== 'production'
  });
  const baseJs = fs.createOutputStream(`${ __dirname }/${ jsConfig.baseDest }`);

  for (let lib of jsConfig.base) {
    b.require(lib.require, {
      expose: lib.expose
    });
  }


  // bundle
  b = b.bundle().on('error', cb);

  // minify
  if(process.env.NODE_ENV === 'production') {
    b = b.pipe(minStream());
  }

  // write
  b.pipe(baseJs).on('close', cb);
});

gulp.task('js:page', () => {
  const jss = glob.sync('*.js', {
    cwd: __dirname + '/source/_src/js'
  });

  return co(function*() {
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

      // min
      if(process.env.NODE_ENV === 'production') {
        content = minify(content);
      }

      // write
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


/**
 * dev
 */

let watched = false;
gulp.task('dev', ['less', 'js'], function() {
  if (!watched) {
    watched = true;
    gulp.watch([
      'source/_src/**/*.less',
      'source/_src/**/*.js'
    ], ['dev']);
  }
});

/**
 * build
 */

gulp.task('build', function(done){
  process.env.NODE_ENV = 'production';
  gulp.start('js', 'less');
});