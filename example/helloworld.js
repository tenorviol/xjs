require('../lib/xjs');
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  require('./helloworld.xjs').render(function(result) {
    res.end(result);
  });
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');
