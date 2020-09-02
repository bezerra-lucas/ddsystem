'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
var concat = require('gulp-concat')
var minifyCSS = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
var rename = require('gulp-rename')

gulp.task('default', watch)
gulp.task('sass', compileSass)

gulp.task('minify-css', () => {
  return gulp.src('styles/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'))
})

function compileSass (){
  return gulp
    .src('public/scss/**/*.scss')

    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename('style.css'))
    .pipe(concat('style.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))

    .pipe(gulp.dest('public/css'))
}

function watch (){
  gulp.watch('public/scss/**/*.scss', compileSass)
}
