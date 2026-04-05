

---

# Stage 2: Content Scripts — вторжение на веб-страницы

В этом уроке мы научим наше расширение **взаимодействовать с любой веб-страницей**: читать DOM, изменять содержимое, добавлять новые элементы и обмениваться данными между страницей и расширением.

## Что мы освоим
- Создание content script, который внедряется на страницы
- Чтение и модификация DOM любой страницы
- Двусторонняя коммуникация: popup ↔ content script ↔ background
- Отправка команд со страницы в расширение
- Обработка ошибок и ограничений

---

## 📁 Новая структура проекта

```
my-extension/
├── manifest.json          # ⚠️ ОБНОВЛЯЕМ — добавляем content_scripts
├── background.js          # Без изменений (но добавим логирование)
├── popup/
│   ├── popup.html         # ⚠️ ОБНОВЛЯЕМ — новые кнопки
│   ├── popup.js           # ⚠️ ОБНОВЛЯЕМ — отправка команд
│   └── popup.css          # ⚠️ ОБНОВЛЯЕМ — стили для новых элементов
├── content/
│   └── content.js         # ✨ НОВЫЙ ФАЙЛ — главный content script
└── icons/                 # Без изменений
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 1. Обновляем манифест — добавляем content script

```json
{
  "manifest_version": 3,
  "name": "Учебное расширение",
  "version": "1.0.0",
  "description": "Урок 2: Content Scripts — взаимодействие со страницами",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["<all_urls>"],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/content.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### Построчное объяснение новых полей

| Поле | Значение |
|------|----------|
| `"permissions": ["scripting"]` | Добавляем право на динамическое внедрение скриптов (пригодится позже) |
| `"content_scripts"` | Массив скриптов, которые будут внедряться на страницы |
| `"matches": ["<all_urls>"]` | На каких URL запускать content script. `<all_urls>` — везде, кроме системных страниц |
| `"js": ["content/content.js"]` | Какой файл внедрять |
| `"run_at": "document_idle"` | Когда запускать: `document_end` — после DOM, `document_idle` — после загрузки всех ресурсов |

> ⚠️ **Важно:** После изменения манифеста нужно **перезагрузить расширение** в `chrome://extensions`!

---

## 2. Создаём content script (`content/content.js`)

Этот файл будет **запускаться на каждой странице**, куда у вас есть доступ.

```javascript
// ============================================
// 1. ИНИЦИАЛИЗАЦИЯ И ЛОГИРОВАНИЕ
// ============================================
console.log("🎯 Content script загружен для:", window.location.href);

// Отправляем приветствие в background при загрузке
chrome.runtime.sendMessage({ 
  type: "CONTENT_READY", 
  url: window.location.href,
  timestamp: Date.now()
});

// ============================================
// 2. ФУНКЦИИ ДЛЯ РАБОТЫ СО СТРАНИЦЕЙ
// ============================================

// 📊 Сбор информации о странице
function getPageInfo() {
  return {
    title: document.title,
    url: window.location.href,
    headersCount: document.querySelectorAll("h1, h2, h3, h4, h5, h6").length,
    linksCount: document.querySelectorAll("a[href]").length,
    imagesCount: document.querySelectorAll("img").length,
    textLength: document.body.innerText.length,
    wordCount: document.body.innerText.split(/\s+/).filter(w => w.length > 0).length
  };
}

// ✨ Подсветка всех ссылок на странице
function highlightLinks() {
  const links = document.querySelectorAll("a");
  links.forEach((link, index) => {
    // Сохраняем оригинальный цвет, если нужно будет вернуть
    if (!link.hasAttribute('data-original-bg')) {
      link.setAttribute('data-original-bg', link.style.backgroundColor || '');
    }
    link.style.backgroundColor = "yellow";
    link.style.transition = "0.3s";
  });
  return links.length;
}

// 🎨 Добавление плавающей информационной панели
function addFloatingPanel() {
  // Проверяем, не добавлена ли уже
  if (document.getElementById("my-extension-panel")) {
    console.log("Панель уже существует");
    return false;
  }
  
  const panel = document.createElement("div");
  panel.id = "my-extension-panel";
  panel.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      border-radius: 12px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      cursor: move;
      min-width: 200px;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <strong>📦 Расширение активно</strong>
        <button id="closePanel" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
        ">✖</button>
      </div>
      <div style="font-size: 12px;">
        <div>🕐 ${new Date().toLocaleTimeString()}</div>
        <div>📄 ${document.title.substring(0, 50)}</div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  
  // Добавляем возможность перетаскивания (упрощённая версия)
  let isDragging = false;
  let currentX, currentY, initialX, initialY;
  const panelDiv = panel.firstElementChild;
  
  panelDiv.addEventListener('mousedown', (e) => {
    if (e.target.id === 'closePanel') return;
    isDragging = true;
    initialX = e.clientX - panelDiv.offsetLeft;
    initialY = e.clientY - panelDiv.offsetTop;
    panelDiv.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    panelDiv.style.left = `${currentX}px`;
    panelDiv.style.top = `${currentY}px`;
    panelDiv.style.position = 'absolute';
    panelDiv.style.right = 'auto';
    panelDiv.style.bottom = 'auto';
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    panelDiv.style.cursor = 'move';
  });
  
  document.getElementById("closePanel").addEventListener("click", () => {
    panel.remove();
  });
  
  return true;
}

// 🎨 Смена фона страницы
function changeBackgroundColor(color) {
  const originalColor = document.body.style.backgroundColor;
  document.body.style.backgroundColor = color;
  return { newColor: color, originalColor: originalColor };
}

// 🗑️ Удаление всех изображений (осторожно!)
function removeAllImages() {
  const images = document.querySelectorAll("img");
  const count = images.length;
  images.forEach(img => img.remove());
  return count;
}

// 📝 Подсчёт слов на странице
function countWords() {
  const text = document.body.innerText;
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

// ============================================
// 3. ОБРАБОТЧИК СООБЩЕНИЙ ИЗ POPUP/BACKGROUND
// ============================================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Content script получил сообщение:", request);
  
  try {
    switch (request.action) {
      case "GET_PAGE_INFO":
        sendResponse({ success: true, data: getPageInfo() });
        break;
        
      case "HIGHLIGHT_LINKS":
        const highlighted = highlightLinks();
        sendResponse({ success: true, linksHighlighted: highlighted });
        break;
        
      case "ADD_PANEL":
        const panelAdded = addFloatingPanel();
        sendResponse({ success: panelAdded, panelAdded: panelAdded });
        break;
        
      case "CHANGE_BACKGROUND":
        const result = changeBackgroundColor(request.color || "lightblue");
        sendResponse({ success: true, newColor: result.newColor });
        break;
        
      case "REMOVE_IMAGES":
        const removedCount = removeAllImages();
        sendResponse({ success: true, imagesRemoved: removedCount });
        break;
        
      case "COUNT_WORDS":
        const wordCount = countWords();
        sendResponse({ success: true, wordCount: wordCount });
        break;
        
      default:
        sendResponse({ success: false, error: `Неизвестное действие: ${request.action}` });
    }
  } catch (error) {
    console.error("Ошибка в content script:", error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Важно! Указывает на асинхронный ответ
});

// ============================================
// 4. АВТОМАТИЧЕСКИЕ ДЕЙСТВИЯ ПРИ ЗАГРУЗКЕ
// ============================================
// Выводим информацию о странице в консоль
console.log("📊 Информация о странице:", getPageInfo());

// Добавляем небольшое уведомление в консоль разработчика
console.log("%c✨ Расширение готово к работе! Используйте popup для управления.", 
  "color: #4CAF50; font-size: 14px; font-weight: bold;");
```

### Ключевые концепции content script

| Концепция | Объяснение |
|-----------|------------|
| **Изоляция** | Content script живёт в своём "мире". Он видит DOM, но не видит JS-переменных страницы (и наоборот) |
| **`chrome.runtime.onMessage`** | Слушает сообщения от popup и background |
| **`sendResponse`** | Отправляет ответ обратно отправителю |
| **`return true`** | Сообщает Chrome, что ответ придёт асинхронно (нужно, если внутри `setTimeout`, Promise и т.д.) |
| **Доступ к DOM** | Полный доступ — может читать, изменять, удалять любые элементы |

---

## 3. Обновляем popup — новые кнопки и функции

### `popup/popup.html` — расширенный интерфейс

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>📦 Учебное расширение</h1>
      <p class="version">Версия: <span id="version">--</span></p>
    </header>
    
    <div class="section">
      <h3>📊 Информация о странице</h3>
      <button id="getInfoBtn" class="btn-primary">Получить информацию</button>
      <button id="countWordsBtn" class="btn-secondary">Подсчитать слова</button>
      <div id="pageInfo" class="info-box"></div>
    </div>
    
    <div class="section">
      <h3>🎨 Визуальные эффекты</h3>
      <button id="highlightLinksBtn">✨ Подсветить ссылки</button>
      <button id="addPanelBtn">🪟 Добавить панель</button>
      <button id="changeBgBtn">🎨 Сменить фон</button>
      <button id="removeImagesBtn" class="btn-danger">🗑️ Удалить изображения</button>
    </div>
    
    <div class="section">
      <h3>📝 Логи выполнения</h3>
      <div id="output" class="log-box"></div>
    </div>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

### `popup/popup.css` — улучшенные стили

```css
* {
  box-sizing: border-box;
}

body {
  width: 380px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 16px;
  margin: 0;
  background: #fafafa;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

header {
  text-align: center;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 8px;
}

header h1 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.version {
  margin: 4px 0 0;
  font-size: 11px;
  color: #666;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}

button {
  padding: 8px 12px;
  margin: 4px 4px 4px 0;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  transition: all 0.2s;
}

button:hover {
  background: #45a049;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

.btn-primary {
  background: #2196F3;
}

.btn-primary:hover {
  background: #0b7dda;
}

.btn-secondary {
  background: #ff9800;
}

.btn-secondary:hover {
  background: #e68900;
}

.btn-danger {
  background: #f44336;
}

.btn-danger:hover {
  background: #da190b;
}

.info-box {
  margin-top: 10px;
  padding: 10px;
  background: #e3f2fd;
  border-radius: 8px;
  font-size: 12px;
  border-left: 3px solid #2196F3;
}

.log-box {
  margin-top: 10px;
  padding: 10px;
  background: #263238;
  color: #aed581;
  border-radius: 8px;
  font-size: 11px;
  font-family: 'Monaco', 'Menlo', monospace;
  max-height: 150px;
  overflow-y: auto;
  white-space: pre-wrap;
}

.log-box:empty {
  display: none;
}
```

### `popup/popup.js` — отправка команд в content script

```javascript
// Ждём загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  // Получаем ссылки на элементы
  const versionSpan = document.getElementById("version");
  const getInfoBtn = document.getElementById("getInfoBtn");
  const countWordsBtn = document.getElementById("countWordsBtn");
  const highlightLinksBtn = document.getElementById("highlightLinksBtn");
  const addPanelBtn = document.getElementById("addPanelBtn");
  const changeBgBtn = document.getElementById("changeBgBtn");
  const removeImagesBtn = document.getElementById("removeImagesBtn");
  const pageInfoDiv = document.getElementById("pageInfo");
  const outputDiv = document.getElementById("output");

  // Получаем версию расширения из background
  chrome.runtime.sendMessage({ type: "GET_VERSION" }, (response) => {
    if (response) versionSpan.textContent = response.version;
  });

  // ============================================
  // ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ОТПРАВКИ КОМАНД
  // ============================================
  async function sendToActiveTab(message, successMessage = "✅ Готово") {
    try {
      // 1. Получаем активную вкладку
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 2. Проверяем, можно ли отправить сообщение на эту вкладку
      if (!tab.id || tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) {
        throw new Error("Нельзя взаимодействовать с этой страницей (системная страница)");
      }
      
      // 3. Отправляем сообщение в content script
      const response = await chrome.tabs.sendMessage(tab.id, message);
      
      // 4. Выводим результат
      if (response && response.success) {
        outputDiv.innerHTML = `✅ ${successMessage}`;
        return response;
      } else {
        throw new Error(response?.error || "Неизвестная ошибка");
      }
      
    } catch (error) {
      console.error("Ошибка:", error);
      outputDiv.innerHTML = `❌ Ошибка: ${error.message}`;
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // 1. ПОЛУЧИТЬ ИНФОРМАЦИЮ О СТРАНИЦЕ
  // ============================================
  getInfoBtn.addEventListener("click", async () => {
    outputDiv.innerHTML = "⏳ Запрос информации...";
    const result = await sendToActiveTab(
      { action: "GET_PAGE_INFO" },
      "Информация получена"
    );
    
    if (result.success && result.data) {
      const data = result.data;
      pageInfoDiv.innerHTML = `
        <strong>📄 ${escapeHtml(data.title)}</strong><br>
        🔗 Ссылок: ${data.linksCount}<br>
        🖼️ Изображений: ${data.imagesCount}<br>
        📝 Заголовков: ${data.headersCount}<br>
        📊 Текст: ${Math.round(data.textLength / 1024)} KB<br>
        💬 Слов: ${data.wordCount}
      `;
    } else if (!result.success) {
      pageInfoDiv.innerHTML = `❌ ${result.error || "Не удалось получить информацию"}`;
    }
  });

  // ============================================
  // 2. ПОДСЧИТАТЬ СЛОВА
  // ============================================
  countWordsBtn.addEventListener("click", async () => {
    const result = await sendToActiveTab(
      { action: "COUNT_WORDS" },
      "Слова подсчитаны"
    );
    
    if (result.success) {
      outputDiv.innerHTML = `📝 На странице ${result.wordCount.toLocaleString()} слов`;
    }
  });

  // ============================================
  // 3. ПОДСВЕТИТЬ ССЫЛКИ
  // ============================================
  highlightLinksBtn.addEventListener("click", async () => {
    const result = await sendToActiveTab(
      { action: "HIGHLIGHT_LINKS" },
      "Ссылки подсвечены"
    );
    
    if (result.success) {
      outputDiv.innerHTML = `✨ Подсвечено ${result.linksHighlighted} ссылок`;
    }
  });

  // ============================================
  // 4. ДОБАВИТЬ ПАНЕЛЬ
  // ============================================
  addPanelBtn.addEventListener("click", async () => {
    const result = await sendToActiveTab(
      { action: "ADD_PANEL" },
      "Панель добавлена"
    );
    
    if (result.success && !result.panelAdded) {
      outputDiv.innerHTML = "ℹ️ Панель уже существует на странице";
    }
  });

  // ============================================
  // 5. СМЕНИТЬ ФОН (СЛУЧАЙНЫЙ ЦВЕТ)
  // ============================================
  changeBgBtn.addEventListener("click", async () => {
    const colors = ["#FFE4E1", "#E0F7FA", "#FFF9C4", "#F3E5F5", "#E8F5E9", "#FFE0B2"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const result = await sendToActiveTab(
      { action: "CHANGE_BACKGROUND", color: randomColor },
      `Фон изменён на ${randomColor}`
    );
    
    if (result.success) {
      outputDiv.innerHTML = `🎨 Фон изменён на ${result.newColor}`;
    }
  });

  // ============================================
  // 6. УДАЛИТЬ ВСЕ ИЗОБРАЖЕНИЯ
  // ============================================
  removeImagesBtn.addEventListener("click", async () => {
    if (confirm("⚠️ Удалить все изображения на странице? Отменить будет нельзя!")) {
      const result = await sendToActiveTab(
        { action: "REMOVE_IMAGES" },
        "Изображения удалены"
      );
      
      if (result.success) {
        outputDiv.innerHTML = `🗑️ Удалено ${result.imagesRemoved} изображений`;
      }
    }
  });

  // ============================================
  // ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ЗАЩИТЫ ОТ XSS
  // ============================================
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
});
```

---

## 4. Обновляем background.js (добавляем логирование)

```javascript
// Фоновый сервис-воркер
console.log("🔧 Background service worker запущен");

// Инициализация при установке
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("✅ Расширение впервые установлено");
    chrome.storage.local.set({ 
      lesson: 2, 
      status: "active",
      installDate: new Date().toISOString()
    });
  } else if (details.reason === "update") {
    console.log("🔄 Расширение обновлено до версии", chrome.runtime.getManifest().version);
  }
});

// Центральный обработчик сообщений
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Определяем отправителя
  const senderType = sender.tab ? `вкладка ${sender.tab.id}` : "popup";
  console.log(`📨 Background получил [${message.type || message.action}] от ${senderType}`, message);

  // Обработка разных типов сообщений
  switch (message.type) {
    case "PING":
      sendResponse({ status: "pong", from: "background", timestamp: Date.now() });
      break;
      
    case "GET_VERSION":
      sendResponse({ version: chrome.runtime.getManifest().version });
      break;
      
    case "CONTENT_READY":
      console.log(`✅ Content script готов на ${message.url}`);
      sendResponse({ received: true, message: "Приветствие принято" });
      break;
      
    default:
      // Если тип не распознан, но action есть — возможно, от content script
      if (message.action) {
        console.log("⚠️ Сообщение с action (проксируем в content script?)");
        sendResponse({ error: "Background не обрабатывает это действие" });
      } else {
        sendResponse({ error: "Неизвестный тип сообщения" });
      }
  }
  
  return true; // Асинхронный ответ
});

// Логируем запуск
console.log("🎯 Background готов к работе!");
```

---

## 5. Тестирование урока 2

### Пошаговая инструкция

1. **Перезагрузите расширение**
   - Откройте `chrome://extensions`
   - Найдите ваше расширение
   - Нажмите кнопку обновления (⟳)

2. **Откройте любую обычную страницу**
   - Хорошо подходят: `wikipedia.org`, `github.com`, `bbc.com`
   - ❌ Не работают: `chrome://extensions`, `about:blank`

3. **Откройте popup расширения** (нажмите на иконку)

4. **Тестируйте кнопки по порядку**:
   - **"Получить информацию"** — должна появиться статистика страницы
   - **"Подсчитать слова"** — покажет количество слов
   - **"Подсветить ссылки"** — все ссылки станут жёлтыми
   - **"Добавить панель"** — появится плавающее окно (его можно перетаскивать)
   - **"Сменить фон"** — фон страницы изменит цвет
   - **"Удалить изображения"** — удалит все картинки (осторожно!)

5. **Проверьте консоли**:
   - **Консоль popup**: ПКМ по popup → "Просмотреть элемент"
   - **Консоль страницы**: F12 на странице
   - **Консоль background**: `chrome://extensions` → ваше расширение → "Просмотреть фон"

---

## 🧠 Ключевые концепции для понимания

### Архитектура обмена сообщениями

```
┌─────────┐                    ┌─────────────┐
│  Popup  │ ──(sendMessage)──▶ │ Background  │
└─────────┘                    │  (service   │
     │                         │   worker)   │
     │                         └─────────────┘
     │                                  │
     └──────────┐              ┌────────┘
                ▼              ▼
          ┌─────────────────────────┐
          │     Content Script      │
          │   (на веб-странице)     │
          └─────────────────────────┘
                   │
                   ▼
              ┌─────────┐
              │   DOM   │
              │ страницы │
              └─────────┘
```

### Поток данных при нажатии кнопки

1. **Пользователь** → клик по кнопке в popup
2. **Popup** → `chrome.tabs.sendMessage(tabId, { action: "..." })`
3. **Content script** → получает сообщение в `onMessage`, выполняет действие
4. **Content script** → `sendResponse({ success: true, data: ... })`
5. **Popup** → получает ответ, обновляет интерфейс

### Важные ограничения

| Ограничение | Почему? | Что делать? |
|-------------|---------|--------------|
| Не работает на `chrome://` страницах | Безопасность браузера | Проверять `tab.url` перед отправкой |
| Нет доступа к JS-переменным страницы | Изоляция | Использовать `window.postMessage()` если нужно |
| Content script перезагружается при навигации | Новая страница = новый экземпляр | Сохранять состояние в `storage` |
| Асинхронные ответы требуют `return true` | Иначе канал закрывается | Всегда возвращайте `true` если используете `sendResponse` асинхронно |

---

## 📝 Домашнее задание (закрепляем материал)

### Задание 1: Новая кнопка "Найти и подсветить слово"
Добавьте в popup:
- Поле ввода текста
- Кнопку "Найти и подсветить"
- Content script должен найти все вхождения слова на странице и подсветить их жёлтым фоном

```javascript
// Подсказка: используйте регулярные выражения и innerHTML
function highlightWord(word) {
  const regex = new RegExp(`(${word})`, 'gi');
  document.body.innerHTML = document.body.innerHTML.replace(regex, '<mark>$1</mark>');
}
```

### Задание 2: Сохранение настроек
- Добавьте в popup чекбокс "Автоматически подсвечивать ссылки"
- Сохраняйте настройку в `chrome.storage.local`
- При загрузке страницы проверяйте настройку и применяйте

### Задание 3: Тёмная тема
- Создайте кнопку "Включить тёмную тему"
- Content script должен добавить CSS, который делает страницу тёмной (инвертировать цвета или добавить overlay)

---

## 🐛 Отладка и решение проблем

### Проблема: "Could not establish connection. Receiving end does not exist."

**Причина:** Content script не загружен на странице (системная страница или ещё не инициализирован).

**Решение:**
```javascript
// Проверяем перед отправкой
const [tab] = await chrome.tabs.query({ active: true });
if (tab.url?.startsWith("http")) {
  // Только для обычных страниц
  await chrome.tabs.sendMessage(tab.id, message);
}
```

### Проблема: Content script не обновляется после изменений

**Решение:** 
1. Перезагрузите расширение в `chrome://extensions`
2. Обновите страницу (F5)
3. Проверьте, что `manifest.json` не содержит ошибок

### Проблема: Дублирование панели при повторном вызове

**Решение:** 
```javascript
// Всегда проверяем существование
if (!document.getElementById('my-panel')) {
  // создаём панель
}
```

---

## 🎯 Итоги урока

**Вы научились:**
- ✅ Создавать content scripts, которые внедряются на любые страницы
- ✅ Читать и модифицировать DOM (статистика, подсветка, удаление элементов)
- ✅ Добавлять свои элементы на страницу (плавающая панель с перетаскиванием)
- ✅ Организовывать двустороннюю коммуникацию popup ↔ content script
- ✅ Обрабатывать ошибки и ограничения
- ✅ Использовать async/await для работы с асинхронными API

**Готовый инструмент:** У вас есть расширение, которое может "общаться" с любой веб-страницей, читать её содержимое и изменять по вашему желанию.

---


