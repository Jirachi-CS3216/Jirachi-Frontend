module.controller('SignupCtrl', function($scope, $state, $ionicHistory, $ionicScrollDelegate,auth) {
	$scope.signin = function() {
		$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop(true);
		$ionicHistory.nextViewOptions({
		    disableAnimate: true
		});
		$state.go('login');
	}

	$scope.submitForm = function(isValid, data) {
		if (isValid) {
			console.log("Valid form ready to go")
		}
	}
})

.directive("compareTo", function() {
	return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})