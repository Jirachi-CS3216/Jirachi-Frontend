serviceModule.

service('indicator', function indicator($ionicPopup) {



    this.showNetworkDownIndicator = function(scope) {
        $ionicPopup.show({
            title: 'Network Down, Showing Cache!',
            scope: scope,
            buttons: [{ text: 'OK' }]
        });
    }
})