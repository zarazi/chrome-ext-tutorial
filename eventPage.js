console.log('eventpage loaded.');

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('browserAction clicked!');
});