module.controller('WishesCtrl', function($scope) {
	$scope.wishes = [];
	$scope.selectedTab = 0;

	$scope.init = function() {
		$scope.wishes = $scope.getWishesMade();
	}

	$scope.isSelected = function(status) {
		return status == $scope.selectedTab;
	}

	$scope.switchTo = function(status) {
		switch(status) {
			case 0:
			$scope.wishes = $scope.getWishesMade();
			$scope.selectedTab = 0;
			break;
			case 1:
			$scope.wishes = $scope.getWishesAccepted();
			$scope.selectedTab = 1;
			break;
		}
	}

	$scope.getWishesMade = function() {
		return [{
			title: "I have a little little wish",
			description: "I wish...for world peace.",
			time: "2016-09-09 12:32:00"
		},
		{
			title: "I wish someone can wash my car",
			description: "As title",
			time: "2016-09-09 12:32:00"
		},
		{
			title: "Who can give me the answer for tutorial 8",
			description: "don't know how to write",
			time: "2016-09-09 12:32:00"
		}]
	}

	$scope.getWishesAccepted = function() {
		return [{
			title: "I need some hlep guyys",
			description: "where is lt32",
			time: "2016-09-09 12:32:00"
		}]
	}


})