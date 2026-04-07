chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    addImageToConteiner(message);
    sendResponse("OK");
});

function addImageToConteiner(urls){
    const conteiner = document.querySelector(".conteiner");
    urls.forEach(url => addImageNode(conteiner, url));
}

function addImageNode(conteiner, url){
    const div = document.createElement("div");
    div.className = "image-div";
    const img = document.createElement("img");
    img.src = url;
    div.appendChild(img);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("url", url);
    div.appendChild(checkbox);
    conteiner.appendChild(div);
}

document.getElementById("select-all").addEventListener("change", (event) => {
    const items = document.querySelectorAll(".conteiner input");
    for(let item of items){
        item.checked = event.target.checked;
    };
});

document.getElementById("download-btn").addEventListener("click", async() => {
    const urls = getSelectedUrls();
    const archive = await createArchive(urls);
    downloadArchive(archive);
});

function getSelectedUrls(){
    const urls = Array.from(document.querySelectorAll(".conteiner input"))
    .filter(item => item.checked)
    .map(item => item.getAttribute("url"));

    return urls;
}

async function createArchive(urls){
    const zip = new JSZip();
    for(let index in urls){
        const url = urls[index];
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(checkFileName(index, blob), blob);
    };
    return zip.generateAsync({
        type: 'blob',
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    });
}

function downloadArchive(archive){
    const link = document.createElement('a');
    link.href = URL.createObjectURL(archive);
    link.download = "images.zip";
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);

}

function checkFileName(index, blob){
    let name = parseInt(index)+1;
    const [type, extension] = blob.type.split("/");

    return name+"."+extension;
}