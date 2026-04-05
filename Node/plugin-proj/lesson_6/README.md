# 🌙 Создаём браузерное расширение "Ночной режим"

## Пошаговое руководство по разработке расширения для Chrome

<div align="center">
  
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Webpack](https://img.shields.io/badge/Webpack-5.x-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)
![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Результат:** Готовое расширение для Chrome с настройками яркости, контрастности и сепии

</div>

---

## 🚀 Что мы создадим

### Функциональность расширения:

| Функция | Описание |
|---------|----------|
| 🌙 **Включение/выключение** | Один переключатель активирует ночной режим |
| 💡 **Регулировка яркости** | Ползунок от 50% до 100% |
| 🎨 **Регулировка контрастности** | Ползунок от 80% до 120% |
| 📜 **Эффект сепии** | Ползунок для тёплого оттенка |
| 💾 **Сохранение настроек** | Настройки запоминаются между сессиями |
| 🔄 **Сброс по умолчанию** | Кнопка возврата к стандартным настройкам |

### Технологии, которые мы используем:

```
┌─────────────────────────────────────────────────────────┐
│                    Браузерное расширение                │
├─────────────────────────────────────────────────────────┤
│  manifest.json      ← Конфигурация (версия, права)     │
│  popup.html/css/js  ← Интерфейс (всплывающее окно)     │
│  content.js         ← Скрипт, внедряемый на страницы   │
│  storage API        ← Хранение настроек пользователя   │
│  messaging API      ← Обмен сообщениями между частями  │
└─────────────────────────────────────────────────────────┘
                              ↓
                    Webpack (сборка проекта)
                              ↓
┌─────────────────────────────────────────────────────────┐
│                   dist/ (готовое расширение)            │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Подготовка окружения

### Создание папки проекта

```bash
# Создаём папку проекта
mkdir night-mode-extension
cd night-mode-extension

# Создаём структуру папок
mkdir -p src/icons src/popup src/content
```

**Объяснение структуры:**
```
night-mode-extension/
├── src/                    # Исходный код (разрабатываем здесь)
│   ├── icons/              # Иконки расширения
│   ├── popup/              # Всплывающее окно (HTML, JS, CSS)
│   └── content/            # Скрипт для страниц
├── dist/                   # Сборка (создастся автоматически)
└── package.json            # Конфигурация проекта
```

### Инициализация npm проекта

```bash
npm init -y
```

**Что произошло?**  
Создался файл `package.json` — это "паспорт" нашего проекта, где будут храниться все зависимости.

### Установка зависимостей

```bash
npm install --save-dev webpack webpack-cli copy-webpack-plugin css-loader style-loader
```

**Что мы установили:**

| Пакет | Назначение |
|-------|------------|
| `webpack` | Сборщик — объединяет все файлы в один |
| `webpack-cli` | Интерфейс командной строки для Webpack |
| `copy-webpack-plugin` | Копирует статические файлы (иконки, HTML) |
| `css-loader` | Позволяет импортировать CSS в JavaScript |
| `style-loader` | Вставляет CSS на страницу |

### Добавление скриптов в package.json

Откройте `package.json` и обновите секцию `scripts`:

```json
{
  "scripts": {
    "build": "webpack",
    "watch": "webpack --watch"
  }
}
```

**Теперь можно запускать:**
- `npm run build` — собрать расширение
- `npm run watch` — автоматически пересобирать при изменениях

---

## 📁 Создание структуры проекта

### Конечная структура после всех шагов:

```
night-mode-extension/
├── src/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── content/
│       └── content.js
├── dist/                      (создаётся при сборке)
├── webpack.config.js          (создадим позже)
├── package.json
└── node_modules/              (устанавливается автоматически)
```

---

## 📄 Шаг 1: Манифест расширения

### Что такое manifest.json?

Это самый важный файл расширения. Он описывает:
- **Кто** — название, версия, описание
- **Что может** — права доступа (permissions)
- **Из чего состоит** — какие файлы входят в расширение

### Создаём файл `src/manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Ночной режим",
  "version": "1.0.0",
  "description": "Включает тёмную тему на любом сайте одним кликом",
  
  "permissions": [
    "storage",
    "activeTab"
  ],
  
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Ночной режим",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/content.js"],
      "run_at": "document_end"
    }
  ],
  
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### 📖 Пояснение полей:

