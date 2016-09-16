module.controller('ActivityCtrl', function($scope, session) {

    $scope.$on("$ionicView.beforeEnter", function(event, data){
        $scope.currentUser = session.currentUser();
    });

    $scope.selectActivity = function(activity) {
        console.log(activity.description);
    }

    $scope.iconMap = {
        "LEVEL_UP": "ion-trophy",
        "WISH_ACCOMPLISHED": "ion-flag",
        "WISH_PICKED": "ion-leaf",
    }

    $scope.viewedClass = {
        true: "viewed",
        false: ""
    }

    //fake data
    $scope.activities = [{
        type: "WISH_PICKED",
        description: "Your wish has been picked up!",
        time: "2016-09-09 12:32:00",
        viewed: false
    },{
        type: "LEVEL_UP",
        description: "You have achieved level 3!",
        time: "2016-09-09 12:32:00",
        viewed: false
    },{
        type: "WISH_ACCOMPLISHED",
        description: "Congrats! Wish fulfilled!",
        time: "2016-09-09 12:32:00",
        viewed: true
    },{
        type: "WISH_PICKED",
        description: "Your wish has been picked up!",
        time: "2016-09-09 12:32:00",
        viewed: true
    },{
        type: "LEVEL_UP",
        description: "You have achieved level 3!",
        time: "2016-09-09 12:32:00",
        viewed: true
    },{
        type: "WISH_ACCOMPLISHED",
        description: "Congrats! Wish fulfilled!",
        time: "2016-09-09 12:32:00",
        viewed: true
    },{
        type: "LEVEL_UP",
        description: "Congrats! Wish fulfilled!",
        time: "2016-09-09 12:32:00",
        viewed: true
    },{
        type: "WISH_ACCOMPLISHED",
        description: "Congrats! Wish fulfilled!",
        time: "2016-09-09 12:32:00",
        viewed: true
    }]
})