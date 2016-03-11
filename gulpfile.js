var gulp = require('gulp'),
    eslint = require('gulp-eslint');

gulp.task('default', () => {

});

gulp.task('lint', () => {
    return gulp.src(['src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
