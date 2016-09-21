module.controller('WishDetailCtrl', function($scope, $stateParams, $ionicHistory, $ionicPopup, session, $state, apis) {

	$scope.session = session;

	var wish = {}

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		var wish = session.selectedWish;
		if (!wish) {
			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true,
				historyRoot: true
			});
			$state.go("tab.wishes");
			return;
		}

		$scope.wish = wish;

		$scope.activities = [{
			image: "./img/avatars/" + wish.user_id % 8  + ".svg",
			description: "Wish Created!",
			time: wish.created_at
		}];

		if (wish.assigned_to) {
			$scope.activities.push({
				image: "./img/avatars/" + wish.assigned_to % 8  + ".svg",
				description: "Wish Picked!",
				time: wish.picked_at	
			})
		}

		if (wish.assigned_to && wish.fulfilled_at) {
			$scope.activities.push({
				image: "./img/avatars/" + wish.assigned_to % 8  + ".svg",
				description: "Wish Fulfilled!",
				time: wish.fulfilled_at	
			})
		}

		if (wish.assigned_to && wish.fulfilled_at && wish.confirmed_at && wish.fulfill_status === "Wish-er marked as fulfilled") {
			$scope.activities.push({
				image: "./img/avatars/" + wish.user_id % 8  + ".svg",
				description: "Wish Satisfied :D",
				time: wish.confirmed_at	
			})
		}

		if (wish.assigned_to && wish.fulfilled_at && wish.confirmed_at && wish.fulfill_status === "Wish-er marked as unfulfilled") {
			$scope.activities.push({
				image: "./img/avatars/" + wish.user_id % 8  + ".svg",
				description: "Wish Not Satisfied :(",
				time: wish.confirmed_at	
			})
		}

	  	viewData.enableBack = true;
	});



	$scope.doerMarkFulfill = function() {
		$ionicPopup.show({
			title: "Mark This Wish Fulfilled",
			template: "Are you sure you have completed this wish? You won't get the point rewards if the wish-er are not satisfied with what you did.",
			buttons:[{
				text: "Cancel"
			}, {
				text: "Continue",
				onTap: function(e) {
					apis.assign.put(session.currentUserID(), $scope.wish.id, {}, {
						fulfill_status: "Do-er marked as fulfilled"
					}).success(function(response) {
						console.log(response)
						$ionicPopup.show({
							title: "Wish Status Updated",
							buttons:[{
								text: "OK",
								onTap: function(e) {
									$scope.activities.push({
										image: "./img/avatars/" + $scope.wish.assigned_to % 8  + ".svg",
										description: "Wish Fulfilled!",
										time: new Date()
									})
								}
							}]
						})

					}).error(function(response){
						console.log(response)
					})
				}
			}]
		})
	}

	$scope.wisherMarkFulfill = function() {
		console.log($scope.wish)

		$ionicPopup.show({
			title: "Are You Satisfied?",
			template: "Glad to hear that you're happy with what the wish picker has done. Press 'Continue' to confirm your happiness and we will reward both of you!",
			buttons:[{
				text: "Cancel"
			}, {
				text: "Continue",
				onTap: function(e) {
					apis.assign.put(session.currentUserID(), $scope.wish.id, {}, {
						fulfill_status: "Wish-er marked as fulfilled"
					}).success(function(response) {
						console.log(response)
						$ionicPopup.show({
							title: "Wish Status Updated",
							buttons:[{
								text: "OK",
								onTap: function(e) {
									$scope.activities.push({
										image: "./img/avatars/" + $scope.wish.user_id % 8  + ".svg",
										description: "Wish Satisfied :D",
										time: new Date()
									})
								}
							}]
						})

					}).error(function(response){
						console.log(response)
					})
				}
			}]
		})
	}

	$scope.wisherMarkNotFulfill = function() {
		console.log($scope.wish)

		$ionicPopup.show({
			title: "Aren't You Satisfied?",
			template: "Sorry to hear that you are not satisfied, but sometimes we're not appriciating what others do, but intead, their willing to help us. " + 
					  "Mark the wish as unsatisfied will not gain you anything, but it may hurt someone who has ever tried to help. If you change your mind, please press 'Cancel'",
			buttons:[{
				text: "Cancel"
			}, {
				text: "Continue",
				onTap: function(e) {
					apis.assign.put(session.currentUserID(), $scope.wish.id, {}, {
						fulfill_status: "Wish-er marked as unfulfilled"
					}).success(function(response) {
						console.log(response)
						$ionicPopup.show({
							title: "Wish Status Updated",
							buttons:[{
								text: "OK",
								onTap: function(e) {
									$scope.activities.push({
										image: "./img/avatars/" + $scope.wish.user_id % 8  + ".svg",
										description: "Wish Not Satisfied :(",
										time: new Date()
									})
								}
							}]
						})

					}).error(function(response){
						console.log(response)
					})
				}
			}]
		})
	}



	$scope.getWishStatus = function() {
		if ($scope.wish.isExpired) {
			return "expired";
		} else if ($scope.wish.isFulfilled) {
			return "fulfilled";
		} else if ($scope.wish.isPicked) {
			return "picked";
		} else {
			return "available";
		}
	}

	$scope.getStatusBtnText = function() {
		// if ($scope.getWishStatus() == "expired") {
		// 	return "Expired";
		// } else if ($scope.getWishStatus() == "fulfilled") {
		// 	return "Fulfilled";
		// } else if ($scope.getWishStatus() == "picked") {
		// 	return "Picked";
		// } else {
		// 	return "Pick!";
		// }
	}

	$scope.getStatusBtnClass = function() {
		if ($scope.getWishStatus() == "expired") {
			return "button-unavailable";
		} else if ($scope.getWishStatus() == "fulfilled") {
			return "button-unavailable";
		} else if ($scope.getWishStatus() == "picked") {
			return "button-busy";
		} else {
			return "button-energized";
		}
	}

	$scope.mapThumbnailDidClick = function() {
		window.location = $scope.nativeMapURL()
	}

	$scope.nativeMapURL = function() {
		return "http://maps.apple.com/maps?q=" + $scope.wish.latitude + "," + $scope.wish.longitude + "&zoom=16&views=traffic"
	}

	$scope.thumbnailURL = function(lat, long) {
		var selectedPoint = new google.maps.LatLng(lat,long);
		var selectedZoom = 13;
		var imageElement = document.querySelectorAll(".map-thumbnail")[0]

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
})