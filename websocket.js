require('dotenv').config();
var http = require('http');
var https = require('https');
var fs = require('fs');
const WebSocket = require('ws');
Tail = require('tail').Tail;

var privateKey  = fs.readFileSync('./key.pem', 'utf8');
var certificate = fs.readFileSync('./cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
var certpass = process.env.ENV_CERTPASS;

var options = {
  key: privateKey,
  cert: certificate,
  passphrase: certpass
};

var server = https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
});
//.listen(443);

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  
  const ip = req.connection.remoteAddress;
  console.log('client ip'+ip);

ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something your ip '+ip);
});

server.listen(443);

tail = new Tail("/home/ubuntu/geth/nohup.out");

tail.on("line", function(data) {
  
wss.clients.forEach(function each(ws) {
  console.log(data);
  if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(data);
  });

});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});

tail.watch();
