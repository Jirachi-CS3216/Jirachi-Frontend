module.controller('WishDetailCtrl', function($scope, $stateParams) {
	$scope.wish = {
		id: 0,
		title: "I have a little little wish",
		description: "I wish...for world peace.",
		time: "2016-09-09 12:32:00",
		isPicked: true,
		isFulfilled: false,
		isExpired: false,
		image: "http://67.media.tumblr.com/1b70e7efd3eba88c15fb122c41d255ca/tumblr_n0valuruRN1r4t05to5_400.jpg"
	};

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
		if ($scope.getWishStatus() == "expired") {
			return "Expired";
		} else if ($scope.getWishStatus() == "fulfilled") {
			return "Fulfilled";
		} else if ($scope.getWishStatus() == "picked") {
			return "Picked";
		} else {
			return "Pick!";
		}
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
})