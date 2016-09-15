module.controller('LoginCtrl', function($scope, $state) {
	$scope.login = function(user) {
		$state.go('tab.dash');
  	};
})