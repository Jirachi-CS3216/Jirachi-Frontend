module.controller('NotificationCtrl', function($scope, $timeout, $state) {

    var DURATION = 3000
    $scope.notificationShowClass = ""
    $scope.notificationShouldShow = false
    $scope.iconClass = ""
    $scope.titleText = ""
    $scope.messageText = ""
    $scope.notificationQueue = []

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

    $scope.showNotifciation = function() {
        var thisNotification = $scope.notificationQueue[0]
        $scope.iconClass = thisNotification.iconClass
        $scope.titleText = thisNotification.title
        $scope.messageText = thisNotification.message
        $scope.notificationShowClass = "notification-show"

         $timeout(function(){
            $scope.notificationShowClass = ""
            $timeout(function() {
                $scope.notificationQueue.shift()
                if ($scope.notificationQueue.length > 0) {
                    $scope.showNotifciation();
                }
            }, 500)
        }, DURATION)
    }


    $scope.$on('notification-should-show', function(event, args) {
        if ($scope.notificationQueue.length > 0) {
            var current = $scope.notificationQueue[0]
            var last = $scope.notificationQueue[$scope.notificationQueue.length - 1]
            if (!(current.title === args.title && current.message === args.message) && 
                !(last.title === args.title && last.message === args.message)) {
                $scope.notificationQueue.push(args)
            }
        } else {
            $scope.notificationQueue.push(args)
        }

        if ($scope.notificationQueue.length > 0) {
            $scope.showNotifciation();
        }
    });
})