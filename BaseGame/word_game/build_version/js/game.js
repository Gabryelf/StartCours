// ВРЕМЕННЫЙ КОД ДЛЯ ТЕСТИРОВАНИЯ
console.log('🎮 Игра Word Wonders загружена!');

// Простая функция для переключения экранов
function showScreen(screenId) {
    console.log('🔄 Переключаем экран на:', screenId);
    
    // 1. Скрываем ВСЕ экраны
    // querySelectorAll находит все элементы с классом .screen
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active'); // Убираем класс .active
    });
    
    // 2. Показываем НУЖНЫЙ экран
    // getElementById находит элемент по id
    document.getElementById(screenId).classList.add('active'); // Добавляем класс .active
}
