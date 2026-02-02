// Основной класс игры
class Game {
    constructor() {
        this.state = new GameState();
        this.ui = UIManager;
        this.screen = ScreenManager;
        this.storage = StorageManager;
        this.generator = LevelGenerator;
        
        // Загрузка сохраненной игры
        const savedData = this.storage.load();
        if (savedData) {
            this.state.initFromSave(savedData);
        }
    }
    
    // Инициализация игры
    init() {
        // Настройка ежедневной игры
        this.setupDaily();
        
        // Инициализация обработчиков событий
        EventHandlers.init(this);
        
        // Обновление главного экрана
        this.ui.updateMainScreen(this.state);
        
        console.log('Игра инициализирована');
    }
    
    // Настройка ежедневной игры
    setupDaily() {
        const today = Utils.getTodayString();
        if (this.state.dailyDate !== today) {
            this.state.dailyCompleted = false;
            this.state.dailyDate = today;
            this.saveGame();
        }
    }
    
    // Начало игры
    startGame(mode) {
        console.log('Запуск игры в режиме:', mode);
        
        this.state.resetForNewGame(mode);
        
        if (mode === 'infinite') {
            this.generateInfiniteLevel();
        } else {
            this.generateDailyLevel();
        }
        
        this.updateGameScreen();
        this.screen.show('gameScreen');
    }
    
    // Генерация бесконечного уровня
    generateInfiniteLevel() {
        this.state.levelData = this.generator.generateInfiniteLevel(
            this.state.level, 
            WORD_LIST.common
        );
        this.state.totalLettersCount = this.state.levelData.allLetters.length;
    }
    
    // Генерация ежедневного уровня
    generateDailyLevel() {
        this.state.levelData = this.generator.generateDailyLevel();
        this.state.totalLettersCount = this.state.levelData.allLetters.length;
    }
    
    // Обновление игрового экрана
    updateGameScreen() {
        this.ui.updateGameScreen(this.state);
        this.ui.renderWordsGrid(this.state);
        this.ui.renderCurrentInput(this.state);
        this.ui.renderCircleInput(this.state);
    }
    
    // Добавление буквы
    addLetter(letter) {
        // Проверяем, можно ли использовать эту букву
        const usedCount = this.state.currentInput.filter(l => l === letter).length;
        const availableCount = this.state.levelData.allLetters.filter(l => l === letter).length;
        
        if (usedCount < availableCount) {
            this.state.currentInput.push(letter);
            this.updateGameScreen();
        } else {
            this.ui.showMessage(`Буква "${letter}" уже использована максимальное количество раз!`, '⚠️');
        }
    }
    
    // Удаление последней буквы
    removeLastLetter() {
        if (this.state.currentInput.length > 0) {
            this.state.currentInput.pop();
            this.updateGameScreen();
        }
    }
    
    // Очистка ввода
    clearInput() {
        this.state.currentInput = [];
        this.updateGameScreen();
    }
    
    // Сброс набранных букв
    resetInput() {
        this.clearInput();
        this.ui.showMessage('Все набранные буквы сброшены', '🔄');
    }
    
    // Перемешивание букв в круге
    shuffleLetters() {
        if (!this.state.levelData || !this.state.levelData.availableLetters) return;
        
        this.state.levelData.availableLetters = Utils.shuffleArray(
            this.state.levelData.availableLetters
        );
        this.updateGameScreen();
        this.ui.showMessage('Буквы перемешаны!', '🔀');
    }
    
    // Использование подсказки
    useHint() {
        if (this.state.hints > 0) {
            const unrevealedWords = this.state.levelData.targetWords.filter(word => 
                !this.state.foundWords.includes(word)
            );
            
            if (unrevealedWords.length > 0) {
                const randomWord = unrevealedWords[Math.floor(Math.random() * unrevealedWords.length)];
                
                this.state.foundWords.push(randomWord);
                this.state.hints--;
                
                const points = Math.floor(randomWord.length * 5);
                this.state.score += points;
                
                this.updateGameScreen();
                this.ui.showMessage(`Подсказка: слово "${randomWord}" открыто! +${points} очков`, '💡');
                
                this.checkLevelCompletion();
            } else {
                this.ui.showMessage('Все слова уже найдены!', '✅');
            }
        } else {
            this.ui.showMessage('Недостаточно подсказок!', '⚠️');
        }
        
        this.saveGame();
    }
    
