'use strict';
const gulp = require('gulp');
const lint = require('./gulp-tasks/lint.js');
const resetTestDb = require('./gulp-tasks/resetTestDb.js');

gulp.task('default', () => {

});

gulp.task('lint', lint);
gulp.task('resetTestDb', resetTestDb);
