console.log('> myScript is activated!');

// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    iframe.id = 'kk-popup-frame';
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('kk-popup-frame.html');

    // Some styles for a fancy sidebar
    // iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
    //                        'width:300px;height:100%;z-index:1000;';

    // Styles from Google Save To Keep
    iframe.style.cssText = 'height: 538px; margin: 0px; padding: 0px;' +
                           'position: fixed; right: 5px; top: 5px;' +
                           'width: 370px; z-index: 2147483647;' +
                           'border-width: 0px; display: none';

    document.body.appendChild(iframe);
}

function togglePopupFrame(message) {
    var f=window.frames['kk-popup-frame'];

    if (f && f.style && f.style.display==='none') {
        f.style.display='block';
        message.command = 'showPopupDiv';
    } else {
        f.style.display='none';
        message.command = 'hidePopupDiv';
    }
     
    f.contentWindow.postMessage(message,'*');
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // console.log(message);
    // console.log(sender);
    if (message && message.command) {
        switch(message.command) {
            case 'togglePopup': togglePopupFrame(message); break;
        }
    }
    sendResponse('done');
});

document.body.addEventListener("click", function(e) {
    var iframe = document.getElementById('kk-popup-frame');
    if (e.target.id !== iframe.id && iframe.style.display!=='none') {
        // console.log('> closing kk-popup-frame');
        togglePopupFrame({});
    }
}, false);
