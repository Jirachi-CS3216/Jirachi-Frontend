module.controller('SettingsCtrl', function($scope, auth, session) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
	   	$scope.currentUser = session.currentUser();
	});

    $scope.logout = function() {
    	auth.logout();
    }
})