| Поле | Значение | Объяснение |
|------|----------|------------|
| `manifest_version` | 3 | Современная версия манифеста (не 2!) |
| `name` | "Ночной режим" | Имя, которое увидят пользователи |
| `version` | "1.0.0" | Семантическое версионирование |
| `permissions` | `["storage", "activeTab"]` | Права: хранилище + активная вкладка |
| `action.default_popup` | `"popup/popup.html"` | Какой HTML показывать при клике |
| `content_scripts` | `[{...}]` | Скрипты, внедряемые на страницы |
| `content_scripts.matches` | `["<all_urls>"]` | На всех сайтах |
| `content_scripts.run_at` | `"document_end"` | После загрузки DOM |

---

## 🖼️ Шаг 2: Иконки расширения

### Создаём простые иконки

Если у вас нет готовых иконок, можно создать их онлайн:

**Вариант 1: Использовать эмодзи** (временно, для тестирования)
```bash
# Создаём пустые файлы (потом заменим)
cd src/icons
touch icon16.png icon48.png icon128.png
```

**Вариант 2: Скачать готовые иконки**
1. Перейдите на [icons8.com](https://icons8.com/icons/set/moon)
2. Найдите иконку луны 🌙
3. Скачайте в размерах 16×16, 48×48, 128×128
4. Поместите в папку `src/icons/`

**Вариант 3: Создать в Figma/Canva**
- Создайте простую иконку с луной
- Экспортируйте в трёх размерах

### Требования к иконкам:
- Формат: PNG
- Прозрачный фон
- Размеры: 16px, 48px, 128px

---

## 🎨 Шаг 3: Интерфейс попапа

### Что такое попап?

Это окно, которое появляется при клике на иконку расширения. Оно позволяет пользователю взаимодействовать с расширением.

### Создаём `src/popup/popup.html`

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ночной режим</title>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">🌙</div>
            <h2>Ночной режим</h2>
        </div>
        
        <div class="toggle-container">
            <label class="switch">
                <input type="checkbox" id="nightModeToggle">
                <span class="slider round"></span>
            </label>
            <span class="toggle-label">Включить ночной режим</span>
        </div>
        
        <div class="info">
            <p>💡 Ночной режим уменьшает нагрузку на глаза</p>
            <p>🎨 Цвета можно настроить ниже</p>
        </div>
        
        <div class="settings">
            <h3>Настройки</h3>
            
            <div class="setting-item">
                <label for="brightness">Яркость</label>
                <input type="range" id="brightness" min="0.5" max="1" step="0.01" value="0.85">
                <span id="brightnessValue">85%</span>
            </div>
            
            <div class="setting-item">
                <label for="contrast">Контрастность</label>
                <input type="range" id="contrast" min="0.8" max="1.2" step="0.01" value="1">
                <span id="contrastValue">100%</span>
            </div>
            
            <div class="setting-item">
                <label for="sepia">Сепия</label>
                <input type="range" id="sepia" min="0" max="1" step="0.01" value="0.2">
                <span id="sepiaValue">20%</span>
            </div>
        </div>
        
        <div class="status" id="status" style="display: none;">
            <span class="status-text">Применяем настройки...</span>
        </div>
        
        <div class="footer">
            <button id="resetBtn" class="reset-btn">Сбросить настройки</button>
        </div>
    </div>
    
    <script src="popup.js"></script>
</body>
</html>
```

### 📖 Структура попапа:

| Элемент | ID | Назначение |
|---------|-----|------------|
| `#nightModeToggle` | toggle | Включение/выключение режима |
| `#brightness` | slider | Регулировка яркости |
| `#contrast` | slider | Регулировка контрастности |
| `#sepia` | slider | Регулировка сепии |
| `#resetBtn` | button | Сброс всех настроек |
| `#status` | div | Показ статуса операций |

---

## 🎨 Шаг 4: Стилизация попапа

### Создаём `src/popup/popup.css`

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    width: 320px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #fff;
}

