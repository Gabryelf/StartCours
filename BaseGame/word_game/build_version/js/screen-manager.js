// js/screen-manager.js
// ====================
// В этом файле управляем переключением между экранами игры

const ScreenManager = {
    // МЕТОД ДЛЯ ПОКАЗА ЭКРАНА
    show(screenId) {
        console.log(`🔄 Переключаем экран на: ${screenId}`);
        
        // 1. Скрываем ВСЕ экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 2. Показываем НУЖНЫЙ экран
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        } else {
            console.error(`❌ Экран с id "${screenId}" не найден!`);
        }
    },
    
    // МЕТОД ДЛЯ ПОЛУЧЕНИЯ ТЕКУЩЕГО ЭКРАНА
    getCurrentScreen() {
        const screens = document.querySelectorAll('.screen');
        for (const screen of screens) {
            if (screen.classList.contains('active')) {
                return screen.id;
            }
        }
        return null; // Если ни один экран не активен
    },
    
    // МЕТОД ДЛЯ ПРОВЕРКИ, АКТИВЕН ЛИ ЭКРАН
    isScreenActive(screenId) {
        const screen = document.getElementById(screenId);
        return screen ? screen.classList.contains('active') : false;
    }
};

// Делаем доступным глобально
window.ScreenManager = ScreenManager;