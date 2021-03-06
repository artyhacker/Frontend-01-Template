const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Recive request!', new Date().toLocaleString());
  console.log('Headers: ', req.headers);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-F00', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK!');
});

server.listen(8088, () => console.log('Server is startup in 8088!'));