serviceModule.service('session', function session($window /*, $rootScope*/) {
    // AngularJS will instantiate a singleton by calling "new" on this function
  
    // window.localStorage key
    var LOCAL_STORAGE_ID = 'WishesSession';

    function saveToDisk(data) {
        if (data) {
            $window.localStorage[LOCAL_STORAGE_ID] = JSON.stringify(data);
        } else {
            delete $window.localStorage[LOCAL_STORAGE_ID];
        }
    }

    function loadFromDisk() {
        try {
            return JSON.parse($window.localStorage[LOCAL_STORAGE_ID]);
        } catch (e) {
            return null;
        }
    }

    var _session = loadFromDisk(); 
  
    // Data contains read-only properties
    // Can be null to clear session
    this.save = function(data) {
        _session = data;
        saveToDisk(_session);
    };

    // Read-only getters
    this.serverToken = function () { return _session && _session.serverToken || ''; };
});