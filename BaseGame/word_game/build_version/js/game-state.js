// js/game-state.js
// =================
// В этом файле храним ВСЁ состояние игры (уровень, очки, найденные слова и т.д.)

class GameState {
    constructor() {
        // ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЯ ПО УМОЛЧАНИЮ
        this.mode = 'infinite';          // Режим игры: 'infinite' или 'daily'
        this.level = 1;                  // Текущий уровень
        this.score = 0;                  // Количество очков
        this.hints = 3;                  // Количество подсказок
        this.revealAttempts = 5;         // Количество попыток открыть букву
        
        // ТЕКУЩАЯ СЕССИЯ
        this.currentInput = [];          // Буквы, которые игрок набрал сейчас
        this.foundWords = [];            // Слова, которые игрок уже нашел
        this.attemptsUsed = 0;           // Использованные попытки в этом уровне
        this.totalLettersCount = 0;      // Общее количество букв в уровне
        
        // ЕЖЕДНЕВНАЯ ИГРА
        this.dailyCompleted = false;     // Пройдено ли сегодняшнее слово
        this.dailyDate = null;           // Дата последней ежедневной игры
        
        // ДАННЫЕ ТЕКУЩЕГО УРОВНЯ
        this.levelData = null;           // Здесь будем хранить данные уровня
    }
    
    // МЕТОД ДЛЯ ЗАГРУЗКИ ИЗ СОХРАНЕНИЯ
    initFromSave(savedData) {
        if (savedData && savedData.state) {
            // Object.assign копирует свойства из savedData.state в this
            Object.assign(this, savedData.state);
        }
    }
    
    // МЕТОД ДЛЯ СБРОСА СОСТОЯНИЯ ПЕРЕД НОВОЙ ИГРОЙ
    resetForNewGame(mode) {
        this.mode = mode;
        this.currentInput = [];
        this.foundWords = [];
        this.attemptsUsed = 0;
        this.totalLettersCount = 0;
        this.levelData = null;
    }
    
    // МЕТОД ДЛЯ ОБНОВЛЕНИЯ ПОСЛЕ ПРОХОЖДЕНИЯ УРОВНЯ
    updateAfterLevelComplete() {
        if (this.mode === 'infinite') {
            // В бесконечном режиме повышаем уровень
            this.level++;
            this.hints++;
            this.revealAttempts += 2;
        } else {
            // В ежедневном режиме отмечаем как пройденное
            this.dailyCompleted = true;
        }
    }
    
    // МЕТОД ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ ДЛЯ СОХРАНЕНИЯ
    getSaveData() {
        return {
            state: {
                mode: this.mode,
                level: this.level,
                score: this.score,
                hints: this.hints,
                revealAttempts: this.revealAttempts,
                dailyCompleted: this.dailyCompleted,
                dailyDate: this.dailyDate
            }
        };
    }
}

// Экспортируем класс для использования в других файлах
window.GameState = GameState;