'use strict';
process.env.NODE_ENV = 'test';

const models = require('../src/db/models');

module.exports = () => {
  return models.sequelize.sync({
    force: true
  }).then(() => {
    console.log('sync complete');
  });
};
