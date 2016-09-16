module.controller('SettingsCtrl', function($scope, auth, session) {
	
	$scope.session = session;

	$scope.$on("$ionicView.beforeEnter", function(event, data){
   		$scope.displayName = session.currentUser().display_name
   		$scope.email = session.currentUser().email
   		$scope.phone = session.currentUser().phone
	});

    $scope.logout = function() {
    	auth.logout();
    }

    $scope.userDisplayNameInputDidChange = function(newValue) {
    	session.currentUser().display_name = newValue;
    	session.saveContext();
    }

    $scope.userEmailInputDidChange = function(newValue) {
    	session.currentUser().email = newValue;
    	session.saveContext();
    }

    $scope.userPhoneInputDidChange = function(newValue) {
    	session.currentUser().phone = newValue;
    	session.saveContext();
    }
})