module.controller('LeaderboardCtrl', function($scope, Chats, session) {
    
    $scope.session = session;
    $scope.selectedTab = 0;

   	$scope.isSelected = function(status) {
		return status == $scope.selectedTab;
	}

	$scope.switchTo = function(status) {
		$scope.selectedTab = status;
	}

    $scope.byPoints = [{
      "id": 1,
      "display_name": "Lazy Guy",
      "points": 12080
    },
    {
      "id": 2,
      "display_name": "Lazy Guy",
      "points": 11400
    },
    {
      "id": 3,
      "display_name": "Lazy Guy",
      "points": 9800
    },
    {
      "id": 4,
      "display_name": "Lazy Guy",
      "points": 8400
    },
    {
      "id": 5,
      "display_name": "Lazy Guy",
      "points": 6400
    },
    {
      "id": 6,
      "display_name": "Lazy Guy",
      "points": 4600
    },
    {
      "id": 7,
      "display_name": "Lazy Guy",
      "points": 4400
    },
    {
      "id": 8,
      "display_name": "Lazy Guy",
      "points": 4200
    }]
    $scope.helpers = []
})