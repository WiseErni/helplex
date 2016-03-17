'use strict';
module.exports = function(sequelize, DataTypes) {
  var Sprint = sequelize.define('Sprint', {
    title: DataTypes.STRING,
    bdate: DataTypes.DATE,
    edate: DataTypes.DATE,
    description: DataTypes.STRING,
    resource: DataTypes.INTEGER,
    factor: DataTypes.INTEGER,
    staffed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Sprint.hasMany(models.Contract, {
          as: 'contracts',
          foreignKey: {
            name: 'sprint_id',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });

        Sprint.hasMany(models.Ticket, {
          as: 'tickets',
          constraints: false,
          foreignKey: {
            name: 'sprint_id',
            allowNull: true
          }
        });

        Sprint.belongsTo(models.User, {
          as: 'creator',
          foreignKey: {
            name: 'creator_id',
            allowNull: true
          }
        });
      }
    }
  });
  return Sprint;
};
