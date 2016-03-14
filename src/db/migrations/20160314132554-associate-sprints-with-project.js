'use strict';

var childTableName = 'Sprints',
  parentTableName = 'Projects',
  columnName = 'project_Id',
  fkName = `FK__${childTableName}__${parentTableName}__${columnName}`;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(childTableName, columnName, {
      type: Sequelize.INTEGER,
      allowNull: false
    })
      .then(() => {
        return queryInterface.sequelize
          .query(`ALTER TABLE ${childTableName} ADD CONSTRAINT ${fkName} FOREIGN KEY (${columnName}) REFERENCES ${parentTableName} (Id)`);
      });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize
      .query(`ALTER TABLE ${childTableName} DROP CONSTRAINT ${fkName}`)
      .then(() => {
        return queryInterface.removeColumn(childTableName, columnName);
      });
  }
};
