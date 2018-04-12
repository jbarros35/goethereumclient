var app = angular.module('myApp', []);
app.controller('ballOutCtrl', function($scope, $http) {

	// it displays initial authentication
   $scope.unlock = false;
   $scope.client_address = null;
   if ($scope.client_address == null) {
		$scope.unlock = true;
		$scope.commandId = 'unlock';
		// open modal directly from unlock button
		setTimeout(function() {
			document.getElementById('unlock').click()        
		}, 0);
   } else {
	   $scope.unlock = false;
   }
      
   $scope.command = function (id) {
	   $scope.commandId = id;
   };
   
   $scope.submitCommand = function() {
	  var id = $scope.commandId;
		switch(id) {
		case "unlock":
			$scope.unlockAccount();
			break;
		case "create":
		    console.log("call create account");
			$scope.createAccount();
			break;
		case "submitBallout":
			console.log("call submit ballout");
			break;
		default:
			console.log("unknown command");
		}
   };
  
  $scope.createAccount = function() {
		var data = $.param({
			password: $scope.password
		});
		
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};
		
		$http.post('/createAccount', data, config)
			.success(function (data, status, headers, config) {
				if (data) {
					$scope.showMessage = true;
				    $scope.messageType = "success";
					$scope.ResponseDetails = "Account created successfully, your address is "+data.address+" you must save it to submit proposals.";
					$scope.client_address = data.address;
					$scope.address = null;
					$scope.password = null;
					$scope.commandId = null;
					$scope.openws();
				}				
			})
			.error(function (data, status, header, config) {
				$scope.showMessage = true;
				$scope.messageType = "warning";
				$scope.ResponseDetails = "Error on creation your account "+data.errorMsg;
			});
   };
  
   $scope.unlockAccount = function() {
		var data = $.param({
			address: $scope.address,
			password: $scope.password
		});
		
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};
		
		$http.post('/unlockAccount', data, config)
			.success(function (data, status, headers, config) {
				if (data) {
					$scope.showMessage = true;
				    $scope.messageType = "success";
					$scope.ResponseDetails = "Account unlocked successfully";
					$scope.client_address = $scope.address;
					$scope.address = null;
					$scope.password = null;
					$scope.commandId = null;
					$scope.openws();
				}				
			})
			.error(function (data, status, header, config) {
				$scope.showMessage = true;
				$scope.messageType = "warning";
				$scope.ResponseDetails = "Error on unlocking your account "+data.errorMsg;
			});
   };

  // OPEN websocket connection after account lockout or creation
$scope.openws = function() {

     var wsserver = null;

    // Load websocket server url param
    $http.get('/getenv')
      .success(function(data) {
          console.log(data.url);
          wsserver = data.url;
		  $scope.connectwsserver(wsserver);
   })
     .error(function(data) {
       console.log('error getting websocket variable, set it inside the .env file.');
       return;
   });

};

$scope.connectwsserver = function(wsserver) {
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  var connection = new WebSocket('wss://'+wsserver, 'echo-protocol');

  connection.onopen = function () {
    // connection is opened and ready to use
	console.log('client opened socket');
	$scope.send({
		address: $scope.client_address
    });
  };

  connection.onerror = function (error) {
    // an error occurred when sending/receiving data
   console.log('err: '+error);
  };

  connection.onmessage = function (message) {
    // try to decode json (I assume that each message
    // from server is json)
	console.log('server response:'+message);
    try {
      var json = JSON.parse(message.data);
	  console.log(json);
    } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ',
          message.data);
      return;
    }
    // handle incoming message
  };
  
  $scope.send = function(msg) {
  // Tell the server this is client 1 (swap for client 2 of course)
  connection.send(JSON.stringify(msg));
  };

}

});
