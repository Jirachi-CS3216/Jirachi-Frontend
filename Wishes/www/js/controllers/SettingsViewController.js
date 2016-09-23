module.controller('SettingsCtrl', function($scope, $ionicPopup, auth, session, apis, indicator, SERVER_EVENTS, offlineWishPosting, $rootScope) {
	
	$scope.session = session;
    $scope.$on(SERVER_EVENTS.notAuthenticated, function(event) {
        indicator.showSessionExpiredIndicator()
    });

    function verifyNetworkStatus(message) {
        apis.updateUserInfo.get(session.currentUserID(), {}).success(function(data, status){
            $scope.networkDown = (status !== 200)
            if (status !== 200) {
                if ($scope.popup) {
                    $scope.popup.close();
                }
                $rootScope.$broadcast("notification-should-show", {
                    iconClass: "ion-alert-circled",
                    title: "Application Offline",
                    message: message
                })
            } else {
                offlineWishPosting.postFromDisk()
            }
        })
    }

	$scope.$on("$ionicView.beforeEnter", function(event, data){
   		loadStoredDetails()
        verifyNetworkStatus("Network unavailable, user details editing is disabled.")
        $scope.getLastestUserInfo()
        
        if (typeof(FB) != 'undefined' && FB != null ) {
            FB.XFBML.parse();
        }
	});

    function loadStoredDetails() {
        $scope.displayName = session.currentUser().display_name
        $scope.email = session.currentUser().email
        $scope.phone = session.currentUser().phone
    }

    $scope.updatePasswordData = {};
    $scope.setForm = function(form) {
        $scope.passform = form;
    }
    $scope.updatePassword = function() {
        verifyNetworkStatus("Network unavailable, user details editing is disabled.")
        $scope.updatePasswordButtonPressed = false;
        $scope.popup = $ionicPopup.show({
            title: 'Update Password',
            subtitle: '',
            scope: $scope,
            template: '' +
                        '<form name="passform">' +
                        
                        '<input name="oldpass" ng-required="true" ng-minlength="6" ng-maxlength="72" class="popup-input" type="password" placeholder="Old Password" ng-model="updatePasswordData.oldPassword" ng-change="setForm(passform)">' + 
                        '<div ng-show="passform.oldpass.$error.minlength" class="popup-help-block">too short</div>' +
                        '<div ng-show="passform.oldpass.$error.maxlength" class="popup-help-block">too long</div>' +
                        '<div ng-show="!passform.oldpass.$error.minlength && !passform.oldpass.$error.maxlength && passform.oldpass.$invalid && (!passform.oldpass.$pristine || updatePasswordButtonPressed)" class="popup-help-block">old password required</div>' + 

                        '<input name="newpass" ng-required="true" ng-minlength="6" ng-maxlength="72" class="popup-input" type="password" placeholder="New Password" ng-model="updatePasswordData.newPassword">' +
                        '<div ng-show="passform.newpass.$error.minlength" class="popup-help-block">too short</div>' +
                        '<div ng-show="passform.newpass.$error.maxlength" class="popup-help-block">too long</div>' +
                        '<div ng-show="!passform.newpass.$error.minlength && !passform.newpass.$error.maxlength && passform.newpass.$invalid && (!passform.newpass.$pristine || updatePasswordButtonPressed)" class="popup-help-block">new password required</div>' + 
                        '<div ng-show="passform.newpass.$valid && (!passform.newpass.$pristine || updatePasswordButtonPressed ) && updatePasswordData.oldPassword === updatePasswordData.newPassword" class="popup-help-block">new password should be the same as the old one</div>' +
                        
                        '<input name="conpass" compare-to="updatePasswordData.newPassword" ng-required="true" ng-minlength="6" ng-maxlength="72" class="popup-input" type="password" placeholder="Confirm New Password" ng-model="updatePasswordData.newPasswordConfirmed">' +
                        '<div ng-show="passform.conpass.$invalid && (!passform.conpass.$pristine || updatePasswordButtonPressed)" class="popup-help-block">not match</div>' +
                        '</form>',
            buttons: [{
                text: 'Cancel',
                onTap: function(e) {
                    
                }
            }, {
                text: 'Update',
                onTap: function(e) {
                    $scope.updatePasswordButtonPressed = true;
                    if (!$scope.passform || $scope.passform.$invalid || $scope.updatePasswordData.oldPassword === $scope.updatePasswordData.newPassword) {
                        e.preventDefault();
                    } else {
                        apis.updateUserInfo.put(session.currentUserID(), {}, {
                            username: session.currentUser().username,
                            old_password: $scope.updatePasswordData.oldPassword,
                            new_password: $scope.updatePasswordData.newPassword
                        }).success(function(data,status,headers,config) {
                            if (status === 200 && !data.error) {
                                $scope.showPopupWithTitle("Password updated successfully!")
                                $scope.updatePasswordData = {}
                            } else {
                                $scope.showPopupWithTitle(data.error)
                                $scope.updatePasswordData = {}
                            }
                        }).error(function(data,status,headers,config) {
                            $scope.showPopupWithTitle("Password updated failed. Please try again later.")
                            $scope.updatePasswordData = {}
                        })
                    }
                }
            }]
        });
    }

    $scope.showPopupWithTitle = function(title) {
        $ionicPopup.show({
            title: title,
            buttons: [{
                text: 'OK'
            }]
        });
    }

    $scope.getLastestUserInfo = function() {
        apis.updateUserInfo.get(session.currentUserID(), {}).success(function(data, status){
            delete data.password;
            delete data.password_digest;
            session.save({ currentUser: data });
        })
    }

    $scope.logout = function() {
    	auth.logout();
    }

    $scope.userDisplayNameInputDidChange = function(newValue) {
    	session.currentUser().display_name = newValue;
    	session.saveContext();
        $scope.updateUserInfo();
    }

    $scope.userEmailInputDidChange = function(newValue) {
    	session.currentUser().email = newValue;
    	session.saveContext();
        $scope.updateUserInfo();
    }

    $scope.userPhoneInputDidChange = function(newValue) {
    	session.currentUser().phone = newValue;
    	session.saveContext();
        $scope.updateUserInfo();
    }

    $scope.updateUserInfo = function() {
        verifyNetworkStatus("Network unavailable, changes will not be persisted")

        apis.updateUserInfo.put(session.currentUserID(), {}, {
            user: session.currentUser()
        }).success(function(data,status,headers,config) {
            if (status === 200 && !data.error) {
            } else {
            }
        }).error(function(data,status,headers,config) {
        })
    }
})