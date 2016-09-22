serviceModule.

service('offlineWishPosting', function offlineWishPosting($window, session, apis, $ionicPopup) {
	
	var LOCAL_STORAGE_ID = "WishForm";

	function postFromDisk() {
		if (navigator.online) {
			try {
				var wish = JSON.parse($window.localStorage[LOCAL_STORAGE_ID]);
				postWish(wish);
			} catch (e) {
			}
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
					$ionicPopup.show({
						title: 'Wish Posted',
						template: 'You wish has been posted to the community. You may check the status in My Wishes section',
						buttons: [{
							text: 'OK',
							onTap: function(e) {
								handler(true)
							}
						}]
					});
				} else if (data.error.points) {
					$ionicPopup.show({
						title: 'Not Enough Points',
						template: 'Each wish cost 100 points and you do not have enough points in your accounts. Try to pick and fulfill others\' wishes to earn points.',
						buttons: [{
							text: 'OK',
							onTap: function(e) {
								handler(true)
							}
						}]
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
			$ionicPopup.show({
				title: 'Wish in progress',
				template: 'Your are currently offline but your wish has been submitted. It will be posted once you go online. ',
				buttons: [{
					text: 'OK',
					onTap: function(e) {
						handler(true)
					}
				}]
			});
		}
	}
});