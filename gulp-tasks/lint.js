var gulp = require('gulp'),
    eslint = require('gulp-eslint');

module.exports = () => {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};
