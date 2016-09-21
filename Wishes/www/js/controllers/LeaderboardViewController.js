module.controller('LeaderboardCtrl', function($scope, $timeout, Chats, session, apis, SERVER_EVENTS, indicator) {

  $scope.spinnerShouldShow = true;
  $scope.session = session;

  $scope.currentUser = $scope.session.currentUser();
  $scope.currentUserID = $scope.session.currentUserID();
  $scope.leaderboardLength = 10;
  $scope.haves = [];
  $scope.helpers = [];
  $scope.wishers = [];

  $scope.selectedTab = 0;

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $scope.getLeaderboards();
  });

  $scope.$on(SERVER_EVENTS.notAuthenticated, function(event) {
    indicator.showSessionExpiredIndicator()
  });

  $scope.getLeaderboards = function() {
    //api insertion point

    apis.leaderboard.get({}).success(function(data, status, statusText, config){
      $scope.spinnerShouldShow = false;
      if (status === 299) {
        indicator.showNetworkDownIndicator();
      }
      $scope.haves = data.by_points;
      $scope.helpers = data.by_fulfill_wishes_count;
      $scope.wishers = data.by_wishes_count;

      $scope.insertCurrentUser();
    }) 
  };

  $scope.insertCurrentUser = function() {
    if(!$scope.isUserInLeaderboard($scope.haves)) {
      $scope.haves.push({
        "id": session.currentUserID(),
        "display_name": session.currentUserDisplayName(),
        "points": session.currentUserPoints(),
        "ranking": 1250
      });
    }
    if(!$scope.isUserInLeaderboard($scope.helpers)) {

      $scope.helpers.push({
        "id": $scope.currentUserID,
        "display_name": $scope.session.currentUserDisplayName(),
        "points": 100,
        "ranking": 0
      });
    }
    if(!$scope.isUserInLeaderboard($scope.wishers)) {
      $scope.wishers.push({
        "id": $scope.currentUserID,
        "display_name": $scope.session.currentUserDisplayName(),
        "points": 100,
        "ranking": 0
      });
    }
  };

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

  $scope.isCurrentUser = function(user) {
    return user.id === $scope.currentUserID;
  }

  $scope.inArray = function (item, array) {
    return (-1 !== array.indexOf(item));
  };

  $scope.isUserInLeaderboard = function (array) {
    return array.filter($scope.isCurrentUser).length > 0;
  }

  $scope.cloak = "cloak"
  $scope.$on('$viewContentLoaded', function(){
    $scope.cloak = ""
  });

})