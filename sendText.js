var fileName = 'FILE_NAME'; //TODO: getting real value from eventPage
var fileContent = 'FILE_CONTENT'; //TODO: getting real value from eventPage

var bg = chrome.extension.getBackgroundPage();
var fileData = bg.getCurrentFileData();
document.getElementById('fileName').value = fileData.fileName;
document.getElementById('fileContent').value = fileData.fileContent;
document.getElementById('sendText').addEventListener('click', function(e){
    var fileName = document.getElementById('fileName').value;
    var fileContent = document.getElementById('fileContent').value;
    chrome.tabs.getCurrent(function(tab){
        console.log(tab.id);
        bg.sendTextToKKPedia(fileName, fileContent, tab.id);
    });
    // chrome.runtime.sendMessage(null, {fileName:fileName, fileContent:fileContent}, {}, function() {
    //     alert('finish sending.');
    // });
    // bg.sendTextToKKPedia(fileName, fileContent);
})
console.log(fileData.fileName, fileData.fileContent);