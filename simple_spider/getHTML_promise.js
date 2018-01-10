const http = require('http');

/**
 * @param url {string} html 目标页面的 url
 * @return {string} 目标页面的 html 文本
 */
module.exports = url => new Promise((resolve, reject) => {
  http.get(url, (res) => {
    let html = '';

    res.on('data', (data) => {
      html += data;
    });
    res.on('end', () => {
      resolve(html);
    });
    res.on('error', (e) => {
      reject(e);
    });
  });
});
