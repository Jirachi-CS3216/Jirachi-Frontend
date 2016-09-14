module.controller('DashCtrl', function($scope, $ionicModal, apis) {
	
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

	$scope.isElementVisible = function(name) {
		if ($scope.selectedPoint) {
			return name !== 'select-address-button' ? "" : "hidden"
		} else {
			return name === 'select-address-button' ? "" : "hidden"
		}
	}


	// Map

	$scope.removeAddress = function() {
		$scope.selectedPoint = undefined;
	}

	$scope.showLocationPicker = function() {
		$scope.locationPickerModal.show();
		if (!$scope.map) {
			intializeMap();
		}
	}

	$scope.locationPickerDone = function() {
		$scope.locationPickerModal.hide();
		$scope.selectedPoint = $scope.map.getCenter()
		$scope.selectedZoom = $scope.map.getZoom()
	}

	$scope.locationPickerCancel = function() {
		$scope.locationPickerModal.hide();
	}

	var intializeMap = function() {
		if ($scope.selectedPoint) {
			var myLatlng = $scope.selectedPoint
			var myZoom = $scope.selectedZoom
		} else {
			var myLatlng = new google.maps.LatLng(1.3521,103.8198);
			var myZoom = 13
		}
        
	    var mapOptions = {
			center: myLatlng,
			zoom: myZoom,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

		$scope.map = new google.maps.Map(document.getElementById("map-modal-post"), mapOptions);

		google.maps.event.addListener($scope.map, "dragend", function() {
   			var currentSelectedPoint = $scope.map.getCenter()
   			apis.reverseGeocoding.get({
   				latlng: currentSelectedPoint.toUrlValue(),
   				key: GOOGLE_MAPE_API_KEY
   			}).success(function(data) {
   				if (data.status === "OK") {
   					var array = data.results
   					if (array.length > 0) {
   						$scope.selectedAddress = array[0].formatted_address
   					}

   				} else {
   					console.log("Google Geocoding Failed");
   				}
   			});
		});
	}


	$scope.thumbnailURL = function() {
		var selectedPoint = $scope.selectedPoint;
		var selectedZoom = $scope.selectedZoom;
		var imageElement = document.querySelectorAll(".map-wrapper")[0]
		if (imageElement && imageElement.clientWidth !== 0 && selectedPoint) {
			var url = "https://maps.googleapis.com/maps/api/staticmap" + 
				  "?center=" + selectedPoint.toUrlValue() +
				  "&zoom=" + selectedZoom +
				  "&size=" + imageElement.clientWidth + "x150" + 
				  "&scale=2" + 
				  "&maptype=roadmap" + 
				  "&markers=red%7C" + selectedPoint.toUrlValue() +
				  "&key=" + GOOGLE_MAPE_API_KEY +
				  " 2x"
			return url
		} else {
			return ""
		}
	}

	

	// End of Map

})