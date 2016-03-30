'use strict';
module.exports = function(sequelize, DataTypes) {
  var Log = sequelize.define('Log', {
    level: DataTypes.STRING,
    msg: DataTypes.TEXT,
    details: DataTypes.TEXT,
    date: DataTypes.DATE,
    ip: DataTypes.STRING,
    url: DataTypes.TEXT
  }, {
    timestamps: false
  });
  return Log;
};
