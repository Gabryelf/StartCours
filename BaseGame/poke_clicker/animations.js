// ==============================
// АНИМАЦИИ И ЭФФЕКТЫ
// ==============================

class AnimationManager {
    constructor() {
        this.animations = new Map();
    }
    
    // Создает эффект урона
    createDamageEffect(damage, x, y, isCritical = false) {
        const effect = document.createElement('div');
        effect.className = 'damage-effect';
        effect.textContent = `-${damage}`;
        effect.style.position = 'fixed';
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        effect.style.fontSize = isCritical ? '2.5rem' : '2rem';
        effect.style.color = isCritical ? '#ff0000' : '#dc3545';
        effect.style.fontWeight = 'bold';
        effect.style.textShadow = isCritical ? '0 0 10px #ff0000' : '0 0 5px #dc3545';
        effect.style.zIndex = '9999';
        effect.style.pointerEvents = 'none';
        
        document.body.appendChild(effect);
        
        // Анимация
        let progress = 0;
        const duration = 1000;
        const startX = x;
        const startY = y;
        const endY = y - 100;
        
        const animate = () => {
            progress += 16 / duration;
            if (progress >= 1) {
                effect.remove();
                return;
            }
            
            const currentY = startY + (endY - startY) * progress;
            const currentOpacity = 1 - progress;
            
            effect.style.opacity = currentOpacity;
            effect.style.transform = `translateY(${currentY - startY}px) scale(${1 + progress * 0.5})`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Создает эффект получения предмета
    createItemGetEffect(itemName, itemImage, x, y) {
        const effect = document.createElement('div');
        effect.className = 'item-effect';
        effect.innerHTML = `
            <img src="${itemImage}" alt="${itemName}">
            <span>+1 ${itemName}</span>
        `;
        effect.style.position = 'fixed';
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        effect.style.display = 'flex';
        effect.style.alignItems = 'center';
        effect.style.gap = '10px';
        effect.style.background = 'rgba(255, 255, 255, 0.9)';
        effect.style.padding = '10px 15px';
        effect.style.borderRadius = '20px';
        effect.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        effect.style.zIndex = '9998';
        
        document.body.appendChild(effect);
        
        // Анимация
        let progress = 0;
        const duration = 2000;
        const startY = y;
        const endY = y - 50;
        
        const animate = () => {
            progress += 16 / duration;
            if (progress >= 1) {
                effect.remove();
                return;
            }
            
            const currentY = startY + (endY - startY) * progress;
            const currentOpacity = 1 - progress;
            
            effect.style.opacity = currentOpacity;
            effect.style.transform = `translateY(${currentY - startY}px)`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Анимация смены противника
    animateEnemyChange(oldEnemy, newEnemy) {
        const enemyImage = document.getElementById('enemy-image');
        if (!enemyImage) return;
        
        // Эффект исчезновения
        enemyImage.style.transition = 'opacity 0.5s ease';
        enemyImage.style.opacity = '0';
        
        setTimeout(() => {
            // Меняем изображение
            enemyImage.src = newEnemy.image;
            enemyImage.style.transform = 'scale(0.5)';
            enemyImage.style.opacity = '0';
            
            // Эффект появления
            setTimeout(() => {
                enemyImage.style.transition = 'all 0.5s ease';
                enemyImage.style.opacity = '1';
                enemyImage.style.transform = 'scale(1)';
                
                // Эффект вспышки
                this.createFlashEffect(enemyImage.parentElement, '#ffcc00');
            }, 100);
        }, 500);
    }
    
    // Эффект вспышки
    createFlashEffect(element, color) {
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = color;
        flash.style.opacity = '0.5';
        flash.style.borderRadius = 'inherit';
        flash.style.zIndex = '1';
        flash.style.pointerEvents = 'none';
        
        element.appendChild(flash);
        
        // Анимация исчезновения
        let opacity = 0.5;
        const fadeOut = () => {
            opacity -= 0.05;
            flash.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(fadeOut);
            } else {
                flash.remove();
            }
        };
        
        requestAnimationFrame(fadeOut);
    }
    
    // Анимация HP бара
    animateHPBar(hpBar, newPercent) {
        if (!hpBar) return;
        
        const currentPercent = parseFloat(hpBar.style.width) || 100;
        const diff = newPercent - currentPercent;
        const duration = 300;
        const steps = duration / 16;
        const step = diff / steps;
        let currentStep = 0;
        
        const animate = () => {
            if (currentStep < steps) {
                const newValue = currentPercent + step * currentStep;
                hpBar.style.width = `${newValue}%`;
                currentStep++;
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    // Эффект дрожания элемента
    shakeElement(element, intensity = 10) {
        if (!element) return;
        
        const originalTransform = element.style.transform;
        let shakeCount = 0;
        const maxShakes = 5;
        
        const shake = () => {
            if (shakeCount >= maxShakes) {
                element.style.transform = originalTransform;
                return;
            }
            
            const x = (Math.random() - 0.5) * intensity * 2;
            const y = (Math.random() - 0.5) * intensity * 2;
            
            element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
            
            shakeCount++;
            setTimeout(shake, 50);
        };
        
        shake();
    }
    
    // Эффект уровня покемона
    createLevelUpEffect(pokemon) {
        const effect = document.createElement('div');
        effect.className = 'level-up-effect';
        effect.innerHTML = `
            <div class="stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <div class="message">${pokemon.name} достиг уровня ${pokemon.level}!</div>
        `;
        effect.style.position = 'fixed';
        effect.style.top = '50%';
        effect.style.left = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.background = 'rgba(0, 0, 0, 0.8)';
        effect.style.color = 'white';
        effect.style.padding = '20px 40px';
        effect.style.borderRadius = '20px';
        effect.style.zIndex = '10000';
        effect.style.textAlign = 'center';
        
        document.body.appendChild(effect);
        
        // Анимация звезд
        const stars = effect.querySelectorAll('.fa-star');
        stars.forEach((star, index) => {
            star.style.animation = `bounce 0.5s ease ${index * 0.2}s infinite alternate`;
        });
        
        // Удаляем через 2 секунды
        setTimeout(() => {
            effect.style.transition = 'opacity 0.5s';
            effect.style.opacity = '0';
            setTimeout(() => effect.remove(), 500);
        }, 2000);
    }
    
    // Инициализация CSS анимаций
    initCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                from { transform: scale(1); }
                to { transform: scale(1.3); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .pulse {
                animation: pulse 0.5s ease;
            }
            
            .spin {
                animation: spin 1s linear;
            }
        `;
        document.head.appendChild(style);
    }
}

// Экспорт менеджера анимаций
window.AnimationManager = AnimationManager;