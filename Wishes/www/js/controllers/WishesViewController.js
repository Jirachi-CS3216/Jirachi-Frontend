module.controller('WishesCtrl', function($scope, $location, $timeout, session, apis) {
	
	$scope.session = session;
	$scope.selectedTab = 0;
	$scope.isMyWishesLoading = true;
	$scope.isOthersWishesLoading = true;
	$scope.myWishes = []
	$scope.othersWishes = []

	$scope.$on("$ionicView.beforeEnter", function(event, data){
		$scope.isMyWishesLoading = true;
		$scope.isOthersWishesLoading = true;
   		$scope.getWishes();
	});

	$scope.isSelected = function(status) {
		return status == $scope.selectedTab;
	}

	$scope.switchTo = function(status) {
		$scope.selectedTab = status;
	}

	$scope.getWishes = function() {
		//api insertion point

		apis.wishes.get(session.currentUserID(), {}).success(function(data, status){
			console.log(data)

			var myWishes = data.self
			if (myWishes.length !== $scope.myWishes.length) {
				myWishes.forEach(function(wish){
					var expiredDate = new Date(wish.created_at)
					wish.createData = expiredDate;
					expiredDate.setDate(expiredDate.getDate() + 20)
					var now = Date.now()
					wish.isExpired = now > expiredDate
					wish.isPicked =  !(!wish.assigned_to) //cast to boolean
					wish.isFulfilled = wish.fulfill_status === "fulfilled"
				})

				$scope.myWishes = myWishes;
			}

			$scope.isMyWishesLoading = false


			var othersWishes = data.others
			if (othersWishes.length !== $scope.othersWishes.length) {
				othersWishes.forEach(function(wish){
					var expiredDate = new Date(wish.created_at)
					expiredDate.setDate(expiredDate.getDate() + 20)
					var now = Date.now()
					wish.isExpired = now > expiredDate
					wish.isPicked =  !(!wish.assigned_to) //cast to boolean
					wish.isFulfilled = wish.fulfill_status === "fulfilled"
				})

				$scope.othersWishes = othersWishes;
			}

			$scope.isOthersWishesLoading = false
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