console.log('initializing..');
var bg = chrome.extension.getBackgroundPage();

var fileData = bg.getCurrentFileData();
document.getElementById('fileName').value = fileData.fileName;
document.getElementById('fileContent').value = fileData.fileContent;

document.getElementById('sendButton').addEventListener('click', function(e){
    e.preventDefault();

    var fileName = document.getElementById('fileName').value;
    var fileContent = document.getElementById('fileContent').value;
    console.log('sending data: ', fileName, fileContent);
    bg.sendTextToKKPedia(fileName, fileContent);
    window.close();
});
