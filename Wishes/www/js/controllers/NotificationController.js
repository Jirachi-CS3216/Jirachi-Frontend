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

    $scope.notificationInProgress = false
    $scope.showNotifciation = function(iconClass, title, message) {
        $scope.notificationInProgress = true
        $scope.iconClass = iconClass
        $scope.titleText = title
        $scope.messageText = message
        $scope.notificationShowClass = "notification-show"

        $timeout(function(){
            $scope.notificationShowClass = ""
            $scope.notificationInProgress = false
        }, DURATION)
    }

    $scope.$on('notification-should-show', function(event, args) {
        $scope.tryPostNotification(args)
    });

    $scope.tryPostNotification = function(args) {
        if ($scope.notificationInProgress) {
            $timeout(function(){
                $scope.tryPostNotification(args)
            }, 4000)
        } else {
            $scope.showNotifciation(args.iconClass, args.title, args.message);
        }
    }
})