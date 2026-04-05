document.addEventListener("DOMContentLoaded", () => {
    const versionSpan = document.getElementById("version");
    const pingBtn = document.getElementById("pingBtn");
    const outputDiv = document.getElementById("output");
  
    // Получить версию из фона
    chrome.runtime.sendMessage({ type: "GET_VERSION" }, (response) => {
      if (response) {
        versionSpan.textContent = response.version;
      }
    });
  
    // Проверить связь с background
    pingBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "PING" }, (response) => {
        outputDiv.innerHTML = `Ответ от фона: ${JSON.stringify(response)}`;
      });
    });
  });