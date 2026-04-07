document.addEventListener("DOMContentLoaded", () => {
  const versionSpan = document.getElementById("version");
  const getInfoBtn = document.getElementById("getInfoBtn");
  const highlightLinksBtn = document.getElementById("highlightLinksBtn");
  const addPanelBtn = document.getElementById("addPanelBtn");
  const changeBgBtn = document.getElementById("changeBgBtn");
  const pageInfoDiv = document.getElementById("pageInfo");
  const outputDiv = document.getElementById("output");
  // Получаем элементы для тёмной темы
  const darkModeToggleBtn = document.getElementById("darkModeToggleBtn");
  const darkModeOffBtn = document.getElementById("darkModeOffBtn");
  const themeStatus = document.getElementById("themeStatus");
  const methodRadios = document.querySelectorAll('input[name="themeMethod"]');

  

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

// Получаем текущий выбранный метод
function getSelectedMethod() {
  let selected = 'custom';
  methodRadios.forEach(radio => {
    if (radio.checked) selected = radio.value;
  });
  return selected;
}

// Обновляем интерфейс в зависимости от статуса тёмной темы
async function updateDarkModeUI() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { action: "GET_DARK_MODE_STATUS" });
    
    if (response && response.success) {
      if (response.active) {
        darkModeToggleBtn.textContent = "🌙 Тёмная тема активна";
        darkModeToggleBtn.style.opacity = "0.7";
        themeStatus.style.display = "block";
        
        // Показываем информацию о текущем методе
        const methodNames = {
          'custom': 'Кастомная CSS',
          'invert': 'Инверсия цветов',
          'overlay': 'Затемняющий оверлей'
        };
        themeStatus.innerHTML = `
          ✅ Тёмная тема включена<br>
          📐 Метод: ${methodNames[response.method] || response.method}<br>
          🔄 Перезагрузите страницу для полного сброса
        `;
      } else {
        darkModeToggleBtn.textContent = "🌙 Включить тёмную тему";
        darkModeToggleBtn.style.opacity = "1";
        themeStatus.style.display = "none";
      }
    }
  } catch (error) {
    console.log("Не удалось получить статус темы:", error);
  }
}

// Включение тёмной темы
darkModeToggleBtn.addEventListener("click", async () => {
  const method = getSelectedMethod();
  outputDiv.innerHTML = `🌙 Включаю тёмную тему (метод: ${method})...`;
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { 
      action: "TOGGLE_DARK_MODE", 
      method: method 
    });
    
    if (response && response.success) {
      const methodNames = {
        'custom': 'кастомной CSS',
        'invert': 'инверсии цветов',
        'overlay': 'оверлея'
      };
      outputDiv.innerHTML = `✅ Тёмная тема включена (${methodNames[response.method]})`;
      await updateDarkModeUI();
    } else {
      outputDiv.innerHTML = `❌ Ошибка: ${response?.error || "неизвестная ошибка"}`;
    }
  } catch (error) {
    outputDiv.innerHTML = `❌ Ошибка: ${error.message}`;
  }
});

// Выключение тёмной темы
darkModeOffBtn.addEventListener("click", async () => {
  outputDiv.innerHTML = "🌙 Выключаю тёмную тему...";
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { 
      action: "TOGGLE_DARK_MODE", 
      method: getSelectedMethod(),
      enable: false
    });
    
    if (response && response.success) {
      outputDiv.innerHTML = "✅ Тёмная тема выключена";
      await updateDarkModeUI();
    } else {
      outputDiv.innerHTML = `❌ Ошибка: ${response?.error || "неизвестная ошибка"}`;
    }
  } catch (error) {
    outputDiv.innerHTML = `❌ Ошибка: ${error.message}`;
  }
});


updateDarkModeUI();