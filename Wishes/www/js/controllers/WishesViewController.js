module.controller('WishesCtrl', function($scope, $location, $timeout, session, apis, indicator, SERVER_EVENTS, offlineWishPosting) {
	
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

	$scope.$on(SERVER_EVENTS.notAuthenticated, function(event) {
        indicator.showSessionExpiredIndicator()
    });

	$scope.isSelected = function(status) {
		return status == $scope.selectedTab;
	}

	$scope.switchTo = function(status) {
		$scope.selectedTab = status;
	}

	$scope.getWishes = function() {
		//api insertion point

		apis.wishes.get(session.currentUserID(), {}).success(function(data, status, statusText, config){

			if (status === 299) {
				indicator.showNetworkDownIndicator();
			} else if (status === 200) {
				offlineWishPosting.postFromDisk();
			}

			var myWishes = data.self
			// if (myWishes.length !== $scope.myWishes.length) {
				myWishes.forEach(function(wish){
					var expiredDate = new Date(wish.created_at)
					wish.time = expiredDate;
					expiredDate.setDate(expiredDate.getDate() + 20)
					var now = Date.now()
					wish.isExpired = now > expiredDate || (wish.fulfill_status === "Wish-er marked as fulfilled" || wish.fulfill_status === "Wish-er marked as unfulfilled")
					wish.isPicked =  !(!wish.assigned_to) //cast to boolean
					wish.isFulfilled = wish.fulfill_status === "fulfilled"
				})

				$scope.myWishes = myWishes;
			// }

			$scope.isMyWishesLoading = false


			var othersWishes = data.others
			// if (othersWishes.length !== $scope.othersWishes.length) {
				othersWishes.forEach(function(wish){
					var expiredDate = new Date(wish.created_at)
					wish.time = expiredDate;
					expiredDate.setDate(expiredDate.getDate() + 20)
					var now = Date.now()
					wish.isExpired = now > expiredDate || (wish.fulfill_status === "Wish-er marked as fulfilled" || wish.fulfill_status === "Wish-er marked as unfulfilled")
					wish.isPicked =  !(!wish.assigned_to) //cast to boolean
					wish.isFulfilled = wish.fulfill_status === "fulfilled"
				})

				$scope.othersWishes = othersWishes;
			// }

			$scope.isOthersWishesLoading = false
		})
	}

	$scope.cardDidClick =function(wish) {
		session.selectedWish = wish;
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