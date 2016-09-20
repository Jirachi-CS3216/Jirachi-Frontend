module.controller('SettingsCtrl', function($scope, $ionicPopup, $ionicModal, auth, session, apis, indicator) {
	
	$scope.session = session;

    $ionicModal.fromTemplateUrl('../../templates/dashboard-modal-spinner.html', {
        scope: $scope,
        animation: 'fade-in'
    }).then(function(modal) {
        $scope.spinnerModal = modal;
    });

    function verifyNetworkStatus(message) {
        apis.updateUserInfo.get(session.currentUserID(), {}).success(function(data, status){
            $scope.networkDown = (status !== 200)
            if (status !== 200) {
                loadStoredDetails()
                indicator.showNetworkDownIndicator($scope, message)
            }
        })
    }

	$scope.$on("$ionicView.beforeEnter", function(event, data){
   		loadStoredDetails()
        verifyNetworkStatus("Network unavailable, user details editing is disabled.")
        $scope.getLastestUserInfo()
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
        $scope.updatePasswordButtonPressed = false;
        $ionicPopup.show({
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
                        console.log("invalid input")
                    } else {
                        $scope.spinnerModal.show();
                        apis.updateUserInfo.put(session.currentUserID(), {}, {
                            username: session.currentUser().username,
                            old_password: $scope.updatePasswordData.oldPassword,
                            new_password: $scope.updatePasswordData.newPassword
                        }).success(function(data,status,headers,config) {
                            $scope.spinnerModal.hide();
                            if (status === 200 && !data.error) {
                                $scope.showPopupWithTitle("Password updated successfully!")
                                $scope.updatePasswordData = {}
                            } else {
                                console.log(data)
                                $scope.showPopupWithTitle(data.error)
                                $scope.updatePasswordData = {}
                            }
                        }).error(function(data,status,headers,config) {
                            $scope.spinnerModal.hide();
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
                console.log("User Info Updated")
            } else {
                console.log(data)
                console.log("User Info Failed to update")
            }
        }).error(function(data,status,headers,config) {
            console.log("User Info Failed to update")
        })
    }
})