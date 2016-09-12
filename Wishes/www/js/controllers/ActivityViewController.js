module.controller('ActivityCtrl', function($scope) {

    $scope.selectActivity = function(activity) {
        console.log(activity.description);
    }

    $scope.iconMap = {
        "LEVEL_UP": "ion-trophy",
        "WISH_ACCOMPLISHED": "ion-flag",
        "WISH_PICKED": "ion-leaf",
    }

    //fake data
    $scope.activities = [{
        type: "WISH_PICKED",
        description: "Your wish has been picked up!",
        time: "2016-09-09 12:32:00"
    },{
        type: "LEVEL_UP",
        description: "You have achieved level 3!",
        time: "2016-09-09 12:32:00"
    },{
        type: "WISH_ACCOMPLISHED",
        description: "Congrats! Wish fulfilled!",
        time: "2016-09-09 12:32:00"
    },{
        type: "WISH_PICKED",
        description: "Your wish has been picked up!",
        time: "2016-09-09 12:32:00"
    },{
        type: "LEVEL_UP",
        description: "You have achieved level 3!",
        time: "2016-09-09 12:32:00"
    },{
        type: "WISH_ACCOMPLISHED",
        description: "Congrats! Wish fulfilled!",
        time: "2016-09-09 12:32:00"
    }]
})