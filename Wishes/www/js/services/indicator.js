serviceModule.

service('indicator', function indicator($ionicPopup) {



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
})