/*global chrome*/

(function () {

    "use strict";

    var isAwake = true;

    chrome.browserAction.onClicked.addListener(function (tab) {
        // update icon & notify content script
        if (isAwake) {
            chrome.browserAction.setIcon({path: 'img/sleep-icon.png'});
            chrome.tabs.sendMessage(tab.id, {activated: false});
        } else {
            chrome.browserAction.setIcon({path: 'img/icon.png'});
            chrome.tabs.sendMessage(tab.id, {activated: true});
        }

        isAwake = !isAwake;
    });

    // listen to content script request
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (sender.tab && request.greeting === "ohhai") { // from a content script
            sendResponse({isAwake: isAwake, greetings: 'kthxbye'});
        }
    });
}());
