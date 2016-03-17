'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Project.hasMany(models.Sprint, {
          as: 'sprints',
          foreignKey: {
            name: 'project_id',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });

        Project.hasMany(models.Ticket, {
          as: 'tickets',
          foreignKey: {
            name: 'project_id',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });

        Project.belongsTo(models.User, {
          as: 'creator',
          foreignKey: {
            name: 'creator_id',
            allowNull: true
          }
        });
      }
    }
  });
  return Project;
};
