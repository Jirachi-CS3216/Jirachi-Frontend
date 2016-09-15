serviceModule.

service('auth', function auth($http, $location, $ionicHistory, $rootScope) {

    this.login = function(){};

    $rootScope.$on('$routeChangeStart', function(e, curr, prev){
        console.log("checkAccess");
        this.checkAccess();
    });

    this.checkAccess = function() {
        if(window.localStorage.getItem("password") === "undefined" || window.localStorage.getItem("password") === null) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $location.path("/login");
        }
    }
})