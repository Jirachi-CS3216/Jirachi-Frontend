serviceModule.

service('indicator', function indicator($ionicPopup, auth) {



    this.showNetworkDownIndicator = function(scope, title) {
        var t = 'Network unavailable, cached results are shown!'
        if (title) {
            t = title
        }
        $ionicPopup.show({
            title: t,
            scope: scope,
            buttons: [{ text: 'OK' }]
        });
    }

    this.showSessionExpiredIndicator = function(scope) {
        var alertPopup = $ionicPopup.show({
            title: 'User Session Expired!',
            scope: scope,
            buttons:[{
                text: "OK",
                onTap: function(){
                    auth.logout()
                }
            }]
        });
    }
})