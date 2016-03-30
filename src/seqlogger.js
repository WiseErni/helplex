var models = require('./db/models');

module.exports = {
  log: function (level, msg, details, ip, url) {
    return models.Log.create({
      level,
      msg,
      details,
      date: new Date(),
      ip,
      url
    }).catch((e) => {
      console.error(e);
    });
  }
};
