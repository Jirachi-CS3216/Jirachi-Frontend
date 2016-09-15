module.controller('WishesCtrl', function($scope) {
	$scope.wishes = [];

	$scope.init = function() {
		$scope.wishes = $scope.getWishesMade();
	}

	$scope.switchTo = function(status) {
		switch(status) {
			case 0:
			$scope.wishes = $scope.getWishesMade();
			break;
			case 1:
			$scope.wishes = $scope.getWishesFulfilled();
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

	$scope.getWishesFulfilled = function() {
		return [{
			title: "I need some hlep guyys",
			description: "where is lt32",
			time: "2016-09-09 12:32:00"
		}]
	}


})