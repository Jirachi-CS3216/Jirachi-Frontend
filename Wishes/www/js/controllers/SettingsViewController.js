module.controller('SettingsCtrl', function($scope, auth, session) {
	
	$scope.session = session;

	$scope.$on("$ionicView.beforeEnter", function(event, data){
   		$scope.displayName = session.currentUser().display_name
	});

    $scope.logout = function() {
    	auth.logout();
    }

    $scope.userDisplayNameInputDidChange = function(newValue) {
    	session.currentUser().display_name = newValue;
    	session.saveContext();
    }
})