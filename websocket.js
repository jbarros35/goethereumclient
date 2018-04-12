require('dotenv').config();
var http = require('http');
var https = require('https');
var fs = require('fs');
const WebSocket = require('ws');
var Web3 = require('web3');
const util = require('util');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
 var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://"+process.env.ENV_GETH_WS));
}

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

// Start geth connection after client unlock or create new account
function gethConnect(ethAddr) {
	// var ethAddr = '0x403A3b4Dc1E8B712189066dCbCc286a58986A24B';
	// WS CONNECTION TO GETH
	const gethws = new WebSocket('ws://'+process.env.ENV_GETH_WS);
	gethws.onopen = function (evt) {
		console.log("geth connected OK");
		gethws.send('{"id": 1, "method": "eth_subscribe", "params": ["newHeads", {}]}');
		// latest balance
		web3.eth.getBalance(ethAddr)
		.then(function(balance) {
			var lastbalance = web3.utils.toWei(String(balance),'ether');
			console.log("current balance: "+lastbalance);
		})
		.catch(function(err) {
			console.log('err on getbalance ' + err);
		});	
	};

	gethws.onmessage = function (evt) {
		console.log('gethws onmessage: '+JSON.stringify(evt.data));
		if (typeof JSON.parse(evt.data).params !== 'undefined') {
			var eAddress = JSON.parse(evt.data).params.result.hash;
			var bCount = web3.eth.getBlockTransactionCount(eAddress);
			for (i=0; i<bCount; i++) {
				var pResult = web3.eth.getTransactionFromBlock(eAddress, i);
				console.log(typeof pResult + '   ' + typeof pResult.to + ' => ' + pResult.to);
				if ( pResult.to == ethAddr) {
					
					web3.eth.getBalance(ethAddr)
						.then(function(balance) {
							var lastbalance = web3.utils.toWei(String(balance),'ether');
							var date = new Date(web3.eth.getBlock(eAddress, true).timestamp * 1000).toLocaleString('en-US',{ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
							var from = pResult.from;
							var value = web3.utils.toWei(pResult.value, 'ether').toString();			
							console.log(
							"TRANSACTION: " + date + ", FROM: " + from +", value: " + value +
							"current balance: "+lastbalance);
					})
					.catch(function(err) {
						console.log('err on getbalance ' + err);
					});
				}
			}
		}
	};

	gethws.onerror = function (evt) {
		console.log('Geth ws Error: '+evt.message)
	};

	gethws.onclose = function () {
		var d = new Date();
		console.log("Unable to connect to geth ws, " +d);
	};
};


var connections = [];

// create secure websocket to client browser.
const wss = new WebSocket.Server({ server });
// connect socket
wss.on('connection', function connection(ws, req) {
 
	// keep connection
	var connection = req.connection;
	connections.push(connection);
	
	// get client ip
	const ip = req.connection.remoteAddress;
	// client id
	var id = req.headers['sec-websocket-key'];
  
	// open connection to get for this client 
	ws.on('message', function incoming(message) {
		console.log('received: %s from %s', message, id);
		var json = JSON.parse(message);
		if (json.address != null) {
			var ethAddr = json.address;
			gethConnect(ethAddr);
		}
		ws.send(JSON.stringify({response:'your message was delivered.'});
	});

  // ping client
  ws.send(JSON.stringify({response:'your client id on server '+id}));
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

/*
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
*/