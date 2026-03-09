// Основная логика игры
class Game {
    constructor() {
        this.state = {
            mode: 'infinite',
            level: CONFIG.INITIAL_LEVEL,
            score: CONFIG.INITIAL_SCORE,
            attempts: CONFIG.INITIAL_ATTEMPTS,
            currentInput: [],
            foundWords: [],
            levelData: null,
            dailyCompleted: false,
            dailyDate: null
        };
        
        this.init();
    }
    
    init() {
        this.setupDaily();
        this.setupEventListeners();
        console.log('Игра инициализирована');
    }
    
    // Настройка ежедневной игры
    setupDaily() {
        const today = Utils.getTodayString();
        if (this.state.dailyDate !== today) {
            this.state.dailyCompleted = false;
            this.state.dailyDate = today;
        }
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Главный экран
        document.getElementById('infiniteMode').addEventListener('click', () => this.start('infinite'));
        document.getElementById('dailyMode').addEventListener('click', () => {
            if (!this.state.dailyCompleted) {
                this.start('daily');
            }
        });
        
        // Игровой экран
        document.getElementById('backBtn').addEventListener('click', () => UI.showScreen('mainScreen'));
        document.getElementById('resetBtn').addEventListener('click', () => this.resetInput());
        
        // Круг с буквами
        document.addEventListener('click', (e) => {
            if (e.target.closest('.circle-letter')) {
                this.addLetter(e.target.textContent);
            }
            if (e.target.closest('.circle-center')) {
                this.submitWord();
            }
        });
        
        // Экран результатов
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            UI.showScreen('mainScreen');
        });
        
        // Клавиатура
        document.addEventListener('keydown', (e) => {
            if (UI.currentScreen === 'gameScreen') {
                if (e.key === 'Enter') this.submitWord();
                if (e.key === 'Backspace') this.removeLastLetter();
                if (/^[а-яА-Яa-zA-Z]$/.test(e.key)) {
                    this.addLetter(e.key.toUpperCase());
                }
                UI.updateGameScreen(this.state);
            }
        });
    }
    
    // Начать игру
    start(mode) {
        this.state.mode = mode;
        this.state.currentInput = [];
        this.state.foundWords = [];
        this.state.attempts = CONFIG.INITIAL_ATTEMPTS + Math.floor(this.state.level / 3);
        
        // Генерация уровня
        if (mode === 'infinite') {
            this.generateLevel();
        } else {
            this.generateDailyLevel();
            this.state.dailyCompleted = true;
        }
        
        UI.showScreen('gameScreen');
        UI.updateGameScreen(this.state);
    }
    
    // Генерация обычного уровня
    generateLevel() {
        const levelMultiplier = 1 + (this.state.level - 1) * CONFIG.LEVEL_MULTIPLIER;
        const wordCount = Math.min(
            CONFIG.MIN_WORDS_PER_LEVEL + Math.floor(this.state.level / 2),
            CONFIG.MAX_WORDS_PER_LEVEL
        );
        
        // Выбираем слова
        const selectedWords = [];
        const usedWords = new Set();
        
        for (let i = 0; i < wordCount; i++) {
            let word;
            do {
                word = Utils.randomElement(WORD_LIST.common);
            } while (usedWords.has(word) || word.length < 3);
            
            selectedWords.push(word);
            usedWords.add(word);
        }
        
        // Собираем все буквы
        const allLetters = selectedWords.join('').split('');
        
        // Берем уникальные буквы для круга
        let circleLetters = Utils.unique(allLetters);
        if (circleLetters.length > CONFIG.MAX_LETTERS_IN_CIRCLE) {
            // Выбираем самые частые буквы
            const letterCounts = Utils.countLetters(allLetters);
            circleLetters = Object.keys(letterCounts)
                .sort((a, b) => letterCounts[b] - letterCounts[a])
                .slice(0, CONFIG.MAX_LETTERS_IN_CIRCLE);
        }
        
        // Перемешиваем буквы
        circleLetters = Utils.shuffle(circleLetters);
        
        this.state.levelData = {
            words: selectedWords,
            letters: circleLetters,
            allLetters: allLetters
        };
    }
    
    // Генерация ежедневного уровня
    generateDailyLevel() {
        const themeIndex = Utils.getDailyThemeIndex();
        const theme = WORD_LIST.dailyThemes[themeIndex];
        
        this.state.levelData = {
            words: theme.words,
            letters: Utils.shuffle(theme.letters.slice(0, CONFIG.MAX_LETTERS_IN_CIRCLE)),
            allLetters: theme.words.join('').split(''),
            theme: theme.name
        };
    }
    
    // Добавить букву
    addLetter(letter) {
        if (this.state.currentInput.length < 15) {
            this.state.currentInput.push(letter);
            UI.updateGameScreen(this.state);
        }
    }
    
    // Удалить последнюю букву
    removeLastLetter() {
        if (this.state.currentInput.length > 0) {
            this.state.currentInput.pop();
            UI.updateGameScreen(this.state);
        }
    }
    
    // Сбросить ввод
    resetInput() {
        this.state.currentInput = [];
        UI.updateGameScreen(this.state);
    }
    
    // Отправить слово
    submitWord() {
        const word = this.state.currentInput.join('').toUpperCase();
        
        if (word.length < 2) {
            UI.showMessage('Минимум 2 буквы!', '⚠️');
            return;
        }
        
        if (this.state.levelData.words.includes(word)) {
            if (!this.state.foundWords.includes(word)) {
                // Слово найдено
                this.state.foundWords.push(word);
                const points = word.length * CONFIG.POINTS_PER_LETTER;
                this.state.score += points;
                
                UI.showMessage(`+${points} очков!`, '✨');
                
                // Проверка завершения уровня
                if (this.state.foundWords.length === this.state.levelData.words.length) {
                    setTimeout(() => this.levelComplete(), 500);
                }
            } else {
                UI.showMessage('Уже найдено!', 'ℹ️');
            }
        } else {
            // Неправильное слово
            this.state.attempts--;
            UI.showMessage('Нет такого слова', '❌');
            
            if (this.state.attempts <= 0) {
                setTimeout(() => this.levelFailed(), 500);
            }
        }
        
        this.resetInput();
        UI.updateGameScreen(this.state);
    }
    
    // Уровень завершен
    levelComplete() {
        this.state.level++;
        this.state.score += CONFIG.BONUS_PER_LEVEL;
        
        UI.showLevelComplete(this.state);
        UI.showScreen('resultScreen');
    }
    
    // Уровень провален
    levelFailed() {
        UI.showLevelFailed(this.state);
        UI.showScreen('resultScreen');
    }
    
    // Следующий уровень
    nextLevel() {
        if (this.state.level <= CONFIG.MAX_LEVEL) {
            this.start('infinite');
        } else {
            UI.showScreen('mainScreen');
        }
    }
}

// Создание экземпляра игры
const game = new Game();