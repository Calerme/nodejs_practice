const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('ssh_key.pem'), // private key
  cert: fs.readFileSync('ssh_cert.pem'), // ssh certificate
};

https.createServer(options, (req, res) => {
  res.writeHead('200');
  res.end('Hello Https!');
});
