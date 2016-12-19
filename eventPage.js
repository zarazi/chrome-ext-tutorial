console.log('eventpage loaded.');

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('browserAction clicked!');
});

currentFileName='';
currentFileContent='';
currentTabId='';
chrome.contextMenus.create({
    id: 'sendTextToKKPedia',
    title: 'Send text to KK-Pedia',
    contexts: ['selection']
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    currentFileName = tab.title;
    currentFileContent = info.selectionText;
    chrome.tabs.create({
        url: chrome.extension.getURL('sendText.html')
    }, function(tab)  {
        console.log('new tab created: '+tab.id);
    });
});
function getCurrentFileData() {
    return {fileName: currentFileName, fileContent: currentFileContent};
}
function sendTextToKKPedia(fileName, fileContent, tabId) {
    currentFileName = fileName;
    currentFileContent = fileContent;
    currentTabId = tabId;

    var formData = new FormData();
        formData.append("file_name", fileName);
        formData.append("file_content", fileContent);
        console.log('sending data: ', fileName, fileContent);

    var http = new XMLHttpRequest();
    var url = "https://script.google.com/macros/s/AKfycbyImFFsA6WPxo9u-aDz52XbMZuJpE87Fl36Fmy8AduydmuVZBo1/exec";

    http.open("POST", url, true);
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log('saved to KKPedia.');
            alert('Saved to KKPedia.');
        }
    }
    http.send(formData);
}

chrome.runtime.onMessage.addListener(function(message, sender) {
    console.log(message);
    console.log(sender);
});



