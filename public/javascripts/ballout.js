var app = angular.module('myApp', []);
app.controller('ballOutCtrl', function($scope, $http) {
   console.log('ballout init');
   
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
					$scope.address = null;
					$scope.password = null;
					$scope.commandId = null;
				}				
			})
			.error(function (data, status, header, config) {
				$scope.showMessage = true;
				$scope.messageType = "warning";
				$scope.ResponseDetails = "Error on creation your account passphrase is invalid.";
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
					$scope.address = null;
					$scope.password = null;
					$scope.commandId = null;
				}				
			})
			.error(function (data, status, header, config) {
				$scope.showMessage = true;
				$scope.messageType = "warning";
				$scope.ResponseDetails = "Error on unlocking your account, address or passphrase invalid.";
			});
   };
});