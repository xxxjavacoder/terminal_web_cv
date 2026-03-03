
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(dartSass);
const bs = browserSync.create();

const paths = {
  html: 'src/*.html',
  styles: 'src/scss/style.scss',
  stylesWatch: 'src/scss/**/*.scss',
  scripts: 'src/js/**/*.js',
  images: 'src/images/**/*',
  favicon: 'src/favicon/**/*',
  dist: 'dist'
};

export function clean() {
  return deleteAsync([`${paths.dist}/**`]);
}

export function html() {
  return src(paths.html)
    .pipe(dest(paths.dist))
    .pipe(bs.stream());
}

export function styles() {
  return src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat('style.min.css'))
    .pipe(dest(`${paths.dist}/css`))
    .pipe(bs.stream());
}

export function scripts() {
  return src(paths.scripts)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest(`${paths.dist}/js`))
    .pipe(bs.stream());
}

export function images() {
  return src(paths.images, { encoding: false })
    .pipe(dest(`${paths.dist}/images`));
}

export function favicon() {
  return src(paths.favicon, { encoding: false })
    .pipe(dest(`${paths.dist}/favicon`));
}

export function serve() {
  bs.init({
    server: { baseDir: paths.dist }
  });

  watch(paths.html, html);
  watch(paths.stylesWatch, styles);
  watch(paths.scripts, scripts);
  watch(paths.images, images);
  watch(paths.favicon, favicon);
}

export default series(clean, parallel(html, styles, scripts, images, favicon), serve);
