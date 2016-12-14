'use strict';

var fs            = require('fs'),
    nodepath      = require('path'),
    gulp          = require('gulp'),
    watch         = require('gulp-watch'),
    prefixer      = require('gulp-autoprefixer'),
    uglify        = require('gulp-uglify'),
    less          = require('gulp-less'),
    sourcemaps    = require('gulp-sourcemaps'),
    rigger        = require('gulp-rigger'),
    cssmin        = require('gulp-minify-css'),
    imagemin      = require('gulp-imagemin'),
    rimraf        = require('rimraf'),
    browserSync   = require("browser-sync"),
    reload        = browserSync.reload,
    notify        = require("gulp-notify")
;
var notifyOptions = {
  message : 'ERROR:: <%= error.message %> \nLINE:: <%= error.line %> \nERROR CODE:: <%= error.extract %>'
};

var path = {
  build: {
    html: 'build/',
    ico: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/images/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/*.html',
    ico: 'src/*.ico',
    js: 'src/js/vendor.js',
    angular: 'src/js/app.js',
    style: 'src/css/style.less',
    img: 'src/images/*.*',
    fonts: 'src/fonts/'
  },
  watch: {
    html: 'src/**/*.html',
    ico: 'src/*.ico',
    js: 'src/js/**/*.js',
    style: 'src/css/**/*.less',
    img: 'src/images/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: false,
  host: 'localhost',
  port: 10000,
  logPrefix: "server-log:"
};


gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(rigger())
    .on('error', notify.onError(notifyOptions))
    .pipe(gulp.dest(path.build.html))
    .on('error', notify.onError(notifyOptions))
    .pipe(reload({stream: true}))
    .on('error', notify.onError(notifyOptions));

  gulp.src(path.src.ico)
    .pipe(gulp.dest(path.build.ico))
    .on('error', notify.onError(notifyOptions))
    .pipe(reload({stream: true}))
    .on('error', notify.onError(notifyOptions));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(rigger())
    .on('error', notify.onError(notifyOptions))
    .pipe(sourcemaps.init())
    .on('error', notify.onError(notifyOptions))
    .pipe(uglify())
    .on('error', notify.onError(notifyOptions))
    .pipe(sourcemaps.write())
    .on('error', notify.onError(notifyOptions))
    .pipe(gulp.dest(path.build.js))
    .on('error', notify.onError(notifyOptions))
    .pipe(reload({stream: true}))
    .on('error', notify.onError(notifyOptions));

  gulp.src(path.src.angular)
    .pipe(rigger())
    .on('error', notify.onError(notifyOptions))
    .pipe(sourcemaps.init())
    .on('error', notify.onError(notifyOptions))
    .pipe(gulp.dest(path.build.js))
    .on('error', notify.onError(notifyOptions))
    .pipe(reload({stream: true}))
    .on('error', notify.onError(notifyOptions));
});

gulp.task('css:build', function () {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', notify.onError(notifyOptions))
    .pipe(prefixer())
    .on('error', notify.onError(notifyOptions))
    .pipe(cssmin())
    .on('error', notify.onError(notifyOptions))
    .pipe(sourcemaps.write())
    .on('error', notify.onError(notifyOptions))
    .pipe(gulp.dest(path.build.css))
    .on('error', notify.onError(notifyOptions))
    .pipe(reload({stream: true}))
    .on('error', notify.onError(notifyOptions));
});

gulp.task('img:build', function () {
  gulp.src(path.src.img)
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}))
});

gulp.task('img:copy', function () {
  return gulp.src("src/images/**/*")
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest("build/images/"))
    .pipe(reload({stream: true}))
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .on('error', notify.onError(notifyOptions))
    .pipe(reload({stream: true}))
    .on('error', notify.onError(notifyOptions));
});


gulp.task('build', [
  'html:build',
  'js:build',
  'css:build',
  'fonts:build',
  'img:build'
]);

gulp.task('watch', function(){
  gulp.watch(path.watch.html,   ['html:build']  );
  gulp.watch(path.watch.style,  ['css:build']   );
  gulp.watch(path.watch.js,     ['js:build']    );
  gulp.watch(path.watch.img,    ['img:build']   );
  gulp.watch(path.watch.fonts,  ['fonts:build'] );
});

gulp.task('server', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'server', 'watch']);
