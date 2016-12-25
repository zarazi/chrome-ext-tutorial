function fillData(message) {

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

console.log('> kk-popup-frame.js loaded.');
