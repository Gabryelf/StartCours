async function sendMessage(){
    const message = document.getElementById('message').value;

    const response = await fetch("api/send-message", {
        method: "POST",
        headers: {
            "content-type" : "application/json",
        },
        body: JSON.stringify({message: message})
    });

    const data = await response.json();

    document.getElementById('length').textContent = data.length;
    document.getElementById('wordCount').textContent = data.wordCount;
}