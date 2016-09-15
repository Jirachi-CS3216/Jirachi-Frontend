module.controller('LoginCtrl', function($scope, $state, auth) {
	$scope.login = function(data) {
		auth.login(data, function(succeeded){
			if (succeeded) {
				$state.go('tab.dash');
			}
		})
  	};
})