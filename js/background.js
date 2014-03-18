/*global chrome*/

(function () {

    "use strict";

    var isAwake = true;

    chrome.browserAction.onClicked.addListener(function (tab) {
        // update icon & notify content script
        chrome.browserAction.setIcon({path: isAwake ? 'img/sleep-icon.png' : 'img/icon.png'});
        chrome.tabs.sendMessage(tab.id, {activated: !isAwake});

        isAwake = !isAwake;
    });

    // listen to content script request
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (sender.tab && request.greeting === "ohhai") { // from a content script
            sendResponse({isAwake: isAwake, greetings: 'kthxbye'});
        }
    });
}());
