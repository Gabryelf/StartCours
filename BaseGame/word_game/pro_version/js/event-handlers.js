// Обработчики событий игры
const EventHandlers = {
    // Инициализация обработчиков
    init(game) {
        // Главный экран
        document.getElementById('infiniteMode').addEventListener('click', () => {
            game.startGame('infinite');
        });
        
        document.getElementById('dailyMode').addEventListener('click', () => {
            if (!game.state.dailyCompleted) {
                game.startGame('daily');
            }
        });
        
        // Игровой экран
        document.getElementById('backBtn').addEventListener('click', () => {
            ScreenManager.show('mainScreen');
            UIManager.updateMainScreen(game.state);
        });
        
        document.getElementById('clearBtn').addEventListener('click', () => {
            game.clearInput();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            game.resetInput();
        });
        
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            game.shuffleLetters();
        });
        
        document.getElementById('hintBtnHeader').addEventListener('click', () => {
            game.useHint();
        });
        
        document.getElementById('revealBtnHeader').addEventListener('click', () => {
            game.revealRandomLetter();
        });
        
        // Центральная кнопка в круге
        document.addEventListener('click', (e) => {
            if (e.target.closest('.circle-center')) {
                game.submitWord();
            }
        });
        
        // Буквы в круге
        document.addEventListener('click', (e) => {
            if (e.target.closest('.circle-letter')) {
                const letter = e.target.closest('.circle-letter').textContent;
                game.addLetter(letter);
            }
        });
        
        // Экран результатов
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            game.nextLevel();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            ScreenManager.show('mainScreen');
            UIManager.updateMainScreen(game.state);
        });
        
        // Сообщения
        document.getElementById('messageOk').addEventListener('click', () => {
            UIManager.hideMessage();
        });
        
        // Обработка клавиатуры
        document.addEventListener('keydown', (e) => {
            if (ScreenManager.getCurrentScreen() === 'gameScreen') {
                if (e.key === 'Backspace') {
                    game.removeLastLetter();
                    e.preventDefault();
                } else if (e.key === 'Enter') {
                    game.submitWord();
                    e.preventDefault();
                } else if (e.key.length === 1 && /[а-яА-Яa-zA-Z]/.test(e.key)) {
                    game.addLetter(e.key.toUpperCase());
                    e.preventDefault();
                }
            }
        });
    }
};