function togglePopupDiv() {
    // var iframe = window.frames['kk-popup-frame'];
    // iframe.style.display = 'block';

    var popupContainer = document.getElementById('kk-popup-container');
    popupContainer.classList.toggle('popup-show');
}

// window.addEventListener('message', function(event) { 
//     switch(event.data) {
//         case 'togglePopupDiv': togglePopupDiv(); break;
//     }
// }); 

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // console.log(message);
    // console.log(sender);
    if (message && message.command) {
        switch(message.command) {
            case 'togglePopup': togglePopupDiv(); break;
        }
    }
    sendResponse('done');
});

console.log('> kk-popup-frame.js loaded.');
