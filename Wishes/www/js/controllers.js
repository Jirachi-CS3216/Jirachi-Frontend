angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('LeaderboardCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('ActivityCtrl', function($scope) {

    $scope.selectActivity = function(activity) {
        console.log(activity.description);
    }

    //fake data
    $scope.activities = [{
        description: "Your wish has been picked up!"   
    },{
        description: "You have achieved level 3!"   
    },{
        description: "Congrats! Your wish has been fulfilled!"   
    },{
        description: "Your wish has been picked up!"   
    },{
        description: "You have achieved level 3!"   
    },{
        description: "Congrats! Your wish has been fulfilled!"   
    }]
})

.controller('PostCtrl', function($scope) {
  
})


;
