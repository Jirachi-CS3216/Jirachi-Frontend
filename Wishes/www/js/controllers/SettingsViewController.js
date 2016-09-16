module.controller('SettingsCtrl', function($scope, auth, session) {
	
	$scope.session = session;

    $scope.logout = function() {
    	auth.logout();
    }
})