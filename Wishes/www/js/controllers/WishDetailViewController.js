module.controller('WishDetailCtrl', function($scope, $stateParams) {
    $scope.wish = {
    	id: 0,
			title: "I have a little little wish",
			description: "I wish...for world peace.",
			time: "2016-09-09 12:32:00",
			isFulfilled: false,
			isExpired: false,
			image: "http://67.media.tumblr.com/1b70e7efd3eba88c15fb122c41d255ca/tumblr_n0valuruRN1r4t05to5_400.jpg"
    };
})