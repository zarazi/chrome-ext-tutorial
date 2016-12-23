console.log('initializing..');
var bg = chrome.extension.getBackgroundPage();

var fileData = bg.getCurrentFileData();
document.getElementById('pageUrl').value = fileData.pageUrl;
document.getElementById('fileName').value = fileData.fileName;
document.getElementById('fileContent').value = fileData.fileContent;

document.getElementById('sendButton').addEventListener('click', function(e){
    e.preventDefault();

    var pageUrl = fileData.pageUrl;
    var fileName = document.getElementById('fileName').value;
    var fileContent = document.getElementById('fileContent').value;
    console.log('sending data: ', pageUrl, fileName, fileContent);
    bg.sendTextToKKPedia(pageUrl, fileName, fileContent);
    window.close();
});
