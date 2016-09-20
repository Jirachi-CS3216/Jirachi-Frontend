module.controller('WishDetailCtrl', function($scope, $stateParams, session) {

	$scope.session = session;

	var wish = {
		id:3,
		title:"Some Wishes",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nec vestibulum turpis. Nam et urna ante. Integer porttitor, sapien quis dapibus vulputate, urna nisl pulvinar risus, ut condimentum nisi sapien scelerisque dui. Vestibulum scelerisque lobortis laoreet. Sed nec cursus leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quis nunc urna. Etiam porta ultrices dolor, eu luctus magna feugiat et. Nam et leo est. Donec nec eleifend metus, vel efficitur lectus. Mauris risus ex, posuere ac ex ut, laoreet congue elit.",
		user_id:2,
		assigned_to:5,
		fulfill_status:null,
		expiry_at:null,
		close_at:null,
		created_at:"2016-09-19T11:11:26.000Z",
		updated_at:"2016-09-19T11:11:26.000Z",

		//not yet existing attributes
		assignee_contact: "88888888",
		assignee_display_name: "Jay Chow",
		picked_at:"2016-09-20T11:11:26.000Z",
		fulfilled_at:"2016-09-21T11:11:26.000Z",
		confirmed_at:"2016-09-21T14:11:26.000Z"
	};

	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		var wish = session.selectedWish;
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

		if (wish.assigned_to && wish.fulfilled_at && wish.confirmed_at) {
			$scope.activities.push({
				image: "./img/avatars/" + wish.user_id % 8  + ".svg",
				description: "Fulfillment Confirmed!",
				time: wish.confirmed_at	
			})
		}



	  	viewData.enableBack = true;
	}); 

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