module.controller('DashCtrl', function($scope, $ionicModal) {
	
	$ionicModal.fromTemplateUrl('../../templates/dashboard-modal-post.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.postModal = modal;
	});

	$ionicModal.fromTemplateUrl('../../templates/dashboard-modal-post-modal-location-picker.html', {
	    scope: $scope,
	    animation: 'scale-in'
	}).then(function(modal) {
    	$scope.locationPickerModal = modal;
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
		$scope.locationPickerModal.remove();
	});

	$scope.buttonAnimations = {
		"SELF": "",
		"OTHER": ""
	}

	$scope.buttonDidTouch = function(key) {
		$scope.buttonAnimations.key = "animated pulse"
	}

	// Map

	$scope.thumbnailURL = function() {
		var selectedPoint = new google.maps.LatLng(1.3521,103.8198);
		var selectedZoom = 13;
		var imageElement = document.querySelectorAll(".map-wrapper")[0]
		if (imageElement && selectedPoint) {
			var url = "https://maps.googleapis.com/maps/api/staticmap" + 
				  "?center=" + selectedPoint.lat() + "," + selectedPoint.lng() +
				  "&zoom=" + selectedZoom +
				  "&size=" + imageElement.clientWidth + "x150" + 
				  "&scale=2" + 
				  "&maptype=roadmap" + 
				  "&markers=red%7C" + selectedPoint.lat() + "," + selectedPoint.lng() +
				  "&key=" + GOOGLE_MAPE_API_KEY +
				  " 2x"
			return url
		} else {
			return ""
		}
	}

	$scope.mapThumbnailDidClick = function() {
		$scope.locationPickerModal.show();
		var map = new google.maps.Map(document.getElementById("map-modal-post"), mapOptions);
	}

	var myLatlng = new google.maps.LatLng(1.3521,103.8198);
        
    var mapOptions = {
		center: myLatlng,
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };

	// End of Map

})