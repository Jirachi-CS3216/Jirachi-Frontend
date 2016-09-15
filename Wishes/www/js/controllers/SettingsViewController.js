module.controller('SettingsCtrl', function($scope, auth) {
    $scope.logout = function() {
    	auth.logout();
    }
})