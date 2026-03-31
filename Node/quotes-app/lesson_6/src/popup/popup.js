// Получаем ссылки на все элементы
const nightModeToggle = document.getElementById('nightModeToggle');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const sepiaSlider = document.getElementById('sepia');
const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const sepiaValue = document.getElementById('sepiaValue');
const resetBtn = document.getElementById('resetBtn');

// Загружаем сохранённые настройки
async function loadSettings() {
    const result = await chrome.storage.local.get([
        'nightModeEnabled',
        'brightness',
        'contrast',
        'sepia'
    ]);
    
    // Применяем настройки к интерфейсу
    nightModeToggle.checked = result.nightModeEnabled || false;
    brightnessSlider.value = result.brightness || 0.85;
    contrastSlider.value = result.contrast || 1;
    sepiaSlider.value = result.sepia || 0.2;
    
    // Обновляем отображение значений
    updateValueDisplays();
}

// Обновляем текстовые значения ползунков
function updateValueDisplays() {
    brightnessValue.textContent = Math.round(brightnessSlider.value * 100) + '%';
    contrastValue.textContent = Math.round(contrastSlider.value * 100) + '%';
    sepiaValue.textContent = Math.round(sepiaSlider.value * 100) + '%';
}

// Сохраняем настройки и отправляем на страницу
async function saveAndApply() {
    const settings = {
        nightModeEnabled: nightModeToggle.checked,
        brightness: parseFloat(brightnessSlider.value),
        contrast: parseFloat(contrastSlider.value),
        sepia: parseFloat(sepiaSlider.value)
    };
    
    // Сохраняем в хранилище
    await chrome.storage.local.set(settings);
    
    // Отправляем сообщение на активную вкладку
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, {
        type: 'APPLY_THEME',
        settings: settings
    });
}

// Сбрасываем настройки по умолчанию
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
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
        type: 'APPLY_THEME',
        settings: defaultSettings
    });
}

// Навешиваем обработчики событий
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

// Загружаем настройки при открытии
loadSettings();