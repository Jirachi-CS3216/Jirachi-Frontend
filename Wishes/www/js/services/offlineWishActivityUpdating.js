serviceModule.

service('offlineWishActivityUpdating', function offlineWishPosting($window, session, apis) {
	var LOCAL_STORAGE_ID = "WishActivityUpdates";

	this.updateFromDisk = function() {
		try {
			if ($window.localStorage[LOCAL_STORAGE_ID]) {
				var activities = JSON.parse($window.localStorage[LOCAL_STORAGE_ID]);
				activities.forEach(updateActivity);
				clearFromDisk();
			}
		} catch (e) {
			console.log(e);
		}
	}

	this.saveToDisk = function(activity) {
		if (activity) {
			var activityArray = [];
			if (!$window.localStorage[LOCAL_STORAGE_ID]) {
				activityArray = [activity];
			} else {
				activityArray = JSON.parse($window.localStorage[LOCAL_STORAGE_ID])
				activityArray.push(activity)
			}
			$window.localStorage[LOCAL_STORAGE_ID] = JSON.stringify(activityArray);
		} else {
			delete $window.localStorage[LOCAL_STORAGE_ID];
		}
	}

	function updateActivity(activity) {
		var wishID = activity.wishID;
		var fulfillStatus = activity.fulfillStatus;
		console.log(fulfillStatus);

		apis.assign.put(session.currentUserID(), wishID, {}, {
			fulfill_status: fulfillStatus
		}).success(function(response) {
			console.log(response)
		}).error(function(response){
			console.log(response)
		});
	}

	function clearFromDisk() {
		saveToDisk(null);
	}
});