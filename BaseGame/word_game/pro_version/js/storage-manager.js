// Управление сохранением игры
const StorageManager = {
    // Ключ для сохранения
    SAVE_KEY: 'wordWondersSave',
    
    // Загрузить сохраненную игру
    load() {
        const saved = localStorage.getItem(this.SAVE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.log('Ошибка загрузки сохранения:', e);
                return null;
            }
        }
        return null;
    },
    
    // Сохранить игру
    save(data) {
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.log('Ошибка сохранения:', e);
            return false;
        }
    },
    
    // Очистить сохранение
    clear() {
        localStorage.removeItem(this.SAVE_KEY);
    }
};