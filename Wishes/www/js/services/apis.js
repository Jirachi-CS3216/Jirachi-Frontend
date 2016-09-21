serviceModule


  .service('apis', function apis($http, session) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    var apiHost = 'https://wishesbackend.tk/api/v1';

    // explicit falsey values are ok, but null and undefined and empty string are not
    // note not allowing -0, NaN etc.
    function isBlank(value) {
        return (value !== 0) && (value !== false) && !value;
    }

    // helper to map query parameters and uri parameters to a url.
    // template has form scheme://host:port/path/{urlParam}/{urlParam2}
    // parameters not in template as urlParameters are attached as query parameters
    function buildUrl(urlTemplate, parameters) {
        var urlParts = urlTemplate.split('?');
        var pathParts = urlParts[0].split('/');

        pathParts.forEach(function(part, i) {
            if (part[0] === '{' && part[part.length - 1] === '}') {
                var urlParam = part.slice(1, -1);
                pathParts[i] = isBlank(parameters[urlParam]) ? '' : parameters[urlParam];
            }
        });
        var url = pathParts.join('/');
        if (url[url.length - 1] === '/') {
            url = url.slice(0, -1); // strip trailing slash so '/resource/{id}, with empty set gives '/resource'
        }
        var queryParams = [];
        angular.forEach(parameters, function(value, key) {
            if (!isBlank(value)) {
                queryParams.push(key + '=' + value);
            }
        });
        if (queryParams.length) {
            url += '?' + queryParams.join('&');
        }
        return url;
    }

    this.reverseGeocoding = {

        get: function(parameters) {
            return $http.get(buildUrl('https://maps.googleapis.com/maps/api/geocode/json', parameters), {
            });
        }
    }

    this.login = {
        post: function(parameters, data) {
            return $http.post(buildUrl(apiHost + '/users/login', parameters), data, {
                disableWicache: true
            });   
        }
    }

    this.signup = {
        post: function(parameters, data) {
            return $http.post(buildUrl(apiHost + '/users/signup', parameters), data, {
                disableWicache: true
            });   
        }   
    }

    this.updateUserInfo = {
        get: function(userID, parameters){
            return $http.get(buildUrl(apiHost + '/users/' + userID, parameters), {
                headers: {
                    'Authorization': 'Token "' + session.serverToken() + '"'
                }
            });
        },

        put: function(userID, parameters, data) {
            return $http.put(buildUrl(apiHost + '/users/' + userID, parameters), data, {
                disableWicache: true,
                headers: {
                    'Authorization': 'Token "' + session.serverToken() + '"'
                }
            });
        }
    }

    this.assign = {
        put: function(userID, wishID, parameters, data) {
            return $http.put(buildUrl(apiHost + '/users/' + userID + '/wishes/' + wishID, parameters), data, {
                headers: {
                    'Authorization': 'Token "' + session.serverToken() + '"'
                }
            });
        }
    }

    this.wishes = {
        post: function(userId, parameters, data) {
            return $http.post(buildUrl(apiHost + '/users/' + userId + '/wishes', parameters), data, {
                disableWicache: true,
                headers: {
                    'Authorization': 'Token "' + session.serverToken() + '"'
                }
            });   
        },

        get : function(userId, parameters) {
            return $http.get(buildUrl(apiHost + '/users/' + userId + '/wishes', parameters), {
                headers: {
                    'Authorization': 'Token "' + session.serverToken() + '"'
                }
            });
        }
    }

    this.randomWishes = {
        get: function(userId, parameters) {
            return $http.get(buildUrl(apiHost + '/users/' + userId + '/getRandomWishes', parameters), {
                headers: {
                    'Authorization': 'Token "' + session.serverToken() + '"'
                }
            });
        }
    }


    this.leaderboard = {
        get: function(parameters) {
            return $http.get(buildUrl(apiHost + '/leaderboard', parameters), {
                headers: {
                    'Authorization': 'Token "' + session.serverToken() + '"'
                }
            });
        }
    }

    this.myRank = {
        get: function(userID, parameters) {
            return $http.get(buildUrl(apiHost + '/leaderboard/' + userID, parameters), {
                headers: {
                    'Authorization': 'Token "' + session.serverToken() + '"'
                }
            });
        }
    }
});
