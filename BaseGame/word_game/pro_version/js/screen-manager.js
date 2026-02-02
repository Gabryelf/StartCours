// Управление переключением экранов
const ScreenManager = {
    // Показать экран
    show(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        console.log('Переключен экран на:', screenId);
    },
    
    // Получить текущий экран
    getCurrentScreen() {
        const screens = document.querySelectorAll('.screen');
        for (const screen of screens) {
            if (screen.classList.contains('active')) {
                return screen.id;
            }
        }
        return null;
    }
};