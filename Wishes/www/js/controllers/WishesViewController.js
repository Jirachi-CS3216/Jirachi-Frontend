module.controller('WishesCtrl', function($scope, session, apis) {
	
	$scope.session = session;

	$scope.currentWishes = [];
	$scope.pastWishes = [];
	$scope.selectedTab = 0;

	$scope.init = function() {
		$scope.getWishesMade();
	}

	$scope.isSelected = function(status) {
		return status == $scope.selectedTab;
	}

	$scope.switchTo = function(status) {
		switch(status) {
			case 0:
			$scope.getWishesMade();
			$scope.selectedTab = 0;
			break;
			case 1:
			$scope.getWishesAccepted();
			$scope.selectedTab = 1;
			break;
		}
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
			isFulfilled: false,
			isExpired: false
		},
		{
			id: 1,
			title: "I wish someone can wash my car",
			description: "As title",
			time: "2016-09-09 12:32:00",
			isFulfilled: true,
			isExpired: true
		},
		{
			id: 2,
			title: "Who can give me the answer for tutorial 8",
			description: "don't know how to write",
			time: "2016-09-09 12:32:00",
			isFulfilled: false,
			isExpired: true
		}];
		$scope.filterWishes(wishes);
	}

	$scope.getWishesAccepted = function() {
		var wishes = [{
			id: 3,
			title: "I need some hlep guyys",
			description: "where is lt32",
			time: "2016-09-09 12:32:00",
			isFulfilled: false,
			isExpired: false
		}];
		$scope.filterWishes(wishes);
	}

	$scope.filterWishes = function(wishes) {
		$scope.currentWishes = wishes.filter(function(wish) {return !wish.isExpired;})
		$scope.pastWishes = wishes.filter(function(wish) {return wish.isExpired;})
	}
})