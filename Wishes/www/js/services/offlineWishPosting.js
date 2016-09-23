serviceModule.

service('offlineWishPosting', function offlineWishPosting($window, session, apis, $rootScope) {
	
	var LOCAL_STORAGE_ID = "WishForm";

	this.postFromDisk = function() {
		try {
			var wish = JSON.parse($window.localStorage[LOCAL_STORAGE_ID]);
			this.postWish(wish, undefined, true);
		} catch (e) {
		}
	}

	function saveToDisk(data) {
		if (data) {
			$window.localStorage[LOCAL_STORAGE_ID] = JSON.stringify(data);
		} else {
			delete $window.localStorage[LOCAL_STORAGE_ID];
		}
	}

	function clearFromDisk() {
		saveToDisk(null);
	}

	this.postWish = function(wish, handler, fromDisk) {
		if (navigator.onLine) {
			apis.wishes.post(session.currentUserID(), {}, wish).success(function(data, status){
				if (!data.error) {
					clearFromDisk();
					$rootScope.$broadcast("notification-should-show", {
						iconClass: "ion-checkmark-circled",
						title: fromDisk ? "Postponed Wish Posted" : "Wish Posted",
						message: "You wish has been posted to the community."
					});
					handler(true)
					if (fromDisk) {
						delete $window.localStorage[LOCAL_STORAGE_ID];
					}
				} else if (data.error.points) {
					$rootScope.$broadcast("notification-should-show", {
						iconClass: "ion-alert-circled",
						title: fromDisk ? "Postponed Wish: Not Enough Points" : "Not Enough Points",
						message: "Points not enough :( Try to pick and fulfill others\' wishes to earn points!'"
					});
					handler(false)
					if (fromDisk) {
						delete $window.localStorage[LOCAL_STORAGE_ID];
					}
				} else {
					handler(false)
					if (fromDisk) {
						delete $window.localStorage[LOCAL_STORAGE_ID];
					}
				}
			}).error(function(data, status) {
				handler(false)
				if (fromDisk) {
					delete $window.localStorage[LOCAL_STORAGE_ID];
				}
			})
		} else {
			if ($window.localStorage[LOCAL_STORAGE_ID]) {
				handler(false, "Only One Offline Wish Can Be Cached")
				return
			}

			saveToDisk(wish);
			$rootScope.$broadcast("notification-should-show", {
				iconClass: "ion-archive",
				title: "Offline Wish Postponed",
				message: "Stay calm, you wish will be posted once you go online :) "
			});
			handler(true)
		}
	}
});