.container {
    padding: 20px;
}

/* ===== Шапка ===== */
.header {
    text-align: center;
    margin-bottom: 20px;
}

.header .icon {
    font-size: 48px;
    margin-bottom: 8px;
}

.header h2 {
    font-size: 20px;
    font-weight: 500;
}

/* ===== Переключатель (toggle switch) ===== */
.toggle-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 20px;
}

.toggle-label {
    font-size: 14px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 52px;
    height: 28px;
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
    transition: 0.3s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #667eea;
}

input:checked + .slider:before {
    transform: translateX(24px);
}

/* ===== Информационная панель ===== */
.info {
    background: rgba(102, 126, 234, 0.2);
    padding: 12px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 12px;
    line-height: 1.5;
}

.info p {
    margin: 5px 0;
}

/* ===== Настройки ===== */
.settings {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 15px;
}

.settings h3 {
    font-size: 14px;
    margin-bottom: 12px;
    color: #667eea;
}

.setting-item {
    margin-bottom: 12px;
}

.setting-item label {
    display: block;
    font-size: 12px;
    margin-bottom: 6px;
    color: #ccc;
}

.setting-item input {
    width: 100%;
    cursor: pointer;
}

.setting-item span {
    display: inline-block;
    margin-top: 4px;
    font-size: 11px;
    color: #667eea;
}

/* ===== Статус ===== */
.status {
    background: rgba(102, 126, 234, 0.3);
    padding: 8px;
    border-radius: 8px;
    text-align: center;
    font-size: 12px;
    margin-bottom: 12px;
}

/* ===== Кнопка сброса ===== */
.reset-btn {
    width: 100%;
    padding: 10px;
    background: rgba(255, 71, 87, 0.8);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.reset-btn:hover {
    background: #ff4757;
    transform: translateY(-1px);
}
```

---

## ⚙️ Шаг 5: Логика попапа

### Создаём `src/popup/popup.js`

```javascript
// ===== Получаем ссылки на элементы =====
const nightModeToggle = document.getElementById('nightModeToggle');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const sepiaSlider = document.getElementById('sepia');
const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const sepiaValue = document.getElementById('sepiaValue');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');

// ===== Вспомогательные функции =====
function updateValueDisplays() {
    brightnessValue.textContent = Math.round(brightnessSlider.value * 100) + '%';
    contrastValue.textContent = Math.round(contrastSlider.value * 100) + '%';
    sepiaValue.textContent = Math.round(sepiaSlider.value * 100) + '%';
}

function showStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.style.display = 'block';
    statusEl.style.background = isError 
        ? 'rgba(255, 71, 87, 0.3)' 
        : 'rgba(102, 126, 234, 0.3)';
    statusEl.querySelector('.status-text').textContent = message;
    
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 2000);
}

// ===== Загрузка сохранённых настроек =====
async function loadSettings() {
    const result = await chrome.storage.local.get([
        'nightModeEnabled',
        'brightness',
        'contrast',
        'sepia'
    ]);
    
    nightModeToggle.checked = result.nightModeEnabled || false;
    brightnessSlider.value = result.brightness || 0.85;
    contrastSlider.value = result.contrast || 1;
    sepiaSlider.value = result.sepia || 0.2;
    
    updateValueDisplays();
}

// ===== Отправка сообщения на страницу =====
async function sendMessageToTab(settings) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Проверяем, что вкладка существует
        if (!tab || !tab.id) {
            console.log('Не удалось получить вкладку');
            return false;
        }
        
        // Проверяем, что это не системная страница Chrome
        if (tab.url && (tab.url.startsWith('chrome://') || 
                        tab.url.startsWith('edge://') ||
                        tab.url.startsWith('about:'))) {
            showStatus('❌ Нельзя применить на этой странице', true);
            return false;
        }
        
        // Отправляем сообщение
        await chrome.tabs.sendMessage(tab.id, {
            type: 'APPLY_THEME',
            settings: settings
        });
        
        showStatus('✓ Настройки применены');
        return true;
        
    } catch (error) {
        console.log('Ошибка отправки:', error.message);
        showStatus('🔄 Обновите страницу для применения', true);
        return false;
    }
}

