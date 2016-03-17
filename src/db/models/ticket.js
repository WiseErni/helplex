'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ticket = sequelize.define('Ticket', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    raiting: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    area: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    taken: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Ticket.belongsTo(models.User, {
          as: 'creator',
          foreignKey: 'creator_id'
        });

        Ticket.belongsTo(models.User, {
          as: 'developer',
          foreignKey: 'developer_id'
        });

        Ticket.belongsTo(models.User, {
          as: 'reviewer',
          foreignKey: 'reviewer_id'
        });

        Ticket.belongsTo(models.User, {
          as: 'tester',
          foreignKey: 'tester_id'
        });
      }
    }
  });
  return Ticket;
};
