'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const lint = require('./gulp-tasks/lint.js');
const sequelizeTestSetup = require('gulp-sequelize-test-setup');

gulp.task('default', () => {
  console.log('default task');
})
.task('lint', lint)
.task('setup-dev', () => {
  process.env.NODE_ENV = 'development';
  const models = require('./src/db/models');
  const sequelize_fixtures = require('sequelize-fixtures');

  return models.sequelize.sync({
    force: true
  }).then(() => {
    return sequelize_fixtures.loadFile('./test/fixtures/**/*', models);
  });
}).task('setup-test', () => {
  process.env.NODE_ENV = 'test';
  const models = require('./src/db/models');
  return gulp.src('./test/fixtures/**/*', {
      read: false
    })
    .pipe(sequelizeTestSetup({
      sequelize: models.sequelize,
      models: models,
      migrationsPath: './src/db/migrations',
      truncate: false
    }));
}).task('test', ['setup-test'], () => {
  return gulp.src('./test/**/*.js', {
    read: false
  })
  .pipe(mocha())
  .on('error', (e) => {
    console.log(e.toString());
    process.exit(1);
  })
  .on('end', () => {
    process.exit();
  });
});
