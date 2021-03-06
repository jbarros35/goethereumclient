# goethereumclient
## Proposal Blockchain System
Nodejs geth client, uses web3 for making several requests inside the blockchain private network.

## Start geth node

Run command for genesis json load before
```
geth --datadir ./myDataDir --networkid 1114 init ./myGenesis.json
```
We can copy inside ./myDataDir/keystore our own keystore file before running bellow command.
```
nohup geth --datadir ./myDataDir --networkid 1114 --ws --wsorigins="*" --wsapi "db,eth,net,ssh,miner,web3,personal,admin" --rpc --rpcapi "web3,eth,personal,miner,net,txpool" --rpccorsdomain "*" --ipcdisable &
```
### Blockchain Rest features

We don't expose the network for the outside, cors are not used in this demo, so we just expose a rest feature for interacting using web3 api.
```
/getenv returns websocket url, can be remote.
/coinbase returns the blockchain coinbase, just for testing purposes.
/getbalance returns an address balance.
/unlockAccount unlock an account based on its address and passphrase, automatically eth locks every acount after some 600 seconds for security feature.
/createAccount create a new account using only its passphrase.
```

## Steps for running

```
Set .env file to ENV_SERVER=localhost:43 or any url with https available.
Set .env file to ENV_CERTPASS=123456 or your certification passphrase.
Set .env file to ENV_GETHLOG for geth log full file path.
```

Import your certificate in the browser, websockets won't workts without a https transport!

Install pm2 feature for monitoring and starting node instances as bellow
```
npm install pm2 -g
```

```
pm2 start node websocket.js
pm2 start npm start --
```

## Next steps

Basic user authentication using address and his passphrase in the blockchain.
Allow websockets monitor transactions flow inside the network and output on the screen.
Update user balance and transactions.

## Development environment

### Webstorm screenshots
Webstorm is a paid tool from Jetbrains supports general Javascript development with several features.
![webstorm1](screenshots/webstorm1.png "Webstorm dev env")
![webstorm2](screenshots/webstorm2.png "Webstorm dev env")
#### Running
![webstorm1](screenshots/runwebstorm.png "Webstorm dev env")

### VSCode screenshots and running
VSCode is a tool light and fast for general development, its provided by Microsoft and supports Node development very well.
I didn't see much difference between Webstorm and VSCode capabilities yet, so you'll be fine on VSCode if don't have a Webstorm license.
![vscode](screenshots/vscode1.png "VSCode")
![vscode](screenshots/vscode2.png "VSCode")
![webstorm1](screenshots/console1.png "Webstorm dev env")
![webstorm1](screenshots/console2.png "Webstorm dev env")
![webstorm1](screenshots/consoletrans.png "Webstorm dev env")

### Start your geth instance
There are several commands available but you must open rpc and ws sockets, init with myGenesis.json providing a source account, mining difficulty and alloc some ether to it.
![webstorm1](screenshots/rungeth1.png "Webstorm dev env")
![webstorm1](screenshots/gethtransaction.png "Webstorm dev env")

### Geth attach
On anoter console, start geth attach to instance already running, it allow us start miner.
![webstorm1](screenshots/gethattach.png "Webstorm dev env")
![webstorm1](screenshots/gethrunning.png "Webstorm dev env")
![webstorm1](screenshots/d.png "Webstorm dev env")
![webstorm1](screenshots/gethminerstop.png "Webstorm dev env")

### Running websocket.js
Websocket.js is a node program wich start https instance with certificate, start wesocket connection to geth and receive web client connections.

### Running web application
The webapplication can send transactions, unlock account and create a new one. It runs on npm start or pm2 start npm -- start command.
console2
Our application starts and print the eth.coinbase
![webstorm1](screenshots/web1.png "Webstorm dev env")

That console means we already connected the websocket to server.
![webstorm1](screenshots/websocketconnection.png "Webstorm dev env")
![webstorm1](screenshots/console1.png "Webstorm dev env")

![webstorm1](screenshots/web2.png "Webstorm dev env")
After unlocking account script sends one transaction per minute for testing our network.
![webstorm1](screenshots/websendtrans1.png "Webstorm dev env")
![webstorm1](screenshots/websendtrans.png "Webstorm dev env")
Websocket receives a send transaction command.

# Check wiki for updates on this project