    // Открытие случайной буквы
    revealRandomLetter() {
        if (this.state.revealAttempts > 0) {
            const hiddenCells = [];
            
            this.state.levelData.targetWords.forEach(word => {
                if (!this.state.foundWords.includes(word)) {
                    this.state.levelData.wordCells[word].forEach((cell, index) => {
                        if (!cell.revealed) {
                            hiddenCells.push({ word, cell, index });
                        }
                    });
                }
            });
            
            if (hiddenCells.length > 0) {
                const randomCell = hiddenCells[Math.floor(Math.random() * hiddenCells.length)];
                
                this.state.levelData.wordCells[randomCell.word][randomCell.index].revealed = true;
                this.state.revealAttempts--;
                
                this.updateGameScreen();
                this.ui.showMessage(`Открыта буква "${randomCell.cell.letter}"`, '👁️');
                
                this.checkWordCompletion(randomCell.word);
            } else {
                this.ui.showMessage('Все буквы уже открыты!', '✅');
            }
        } else {
            this.ui.showMessage('Недостаточно попыток!', '⚠️');
        }
        
        this.saveGame();
    }
    
    // Проверка открытия слова через бонусные буквы
    checkWordCompletion(word) {
        const allRevealed = this.state.levelData.wordCells[word].every(cell => cell.revealed);
        if (allRevealed && !this.state.foundWords.includes(word)) {
            this.state.foundWords.push(word);
            const points = word.length * 10;
            this.state.score += points;
            
            this.ui.showMessage(`Слово "${word}" полностью открыто! +${points} очков`, '✨');
            this.checkLevelCompletion();
        }
        
        this.saveGame();
    }
    
    // Проверка слова
    submitWord() {
        const word = this.state.currentInput.join('').toUpperCase();
        
        if (word.length < 2) {
            this.ui.showMessage('Слово должно содержать минимум 2 буквы!', '⚠️');
            return;
        }
        
        // Проверяем использование букв
        const letterCounts = Utils.countOccurrences(this.state.currentInput);
        const availableCounts = Utils.countOccurrences(this.state.levelData.allLetters);
        
        let isValid = true;
        for (const letter in letterCounts) {
            if (!availableCounts[letter] || availableCounts[letter] < letterCounts[letter]) {
                isValid = false;
                break;
            }
        }
        
        if (!isValid) {
            this.state.attemptsUsed++;
            this.ui.showMessage('Использованы недоступные буквы!', '❌');
            
            if (this.state.attemptsUsed >= this.state.levelData.maxAttempts) {
                setTimeout(() => {
                    this.showLevelFailed();
                }, 1000);
            }
            
            this.clearInput();
            this.updateGameScreen();
            this.saveGame();
            return;
        }
        
        // Проверяем слово
        if (this.state.levelData.targetWords.includes(word)) {
            if (!this.state.foundWords.includes(word)) {
                this.state.foundWords.push(word);
                const points = word.length * 10;
                this.state.score += points;
                this.state.attemptsUsed++;
                
                this.ui.showMessage(`Правильно! "${word}" найдено! +${points} очков`, '✅');
                this.checkLevelCompletion();
                
            } else {
                this.state.attemptsUsed++;
                this.ui.showMessage('Это слово уже найдено!', '⚠️');
            }
        } else {
            this.state.attemptsUsed++;
            this.ui.showMessage('Такого слова нет в этом уровне!', '❌');
            
            if (this.state.attemptsUsed >= this.state.levelData.maxAttempts) {
                setTimeout(() => {
                    this.showLevelFailed();
                }, 1000);
            }
        }
        
        this.clearInput();
        this.saveGame();
    }
    
    // Проверка завершения уровня
    checkLevelCompletion() {
        const allFound = this.state.levelData.targetWords.every(word => 
            this.state.foundWords.includes(word)
        );
        
        if (allFound) {
            setTimeout(() => {
                this.showLevelComplete();
            }, 1000);
        }
    }
    
    // Показать экран завершения уровня
    showLevelComplete() {
        this.ui.showLevelComplete(this.state);
        this.screen.show('resultScreen');
    }
    
    // Показать экран провала уровня
    showLevelFailed() {
        this.ui.showLevelFailed(this.state);
        this.screen.show('resultScreen');
    }
    
    // Переход на следующий уровень
    nextLevel() {
        this.state.updateAfterLevelComplete();
        this.saveGame();
        
        if (this.state.mode === 'infinite') {
            this.startGame('infinite');
        } else {
            this.screen.show('mainScreen');
            this.ui.updateMainScreen(this.state);
        }
    }
    
    // Сохранение игры
    saveGame() {
        const saveData = this.state.getSaveData();
        this.storage.save(saveData);
    }
}

// Создание и инициализация игры
const game = new Game();

// Запуск игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('Документ загружен, инициализация игры...');
    game.init();
    console.log('Игра инициализирована');
});