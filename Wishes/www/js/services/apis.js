serviceModule


  .service('apis', function apis($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    var apiHost = 'http://wishessss.tk:3000/api/v1';

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
        post: function(parameters) {
            return $http.post(buildUrl(apiHost + '/users/login', parameters), {
            });   
        }
    }

    this.signup = {
        post: function(parameters) {
            return $http.post(buildUrl(apiHost + '/users/signup', parameters), {
            });   
        }   
    }
  });
