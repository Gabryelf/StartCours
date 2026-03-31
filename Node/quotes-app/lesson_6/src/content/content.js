// Создаём стили для ночного режима
let styleElement = null;

// Слушаем сообщения от попапа
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'APPLY_THEME') {
        applyTheme(request.settings);
    }
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
    
    // Создаём или обновляем стили
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
}

// Удаляем тему
function removeTheme() {
    if (styleElement) {
        styleElement.remove();
        styleElement = null;
    }
}

// Загружаем сохранённые настройки
async function loadInitialTheme() {
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
}

// Запускаем загрузку темы
loadInitialTheme();