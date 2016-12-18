console.log('eventpage loaded.');

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('browserAction clicked!');

    var http = new XMLHttpRequest();
    var url = "https://script.google.com/macros/s/AKfycbyImFFsA6WPxo9u-aDz52XbMZuJpE87Fl36Fmy8AduydmuVZBo1/exec";
    var params = "file_name=test&file_content=elephant";
    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(params);
});

chrome.contextMenus.create({
    id: 'sendTextToKKPedia',
    title: 'Send text to KK-Pedia',
    contexts: ['selection']
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    alert('Sending text to KK-Pedia...\ntitle:'+tab.title+'\ntext:'+info.selectionText);
    // console.log(info,tab);
});

