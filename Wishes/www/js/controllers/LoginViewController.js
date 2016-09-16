module.controller('LoginCtrl', function($scope, $state, $ionicHistory, $ionicScrollDelegate,auth) {
		
	$scope.submitForm = function(isValid, data) {
		if (isValid) {
			$scope.login(data)
		}
	}

	$scope.login = function(data) {
		$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop(true);
		auth.login(data, function(succeeded){
			if (succeeded) {
				$ionicHistory.nextViewOptions({
				    disableAnimate: true
				});
				$state.go('tab.dash');
			}
		})
  	};

  	$scope.signup = function() {
  		$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop(true);
  		$ionicHistory.nextViewOptions({
		    disableAnimate: true
		});
  		$state.go('signup');
  	}
})