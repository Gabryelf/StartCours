// Этот код выполняется на каждой веб-странице
console.log("🎯 Content script загружен для:", window.location.href);

// ===== 1. Чтение информации о странице =====
function getPageInfo() {
  return {
    title: document.title,
    url: window.location.href,
    headersCount: document.querySelectorAll("h1, h2, h3").length,
    linksCount: document.querySelectorAll("a").length,
    imagesCount: document.querySelectorAll("img").length,
    textLength: document.body.innerText.length
  };
}

// ===== 2. Модификация страницы =====
function highlightLinks() {
  const links = document.querySelectorAll("a");
  links.forEach((link, index) => {
    link.style.backgroundColor = "yellow";
    link.style.transition = "0.3s";
    if (index % 10 === 0) {
      console.log(`Подсвечено ${index + 1} ссылок`);
    }
  });
  return links.length;
}

function addFloatingPanel() {
  // Проверяем, не добавлена ли уже панель
  if (document.getElementById("my-extension-panel")) return;
  
  const panel = document.createElement("div");
  panel.id = "my-extension-panel";
  panel.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    ">
      <strong>📦 Расширение активно</strong>
      <button id="closePanel" style="margin-left: 10px;">✖</button>
    </div>
  `;
  document.body.appendChild(panel);
  
  document.getElementById("closePanel").addEventListener("click", () => {
    panel.remove();
  });
}

// ===== 3. Отправка данных в расширение =====
function sendToBackground(message) {
  chrome.runtime.sendMessage(message, (response) => {
    console.log("Ответ от фона:", response);
  });
}

// ===== 4. Слушаем команды из popup =====
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script получил:", request);
  
  switch (request.action) {
    case "PING":
      sendResponse({ pong: true });
      break;

    case "GET_PAGE_INFO":
      sendResponse(getPageInfo());
      break;
      
    case "HIGHLIGHT_LINKS":
      const count = highlightLinks();
      sendResponse({ success: true, linksHighlighted: count });
      break;
      
    case "ADD_PANEL":
      addFloatingPanel();
      sendResponse({ success: true, panelAdded: true });
      break;
      
    case "CHANGE_BACKGROUND":
      document.body.style.backgroundColor = request.color || "lightblue";
      sendResponse({ success: true, newColor: request.color });
      break;
      
    default:
      sendResponse({ error: "Неизвестное действие" });
  }
  
  return true; // Асинхронный ответ
});

// Автоматически показываем информацию при загрузке
console.log("Инфо о странице:", getPageInfo());

// Отправляем приветствие в background при загрузке
sendToBackground({ 
  type: "CONTENT_READY", 
  url: window.location.href,
  timestamp: Date.now()
});