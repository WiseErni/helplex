'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Sprints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      bdate: {
        type: Sequelize.DATE
      },
      edate: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING
      },
      resource: {
        type: Sequelize.INTEGER
      },
      factor: {
        type: Sequelize.INTEGER
      },
      staffed: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('Sprints');
  }
};
