// ==============================
// МЕНЕДЖЕР СОХРАНЕНИЙ
// ==============================

class SaveManager {
    constructor() {
        this.saveKey = GAME_CONFIG.SAVE_KEY;
        this.autoSaveInterval = null;
    }
    
    // Генерирует начальное состояние игры
    generateInitialSave() {
        return {
            version: '1.0',
            money: GAME_CONFIG.STARTING_MONEY,
            pokeballs: { ...GAME_CONFIG.STARTING_POKEBALLS },
            collection: [],
            team: [],
            currentEnemy: {
                id: 0,
                hp: GAME_CONFIG.BASE_ENEMY_HP,
                maxHp: GAME_CONFIG.BASE_ENEMY_HP,
                level: 1
            },
            maxTeamSize: GAME_CONFIG.MAX_TEAM_SIZE,
            stats: {
                totalDamage: 0,
                enemiesDefeated: 0,
                pokeballsOpened: 0,
                highestDamage: 0
            },
            lastSave: Date.now()
        };
    }
    
    // Загружает сохранение
    load() {
        try {
            const saved = localStorage.getItem(this.saveKey);
            if (saved) {
                const data = JSON.parse(saved);
                
                // Проверка версии и миграция если нужно
                if (data.version !== '1.0') {
                    console.log('Обнаружено старое сохранение, применяю миграцию...');
                    return this.migrateSave(data);
                }
                
                return data;
            }
        } catch (error) {
            console.error('Ошибка загрузки сохранения:', error);
        }
        
        // Если нет сохранения или ошибка - создаем новое
        console.log('Создаю новое сохранение...');
        return this.generateInitialSave();
    }
    
    // Сохраняет игру
    save(gameState) {
        try {
            const saveData = {
                ...gameState,
                version: '1.0',
                lastSave: Date.now()
            };
            
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('Игра сохранена:', saveData.lastSave);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            return false;
        }
    }
    
    // Миграция старых сохранений
    migrateSave(oldSave) {
        const newSave = this.generateInitialSave();
        
        // Переносим данные из старого сохранения
        if (oldSave.money) newSave.money = oldSave.money;
        if (oldSave.pokeballs) newSave.pokeballs = { ...oldSave.pokeballs };
        if (oldSave.collection) newSave.collection = oldSave.collection;
        if (oldSave.team) newSave.team = oldSave.team;
        if (oldSave.stats) newSave.stats = { ...oldSave.stats };
        
        // Сохраняем мигрированные данные
        this.save(newSave);
        return newSave;
    }
    
    // Запускает автосохранение
    startAutoSave(gameStateGetter, interval = GAME_CONFIG.AUTO_SAVE_INTERVAL) {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            const currentState = gameStateGetter();
            this.save(currentState);
            this.showNotification('Автосохранение выполнено!', 'info');
        }, interval);
    }
    
    // Останавливает автосохранение
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
    
    // Уведомление
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px';
        notification.style.background = type === 'error' ? '#dc3545' : 
                                       type === 'warning' ? '#ffc107' : '#28a745';
        notification.style.color = type === 'warning' ? '#333' : 'white';
        notification.style.borderRadius = '10px';
        notification.style.zIndex = '1001';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Сброс игры
    resetGame() {
        if (confirm('Вы уверены? Все данные будут потеряны!')) {
            localStorage.removeItem(this.saveKey);
            location.reload();
        }
    }
}

// Экспорт менеджера сохранений
window.SaveManager = SaveManager;