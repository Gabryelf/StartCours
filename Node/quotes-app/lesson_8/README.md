
---

# Stage 1: Создаём базовое расширение для браузера (Manifest V3)

Этот урок — фундамент для всех следующих. Мы создадим **рабочее расширение-заготовку**, которое можно будет расширять: добавлять парсинг страниц, работу с API, изменение DOM и другие фичи.

## Что мы сделаем
- Расширение с всплывающим окном (popup)
- Фоновый сервис-воркер (background service worker)
- Обмен сообщениями между popup и фоном
- Использование `storage` для сохранения данных
- Совместимость с Chrome, Edge и Firefox

---

## 📁 Итоговая структура проекта

```
my-extension/
├── manifest.json          # Манифест — главный файл расширения
├── background.js          # Фоновый сервис-воркер
├── popup/
│   ├── popup.html         # Интерфейс всплывающего окна
│   ├── popup.js           # Логика popup
│   └── popup.css          # Стили для popup
└── icons/                 # Иконки (16, 48, 128 пикселей)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 1. Манифест (`manifest.json`) — точка входа расширения

Этот файл говорит браузеру, что за расширение, какие у него права, и где искать его части.

```json
{
  "manifest_version": 3,
  "name": "Учебное расширение",
  "version": "1.0.0",
  "description": "Базовый шаблон для уроков по расширениям",
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["<all_urls>"],
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Открыть панель",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### Построчное объяснение

| Поле | Что означает |
|------|----------------|
| `"manifest_version": 3` | Используем третью версию манифеста (современная, обязательная для новых расширений) |
| `"name"`, `"version"`, `"description"` | Метаданные расширения |
| `"permissions"` | Права, которые запрашивает расширение. `storage` — доступ к локальному хранилищу, `activeTab` — временный доступ к текущей вкладке |
| `"host_permissions"` | На каких сайтах расширение может работать. `"<all_urls>"` — на всех (для учебных целей) |
| `"action"` | Настройки иконки на панели инструментов. `default_popup` указывает HTML-файл всплывающего окна |
| `"background"` | Фоновый сервис-воркер — скрипт, который живёт постоянно (даже когда popup закрыт) |
| `"icons"` | Иконки для менеджера расширений и магазина |

---

## 2. Фоновый скрипт (`background.js`)

Сервис-воркер работает в фоне, не имеет доступа к DOM, но может общаться с другими частями расширения.

```javascript
// Фоновый сервис-воркер запускается при старте браузера или активации расширения
console.log("Background service worker запущен");

// Событие установки/обновления расширения
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Расширение впервые установлено");
    // Сохраняем начальные данные в хранилище
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

  return true; // Указывает, что ответ придёт асинхронно
});
```

### Разбор важных моментов

- **`chrome.runtime.onInstalled`** — срабатывает при первой установке или обновлении. Хорошее место для инициализации.
- **`chrome.storage.local.set`** — сохраняет данные в локальное хранилище расширения (данные не стираются при перезагрузке).
- **`chrome.runtime.onMessage`** — слушает входящие сообщения от popup, контент-скриптов или других частей.
- **`return true`** — обязательно, если вы вызываете `sendResponse` асинхронно (через `setTimeout`, Promise и т.д.).

---

## 3. Popup — интерфейс расширения

### `popup/popup.html` — разметка

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <h1>📦 Учебное расширение</h1>
    <p>Версия: <span id="version">--</span></p>
    <button id="pingBtn">Проверить фон</button>
    <button id="injectBtn">(урок 2) Инжект скрипта</button>
    <div id="output"></div>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

- `id="version"`, `id="pingBtn"`, `id="output"` — нужны для доступа из JS.
- Вторая кнопка — заготовка для следующего урока.

### `popup/popup.css` — базовые стили

```css
body {
  width: 300px;
  font-family: system-ui, sans-serif;
  padding: 12px;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
button {
  padding: 8px;
  cursor: pointer;
}
#output {
  margin-top: 12px;
  font-size: 0.9em;
  border-top: 1px solid #ccc;
  padding-top: 8px;
}
```

### `popup/popup.js` — логика окна

```javascript
// Ждём полной загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  const versionSpan = document.getElementById("version");
  const pingBtn = document.getElementById("pingBtn");
  const outputDiv = document.getElementById("output");

  // Запрашиваем версию у фонового скрипта
  chrome.runtime.sendMessage({ type: "GET_VERSION" }, (response) => {
    if (response) {
      versionSpan.textContent = response.version;
    }
  });

  // Отправляем PING при клике на кнопку
  pingBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "PING" }, (response) => {
      outputDiv.innerHTML = `Ответ от фона: ${JSON.stringify(response)}`;
    });
  });
});
```

### Как работает обмен сообщениями

1. Popup отправляет сообщение через `chrome.runtime.sendMessage`
2. Фоновый скрипт принимает его в `onMessage.addListener`
3. Фон отправляет ответ через `sendResponse`
4. Popup получает ответ в колбэке второго аргумента `sendMessage`

---

## 4. Иконки

Создайте три PNG-изображения размером **16×16**, **48×48** и **128×128** пикселей.  
Для первого урока подойдут даже простые цветные квадраты — главное, чтобы они были в папке `icons/` с правильными именами.

**Быстрый способ (для разработки):**  
Нарисуйте в любом графическом редакторе или используйте онлайн-генератор иконок.

---

## 🧪 Тестирование расширения

### Chrome / Edge
1. Откройте `chrome://extensions`
2. Включите **«Режим разработчика»** (переключатель в правом верхнем углу)
3. Нажмите **«Загрузить распакованное расширение»**
4. Выберите папку `my-extension`
5. Иконка появится на панели расширений (рядом с адресной строкой)

### Firefox
1. Откройте `about:debugging`
2. Выберите **«Этот Firefox»**
3. Нажмите **«Загрузить временное дополнение»**
4. Выберите файл `manifest.json` из вашей папки

---

## 🔍 Что проверить после установки

1. **Открыть popup** — должно появиться окно с версией и кнопкой.
2. **Нажать «Проверить фон»** — в окне появится ответ `{"status":"pong","from":"background"}`.
3. **Открыть консоль фона**:
   - Chrome: `chrome://extensions` → ваше расширение → «Просмотреть фон» (service worker)
   - Firefox: `about:debugging` → ваше расширение → «Инспектировать»
   - Там должно быть сообщение `Background service worker запущен`

---

## 🧠 Домашнее задание (для закрепления)

1. **Добавить поле ввода и кнопку «Сохранить»**  
   — Пользователь вводит текст → сохраняете в `chrome.storage.local`  
   — При открытии popup — загружаете сохранённый текст и показываете

2. **Показать информацию о текущей вкладке**  
   — Добавьте кнопку «Инфо о вкладке»  
   — Используйте `chrome.tabs.query({ active: true, currentWindow: true })`  
   — Выведите заголовок и URL в `#output`

---

## ⏭️ Что дальше? (мост к уроку 2)

В следующем уроке мы добавим **контент-скрипт (`content.js`)**. Он сможет:
- Читать и изменять DOM любой страницы
- Слушать клики и события на сайте
- Общаться с фоном и popup

Подготовка: обратите внимание на кнопку `#injectBtn` в popup — она как раз будет запускать внедрение скрипта на страницу.

---

## ❓ Частые вопросы

**Q: Почему не используется jQuery или другие библиотеки?**  
A: Современный JavaScript (ES6+) позволяет обходиться без них, уменьшая размер расширения.

**Q: Можно ли использовать `localStorage` вместо `chrome.storage`?**  
A: `localStorage` в service worker недоступен, к тому же `chrome.storage` синхронизируется между вкладками и не стирается при очистке кэша.

**Q: Почему `return true` в `onMessage`?**  
A: Это сигнал браузеру, что `sendResponse` вызовется асинхронно. Иначе канал закроется сразу после выполнения listener.

**Q: Как отлаживать popup?**  
A: Кликните правой кнопкой по popup → «Просмотреть элемент» — откроется DevTools именно для popup.

---

## 🎯 Результат урока

Вы имеете **полностью рабочее расширение-шаблон**, которое:
- Устанавливается в браузер
- Имеет UI в виде popup
- Взаимодействует с фоновым скриптом
- Сохраняет данные в хранилище

Этот каркас будет использоваться во всех следующих уроках. 🚀

---

Этот `README.md` можно положить в корень проекта. Ученики получат **полную инструкцию**: от создания файлов до отладки. Все объяснения даны в формате «строка → что она делает», а в конце есть задание и ответы на частые вопросы.

Если хотите, я сразу напишу **план второго урока с контент-скриптом** и `content.js`, который будет менять фон страницы или собирать данные.
