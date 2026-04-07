const loadBtn = document.getElementById("load-btn")
    .addEventListener("click", () => {
        chrome.tabs.query({active: true}, function(tabs){
            var tab = tabs[0];
            if(tab){
                chrome.scripting.executeScript(
                    {
                        target: {tabId: tab.id, allFrames: true},
                        func: loadImages
                    },
                    onResult
                )
            }
        });
    });

function loadImages(){
    const images = document.querySelectorAll("img");
    return Array.from(images).map(image => image.src)
}

function onResult(frames){
    const imageUrls = frames.map(frame => frame.result)
        .reduce((r1,r2) => r1.concat(r2));

    window.navigator.clipboard
        .writeText(imageUrls.join("\n"))
        .then(() => {
            window.close();
        });
}