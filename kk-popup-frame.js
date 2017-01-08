function fillData(message) {

    document.getElementById('tabId').value = message.tabId || '';
    document.getElementById('pageUrl').value = message.pageUrl || '';
    document.getElementById('fileName').value = message.fileName || '';
    document.getElementById('fileContent').value = message.content || '';
}

function togglePopupDiv(visibility) {
    var popupContainer = document.getElementById('kk-popup-container');
    if (visibility===true) {
        popupContainer.classList.add('popup-show');
    } else {
        popupContainer.classList.remove('popup-show');
    }
}

window.addEventListener('message', function(event) { 
    var message = event.data;
    if (message) {
        switch(message.command) {
            case 'showPopupDiv': 
                togglePopupDiv(true); 
                fillData(message);
                break;
            case 'hidePopupDiv': 
                togglePopupDiv(false); 
                break;
        }
    }
}); 

document.getElementById('sendButton').addEventListener('click', function(e){
    e.preventDefault();

    var tabId = document.getElementById('tabId').value;
    var pageUrl = document.getElementById('pageUrl').value;
    var fileName = document.getElementById('fileName').value;
    var fileContent = document.getElementById('fileContent').value;
    
    if (tabId && pageUrl && fileName && fileContent) {
        // console.log('sending data: ', tabId, pageUrl, fileName, fileContent);
        console.log('sending data to kk-pedia ...');

        chrome.runtime.sendMessage({
            command: 'sendTextToKKPedia',
            tabId: tabId && parseInt(tabId),
            pageUrl: pageUrl,
            fileName: fileName,
            fileContent: fileContent
        });
    }
});

document.getElementById('cancelButton').addEventListener('click', function(e){
    e.preventDefault();

    var tabId = document.getElementById('tabId').value;
    
    chrome.runtime.sendMessage({
        command: 'closePopup',
        tabId: tabId && parseInt(tabId)
    });
});

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     // console.log(message);
//     // console.log(sender);
//     if (message && message.command) {
//         switch(message.command) {
//             case 'togglePopupDiv': togglePopupDiv(); break;
//         }
//     }
//     sendResponse('done');
// });

// console.log('> kk-popup-frame.js loaded.');
