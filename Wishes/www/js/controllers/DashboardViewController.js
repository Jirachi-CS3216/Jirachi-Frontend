module.controller('DashCtrl', function($scope, $ionicModal, apis, session, $timeout, TDCardDelegate) {
	$scope.session = session;
	//modals for posting wishes
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

	$scope.post = function() {
		var wish = {}
		wish.title = $scope.postWishTitle;
		wish.description = $scope.postWishDescription;
		wish.needsMeetup = $scope.selectedPoint !== undefined;
		if (wish.needMeetup) {
			wish.latitude = $scope.selectedPoint.lat
			wish.longitude = $scope.selectedPoint.long
		}

		console.log(wish)
	}

	//modals for getting wishes
	$ionicModal.fromTemplateUrl('../../templates/dashboard-modal-get.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.getModal = modal;
	});

	var wishes = [{ 
		title: 'Printing@SoC',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nulla purus, placerat sed turpis ac, consectetur cursus nunc. Nunc lorem turpis, faucibus sed neque a, lacinia egestas lacus. Vestibulum sollicitudin molestie hendrerit. Vestibulum consequat ipsum nec leo porttitor, ac elementum libero posuere. Sed placerat rutrum tellus, vestibulum porta nibh rhoncus eget. Etiam sit amet tincidunt felis.',
		posterHasContact: true,
		hasMeetupLocation: true,
		address: "School of Computing, 13 Computing Drive",
		latitude: 1.30,
		longitude: 103.77
	},{ 
		title: 'Printing@SoC',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nulla purus, placerat sed turpis ac, consectetur cursus nunc. Nunc lorem turpis, faucibus sed neque a, lacinia egestas lacus. Vestibulum sollicitudin molestie hendrerit. Vestibulum consequat ipsum nec leo porttitor, ac elementum libero posuere. Sed placerat rutrum tellus, vestibulum porta nibh rhoncus eget. Etiam sit amet tincidunt felis.',
		posterHasContact: true,
		hasMeetupLocation: true,
		address: "School of Computing, 13 Computing Drive",
		latitude: 1.28333,
		longitude: 103.7666
	},{
		title: 'Printing@SoC',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nulla purus, placerat sed turpis ac, consectetur cursus nunc. Nunc lorem turpis, faucibus sed neque a, lacinia egestas lacus. Vestibulum sollicitudin molestie hendrerit. Vestibulum consequat ipsum nec leo porttitor, ac elementum libero posuere. Sed placerat rutrum tellus, vestibulum porta nibh rhoncus eget. Etiam sit amet tincidunt felis.',
		posterHasContact: true,
		hasMeetupLocation: true,
		address: "School of Computing, 13 Computing Drive",
		latitude: 1.28333,
		longitude: 103.7666
	}];

	$scope.cards = {
		master: Array.prototype.slice.call(wishes, 0),
		active: Array.prototype.slice.call(wishes, 0),
		discards: [],
		liked: [],
		disliked: []
	}

	$scope.cardDestroyed = function(index) {
		$scope.cards.active.splice(index, 1);
	};

	$scope.addCard = function() {
		var newCard = wishes[0];
		$scope.cards.active.push(angular.extend({}, newCard));
	}

	$scope.refreshCards = function() {
		// Set $scope.cards to null so that directive reloads
		$scope.cards.active = null;
		$timeout(function() {
			$scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
		});
	}

	$scope.cardSnapBack = function() {
		console.log("snapBack");
	}

	$scope.$on('removeCard', function(event, element, card) {
		console.log('removeCard');
		var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
		$scope.cards.discards.push(discarded);
	});

	$scope.cardSwipedLeft = function(index) {
		console.log('LEFT SWIPE');
		var card = $scope.cards.active[index];
		$scope.cards.disliked.push(card);
	};
	
	$scope.cardSwipedRight = function(index) {
		console.log('RIGHT SWIPE');
		var card = $scope.cards.active[index];
		$scope.cards.liked.push(card);
	};


	//methods

	$scope.openPostModal = function() {
	    $scope.postModal.show();
	};
	
	$scope.closePostModal = function() {
		$scope.postModal.hide();
	};

	$scope.openGetModal = function() {
	    $scope.getModal.show();
	};
	
	$scope.closeGetModal = function() {
		$scope.getModal.hide();
	};

	// Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.postModal.remove();
		$scope.locationPickerModal.remove();
		$scope.getModal.remove();
	});

	$scope.buttonAnimations = {
		"SELF": "",
		"OTHER": ""
	}

	$scope.buttonDidTouch = function(key) {
		$scope.buttonAnimations.key = "animated pulse"
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
		$scope.selectedAddress = "Select Meetup Address"

		function mapDidDrag() {
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
		}

		google.maps.event.addListener($scope.map, "dragend", mapDidDrag);
		mapDidDrag();
	}


	$scope.thumbnailURL = function(lat, long) {
		if (lat !== undefined && long !== undefined) {
			var selectedPoint = new google.maps.LatLng(lat,long);
			var selectedZoom = 13;
			var imageElement = document.querySelectorAll(".map-thumbnail")[0]
		} else {
			var selectedPoint = $scope.selectedPoint;
			var selectedZoom = $scope.selectedZoom;
			var imageElement = document.querySelectorAll(".map-wrapper")[0]
		}

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