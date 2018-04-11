require('dotenv').config();
var http = require('http');
var https = require('https');
var fs = require('fs');
const WebSocket = require('ws');
Tail = require('tail').Tail;
// certificate files
var privateKey  = fs.readFileSync('./key.pem', 'utf8');
var certificate = fs.readFileSync('./cert.pem', 'utf8');
var certpass = process.env.ENV_CERTPASS;

// certificate credentials
var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
// options for load certificate
var options = {
  key: privateKey,
  cert: certificate,
  passphrase: certpass
};
// create https server
var server = https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
});

// create secure websocket
const wss = new WebSocket.Server({ server });
// connect socket
wss.on('connection', function connection(ws, req) {
  // get client ip
  const ip = req.connection.remoteAddress;
  console.log('client ip'+ip);
   ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  // ping client
  ws.send(JSON.stringify({response:'something your ip '+ip}));
});
// start server at 443
server.listen(443);

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// tail a geth output file
var logfile = process.env.ENV_GETHLOG;
tail = new Tail(logfile);

tail.on("line", function(data) {
  console.log(data);
  wss.broadcast(JSON.stringify({log:data}));
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});

tail.watch();
