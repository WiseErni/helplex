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

      }
    }
  });
  return Sprint;
};
