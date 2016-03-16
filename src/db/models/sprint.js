'use strict';
module.exports = function(sequelize, DataTypes) {
  var Sprint = sequelize.define('Sprint', {
    title: DataTypes.STRING,
    bdate: DataTypes.DATE,
    edate: DataTypes.DATE,
    description: DataTypes.STRING,
    resource: DataTypes.DECIMAL,
    factor: DataTypes.DECIMAL,
    staffed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Sprint.hasMany(models.Contract, {
          foreignKey: {
            name: 'sprint_id',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });

        Sprint.hasMany(models.Ticket, {
          constraints: false
        });

        Sprint.belongsTo(models.User, {
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
