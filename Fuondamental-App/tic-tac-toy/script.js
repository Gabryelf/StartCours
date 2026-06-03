// Состояние игры
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // X всегда ходит первым
let gameActive = true;
let moveCount = 0;

// Победные комбинации (индексы ячеек)
const winningConditions = [
    [0, 1, 2], // верхняя строка
    [3, 4, 5], // средняя строка
    [6, 7, 8], // нижняя строка
    [0, 3, 6], // левый столбец
    [1, 4, 7], // центральный столбец
    [2, 5, 8], // правый столбец
    [0, 4, 8], // диагональ \
    [2, 4, 6]  // диагональ /
];

// Получаем все кнопки
const buttons = [
    document.getElementById('but-1'),
    document.getElementById('but-2'),
    document.getElementById('but-3'),
    document.getElementById('but-4'),
    document.getElementById('but-5'),
    document.getElementById('but-6'),
    document.getElementById('but-7'),
    document.getElementById('but-8'),
    document.getElementById('but-9')
];

// Получаем все изображения внутри кнопок
const images = [
    document.getElementById('img-1'),
    document.getElementById('img-2'),
    document.getElementById('img-3'),
    document.getElementById('img-4'),
    document.getElementById('img-5'),
    document.getElementById('img-6'),
    document.getElementById('img-7'),
    document.getElementById('img-8'),
    document.getElementById('img-9')
];

// Функция для обработки клика по ячейке
function handleCellClick(clickedIndex) {
    // Проверяем, активна ли игра и свободна ли ячейка
    if (!gameActive || gameBoard[clickedIndex] !== '') {
        return;
    }
    
    // Обновляем состояние игры
    updateBoard(clickedIndex);
    
    // Проверяем победу или ничью
    checkResult();
    
    // Меняем игрока
    if (gameActive) {
        changePlayer();
    }
}

// Функция обновления доски
function updateBoard(index) {
    // Обновляем массив состояния
    gameBoard[index] = currentPlayer;
    
    // Обновляем изображение в кнопке
    updateImage(index, currentPlayer);
    
    // Делаем кнопку неактивной (чтобы нельзя было нажать повторно)
    buttons[index].disabled = true;
    
    // Добавляем класс для стилизации (опционально)
    buttons[index].classList.add('disabled');
}

// Функция обновления изображения в ячейке
function updateImage(index, player) {
    const img = images[index];
    
    if (player === 'X') {
        img.src = './images/x.png'; 
    } else {
        img.src = './images/o.png';
    }
    
    img.style.width = '150px';
    img.style.height = '150px';
}

function checkResult() {
    // Проверяем победу
    for (let i = 0; i < winningConditions.length; i++) {
        let pos1 = winningConditions[i][0];
        let pos2 = winningConditions[i][1];
        let pos3 = winningConditions[i][2];
        
        let cell1 = gameBoard[pos1];
        let cell2 = gameBoard[pos2];
        let cell3 = gameBoard[pos3];
        
        // Если все три ячейки заполнены одинаковыми значениями
        if (cell1 !== '' && cell1 === cell2 && cell2 === cell3) {
            gameActive = false;
            alert(`Игрок ${currentPlayer} выиграл!`);
            return;
        }
    }
    
    // Проверяем ничью
    moveCount = moveCount + 1;
    if (moveCount === 9) {
        gameActive = false;
        alert('Ничья!');
    }
}

// Функция смены игрока
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Навешиваем обработчики на кнопки
function attachEventListeners() {
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => handleCellClick(index));
    });
}

// Инициализация игры
function initGame() {
    attachEventListeners();
}

// Запускаем игру после загрузки страницы
document.addEventListener('DOMContentLoaded', initGame);