serviceModule.

service('offlineWishPosting', function offlineWishPosting($window, session, apis, $rootScope) {
	
	var LOCAL_STORAGE_ID = "WishForm";

	this.postFromDisk = function() {
		try {
			var wish = JSON.parse($window.localStorage[LOCAL_STORAGE_ID]);
			this.postWish(wish);
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

	this.postWish = function(wish, handler) {
		if (navigator.onLine) {
			apis.wishes.post(session.currentUserID(), {}, wish).success(function(data, status){
				if (!data.error) {
					clearFromDisk();
					$rootScope.$broadcast("notification-should-show", {
						iconClass: "ion-alert-circled",
						title: "Wish Posted",
						message: "You wish has been posted to the community. You may check the status in My Wishes section"
					});
				} else if (data.error.points) {
					$rootScope.$broadcast("notification-should-show", {
						iconClass: "ion-alert-circled",
						title: "Not Enough Points",
						message: "Each wish cost 100 points and you do not have enough points in your accounts. Try to pick and fulfill others\' wishes to earn points.'"
					});
				} else {
					console.log("Wish created failed")
				}
			}).error(function(data, status) {
				handler(false)
			})
		} else {
			console.log("offline")
			saveToDisk(wish);
			$rootScope.$broadcast("notification-should-show", {
				iconClass: "ion-alert-circled",
				title: "Wish in progress",
				message: "Your are currently offline but your wish has been submitted. It will be posted once you go online. "
			});
		}
	}
});