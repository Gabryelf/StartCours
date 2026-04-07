chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    addImageToConteiner(message);
    sendResponse("OK");
});

function addImageToConteiner(urls){
    document.write(JSON.stringify(urls));
}