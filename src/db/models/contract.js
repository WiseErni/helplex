'use strict';
module.exports = function(sequelize, DataTypes) {
  var Contract = sequelize.define('Contract', {
    days: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Contract;
};