module.controller('DashCtrl', function($scope, $ionicModal) {
	
	$ionicModal.fromTemplateUrl('../../templates/dashboard-modal-post.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.postModal = modal;
	});

	$scope.openModal = function() {
	    $scope.postModal.show();
	};
		$scope.closeModal = function() {
		$scope.postModal.hide();
	};

	// Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.postModal.remove();
	});

	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
		// Execute action
	});

	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
		// Execute action
	});

	$scope.buttonAnimations = {
		"SELF": "",
		"OTHER": ""
	}

	$scope.buttonDidTouch = function(key) {
		$scope.buttonAnimations.key = "animated pulse"
	}

})