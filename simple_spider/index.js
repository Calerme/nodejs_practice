const http = require('http');
const fs = require('fs');
const path = require('path');

// third-party modules
const chalk = require('chalk');
const handlebars = require('handlebars');

// self modules
const getDataPromise = require('./getData');

// config
const conf = require('./conf/config');

const server = http.createServer((req, res) => {
  getDataPromise
    .then((data) => {
      const source = fs.readFileSync(path.join(__dirname, './tpl/index.html'));
      const tpl = handlebars.compile(source.toString());

      // 对课程数据按收听人数排序
      data.sort((a, b) => b.number - a.number);

      // 将数据写到一个文件里
      fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(data, null, 4));
      return tpl(data);
    })
    .then((html) => {
      res.end(html);
    })
    .catch((e) => {
      console.log('error: ', e);
    });
});

server.listen(conf.port, conf.host, () => {
  // eslint-disable-next-line
  console.log(`Server is listening to ${chalk.green(conf.host+':'+conf.port)}`);
});
