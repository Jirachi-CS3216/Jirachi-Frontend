module.controller('SettingsCtrl', function($scope, auth, session, apis) {
	
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
        $scope.updateUserInfo();
    }

    $scope.userEmailInputDidChange = function(newValue) {
    	session.currentUser().email = newValue;
    	session.saveContext();
        $scope.updateUserInfo();
    }

    $scope.userPhoneInputDidChange = function(newValue) {
    	session.currentUser().phone = newValue;
    	session.saveContext();
        $scope.updateUserInfo();
    }

    $scope.updateUserInfo = function() {
        apis.updateUserInfo.put(session.currentUserID(), {
            user: session.currentUser()
        }).success(function(data) {
            console.log("User Info Updated")
            console.log(data)
        }).error(function(data) {
            console.log("User Info Failed to update")
            console.log(data)
        })
    }
})