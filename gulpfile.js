
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(dartSass);
const bs = browserSync.create();

const paths = {
  html: 'src/*.html',
  styles: 'src/scss/**/*.scss',
  scripts: 'src/js/**/*.js',
  images: 'src/images/**/*',
  fonts: 'dist/fonts',
  dist: 'dist'
};

export function clean() {
  return deleteAsync([
    `${paths.dist}/**`,
    `!${paths.fonts}`,
    `!${paths.fonts}/**`
  ]);
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
  return src(paths.images)
    .pipe(imagemin())
    .pipe(dest(`${paths.dist}/images`));
}

export function serve() {
  bs.init({
    server: { baseDir: paths.dist }
  });

  watch(paths.html, html);
  watch(paths.styles, styles);
  watch(paths.scripts, scripts);
  watch(paths.images, images);
}

export default series(clean, parallel(html, styles, scripts, images), serve);
