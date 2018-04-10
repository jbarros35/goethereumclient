// var WebSocketServer = require('websocket').server;
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

var options = {
  key: privateKey,
  cert: certificate,
  passphrase: '123456'
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

/*
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // always verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
		console.log(message.type);
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF({response:'ok'});
        }

        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

});
*/


tail = new Tail("/home/ubuntu/geth/nohup.out");

tail.on("line", function(data) {
  
wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(data);
  });
console.log(data);
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});

tail.watch();

