// Состояние приложения
let isConnected = false;
let currentProxy = null;

// DOM элементы
const statusDiv = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');
const serverSelect = document.getElementById('serverSelect');
const refreshBtn = document.getElementById('refreshProxiesBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('errorMsg');
const proxyInfoDiv = document.getElementById('proxyInfo');
const proxyIpSpan = document.getElementById('proxyIp');

// Наш локальный прокси
const PROXY = { 
    host: '127.0.0.1',
    port: 8080,
    scheme: 'http', 
    name: 'Локальный прокси-сервер'
};

// Проверка прокси
async function testProxy() {
    const testUrl = `http://${PROXY.host}:${PROXY.port}/https://httpbin.org/ip`;
    
    try {
        console.log('🔄 Тестируем прокси:', testUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(testUrl, {
            signal: controller.signal,
            method: 'GET'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Прокси работает! IP:', data.origin);
            return { working: true, ip: data.origin };
        }
    } catch (error) {
        console.log('❌ Прокси не работает:', error.message);
    }
    
    return { working: false };
}

// Загрузка состояния
async function loadState() {
    const result = await chrome.storage.local.get(['vpnConnected']);
    isConnected = result.vpnConnected || false;
    updateUI();
    
    if (isConnected) {
        // Проверяем IP через прокси
        const testResult = await testProxy();
        if (testResult.working) {
            proxyIpSpan.textContent = testResult.ip;
            proxyInfoDiv.style.display = 'block';
        }
    }
}

// Подключение
async function connect() {
    showLoading(true);
    hideError();
    
    // Проверяем прокси
    const testResult = await testProxy();
    
    if (!testResult.working) {
        showLoading(false);
        showError('❌ Прокси-сервер не запущен! Запустите: node proxy-server.js');
        return;
    }
    
    // Настраиваем прокси в браузере
    const response = await chrome.runtime.sendMessage({
        type: 'CONNECT',
        proxyHost: PROXY.host,
        proxyPort: PROXY.port,
        proxyScheme: PROXY.scheme
    });
    
    showLoading(false);
    
    if (response && response.success) {
        isConnected = true;
        updateUI();
        
        proxyIpSpan.textContent = testResult.ip;
        proxyInfoDiv.style.display = 'block';
        showError('🔒 ПОДКЛЮЧЕНО! Ваш IP: ' + testResult.ip);
        
        await chrome.storage.local.set({ vpnConnected: true });
    } else {
        showError('❌ Не удалось настроить прокси');
    }
}

// Отключение
async function disconnect() {
    showLoading(true);
    
    const response = await chrome.runtime.sendMessage({
        type: 'DISCONNECT'
    });
    
    showLoading(false);
    
    if (response && response.success) {
        isConnected = false;
        updateUI();
        proxyInfoDiv.style.display = 'none';
        showError('🔓 Прокси отключен');
        
        await chrome.storage.local.set({ vpnConnected: false });
    }
}

// Обновление интерфейса
function updateUI() {
    if (isConnected) {
        statusDiv.className = 'status connected';
        statusDiv.innerHTML = '<div class="status-icon">🔒</div><div class="status-text">Подключен</div>';
        toggleBtn.textContent = '🔌 Отключиться';
        toggleBtn.className = 'connect-btn connected';
        serverSelect.disabled = true;
        refreshBtn.disabled = true;
        
        // Показываем информацию о прокси
        serverSelect.innerHTML = `<option value="">✅ Подключен: ${PROXY.name}</option>`;
    } else {
        statusDiv.className = 'status disconnected';
        statusDiv.innerHTML = '<div class="status-icon">⚪</div><div class="status-text">Отключен</div>';
        toggleBtn.textContent = '🚀 Подключиться';
        toggleBtn.className = 'connect-btn disconnected';
        serverSelect.disabled = false;
        refreshBtn.disabled = false;
        
        serverSelect.innerHTML = `<option value="${PROXY.host}:${PROXY.port}:${PROXY.scheme}">🌍 ${PROXY.name} (${PROXY.host}:${PROXY.port})</option>`;
    }
}

// Вспомогательные функции
function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
    toggleBtn.disabled = show;
    refreshBtn.disabled = show;
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 4000);
}

function hideError() {
    errorDiv.style.display = 'none';
}

// Обработчики
toggleBtn.onclick = () => {
    if (isConnected) {
        disconnect();
    } else {
        connect();
    }
};

refreshBtn.onclick = async () => {
    if (isConnected) {
        showError('🔌 Сначала отключитесь');
        return;
    }
    showLoading(true);
    const result = await testProxy();
    showLoading(false);
    
    if (result.working) {
        showError('✅ Прокси работает! Можно подключаться.');
    } else {
        showError('❌ Прокси не работает. Запустите сервер: node proxy-server.js');
    }
};

// Инициализация
async function init() {
    updateUI();
    await loadState();
}

init().catch(console.error);