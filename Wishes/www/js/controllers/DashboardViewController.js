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
		window.alert("Location Picker Not Implemented")
	}

	// var myLatlng = new google.maps.LatLng(1.3521,103.8198);
        
 //    var mapOptions = {
	// 	draggable: false,
	// 	scrollwheel: false,
	// 	disableDoubleClickZoom: true,
	// 	clickableLabels:false,
	// 	zoomControl: false,
	// 	center: myLatlng,
	// 	zoom: 13,
	// 	mapTypeId: google.maps.MapTypeId.ROADMAP
 //    };

 //    var map = new google.maps.Map(document.getElementById("map-modal-post"), mapOptions);

	// End of Map

})