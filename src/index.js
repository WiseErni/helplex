'use strict';

const server = require('./server.js'),
  PORT = 3500;

server.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
