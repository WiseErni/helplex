'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const winston = require('winston');
const routes = require('./routes');
const app = express();
const SeqLogger = require('./seqlogger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({
      json: false,
      filename: './logs/express.log'
    })
  ]
}));

app.use('/', routes);

app.use(expressWinston.errorLogger({
  transports: [
    new SeqLogger({
      json: false
    })
  ]
}));

// eslint-disable-next-line
app.use((err, req, res, next) => {
  let error = {};

  if ((app.get('env') === 'development') || (app.get('env') === 'test')) {
    error = err;
  }

  res.status(err.status || 500)
    .json({
      message: err.message,
      error
    });
});

module.exports = app;
