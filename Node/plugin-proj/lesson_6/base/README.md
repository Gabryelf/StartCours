# 🌙 Упрощённая версия расширения "Ночной режим"

## Быстрая сборка без сложных настроек

<div align="center">
  
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)

</div>

---



---

###  Создаём файлы

Создайте следующие файлы:

```
night-mode-simple/
├── manifest.json
├── popup.html
├── popup.js
├── popup.css
├── content.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

##  Манифест 

**Файл: `manifest.json`**

```json
{
  "manifest_version": 3,
  "name": "Ночной режим",
  "version": "1.0.0",
  "description": "Включает тёмную тему на любом сайте",
  
  "permissions": ["storage"],
  
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

## 🎨  Попап 

**Файл: `popup.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Ночной режим</title>
    <link rel="stylesheet" href="popup.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="icon">🌙</span>
            <h2>Ночной режим</h2>
        </div>
        
        <div class="toggle-wrapper">
            <label class="switch">
                <input type="checkbox" id="nightMode">
                <span class="slider"></span>
            </label>
            <span>Включить</span>
        </div>
        
        <div class="settings">
            <div class="setting">
                <label>🌑 Яркость</label>
                <input type="range" id="brightness" min="0.5" max="1" step="0.01" value="0.85">
                <span id="brightnessValue">85%</span>
            </div>
            
            <div class="setting">
                <label>📊 Контраст</label>
                <input type="range" id="contrast" min="0.8" max="1.2" step="0.01" value="1">
                <span id="contrastValue">100%</span>
            </div>
        </div>
        
        <button id="resetBtn" class="reset">Сбросить</button>
    </div>
    
    <script src="popup.js"></script>
</body>
</html>
```

---

## 🎨  Стили

**Файл: `popup.css`**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    width: 280px;
    font-family: system-ui, -apple-system, sans-serif;
    background: #1a1a2e;
    color: white;
    padding: 16px;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.header {
    text-align: center;
}

.icon {
    font-size: 32px;
}

h2 {
    font-size: 18px;
    margin-top: 4px;
}

.toggle-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255,255,255,0.1);
    padding: 12px;
    border-radius: 8px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.2s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #667eea;
}

input:checked + .slider:before {
    transform: translateX(20px);
}

.setting {
    margin-bottom: 12px;
}

.setting label {
    display: block;
    font-size: 12px;
    margin-bottom: 6px;
    color: #ccc;
}

.setting input {
    width: 100%;
    cursor: pointer;
}

.setting span {
    display: inline-block;
    margin-top: 4px;
    font-size: 11px;
    color: #667eea;
}

.reset {
    background: rgba(255,71,87,0.8);
    color: white;
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
}

.reset:hover {
    background: #ff4757;
}
```

---

## ⚙️ Логика попапа

**Файл: `popup.js`**

```javascript
// Получаем элементы
const toggle = document.getElementById('nightMode');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const resetBtn = document.getElementById('resetBtn');

// Загружаем настройки
async function loadSettings() {
    const data = await chrome.storage.local.get(['enabled', 'brightness', 'contrast']);
    toggle.checked = data.enabled || false;
    brightnessSlider.value = data.brightness || 0.85;
    contrastSlider.value = data.contrast || 1;
    updateDisplay();
}

// Обновляем отображение
function updateDisplay() {
    brightnessValue.textContent = Math.round(brightnessSlider.value * 100) + '%';
    contrastValue.textContent = Math.round(contrastSlider.value * 100) + '%';
}

// Применяем настройки
async function apply() {
    const settings = {
        enabled: toggle.checked,
        brightness: parseFloat(brightnessSlider.value),
        contrast: parseFloat(contrastSlider.value)
    };
    
    await chrome.storage.local.set(settings);
    
    // Отправляем на страницу
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && !tab.url.startsWith('chrome://')) {
        try {
            await chrome.tabs.sendMessage(tab.id, { type: 'APPLY', settings });
        } catch(e) {
            console.log('Обновите страницу');
        }
    }
}

// Сброс
async function reset() {
    toggle.checked = false;
    brightnessSlider.value = 0.85;
    contrastSlider.value = 1;
    updateDisplay();
    await apply();
}

// Слушатели событий
toggle.addEventListener('change', apply);
brightnessSlider.addEventListener('input', () => {
    updateDisplay();
    apply();
});
contrastSlider.addEventListener('input', () => {
    updateDisplay();
    apply();
});
resetBtn.addEventListener('click', reset);

// Запуск
loadSettings();
```

---

## 🌐 Скрипт для страниц 

**Файл: `content.js`**

```javascript
let styleElement = null;

