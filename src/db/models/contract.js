'use strict';
module.exports = function(sequelize, DataTypes) {
  var Contract = sequelize.define('Contract', {
    days: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        Contract.belongsTo(models.User, {
          as: 'developer',
          foreignKey: 'user_id'
        });
      }
    }
  });
  return Contract;
};
