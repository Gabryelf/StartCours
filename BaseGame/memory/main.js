// Картинки для игры (6 картинок, берем первые 5 для 5 пар)
const IMAGES = [
    'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/images/clash_royale/archer_evolution.png',
    'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/images/clash_royale/dartgoblinevolution.png',
    'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/images/clash_royale/goblinbarrelevolution.png',
    'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/images/clash_royale/ice_golem.png',
    'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/images/clash_royale/royaleking_mt.png'
];

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const boardElement = document.getElementById('gameBoard');
    const attemptsElement = document.getElementById('attempts');
    const pairsFoundElement = document.getElementById('pairsFound');
    const restartBtn = document.getElementById('restartBtn');
    
    // Проверяем, что все элементы найдены
    if (!boardElement || !attemptsElement || !pairsFoundElement || !restartBtn) {
        console.error('Не найдены элементы DOM');
        return;
    }
    
    // Инициализируем игру
    Game.init(IMAGES, boardElement, attemptsElement, pairsFoundElement);
    
    // Вешаем обработчик на кнопку рестарта
    restartBtn.onclick = function() {
        Game.restart();
    };
});