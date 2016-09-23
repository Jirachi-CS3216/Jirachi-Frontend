module.controller('LeaderboardCtrl', function($scope, $timeout, Chats, session, apis, SERVER_EVENTS, indicator, offlineWishPosting, $ionicScrollDelegate, $rootScope) {

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
    console.log("datttttttta")
    apis.leaderboard.get({}).success(function(data, status, statusText, config){
      $scope.spinnerShouldShow = false;
      console.log("datttttttta")
      console.log(data)
      if (status === 299) {
        $rootScope.$broadcast("notification-should-show", {
          iconClass: "ion-alert-circled",
          title: "Application Offline",
          message: "Cached results will be shown instead."
        })
      } else if (status === 200) {
        offlineWishPosting.postFromDisk();
      }
      $scope.haves = data.by_points;
      $scope.helpers = data.by_fulfill_wishes_count;
      $scope.wishers = data.by_wishes_count;

      apis.myRank.get(session.currentUserID(), {}).success(function(data){
        $scope.insertCurrentUser(data.by_points, data.by_fulfill_wishes_count, data.by_wishes_count);
        $ionicScrollDelegate.resize();
      })
    }).error(function(data, status, statusText, config){
      console.log("datttttttta")
      console.log(data)
      console.log(status)
      console.log(statusText)
      console.log(config)
    }) 
  };

  $scope.insertCurrentUser = function(byPoints, byFulfill, byWishes) {
    if(!$scope.isUserInLeaderboard($scope.haves)) {
      $scope.haves.push({
        "id": session.currentUserID(),
        "display_name": session.currentUserDisplayName(),
        "points": session.currentUserPoints(),
        "ranking": byPoints
      });
    }
    if(!$scope.isUserInLeaderboard($scope.helpers)) {

      $scope.helpers.push({
        "id": session.currentUserID(),
        "display_name": session.currentUserDisplayName(),
        "points": session.currentUserPickedWishesCount(),
        "ranking": byFulfill
      });
    }
    if(!$scope.isUserInLeaderboard($scope.wishers)) {
      $scope.wishers.push({
        "id": session.currentUserID(),
        "display_name": session.currentUserDisplayName(),
        "points": session.currentUserPostedWishesCount(),
        "ranking": byWishes
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
     $ionicScrollDelegate.resize();
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