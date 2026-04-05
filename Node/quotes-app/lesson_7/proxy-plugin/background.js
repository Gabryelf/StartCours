// Service Worker для управления прокси
console.log('✅ Proxy Service Worker загружен');

// Обработка установки
chrome.runtime.onInstalled.addListener(() => {
    console.log('✅ Расширение установлено');
});

// Слушаем сообщения от popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Получено сообщение:', message);
    
    if (message.type === 'CONNECT') {
        // ВАЖНО: Настраиваем прокси для ВСЕХ протоколов
        const config = {
            mode: "fixed_servers",
            rules: {
                // Для HTTP
                proxyForHttp: {
                    scheme: message.proxyScheme || "http",
                    host: message.proxyHost,
                    port: message.proxyPort
                },
                // Для HTTPS
                proxyForHttps: {
                    scheme: message.proxyScheme || "http",
                    host: message.proxyHost,
                    port: message.proxyPort
                },
                // Не проксируем локальные адреса
                bypassList: ["localhost", "127.0.0.1", "*.local", "chrome://*"]
            }
        };
        
        chrome.proxy.settings.set(
            { value: config, scope: 'regular' },
            () => {
                if (chrome.runtime.lastError) {
                    console.error('❌ Ошибка настройки прокси:', chrome.runtime.lastError);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    console.log('✅ Прокси настроен:', message.proxyHost + ':' + message.proxyPort);
                    sendResponse({ success: true });
                }
            }
        );
        return true;
    }
    
    if (message.type === 'DISCONNECT') {
        chrome.proxy.settings.set(
            { value: { mode: "direct" }, scope: 'regular' },
            () => {
                if (chrome.runtime.lastError) {
                    console.error('❌ Ошибка отключения:', chrome.runtime.lastError);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    console.log('✅ Прокси отключен');
                    sendResponse({ success: true });
                }
            }
        );
        return true;
    }
});