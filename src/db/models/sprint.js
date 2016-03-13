'use strict';
module.exports = function(sequelize, DataTypes) {
  var Sprint = sequelize.define('Sprint', {
    title: DataTypes.STRING,
    bdate: DataTypes.DATE,
    edate: DataTypes.DATE,
    staffed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(/*models*/) {
        // associations can be defined here
      }
    }
  });
  return Sprint;
};
