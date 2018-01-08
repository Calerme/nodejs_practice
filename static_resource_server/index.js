const http = require('http');

// third-party modules
const chalk = require('chalk');

// config file
const conf = require('./config/config');

const server = http.createServer((req, res) => {
  res.end('Your Mother Fucker.');
});

server.listen(conf.port, conf.host, () => {
  const info = `Your site is listening to ${chalk.green(`${conf.host}:${conf.port}`)}`;
  console.log(info); //eslint-disable-line
});
