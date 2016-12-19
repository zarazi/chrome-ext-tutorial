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
    // alert('Sending text to KK-Pedia...\ntitle:'+tab.title+'\ntext:'+info.selectionText);
    // console.log(info,tab);
    currentFileName = tab.title;
    currentFileContent = info.selectionText;
    chrome.tabs.create({url: chrome.extension.getURL('sendText.html')}, function(tab)  {
        console.log(tab);
    });
});
function getCurrentFileData() {
    return {fileName: currentFileName, fileContent: currentFileContent};
}
function sendTextToKKPedia(fileName, fileContent, tabId) {
    currentTabId = tabId;

    var http = new XMLHttpRequest();
    var url = "https://script.google.com/macros/s/AKfycbyImFFsA6WPxo9u-aDz52XbMZuJpE87Fl36Fmy8AduydmuVZBo1/exec";
    var params = "file_name="+fileName+"&file_content="+fileContent;
    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log('done sending text to KKPedia.');
            var t = chrome.extension.getViews({type: 'tab', tabId: currentTabId});
            if (t && t[0]) t[0].close();
        }
    }
    http.send(params);
}

chrome.runtime.onMessage.addListener(function(message, sender) {
    console.log(message);
    console.log(sender);
});



