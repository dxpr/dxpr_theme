const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');

// Minify JavaScript
gulp.task('minify-js', function() {
  return gulp.src('dxb-slider.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('.'));
});

// Minify CSS
gulp.task('minify-css', function() {
  return gulp.src('dxb-slider.css')
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('.'));
});

// Watch task
gulp.task('watch', function() {
  gulp.watch('dxb-slider.js', gulp.series('minify-js'));
  gulp.watch('dxb-slider.css', gulp.series('minify-css'));
});

// Default task
gulp.task('default', gulp.parallel('minify-js', 'minify-css', 'watch'));