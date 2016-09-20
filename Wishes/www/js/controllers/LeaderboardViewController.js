module.controller('LeaderboardCtrl', function($scope, $timeout, Chats, session, SERVER_EVENTS, indicator) {

    $scope.session = session;

    $scope.currentUser = $scope.session.currentUser();
    $scope.currentUserID = $scope.session.currentUserID();
    $scope.leaderboardLength = 8;

    $scope.selectedTab = 0;

    $scope.$on(SERVER_EVENTS.notAuthenticated, function(event) {
        indicator.showSessionExpiredIndicator()
    });

  $scope.$on("$ionicView.beforeEnter", function(event){
    if(!$scope.isUserInLeaderboard($scope.haves)) {
      $scope.haves.push({
        "id": $scope.currentUserID,
        "display_name": $scope.session.currentUserDisplayName(),
        "points": 100,
        "ranking": 1250
      });
    }
    if(!$scope.isUserInLeaderboard($scope.helpers)) {
      $scope.helpers.push({
        "id": $scope.currentUserID,
        "display_name": $scope.session.currentUserDisplayName(),
        "points": 100,
        "ranking": 1250
      });
    }
    if(!$scope.isUserInLeaderboard($scope.wishers)) {
      $scope.wishers.push({
        "id": $scope.currentUserID,
        "display_name": $scope.session.currentUserDisplayName(),
        "points": 100,
        "ranking": 1250
      });
    }
  });

  $scope.isSelected = function(status) {
    return status == $scope.selectedTab;
  }

  $scope.switchTo = function(status) {
    $scope.animateClass[$scope.selectedTab][0] = "fadeOutLeft animation-duration-short"
    $scope.animateClass[$scope.selectedTab][1] = "fadeOutRight animation-duration-short"
    $scope.selectedTab = status;
    $timeout(function(){
     var shouldShow = [false, false, false]
     shouldShow[status] = true
     $scope.shouldShow = shouldShow
     $scope.animateClass = [["fadeInLeft", "fadeInRight"], ["fadeInLeft", "fadeInRight"], ["fadeInLeft", "fadeInRight"]]
     $scope.$apply()
   }, 300)
  }

  $scope.shouldShow = [true, false, false]
  $scope.animateClass = [["fadeInLeft", "fadeInRight"], ["fadeInLeft", "fadeInRight"], ["fadeInLeft", "fadeInRight"]]

  $scope.haves = [{
    "id": 1,
    "display_name": "Jay",
    "points": 12080
  },
  {
    "id": 2,
    "display_name": "Lazy Guy",
    "points": 11400
  },
  {
    "id": 3,
    "display_name": "John",
    "points": 9800
  },
  {
    "id": 4,
    "display_name": "Daddy",
    "points": 8400
  },
  {
    "id": 5,
    "display_name": "Who's",
    "points": 6400
  },
  {
    "id": 10,
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

  $scope.helpers = [{
    "id": 11,
    "display_name": "Lazy Guy",
    "counts": 120
  },
  {
    "id": 12,
    "display_name": "Lazy Guy",
    "counts": 114
  },
  {
    "id": 13,
    "display_name": "Lazy Guy",
    "counts": 98
  },
  {
    "id": 14,
    "display_name": "Lazy Guy",
    "counts": 84
  },
  {
    "id": 15,
    "display_name": "Lazy Guy",
    "counts": 64
  },
  {
    "id": 16,
    "display_name": "Lazy Guy",
    "counts": 46
  },
  {
    "id": 17,
    "display_name": "Lazy Guy",
    "counts": 44
  },
  {
    "id": 18,
    "display_name": "Lazy Guy",
    "counts": 42
  }]

  $scope.wishers = [{
    "id": 11,
    "display_name": "Lazy Guy",
    "counts": 120
  },
  {
    "id": 12,
    "display_name": "Lazy Guy",
    "counts": 114
  },
  {
    "id": 13,
    "display_name": "Lazy Guy",
    "counts": 98
  },
  {
    "id": 14,
    "display_name": "Lazy Guy",
    "counts": 84
  },
  {
    "id": 15,
    "display_name": "Lazy Guy",
    "counts": 64
  },
  {
    "id": 16,
    "display_name": "Lazy Guy",
    "counts": 46
  },
  {
    "id": 17,
    "display_name": "Lazy Guy",
    "counts": 44
  },
  {
    "id": 18,
    "display_name": "Lazy Guy",
    "counts": 42
  }]

  $scope.isCurrentUser = function(user) {
    return user.id === $scope.currentUserID;
  }

  $scope.inArray = function (item, array) {
    return (-1 !== array.indexOf(item));
  };

  $scope.isUserInLeaderboard = function (array) {
    return array.filter($scope.isCurrentUser).length > 0;
  }
})