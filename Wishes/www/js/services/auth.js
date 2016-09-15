serviceModule.

service('auth', function auth($http, $state, session, $ionicPopup) {

    this.login = function(data, handler){
        data = data ? data : {}
        if (data.username === "admin" && data.password === "admin") {

            var token = "RANDOM-TOKEN-OIWE983KO39WIO29"
            var user = {serverToken: token}

            this.setCurrentUser(user);
            handler(true);
        } else {
            this.destroyCurrentUser()
            $ionicPopup.show({
                title: 'Login Failed',
                buttons: [{text: 'OK'}]
            });
            handler(false);
        }
    };

    this.logout = function() {
        this.destroyCurrentUser()
    }

    this.setCurrentUser = function(data) {
        
        session.save({serverToken: data.serverToken});
    }

    this.destroyCurrentUser = function() {
        session.save(null);
        $state.go('login');
    }

    this.isTokenValid = function() {
        var token = session.serverToken()
        return token !== undefined && token !== null && token !== "";
    }
})