// ===== Сохранение и применение настроек =====
async function saveAndApply() {
    const settings = {
        nightModeEnabled: nightModeToggle.checked,
        brightness: parseFloat(brightnessSlider.value),
        contrast: parseFloat(contrastSlider.value),
        sepia: parseFloat(sepiaSlider.value)
    };
    
    // Сохраняем в хранилище
    await chrome.storage.local.set(settings);
    
    // Отправляем на активную вкладку
    await sendMessageToTab(settings);
}

// ===== Сброс настроек =====
async function resetSettings() {
    const defaultSettings = {
        nightModeEnabled: false,
        brightness: 0.85,
        contrast: 1,
        sepia: 0.2
    };
    
    // Обновляем интерфейс
    nightModeToggle.checked = defaultSettings.nightModeEnabled;
    brightnessSlider.value = defaultSettings.brightness;
    contrastSlider.value = defaultSettings.contrast;
    sepiaSlider.value = defaultSettings.sepia;
    
    updateValueDisplays();
    
    // Сохраняем и применяем
    await chrome.storage.local.set(defaultSettings);
    await sendMessageToTab(defaultSettings);
}

// ===== Навешиваем обработчики =====
nightModeToggle.addEventListener('change', saveAndApply);
brightnessSlider.addEventListener('input', () => {
    updateValueDisplays();
    saveAndApply();
});
contrastSlider.addEventListener('input', () => {
    updateValueDisplays();
    saveAndApply();
});
sepiaSlider.addEventListener('input', () => {
    updateValueDisplays();
    saveAndApply();
});
resetBtn.addEventListener('click', resetSettings);

// ===== Запуск =====
loadSettings();
```

### 📖 Ключевые API расширений:

| API | Назначение |
|-----|------------|
| `chrome.storage.local.get()` | Загрузка данных из хранилища |
| `chrome.storage.local.set()` | Сохранение данных |
| `chrome.tabs.query()` | Поиск активной вкладки |
| `chrome.tabs.sendMessage()` | Отправка сообщения на страницу |

---

## 🌐 Шаг 6: Скрипт для страниц

### Создаём `src/content/content.js`

Этот скрипт внедряется на каждую страницу и применяет CSS фильтры.

```javascript
// ===== Проверка, можно ли работать на этой странице =====
function isAllowedPage() {
    const url = window.location.href;
    if (url.startsWith('chrome://') || 
        url.startsWith('chrome-extension://') ||
        url.startsWith('edge://') ||
        url.startsWith('about:') ||
        url.startsWith('data:')) {
        return false;
    }
    return true;
}

