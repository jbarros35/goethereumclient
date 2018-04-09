var express = require('express');
var Web3 = require('web3');

var router = express.Router();

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.getCoinbase(function(err, cb) { console.log(err, cb); })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Proposal Blockchain System' });
});

router.get('/coinbase', function(req, res, next) {
	try {
		web3.eth.getCoinbase(function(err, result) { 
			res.status(200).json(result);
		});
	} catch(e) {
		next(e);
	}
});

// 
router.post('/getBalance', function(req, res, next) {
	try {
		var address = req.body.address;
		web3.eth.getBalance(address)
		.then((response) => {
			res.status(200).json({"balance": response});
		}).catch((error) => {
			console.log(error);
			res.status(500).json(error);
		});
	} catch(e) {
		next(e);
	}
});

// unlock account
router.post('/unlockAccount', function(req, res, next) {
	try {
		var address = req.body.address;
		var password = req.body.password;
		web3.eth.personal.unlockAccount(address, password, 600)
		.then((response) => {
			console.log(response);
			res.status(200).json({response: 'ok'});
		}).catch((error) => {
			console.log('error'+error);
			res.status(500).json({error: error});
		});
	} catch(e) {
		next(e);
	}
});

// create account
router.post('/createAccount', function(req, res, next) {
	try {
		var password = req.body.password;	
		web3.eth.personal.newAccount(password)
		.then((response) => {
			res.status(200).json({address: response});
		}).catch((error) => {
			console.log(error);
			res.status(500).json(error);
		});
	} catch(e) {
		next(e);
	}
});

module.exports = router;