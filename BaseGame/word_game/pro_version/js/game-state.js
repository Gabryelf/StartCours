// Состояние игры
class GameState {
    constructor() {
        this.mode = 'infinite';
        this.level = 1;
        this.score = 0;
        this.hints = 3;
        this.revealAttempts = 5;
        this.currentInput = [];
        this.foundWords = [];
        this.attemptsUsed = 0;
        this.totalLettersCount = 0;
        this.dailyCompleted = false;
        this.dailyDate = null;
        this.levelData = null;
    }
    
    // Инициализация из сохраненных данных
    initFromSave(savedData) {
        if (savedData && savedData.state) {
            Object.assign(this, savedData.state);
        }
    }
    
    // Сброс состояния для новой игры
    resetForNewGame(mode) {
        this.mode = mode;
        this.currentInput = [];
        this.foundWords = [];
        this.attemptsUsed = 0;
        this.totalLettersCount = 0;
        this.levelData = null;
    }
    
    // Обновление после прохождения уровня
    updateAfterLevelComplete() {
        if (this.mode === 'infinite') {
            this.level++;
            this.hints++;
            this.revealAttempts += 2;
        } else {
            this.dailyCompleted = true;
        }
    }
    
    // Получение данных для сохранения
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