/*global document, chrome, setInterval, clearInterval, Image*/

(function () {

    "use strict";

    var kittenURL = 'http://placekitten.com/',
        isAwake = true,
        loop = null,

        getKittenURL = function (width, height) {
            return kittenURL + width + '/' + height;
        },
        replaceByKittens = function () {
            var images = document.querySelectorAll('img:not([data-errored]):not([data-original])');

            Array.prototype.forEach.call(images, function (img) {
                if (img.getAttribute('data-cat') !== null) {
                    img.setAttribute('data-original', img.getAttribute('src'));
                    img.setAttribute('src', img.getAttribute('data-cat'));
                    img.removeAttribute('data-cat');
                    return;
                }

                var image = new Image();
                image.src = img.getAttribute('src');

                image.onload = function () {
                    img.setAttribute('data-original', image.src);
                    img.setAttribute('src', getKittenURL(image.width, image.height));
                };
                image.onerror = function () {
                    img.setAttribute('data-errored', true);
                };
            });
        },
        replaceOriginals = function () {
            var images = document.querySelectorAll('img[data-original]');

            Array.prototype.forEach.call(images, function (img) {
                img.setAttribute('data-cat', img.getAttribute('src'));
                img.setAttribute('src',  img.getAttribute('data-original'));
                img.removeAttribute('data-original');
            });
        };

    /*
     * send a message to the background script to know if it is activated
      */
    chrome.runtime.sendMessage({greeting: "ohhai"}, function (response) {
        if (response.isAwake) {
            replaceByKittens();
            loop = setInterval(replaceByKittens, 3000);
        } else {
            clearInterval(loop);
        }
    });

    /*
     * listen to messages from the background script change on status
      */
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        isAwake = request.activated;

        if (isAwake) {
            loop = setInterval(replaceByKittens, 3000);
        } else {
            clearInterval(loop);
            replaceOriginals();
        }
    });
}());
