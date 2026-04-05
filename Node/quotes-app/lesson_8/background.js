// Фоновый сервис-воркер (не имеет доступа к DOM)
console.log("Background service worker запущен");

// Пример слушателя установки расширения
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Расширение впервые установлено");
    chrome.storage.local.set({ lesson: 1, status: "active" });
  } else if (details.reason === "update") {
    console.log("Расширение обновлено");
  }
});

// Слушаем сообщения из popup или content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Получено сообщение:", message);

  if (message.type === "PING") {
    sendResponse({ status: "pong", from: "background" });
  }

  if (message.type === "GET_VERSION") {
    sendResponse({ version: chrome.runtime.getManifest().version });
  }

  return true; // асинхронный ответ
});