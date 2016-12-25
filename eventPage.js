console.log('eventpage loaded.');

var currentPageUrl='';
var currentFileName='';
var currentFileContent='';
var currentTabId='';

chrome.runtime.onInstalled.addListener(function() {
    console.log('onInstalled!');

    chrome.contextMenus.create({
        id: 'sendTextToKKPedia',
        title: 'Send text to KK-Pedia',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch(info.menuItemId) {
        case "sendTextToKKPedia": openSendTextPopup(tab); break;
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('browserAction clicked!');
    openSendTextPopup(tab)
});

function openSendTextPage(tab) {
    currentPageUrl = tab.url;
    currentFileName = tab.title;
    // currentFileContent = info.selectionText.replace(/[ ]{2,}/gi,'\n');
    chrome.tabs.executeScript(tab.id, {
        code:'window.getSelection().toString()'
    },function(selectionText){
        currentFileContent = selectionText[0];
        chrome.tabs.create({
            url: chrome.extension.getURL('sendText.html')
        }, function(tab)  {
            console.log('new tab created: '+tab.id);
        });
    });
}

function openSendTextPopup(tab) {
    currentPageUrl = tab.url;
    currentFileName = tab.title;

    chrome.tabs.executeScript(tab.id, {
        code:'window.getSelection().toString()'

    },function(selectionText){
        currentFileContent = selectionText[0];
        chrome.tabs.sendMessage(tab.id, {
            command: 'togglePopup',
            pageUrl: tab.url,
            fileName: tab.title,
            content: selectionText[0]

        }, {}, function(res) {
            console.log('> finished sendMessage: togglePopup to tab.');
            console.log('> get response: ', res);
        });
    });
}

function getCurrentFileData() {
    return {pageUrl: currentPageUrl, fileName: currentFileName, fileContent: currentFileContent};
}
function sendTextToKKPedia(pageUrl, fileName, fileContent, tabId) {
    currentPageUrl = pageUrl,
    currentFileName = fileName;
    currentFileContent = fileContent;
    currentTabId = tabId;

    var formData = new FormData();
        formData.append("page_url", pageUrl);
        formData.append("file_name", fileName);
        formData.append("file_content", fileContent.replace(/\n\n/g,'\n'));
        console.log('sending data: ', pageUrl, fileName, fileContent);

    var http = new XMLHttpRequest();
    //var url = "https://script.google.com/macros/s/AKfycbyImFFsA6WPxo9u-aDz52XbMZuJpE87Fl36Fmy8AduydmuVZBo1/exec";
    var url = "https://script.google.com/macros/s/AKfycbwL3CFBU1qC8dB0d3f_FpmbqFa51pi7Hhiiqv3DtHsVhWLwuBg/exec";

    http.open("POST", url, true);
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log('saved to KKPedia.');
            chrome.notifications.create(null, {
                title: 'KK-Pedia Message',
                iconUrl: 'kk-black-64.png',
                type: 'basic',
                message: "Content is saved to KK-Pedia."
            }, function() {});
        }
    }
    http.send(formData);
}

chrome.runtime.onMessage.addListener(function(message, sender) {
    console.log(message);
    console.log(sender);
});



