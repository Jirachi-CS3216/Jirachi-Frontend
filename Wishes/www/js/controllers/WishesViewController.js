module.controller('WishesCtrl', function($scope, $location, $timeout, session, apis) {
	
	$scope.session = session;
	$scope.selectedTab = 0;
	$scope.isMyWishesLoading = true;
	$scope.isOthersWishesLoading = true;
	$scope.myWishes = []
	$scope.othersWishes = []

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.isMyWishesLoading = true;
   		$scope.getWishesMade();
   		$scope.isOthersWishesLoading = true;
		$scope.getWishesAccepted();
	});

	$scope.isSelected = function(status) {
		return status == $scope.selectedTab;
	}

	$scope.switchTo = function(status) {
		$scope.selectedTab = status;
	}

	$scope.getWishesMade = function() {
		//api insertion point

		// apis.wishes.get(session.currentUserID(), {}).success(function(data, status){
		// 	console.log(data)
		// 	$scope.filterWishes(data);
		// })


		var wishes =  [{
			id: 0,
			title: "I have a little little wish",
			description: "I wish...for world peace.",
			time: "2016-09-09 12:32:00",
			isPicked: true,
			isFulfilled: false,
			isExpired: false
		},
		{
			id: 1,
			title: "I wish someone can wash my car",
			description: "As title",
			time: "2016-09-09 12:32:00",
			isPicked: true,
			isFulfilled: true,
			isExpired: true
		},
		{
			id: 2,
			title: "Who can give me the answer for tutorial 8",
			description: "don't know how to write",
			time: "2016-09-09 12:32:00",
			isPicked: false,
			isFulfilled: false,
			isExpired: true
		}];
		
		if (wishes.length !== $scope.myWishes.length) {
			$scope.myWishes = wishes
		}
		$scope.isMyWishesLoading = false
	}

	$scope.getWishesAccepted = function() {
		var wishes = [
		{
			id: 3,
			title: "I need some hlep guyys",
			description: "where is lt32",
			time: "2016-09-09 12:32:00",
			isPicked: true,
			isFulfilled: false,
			isExpired: false
		}
		];

		if (wishes.length !== $scope.othersWishes.length) {
			$scope.othersWishes = wishes
		}
		$scope.isOthersWishesLoading = false
	}

	$scope.cardDidClick =function(wish) {
		$location.path("/tab/wishes/" + wish.id)
	}

	$scope.expiredFilter = {
		isExpired: true
	}

	$scope.currentFilter = {
		isExpired: false	
	}

	$scope.getWishStatus = function(wish) {
		if (wish.isFulfilled) {
			return "fulfilled";
		} else if (wish.isExpired) {
			return "expired";
		} else if (wish.isPicked) {
			return "picked";
		} else {
			return "available";
		}
	}
})