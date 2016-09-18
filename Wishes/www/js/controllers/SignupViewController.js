module.controller('SignupCtrl', function($scope, $state, $ionicHistory, $ionicScrollDelegate, apis, $ionicPopup) {
	$scope.signin = function() {
		$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop(true);
		$ionicHistory.nextViewOptions({
		    disableAnimate: true
		});
		$state.go('login');
	}

	$scope.signup = function(data) {
		$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop(true);
		apis.signup.post({}, {
            username: data.username,
            password: data.password
        }).success(function(response) {
        	if (response.error) {
        		console.log(response)
        		$ionicPopup.show({
		            title: 'Username Already Existed!',
		            buttons: [{text: 'OK'}]
		        });
        	} else {
        		$ionicHistory.nextViewOptions({
				    disableAnimate: true
				});
				$ionicPopup.show({
		            title: 'Sign up Successfully',
		            buttons: [{
		            	text: 'Go to Login Page',
		            	onTap: function(e) {
				          $state.go('login');
				        }
		            }]
		        });
        	}
        }).error(function(response) {
      		console.log(response)  	
        })
  	};

	$scope.submitForm = function(isValid, data) {
		if (isValid) {
			$scope.signup(data)
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