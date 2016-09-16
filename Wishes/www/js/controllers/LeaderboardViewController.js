module.controller('LeaderboardCtrl', function($scope, Chats, session) {
    
    $scope.session = session;

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})