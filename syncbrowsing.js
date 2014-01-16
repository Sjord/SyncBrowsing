
function getModifyUrl(firstUrl, secondUrl) {
	i1 = firstUrl.length - 1;
	i2 = secondUrl.length - 1;
	while (i1 >= 0 && i2 >= 0 && firstUrl[i1] === secondUrl[i2]) {
		i1--;
		i2--;
	}
	var diff1 = firstUrl.substring(0, i1 + 1);
	var diff2 = secondUrl.substring(0, i2 + 1);
	return function (url) {
		return url.replace(diff1, diff2);
	};
}

function createSyncTab(firstTab, secondUrl, splitSessions) {
    var initializeTab = function (secondTab) {
		var modifyUrl = getModifyUrl(firstTab.url, secondUrl);
		var keepTabsInSync = function (tabId, changeInfo, tab) {
			if (firstTab.id === tabId) {
				var origUrl = changeInfo.url;
				if (typeof(origUrl) !== 'undefined') {
					var newUrl = modifyUrl(origUrl);
					chrome.tabs.update(secondTab.id, { url : newUrl }, null);
				}
			}
		};

		var stopSyncing = function (tabId) {
			if (tabId === firstTab.id || tabId === secondTab.id) {
				chrome.tabs.onUpdated.removeListener(keepTabsInSync);
				chrome.tabs.onRemoved.removeListener(stopSyncing);
			}
		};

		chrome.tabs.onUpdated.addListener(keepTabsInSync);
		chrome.tabs.onRemoved.addListener(stopSyncing);
	};

    var tabProperties = { url: secondUrl };
    if (splitSessions) {
        chrome.windows.create({incognito: true}, function (win) {
            tabProperties['windowId'] = win.id;
            chrome.tabs.create(tabProperties, initializeTab);
        });
    } else {
    	chrome.tabs.create(tabProperties, initializeTab);
    }
}
