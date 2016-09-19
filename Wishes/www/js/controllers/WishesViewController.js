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

		apis.wishes.get(session.currentUserID(), {}).success(function(data, status){
			var myWishes = data.self
			if (myWishes.length !== $scope.myWishes.length) {
				myWishes.forEach(function(wish){
					var expiredDate = new Date(myWishes.created_at)
					expiredDate.setDate(expiredDate.getDate() + 20)
					var now = Date.now()
					wish.isExpired = now > expiredDate
				})

				$scope.myWishes = myWishes;
			}

			$scope.isMyWishesLoading = false



		})


		//  {
		// 	id: 0,
		// 	title: "I have a little little wish",
		// 	description: "I wish...for world peace.",
		// 	time: "2016-09-09 12:32:00",
		// 	isPicked: true,
		// 	isFulfilled: false,
		// 	isExpired: false
		// }
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