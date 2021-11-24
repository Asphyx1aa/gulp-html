const { src, dest, parallel, series, watch } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleancss = require('gulp-clean-css');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const del = require('del');
const browserSync = require('browser-sync').create();

function browsersync() {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    notify: false,
  })
}

function clean() {
    return del('./dist')
}

function html() {
    return src('./src/index.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest('./dist'))
      .pipe(browserSync.stream())
}

function style() {
  return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(cleancss({ level: 2 }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream())
}

function fonts() {
   return src('./src/fonts/*.ttf')
     .pipe(ttf2woff())
     .pipe(src('./src/fonts/*.ttf'))
     .pipe(ttf2woff2())
     .pipe(dest('./dist/fonts'))
}

function image() {
   return src('./src/img/*')
    .pipe(imagemin())
    .pipe(dest('./dist/img'))
}

function watchFiles() {
    watch('./src/scss/**/*.scss', style)
    watch('./src/index.html', html)
    watch('./src/img/*', image)
    watch('./src/fonts/*.ttf', fonts)
}

exports.html = html;
exports.style = style;
exports.fonts = fonts;
exports.image = image;
exports.clean = clean;
exports.watchFiles = watchFiles;

exports.build = series(clean, parallel(html, style, image, fonts));
exports.default = series(clean, parallel(html, style, image, fonts, browsersync, watchFiles));