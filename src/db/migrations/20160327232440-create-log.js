'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      level: {
        type: Sequelize.STRING
      },
      msg: {
        type: Sequelize.TEXT
      },
      details: {
        type: Sequelize.TEXT
      },
      date: {
        type: Sequelize.DATE
      },
      ip: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.TEXT
      }
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('Logs');
  }
};
