console.log("Background service worker запущен");

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Расширение установлено");
    chrome.storage.local.set({ lesson: 2, status: "active" });
  }
});

// Слушаем сообщения из popup и content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background получил:", message, "от:", sender.tab?.url || "popup");

  if (message.type === "PING") {
    sendResponse({ status: "pong", from: "background" });
  }

  if (message.type === "GET_VERSION") {
    sendResponse({ version: chrome.runtime.getManifest().version });
  }

  if (message.type === "CONTENT_READY") {
    console.log(`✅ Content script готов на ${message.url}`);
    sendResponse({ received: true });
  }

  return true;
});