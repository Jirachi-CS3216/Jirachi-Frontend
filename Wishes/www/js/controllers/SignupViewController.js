module.controller('SignupCtrl', function($scope, $state, $ionicHistory, $ionicScrollDelegate,auth) {
	$scope.signin = function() {
		$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop(true);
		$ionicHistory.nextViewOptions({
		    disableAnimate: true
		});
		$state.go('login');
	}
})