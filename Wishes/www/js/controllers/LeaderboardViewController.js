module.controller('LeaderboardCtrl', function($scope, Chats, session) {
    
    $scope.$on("$ionicView.beforeEnter", function(event, data){
        $scope.currentUser = session.currentUser();
    });

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})