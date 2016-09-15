module.controller('SettingsCtrl', function($scope, auth) {
    $scope.settings = {
        enableFriends: true
    };

    $scope.logout = function() {
    	auth.logout();
    }
})