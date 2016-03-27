'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', routes);

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
