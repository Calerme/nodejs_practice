const http = require('http');

// third-party modules
const chalk = require('chalk');

// config
const conf = require('./conf/config');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.write('Hello Vue!');
  res.end('Hello World!');
});

server.listen(conf.port, conf.host, () => {
  // eslint-disable-next-line
  console.log(`Server is listening to ${chalk.green(conf.host+':'+conf.port)}`);
});
