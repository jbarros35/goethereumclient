var express = require('express');
var Web3 = require('web3');

var router = express.Router();

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

router.post('/sendTransaction', function(req, res, next) {
	try {
		var from = req.body.from;
		var to = req.body.to;
		var password = req.body.password;
		var value = req.body.value;
		var coin = req.body.coin;
		var tx = {"from": from, "to": to, "value": web3.utils.toWei(value, coin)};
		web3.eth.personal.sendTransaction(tx, password)
		.then((response) => {
			res.status(200).json(response);
		}).catch((error) => {
			console.log(error);
			res.status(500).json(error);
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