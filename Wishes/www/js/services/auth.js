serviceModule.

service('auth', function auth($http, $state, $ionicPopup, session, apis) {
    this.login = function(data, handler){
        if (data === undefined) {
            handleLoginFailure(handler)
        } else {
            apis.login.post({
                username: data.username,
                password: data.password
            }).success(function(response){
                if (response.error !== undefined && response.error !== null && response.error !== "") {
                    handleLoginFailure(handler)
                } else {
                    handleLoginSuccess(response, handler)
                }
            })
        }
    };

    function handleLoginFailure(handler) {
        destroyCurrentUser()
        $ionicPopup.show({
            title: 'Login Failed',
            buttons: [{text: 'OK'}]
        });
        handler(false);
    }

    function handleLoginSuccess(data, handler) {
        setCurrentUser(data);
        handler(true);
    }

    this.logout = function() {
        destroyCurrentUser()
    }

    setCurrentUser = function(data) {
        session.save({ currentUser: data });
    }

    destroyCurrentUser = function() {
        session.save(null);
        $state.go('login');
    }

    this.isUserValid = function() {
        var currentUser = session.currentUser()
        return currentUser !== undefined && currentUser !== null;
    }
})