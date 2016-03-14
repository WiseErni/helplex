'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ticket = sequelize.define('Ticket', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    raiting: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    taken: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Ticket;
};