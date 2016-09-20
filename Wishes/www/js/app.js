// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic.contrib.ui.tinderCards2'])

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.constant('SERVER_EVENTS', {
  notAuthenticated: 'not-authenticated',
  notAuthorized: 'not-authorized',
  notFound: 'not-found'
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.hide()
    }
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    publicAccess: true
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl',
    publicAccess: true
  })

  // setup an abstract state for the tabs directive  
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.leaderboard', {
    url: '/leaderboard',
    views: {
      'tab-leaderboard': {
        templateUrl: 'templates/tab-leaderboard.html',
        controller: 'LeaderboardCtrl'
      }
    }
  })

  .state('tab.wishes', {
    url: '/wishes',
    views: {
      'tab-wishes': {
        templateUrl: 'templates/tab-wishes.html',
        controller: 'WishesCtrl'
      }
    }
  })

  .state('tab.activity', {
    url: '/activity',
    views: {
      'tab-activity': {
        templateUrl: 'templates/tab-activity.html',
        controller: 'ActivityCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('tab.wish-detail', {
    url: '/wishes/:wishID',
    views: {
      'tab-wishes': {
        templateUrl: 'templates/wish-detail.html',
        controller: 'WishDetailCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})

.run(function($rootScope, $window, auth){
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (!toState.publicAccess & !auth.isUserValid()) {
      event.preventDefault();
      $window.location.href = '/'
    } else if (toState.url === '/login' && auth.isUserValid())  {
      event.preventDefault();
      $window.location.href = '/#/tab/dash'
    }
  });
})

.service('wicache', function wicache($window) {
  var LOCAL_STORAGE_CACHE_ID = 'Wicache';
  this.data = {}

  this.cacheResponse = function(response, keyObjects) {
    var key = JSON.stringify(keyObjects);
    this.data[key] = response;
    this.save();
  }

  this.response = function(keyObjects) {
    var key = JSON.stringify(keyObjects);
    return this.data[key]
  }

  this.save = function() {
    if (this.data) {
      $window.localStorage[LOCAL_STORAGE_CACHE_ID] = JSON.stringify(this.data);
    }
  }

  this.clear = function() {
    delete $window.localStorage[LOCAL_STORAGE_CACHE_ID];
  }
})

.factory('ResponseInterceptor', function ($rootScope, $q, wicache, SERVER_EVENTS) {
  return {
    response: function(response) {
      var config = response.config
      if (!config.disableWicache) {
        wicache.cacheResponse(response, {
          method: config.method,
          url: config.url,
        })
      }

      return response;
    }, 

    responseError: function (response) {
      if ((response.status === 404 || response.status === -1) && response.config.disableWicache !== true) {
        console.log("network down: fetching from cache")
        var config = response.config
        var newResponse = wicache.response({
          method: config.method,
          url: config.url,
        });
        if (newResponse) {
          newResponse.status = 299
          return newResponse 
        } else {
          return $q.reject(response);  
        }
      } else {
        $rootScope.$broadcast({
          401: SERVER_EVENTS.notAuthenticated,
          403: SERVER_EVENTS.notAuthorized
        }[response.status], response);
        return $q.reject(response);
      }
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('ResponseInterceptor');
});