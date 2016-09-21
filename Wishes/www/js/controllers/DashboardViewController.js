module.controller('DashCtrl', function($scope, $ionicModal, $ionicPopup, apis, indicator, session, $timeout, SERVER_EVENTS) {
	$scope.session = session;
	
	$scope.$on(SERVER_EVENTS.notAuthenticated, function(event) {
        indicator.showSessionExpiredIndicator()
    });

	$scope.$on("$ionicView.beforeEnter", function(event, data){
   		verifyNetworkStatus("Network unavailable, posting and picking wishes are disabled.");
	});

    function verifyNetworkStatus(message) {
    	apis.updateUserInfo.get(session.currentUserID(), {}).success(function(data, status){
			$scope.networkDown = (status !== 200)
			if (status !== 200) {
				$scope.locationPickerModal.hide()
				$scope.postModal.hide()
				$scope.getModal.hide()
				$scope.spinnerModal.hide()
				indicator.showNetworkDownIndicator($scope, message)
			}
	    })
    }

	$ionicModal.fromTemplateUrl('../../templates/dashboard-modal-spinner.html', {
	    scope: $scope,
	    animation: 'fade-in'
	}).then(function(modal) {
	    $scope.spinnerModal = modal;
	});

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
		wish.title = this.postWishTitle;
		wish.description = this.postWishDescription;
		wish.needs_meetup = $scope.selectedPoint !== undefined;
		if (wish.needs_meetup) {
			wish.address = $scope.selectedAddress;
			wish.latitude = $scope.selectedPoint.lat()
			wish.longitude = $scope.selectedPoint.lng()
		}

		$scope.spinnerModal.show();
		apis.wishes.post(session.currentUserID(), {}, wish).success(function(data, status){
			$scope.spinnerModal.hide();
			if (!data.error) {
				$ionicPopup.show({
		            title: 'Wish Posted',
		            template: 'You wish has been posted to the community. You may check the status in My Wishes section',
		            buttons: [{
		            	text: 'OK',
		            	onTap: function(e) {
				          $scope.closePostModal();
				        }
		            }]
		        });
			} else if (data.error.points) {
				$ionicPopup.show({
		            title: 'Not Enough Points',
		            template: 'Each wish cost 100 points and you do not have enough points in your accounts. Try to pick and fulfill others\' wishes to earn points.',
		            buttons: [{
		            	text: 'OK',
		            	onTap: function(e) {
				          $scope.closePostModal();
				        }
		            }]
		        });
			} else {
				console.log("Wish created failed")
			}
		}).error(function(data, status) {
			verifyNetworkStatus("Network Unavailable")
			console.log("Wish created failed")
			$scope.spinnerModal.hide();
		})
	}

	//modals for getting wishes
	$ionicModal.fromTemplateUrl('../../templates/dashboard-modal-get.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.getModal = modal;
	});

	var wishes = [];

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
			$scope.cards.master = Array.prototype.slice.call(wishes, 0);
			$scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
		});
	}

	$scope.acceptWish = function(card) {
		var userID = session.currentUserID()
		apis.assign.put(userID, card.id, {}, {
			assigned_to: userID
		}).success(function(data, status) {
			if (data.error) {
				$ionicPopup.show({
					title: "Oops, the wish has just been grabbed by another guy.",
					templates: "Don't hesitate again next time!",
					buttons:[{
						text: "OK",
						onTap: function(e) {
							$scope.onClickTransitionOut(card)
						}
					}]
				})
			} else {
				//wish picked successfully
				$ionicPopup.show({
					title: "Wish Picked up Successfully!",
					templates: "You may check it's status in My Wishes section!",
					buttons:[{
						text: "OK",
						onTap: function(e) {
							$scope.closeGetModal();
						}
					}]
				})
			}
      	}).error(function(data, status) {
			$ionicPopup.show({
				title: "Oops, the wish has just been grabbed by another guy.",
				templates: "Don't hesitate again next time!",
				buttons:[{
					text: "OK",
					onTap: function(e) {
						$scope.onClickTransitionOut(card)
					}
				}]
			})
      	})
	}


	//The following is disabled right now

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
		verifyNetworkStatus()
	    $scope.postModal.show();
	};
	
	$scope.closePostModal = function() {
		$scope.postModal.hide();
	};

	$scope.openGetModal = function() {
		verifyNetworkStatus()
		$scope.getModal.show();
		$scope.loadRandomWishes(400);
	};

	$scope.loadRandomWishes = function(spinnerDelay) {
		setTimeout(function(){
			$scope.spinnerModal.show()
		}, spinnerDelay)
		navigator.geolocation.getCurrentPosition(function (position) {
			
	      	$scope.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	      	apis.randomWishes.get(session.currentUserID(), {
	      		latitude: position.coords.latitude,
	      		longitude: position.coords.longitude
	      	}).success(function(data, status) {
	      		$scope.spinnerModal.hide()
	      		wishes = data;
	      		$scope.refreshCards();	
	      		
	      		console.log("get random wishes successfully")
	      		console.log(data, status)
	      	}).error(function(data, status) {
				$scope.spinnerModal.hide()
	      		console.log(data, status)
	      	})
		}, function(err) {
			$scope.spinnerModal.hide()
			console.log("failed to get current location")
			$ionicPopup.show({
				title: "Failed to get user location.",
				buttons:[{title: "OK"}]
			})
		});
	}
	
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
			setTimeout(function(){
				$scope.spinnerModal.show()
			}, 400)
			navigator.geolocation.getCurrentPosition(function (position) {
				$scope.spinnerModal.hide()
		      	$scope.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		      	if (!$scope.map) {
					intializeMap();
				}
			}, function(err) {
				$scope.spinnerModal.hide()
				$ionicPopup.show({
					title: "Failed to get user location.",
					buttons:[
						{
							title: "OK"
						}
					]
				})
			});
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
		} else if ($scope.currentLocation) {
			var myLatlng = $scope.currentLocation
			var myZoom = 13
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