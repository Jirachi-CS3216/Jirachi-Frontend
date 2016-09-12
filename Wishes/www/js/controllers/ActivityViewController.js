module.controller('ActivityCtrl', function($scope) {

    $scope.selectActivity = function(activity) {
        console.log(activity.description);
    }

    //fake data
    $scope.activities = [{
        description: "Your wish has been picked up!"   
    },{
        description: "You have achieved level 3!"   
    },{
        description: "Congrats! Your wish has been fulfilled!"   
    },{
        description: "Your wish has been picked up!"   
    },{
        description: "You have achieved level 3!"   
    },{
        description: "Congrats! Your wish has been fulfilled!"   
    }]
})