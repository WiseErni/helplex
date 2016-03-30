const gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  eslint = require('gulp-eslint'),
  sequelizeTestSetup = require('gulp-sequelize-test-setup'),
  sequelize_fixtures = require('sequelize-fixtures');

const PATH = {
  SRC: './src/**/*.js',
  TESTS: './test/**/*.js',
  MODELS: './src/db/models',
  FIXTURES: './test/fixtures/**/*',
  MIGRATIONS: './src/db/migrations'
};

const test = function () {
  return gulp.src(PATH.TESTS, {
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
};

gulp.task('lint', () => {
  return gulp.src([PATH.SRC])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('setup-sync', () => {
  const models = require(PATH.MODELS);

  return models.sequelize.sync({
    force: true
  }).then(() => {
    return sequelize_fixtures.loadFile(PATH.FIXTURES, models);
  });
});

gulp.task('setup-migrate', () => {
  const models = require(PATH.MODELS);

  return gulp.src(PATH.FIXTURES, {
      read: false
    })
    .pipe(sequelizeTestSetup({
      sequelize: models.sequelize,
      models: models,
      migrationsPath: PATH.MIGRATIONS,
      truncate: false
    }));
});

gulp.task('test', ['setup-migrate'], () => {
  return test();
});

gulp.task('test-sync', ['setup-sync'], () => {
  return test();
});
