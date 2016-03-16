'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Project.hasMany(models.Sprint, {
          foreignKey: {
            name: 'project_id',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });

        Project.hasMany(models.Ticket, {
          foreignKey: {
            name: 'project_id',
            allowNull: false
          },
          onDelete: 'CASCADE'
        });

        Project.belongsTo(models.User, {
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
