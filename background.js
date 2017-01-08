console.log('eventpage loaded.');

var currentPageUrl='';
var currentFileName='';
var currentFileContent='';
var currentTabId='';

var currentNotificationId = null;
var currentNotificationUrl = null;

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
            tabId: tab.id,
            pageUrl: tab.url,
            fileName: tab.title,
            content: selectionText[0]

        }, {}, function(res) {
            console.log('> popup created: ', res);
        });
    });
}

chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message && message.command) {
        switch(message.command) {
            case 'sendTextToKKPedia': 
                sendTextToKKPedia(message.pageUrl, message.fileName, message.fileContent, message.tabId);
                chrome.tabs.sendMessage(message.tabId, {command: 'togglePopup'}, function(res) {
                    if (res) 
                        chrome.tabs.executeScript(message.tabId, {
                            code:   'if (window.getSelection && window.getSelection().empty)'+
                                    ' window.getSelection().empty();'
                        });
                });
                break;
        }
    }
    // console.log(message);
    // console.log(sender);
});

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
    var url = "https://script.google.com/macros/s/AKfycbw_pz9bTe_ZvLPsduiTaSAzJlaqLc6jO3CBDBynPGHsKj-a-WdR/exec";

    http.open("POST", url, true);
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log('saved to KKPedia: ', http.responseText);
            chrome.notifications.create(null, {
                title: 'ข้อความจาก KK-Pedia',
                iconUrl: 'kk-black-64.png',
                type: 'basic',
                message: "เซฟเรียบร้อย",
                contextMessage: fileName,
                buttons: [{
                    title: "เปิดดู"
                }]
            }, function(id) {
                currentNotificationId = id;
                currentNotificationUrl = JSON.parse(http.responseText).url;
            });
        }
    }
    http.send(formData);
}

chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === currentNotificationId) {
        if (btnIdx === 0) {
            chrome.tabs.create({url: currentNotificationUrl});
        }
    }
});



