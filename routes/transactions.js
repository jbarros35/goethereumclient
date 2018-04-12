var express = require('express');
var Web3 = require('web3');

var router = express.Router();

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
 var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://"+process.env.ENV_GETH_WS));
}

console.log(web3.version);

web3.eth.subscribe('pendingTransactions', function(err, res) {
    console.log('Here')
    console.log(err)
    console.log(res)
}).on('data', function(transaction) {
    console.log('Here 2')
    console.log(transaction)
});

router.post('/sendTransaction', function(req, res, next) {
	try {
		var from = req.body.from;
		var to = req.body.to;
		var password = req.body.password;
		var value = req.body.value;
		var coin = req.body.coin
        console.log('/sendTransaction from %s to %s', from, to);

		var tx = {"from": from, "to": to, "value": web3.utils.toWei(value, coin), 
                  "gas" : '21000', 
                  gasPrice: '10'};
		web3.eth.personal.sendTransaction(tx, password)
		.then((response) => {
            console.log(response);
			res.status(200).json(response);
		}).catch((error) => {
			console.log(error);
			res.status(500).json({errorMsg : String(error)});
		});
	} catch(e) {
		next(e);
	}
});

 
/* doesn't works on http provider
web3.eth.filter("pending").watch(
    function(error,result){
        if (!error) {
            console.log('Tx Hash: ' + result);
        }
    }
);
*/

module.exports = router;