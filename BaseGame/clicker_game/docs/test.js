
// ============ СИСТЕМА ЗВУКОВ ============
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

// ============ ОБНОВЛЕНИЕ ФУНКЦИЙ ============

// В handleClick
function handleClick() {
    score += 1;
    // ... 
    
    // Звук клика
    GameSounds.beep(800, 0.08, 0.15);
    
    // Или для ретро-стиля:
    // GameSounds.beep(1200, 0.05, 0.1, 'square');
}

// В checkForImageChange
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
            
            // ...
        }
    }
}

// ============ АНИМАЦИЯ PARTICLE EFFECT ============
function createParticles(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 5px;
            height: 5px;
            background: #FFD700;
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 999;
        `;
        
        document.body.appendChild(particle);
        
        // Анимация
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const duration = 500 + Math.random() * 500;
        
        const startX = x;
        const startY = y;
        let progress = 0;
        
        function animate() {
            progress += 16 / duration;
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const currentX = startX + Math.cos(angle) * speed * progress * 100;
            const currentY = startY + Math.sin(angle) * speed * progress * 100;
            
            particle.style.opacity = 1 - progress;
            particle.style.transform = `translate(${currentX - startX}px, ${currentY - startY}px) scale(${1 - progress})`;
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
}
