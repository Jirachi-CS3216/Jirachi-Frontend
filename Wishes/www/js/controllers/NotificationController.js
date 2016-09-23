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

        $timeout(function(){
            $scope.notificationShowClass = ""
        }, DURATION)
    }

    $scope.$on('notification-should-show', function(event, args) {
        $scope.showNotifciation(args.iconClass, args.title, args.message);
    });
})