// Применяем тему
function applyTheme(settings) {
    if (!settings.enabled) {
        if (styleElement) styleElement.remove();
        styleElement = null;
        return;
    }
    
    if (!styleElement) {
        styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
        html {
            filter: brightness(${settings.brightness}) contrast(${settings.contrast});
            transition: filter 0.2s;
        }
    `;
}

// Слушаем сообщения
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'APPLY') {
        applyTheme(request.settings);
        sendResponse({ success: true });
    }
    return true;
});

// Загружаем сохранённые настройки
async function load() {
    const data = await chrome.storage.local.get(['enabled', 'brightness', 'contrast']);
    if (data.enabled) {
        applyTheme({
            enabled: true,
            brightness: data.brightness || 0.85,
            contrast: data.contrast || 1
        });
    }
}

load();
```

---

## 🖼️ Шаг 6: Иконки 

**Создайте файлы вручную:** 

**Рекомендация:** Скачайте готовые иконки с [icons8.com](https://icons8.com/icons/set/moon) (бесплатно)

---

## ✅ Шаг 7: Загрузка в Chrome

1. **Откройте** `chrome://extensions/`

2. **Включите** "Режим разработчика"

3. **Нажмите** "Загрузить распакованное расширение"

4. **Выберите** папку `night-mode-simple`

5. **Готово!** 

---

## 🚀 Итоговый код всего проекта

### `manifest.json`
```json
{
  "manifest_version": 3,
  "name": "Ночной режим",
  "version": "1.0",
  "permissions": ["storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

### `popup.html`
```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><link rel="stylesheet" href="popup.css"></head>
<body>
<div class="container">
  <h2>🌙 Ночной режим</h2>
  <label class="switch">
    <input type="checkbox" id="toggle">
    <span class="slider"></span>
  </label>
  <div>
    <label>Яркость</label>
    <input type="range" id="brightness" min="0.5" max="1" step="0.01" value="0.85">
    <span id="brightnessVal">85%</span>
  </div>
  <div>
    <label>Контраст</label>
    <input type="range" id="contrast" min="0.8" max="1.2" step="0.01" value="1">
    <span id="contrastVal">100%</span>
  </div>
  <button id="reset">Сбросить</button>
</div>
<script src="popup.js"></script>
</body>
</html>
```

### `popup.css`
```css
body {
  width: 260px;
  font-family: system-ui;
  background: #1a1a2e;
  color: white;
  padding: 16px;
}
.container { display: flex; flex-direction: column; gap: 12px; }
h2 { margin: 0; text-align: center; font-size: 18px; }
.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc; transition: 0.2s; border-radius: 24px;
}
.slider:before {
  position: absolute; content: ""; height: 18px; width: 18px;
  left: 3px; bottom: 3px; background-color: white; transition: 0.2s; border-radius: 50%;
}
input:checked + .slider { background-color: #667eea; }
input:checked + .slider:before { transform: translateX(20px); }
input, button { width: 100%; }
button {
  background: #ff4757; color: white; border: none;
  padding: 8px; border-radius: 6px; cursor: pointer;
}
span { display: inline-block; margin-top: 4px; font-size: 12px; color: #667eea; }
```

### `popup.js`
```javascript
const toggle = document.getElementById('toggle');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const brightnessVal = document.getElementById('brightnessVal');
const contrastVal = document.getElementById('contrastVal');
const reset = document.getElementById('reset');

function updateDisplay() {
  brightnessVal.textContent = Math.round(brightness.value * 100) + '%';
  contrastVal.textContent = Math.round(contrast.value * 100) + '%';
}

async function apply() {
  const settings = {
    enabled: toggle.checked,
    brightness: parseFloat(brightness.value),
    contrast: parseFloat(contrast.value)
  };
  await chrome.storage.local.set(settings);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && !tab.url.startsWith('chrome://')) {
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'APPLY', settings });
    } catch(e) {}
  }
}

async function load() {
  const data = await chrome.storage.local.get(['enabled', 'brightness', 'contrast']);
  toggle.checked = data.enabled || false;
  brightness.value = data.brightness || 0.85;
  contrast.value = data.contrast || 1;
  updateDisplay();
}

async function resetSettings() {
  toggle.checked = false;
  brightness.value = 0.85;
  contrast.value = 1;
  updateDisplay();
  await apply();
}

toggle.addEventListener('change', apply);
brightness.addEventListener('input', () => { updateDisplay(); apply(); });
contrast.addEventListener('input', () => { updateDisplay(); apply(); });
reset.addEventListener('click', resetSettings);
load();
```

### `content.js`
```javascript
let style = null;

chrome.runtime.onMessage.addListener((req, sender, send) => {
  if (req.type === 'APPLY') apply(req.settings);
  send({ success: true });
  return true;
});

function apply(settings) {
  if (!settings.enabled) {
    if (style) style.remove();
    style = null;
    return;
  }
  if (!style) {
    style = document.createElement('style');
    document.head.appendChild(style);
  }
  style.textContent = `html { filter: brightness(${settings.brightness}) contrast(${settings.contrast}); transition: filter 0.2s; }`;
}

async function load() {
  const data = await chrome.storage.local.get(['enabled', 'brightness', 'contrast']);
  if (data.enabled) apply({ enabled: true, brightness: data.brightness || 0.85, contrast: data.contrast || 1 });
}
load();
```

---

## ✅ Проверка работоспособности

1. **Создайте все файлы** в одной папке
2. **Добавьте иконки** в папку `icons/` (можно любые PNG)
3. **Загрузите** в Chrome через `chrome://extensions/`
4. **Откройте любую страницу** и нажмите на иконку

---

## 🎯 Итог

**Упрощённая версия даёт:**

✅ **Меньше файлов** — всего 6 файлов  
✅ **Без сборки** — работает сразу  
✅ **Сохранение настроек** — через chrome.storage  
✅ **Базовые настройки** — яркость и контраст  
✅ **Простой код** — легко разобраться  

**Чего нет:**
- ❌ Сепия (можно добавить, если нужно)
- ❌ Webpack (не нужен)
- ❌ Сложная структура папок

---

