module.controller('LoginCtrl', function($scope, $state, $ionicScrollDelegate,auth) {
	$scope.login = function(data) {
		$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop(true);
		auth.login(data, function(succeeded){
			if (succeeded) {
				$state.go('tab.dash');
			}
		})
  	};
})