// Если страница не подходит — выходим
if (!isAllowedPage()) {
    console.log('Ночной режим: страница не поддерживается');
    // Не выполняем код на системных страницах
} else {
    // ===== Основной код =====
    let styleElement = null;
    
    // Слушаем сообщения от попапа
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'APPLY_THEME') {
            applyTheme(request.settings);
            sendResponse({ success: true });
        }
        return true; // Важно для асинхронного ответа
    });
    
    // Применяем тему к странице
    function applyTheme(settings) {
        if (!settings.nightModeEnabled) {
            removeTheme();
            return;
        }
        
        const filters = `
            brightness(${settings.brightness})
            contrast(${settings.contrast})
            sepia(${settings.sepia})
        `;
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            html {
                filter: ${filters};
                transition: filter 0.3s ease;
            }
            
            img, video, iframe {
                filter: brightness(0.9) contrast(1.1);
            }
        `;
        
        document.documentElement.setAttribute('data-night-mode', 'true');
    }
    
    // Удаляем тему
    function removeTheme() {
        if (styleElement) {
            styleElement.remove();
            styleElement = null;
            document.documentElement.removeAttribute('data-night-mode');
        }
    }
    
    // Загружаем сохранённые настройки
    async function loadInitialTheme() {
        try {
            const result = await chrome.storage.local.get([
                'nightModeEnabled',
                'brightness',
                'contrast',
                'sepia'
            ]);
            
            if (result.nightModeEnabled) {
                applyTheme({
                    nightModeEnabled: true,
                    brightness: result.brightness || 0.85,
                    contrast: result.contrast || 1,
                    sepia: result.sepia || 0.2
                });
            }
            
            console.log('Ночной режим: content.js загружен');
        } catch (error) {
            console.error('Ошибка при загрузке темы:', error);
        }
    }
    
    // Запускаем загрузку темы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadInitialTheme);
    } else {
        loadInitialTheme();
    }
}
```

### 📖 Как это работает:

1. **CSS фильтры** — применяем к `html` элементу:
   - `brightness()` — уменьшаем яркость
   - `contrast()` — настраиваем контраст
   - `sepia()` — добавляем тёплый оттенок

2. **Исключения** — для изображений и видео применяем отдельные фильтры

3. **Плавность** — добавляем `transition` для плавного переключения

---

## ⚙️ Шаг 7: Настройка Webpack

### Создаём `webpack.config.js`

```javascript
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    // Точки входа для разных частей расширения
    entry: {
        popup: './src/popup/popup.js',
        content: './src/content/content.js'
    },
    
    // Выходные файлы
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/[name].js',
        clean: true  // Очищает dist перед сборкой
    },
    
    // Режим разработки
    mode: 'development',
    
    // Отключаем eval (важно для расширений Chrome!)
    devtool: false,
    
    // Правила обработки файлов
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    
    // Плагины
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/popup/popup.html', to: 'popup/popup.html' },
                { from: 'src/icons', to: 'icons' }
            ]
        })
    ]
};
```

### 📖 Что делает Webpack:

| Компонент | Назначение |
|-----------|------------|
| `entry` | Указывает, с каких файлов начинать сборку |
| `output` | Куда и как сохранять результат |
| `module.rules` | Как обрабатывать разные типы файлов |
| `CopyPlugin` | Копирует статические файлы (HTML, иконки) |
| `devtool: false` | Отключает eval (безопасность расширений) |

---

## 🚀 Шаг 8: Сборка и тестирование

### Шаг 8.1: Сборка проекта

```bash
# Удаляем старую сборку (если есть)
rm -rf dist

# Собираем проект
npm run build
```

**Ожидаемый результат:**
```
> webpack

asset content/content.js ... [создан]
asset popup/popup.js ... [создан]
asset manifest.json ... [скопирован]
asset popup/popup.html ... [скопирован]
asset icons/icon16.png ... [скопирован]
```

### Шаг 8.2: Проверка структуры `dist`

После сборки папка `dist` должна выглядеть так:

```
dist/
├── manifest.json
├── popup/
│   ├── popup.html
│   └── popup.js
├── content/
│   └── content.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Шаг 8.3: Загрузка расширения в Chrome

1. **Откройте страницу расширений:**
   ```
   chrome://extensions/
   ```

2. **Включите "Режим разработчика"** (в правом верхнем углу)

3. **Нажмите "Загрузить распакованное расширение"**

4. **Выберите папку `dist`** вашего проекта

5. **Убедитесь, что расширение появилось в списке**

### Шаг 8.4: Проверка работы

1. **Откройте любую обычную страницу** (например, google.com)

2. **Нажмите на иконку расширения** (луна 🌙) в панели инструментов

3. **Включите переключатель "Ночной режим"**

4. **Страница должна изменить цвета!**

5. **Поэкспериментируйте с ползунками** — яркость, контрастность, сепия

6. **Закройте попап и перезагрузите страницу** — настройки должны сохраниться

---

## 🐛 Шаг 9: Решение типичных проблем

### Проблема 1: "Could not establish connection"

**Ошибка:**
```
Uncaught (in promise) Error: Could not establish connection. 
Receiving end does not exist.
```

**Причина:** Попап пытается отправить сообщение, но content.js ещё не загружен на странице.

**Решение:** Уже реализовано в нашем коде — используем `try/catch` и показываем сообщение пользователю.

### Проблема 2: Расширение не видит иконки

**Ошибка:** Иконка не отображается или показывает "broken image"

**Решение:**
1. Проверьте, что файлы иконок существуют в `src/icons/`
2. Проверьте пути в `manifest.json`
3. Убедитесь, что Webpack скопировал иконки в `dist/icons/`

### Проблема 3: Тема не применяется

**Ошибка:** Переключатель работает, но страница не меняется

**Решение:**
1. Откройте консоль на странице (F12)
2. Проверьте, нет ли ошибок
3. Убедитесь, что `content.js` загружен:
   - В консоли должно быть сообщение: "Ночной режим: content.js загружен"

### Проблема 4: eval ошибка

**Ошибка:**
```
Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source
```

**Решение:** Уже исправлено в `webpack.config.js` строкой `devtool: false`

### Проблема 5: Расширение работает не на всех сайтах

**Причина:** Некоторые сайты (chrome://, about:) запрещены политикой безопасности

**Решение:** Уже реализовано — функция `isAllowedPage()` проверяет и пропускает такие страницы

---

## 💡 Шаг 10: Улучшения и идеи

### Идеи для доработки расширения:

| Улучшение | Сложность | Описание |
|-----------|-----------|----------|
| 🌅 **Автоматическое расписание** | ⭐⭐ | Включать ночной режим после заката |
| 📝 **Белый список сайтов** | ⭐⭐ | Не применять тему на определённых сайтах |
| ⌨️ **Горячие клавиши** | ⭐ | Включать режим по Ctrl+Shift+N |
| 🎨 **Пресеты тем** | ⭐⭐ | "Кино", "Чтение", "Работа" |
| 🌈 **Цветовая температура** | ⭐⭐ | Регулировка тёплого/холодного света |
| 📊 **Статистика использования** | ⭐⭐⭐ | Сколько времени в ночном режиме |
| 🔄 **Синхронизация с облаком** | ⭐⭐⭐ | Сохранение настроек между устройствами |

### Пример добавления горячих клавиш:

В `manifest.json` добавьте:

```json
{
  "commands": {
    "toggle-night-mode": {
      "suggested_key": {
        "default": "Ctrl+Shift+N",
        "mac": "Command+Shift+N"
      },
      "description": "Включить/выключить ночной режим"
    }
  }
}
```

В `background.js` добавьте:

```javascript
chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-night-mode') {
        // Логика переключения
    }
});
```

---

## 📚 Заключение

### Что мы изучили:

✅ **Структуру браузерного расширения** — manifest.json, попап, content-скрипты  
✅ **Работу с Chrome API** — storage, tabs, messaging  
✅ **CSS фильтры** — brightness, contrast, sepia  
✅ **Сборку с Webpack** — конфигурация, плагины, loaders  
✅ **Обработку ошибок** — try/catch, проверки соединения  
✅ **Хранение настроек** — chrome.storage.local  

### Полученный результат:

<div align="center">
  
| До | После |
|----|-------|
| 🌞 Яркая, резкая страница | 🌙 Приятный, тёплый ночной режим |
| 😫 Глаза устают | 😊 Комфортное чтение |
| 🔧 Ручная настройка | 🎛️ Удобные ползунки |

</div>

### Дальнейшие шаги:

1. **Опубликуйте расширение** в Chrome Web Store
2. **Добавьте новые функции** из списка идей
3. **Создайте версию для Firefox** (отличается только API)
4. **Поделитесь с друзьями** и соберите отзывы

---

## 🔗 Полезные ссылки

| Ресурс | Ссылка | Назначение |
|--------|--------|------------|
| Chrome Extensions Docs | [developer.chrome.com/docs/extensions](https://developer.chrome.com/docs/extensions/) | Официальная документация |
| Webpack Documentation | [webpack.js.org](https://webpack.js.org/) | Документация по Webpack |
| Chrome Web Store | [chrome.google.com/webstore](https://chrome.google.com/webstore) | Публикация расширений |
| MDN Web Extensions | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) | Для версии Firefox |

---

> [!NOTE]
> Обновлено 31.03.2026

<div align="center">

![Версия](https://img.shields.io/badge/версия-0.0.1-brightgreen)
![js](https://img.shields.io/badge/javascript-yellow)
![css-3](https://img.shields.io/badge/css-3-blue)
![html-5](https://img.shields.io/badge/html-5-orange)
</div>

---
