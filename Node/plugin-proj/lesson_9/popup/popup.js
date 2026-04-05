document.addEventListener("DOMContentLoaded", () => {
  const versionSpan = document.getElementById("version");
  const getInfoBtn = document.getElementById("getInfoBtn");
  const highlightLinksBtn = document.getElementById("highlightLinksBtn");
  const addPanelBtn = document.getElementById("addPanelBtn");
  const changeBgBtn = document.getElementById("changeBgBtn");
  const pageInfoDiv = document.getElementById("pageInfo");
  const outputDiv = document.getElementById("output");

  // Получить версию расширения
  chrome.runtime.sendMessage({ type: "GET_VERSION" }, (response) => {
    if (response) versionSpan.textContent = response.version;
  });

  // Функция для инъекции content script если он не загружен
  async function ensureContentScript(tabId) {
    try {
      // Пробуем отправить тестовое сообщение
      await chrome.tabs.sendMessage(tabId, { action: "PING" });
      return true;
    } catch (error) {
      // Content script не загружен, инжектим его
      console.log("Инжектим content script...");
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content/content.js"]
      });
      return true;
    }
  }

  // Вспомогательная функция для отправки команд на активную вкладку
  async function sendToActiveTab(message) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        return { error: "Нет активной вкладки" };
      }
      
      // Проверяем и инжектим content script если нужно
      await ensureContentScript(tab.id);
      
      // Даём время на инициализацию
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await chrome.tabs.sendMessage(tab.id, message);
      return response;
    } catch (error) {
      console.error("Ошибка:", error);
      return { error: "Не удалось связаться со страницей. Обновите страницу и попробуйте снова." };
    }
  }

  // 1. Получить информацию о странице
  getInfoBtn.addEventListener("click", async () => {
    outputDiv.innerHTML = "⏳ Запрос информации...";
    const result = await sendToActiveTab({ action: "GET_PAGE_INFO" });
    
    if (result.error) {
      pageInfoDiv.innerHTML = `❌ ${result.error}`;
      outputDiv.innerHTML = `❌ ${result.error}`;
    } else {
      pageInfoDiv.innerHTML = `
        📄 <strong>${result.title}</strong><br>
        🔗 Ссылок: ${result.linksCount}<br>
        🖼️ Изображений: ${result.imagesCount}<br>
        📝 Заголовков: ${result.headersCount}<br>
        📊 Текст: ${Math.round(result.textLength / 1000)}KB
      `;
      outputDiv.innerHTML = `✅ Получена информация о странице`;
    }
  });

  // 2. Подсветить ссылки
  highlightLinksBtn.addEventListener("click", async () => {
    outputDiv.innerHTML = "✨ Подсвечиваю ссылки...";
    const result = await sendToActiveTab({ action: "HIGHLIGHT_LINKS" });
    
    if (result.success) {
      outputDiv.innerHTML = `✅ Подсвечено ${result.linksHighlighted} ссылок`;
    } else if (result.error) {
      outputDiv.innerHTML = `❌ ${result.error}`;
    }
  });

  // 3. Добавить плавающую панель
  addPanelBtn.addEventListener("click", async () => {
    outputDiv.innerHTML = "🔄 Добавляю панель...";
    const result = await sendToActiveTab({ action: "ADD_PANEL" });
    
    if (result.success) {
      outputDiv.innerHTML = "✅ Панель добавлена на страницу";
    } else if (result.error) {
      outputDiv.innerHTML = `❌ ${result.error}`;
    }
  });

  // 4. Сменить фон страницы
  changeBgBtn.addEventListener("click", async () => {
    const colors = ["lightblue", "lightgreen", "lightcoral", "lightyellow", "#f0f0f0"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    outputDiv.innerHTML = `🎨 Меняю фон на ${randomColor}...`;
    const result = await sendToActiveTab({ 
      action: "CHANGE_BACKGROUND", 
      color: randomColor 
    });
    
    if (result.success) {
      outputDiv.innerHTML = `✅ Фон изменён на ${result.newColor}`;
    } else if (result.error) {
      outputDiv.innerHTML = `❌ ${result.error}`;
    }
  });
});