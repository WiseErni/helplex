'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  expressWinston = require('express-winston'),
  winston = require('winston'),
  routes = require('./routes'),
  app = express(),
  seqLogger = require('./seqlogger');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

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

// eslint-disable-next-line
app.use((err, req, res, next) => {
  let error = {};

  if ((app.get('env') === 'development') || (app.get('env') === 'test')) {
    error = err;
  }

  seqLogger.log('error', err.message, JSON.stringify(err), req.ip, req.originalUrl);

  res.status(err.status || 500)
    .json({
      message: err.message,
      error
    });
});

module.exports = app;
