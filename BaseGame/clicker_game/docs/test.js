// Вставьте этот код в ваш script.js после объявления переменных

// ============ ПРОСТАЯ СИСТЕМА ЗВУКОВ ============
const GameSounds = {
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 Звуковая система готова');
        } catch (e) {
            console.log('⚠️ Звуки не доступны');
        }
    },
    
    beep(freq = 800, dur = 0.1, vol = 0.2, type = 'sine') {
        if (!this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = vol;
        
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
    }
};

// ============ ИНИЦИАЛИЗАЦИЯ ============
GameSounds.init();

// ============ ОБНОВИТЕ ВАШИ ФУНКЦИИ ============

// В handleClick добавьте:
function handleClick() {
    score += 1;
    // ... ваш код ...
    
    // Звук клика
    GameSounds.beep(800, 0.08, 0.15);
    
    // Или для ретро-стиля:
    // GameSounds.beep(1200, 0.05, 0.1, 'square');
}

// В checkForImageChange добавьте:
function checkForImageChange() {
    if (currentImageIndex < GAME_SETTINGS.imageThresholds.length && 
        score >= GAME_SETTINGS.imageThresholds[currentImageIndex]) {
        
        currentImageIndex++;
        
        if (currentImageIndex < GAME_SETTINGS.images.length) {
            changeImage(currentImageIndex);
            
            // Звук уровня - последовательность из 3 бипов
            GameSounds.beep(523, 0.15, 0.2);
            setTimeout(() => GameSounds.beep(659, 0.15, 0.2), 150);
            setTimeout(() => GameSounds.beep(784, 0.2, 0.25), 300);
            
            // ... ваш код ...
        }
    }
}