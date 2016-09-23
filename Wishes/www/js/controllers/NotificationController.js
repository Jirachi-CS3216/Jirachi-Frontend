module.controller('NotificationCtrl', function($scope, $timeout) {
    console.log("start notification watch");

    var DURATION = 3000
    $scope.notificationShowClass = ""
    $scope.notificationShouldShow = false
    $scope.iconClass = ""
    $scope.titleText = ""
    $scope.messageText = ""

    $scope.notificationDidClick = function() {

    }

    $scope.showNotifciation = function(iconClass, title, message) {
        $scope.iconClass = iconClass
        $scope.titleText = title
        $scope.messageText = message
        $scope.notificationShowClass = "notification-show"
        $scope.$apply();

        $timeout(function(){
            $scope.notificationShowClass = ""
            $scope.$apply();
        }, DURATION)
    }
})