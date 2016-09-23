module.controller('DashCtrl', function($scope, $ionicModal, $ionicPopup, apis, indicator, session, $timeout, SERVER_EVENTS, offlineWishPosting, $rootScope, $document) {
	$scope.session = session;
	$scope.$on(SERVER_EVENTS.notAuthenticated, function(event) {
        indicator.showSessionExpiredIndicator()
    });

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.spinnerShouldShow = true;
   		verifyNetworkStatus();
	});

  function verifyNetworkStatus() {
   	apis.updateUserInfo.get(session.currentUserID(), {}).success(function(data, status){
			$scope.networkDown = (status !== 200)
			if (status !== 200) {
				$scope.locationPickerModal.hide()
				$scope.getModal.hide()
				$scope.spinnerShouldShow = false;

				$rootScope.$broadcast("notification-should-show", {
					iconClass: "ion-alert-circled",
					title: "Application Offline",
					message: "You can still finish your current wish but picking wish is disabled."
				})

			} else {
				offlineWishPosting.postFromDisk()
			}
	  })
  }

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


	var isPosting = false
	$scope.post = function() {
		if (isPosting) {
			return;
		} else {
			isPosting = true;
			var wish = {}
			wish.title = this.postWishTitle;
			wish.description = this.postWishDescription;
			wish.needs_meetup = $scope.selectedPoint !== undefined;
			if (wish.needs_meetup) {
				wish.address = $scope.selectedAddress;
				wish.latitude = $scope.selectedPoint.lat()
				wish.longitude = $scope.selectedPoint.lng()
			}

			$scope.spinnerShouldShow = true;
			offlineWishPosting.postWish(wish, function(success, message){
				if (success) {
					$scope.closePostModal();
					isPosting = false;
				} else {
					$ionicPopup.show({
						title: "Wish Posting Failed",
						template: "You have another offline wish in pending. Please get your device online to post a new one.",
						buttons:[{
							text: "OK",
							onTap: function(e){
								$scope.closePostModal();
								isPosting = false;		
							}
						}]
					})
				}
			});
		}
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
				var b = data.error === "Assignee have too many incomplete assigned wishes."
				var t = b ? "Too Many On-going Wishes!" : "Oops, the wish has just been grabbed by another guy."
				var d = b ? "Complete the pending ones before accepting new wishes" : "Don't hesitate again next time!"

				$ionicPopup.show({
					title: t,
					template: d,
					buttons:[{
						text: "OK",
					}]
				})
			} else {
				//wish picked successfully
				$ionicPopup.show({
					title: "Wish Picked up Successfully!",
					template: "You may check it's status in My Wishes section!",
					buttons:[{
						text: "OK",
						onTap: function(e) {
							$scope.cardDestroyed(0)
							$scope.closeGetModal();
						}
					}]
				})
			}
      	}).error(function(data, status) {
			$ionicPopup.show({
				title: "Oops, the wish has just been grabbed by another guy.",
				template: "Don't hesitate again next time!",
				buttons:[{
					text: "OK",
					onTap: function(e) {
						$scope.cardDestroyed(0)
					}
				}]
			})
      	})
	}


	$scope.discardWish = function() {

	}

	//The following is disabled right now
	$scope.$on('removeCard', function(event, element, card) {
		var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
		$scope.cards.discards.push(discarded);
	});

	$scope.cardSwipedLeft = function(index) {
		var card = $scope.cards.active[index];
		$scope.cards.disliked.push(card);
	};
	
	$scope.cardSwipedRight = function(index) {
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
		$scope.loadRandomWishes();
	};

	$scope.loadRandomWishes = function() {
		$scope.spinnerShouldShow = true
		navigator.geolocation.getCurrentPosition(function (position) {
			
	      	$scope.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	      	apis.randomWishes.get(session.currentUserID(), {
	      		latitude: position.coords.latitude,
	      		longitude: position.coords.longitude
	      	}).success(function(data, status) {
	      		if (data.length === 0) {
	      			$ionicPopup.show({
	      				title: "Oops!",
	      				template: "It seems no active wishes from others are available right now.",
	      				buttons:[{
	      					text: "OK",
	      					onTap: function(e) {
	      						$scope.spinnerShouldShow = false;
	      					}
	      				}]
	      			})
	      		} else {
	      			wishes = data;
	      			$scope.refreshCards();
	      			$timeout(function(){
	      				$scope.spinnerShouldShow = false;
	      			}, 500)
	      		}
	      	}).error(function(data, status) {
				$scope.spinnerShouldShow = false;
	      	})
		}, function(err) {
			$rootScope.$broadcast("notification-should-show", {
				iconClass: "ion-alert-circled",
				title: "Failed to Get User Location",
				message: "Random wishes are shown."
			})

			apis.randomWishes.get(session.currentUserID(), {
	      	}).success(function(data, status) {
	      		if (data.length === 0) {
	      			$ionicPopup.show({
	      				title: "Oops!",
	      				template: "It seems no active wishes from others are available right now.",
	      				buttons:[{
	      					text: "OK",
	      					onTap: function(e) {
	      						$scope.spinnerShouldShow = false;
	      					}
	      				}]
	      			})
	      		} else {
	      			wishes = data;
	      			$scope.refreshCards();
	      			$timeout(function(){
	      				$scope.spinnerShouldShow = false;
	      			}, 500)
	      		}
	      	}).error(function(data, status) {
				$scope.spinnerShouldShow = false;
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
			$scope.spinnerShouldShow = true
			navigator.geolocation.getCurrentPosition(function (position) {
				$scope.spinnerShouldShow = false;
		      	$scope.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		      	if (!$scope.map) {
					intializeMap();
				}
			}, function(err) {
				$scope.spinnerShouldShow = false;
				$rootScope.$broadcast("notification-should-show", {
					iconClass: "ion-alert-circled",
					title: "Failed to Get User Location",
					message: "Please drag the map to select the location yourself."
				})
				if (!$scope.map) {
					intializeMap();
				}
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

	$scope.$on('modal.shown',function() {
     $timeout(function(){
          if( $document[0].body.classList.contains('loading-active')) {
              $document[0].body.classList.remove('loading-active');
          }
      },50);
	});

	// End of Map

})