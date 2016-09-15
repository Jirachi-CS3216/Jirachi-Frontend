serviceModule.

service('auth', function auth($http, $location) {

    var isLoggedIn = false;

    this.login = function(data, handler){
        data = data ? data : {}
        if (data.username === "admin" && data.password === "admin") {
            isLoggedIn = true;
            handler(true);
        } else {
            isLoggedIn = false;
            handler(false);
        }
    };

    this.isTokenValid = function() {
        return isLoggedIn;
    }
})