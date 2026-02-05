// ==============================
// СИСТЕМА БОЯ
// ==============================

class BattleSystem {
    constructor(pokemonManager) {
        this.pokemonManager = pokemonManager;
        this.currentEnemy = null;
        this.enemyLevel = 1;
        this.totalDamageDealt = 0;
        this.enemiesDefeated = 0;
    }
    
    // Создает нового противника
    createNewEnemy() {
        const enemyTemplates = GAME_CONFIG.ENEMY_IMAGES;
        const enemyTemplate = enemyTemplates[Math.floor(Math.random() * enemyTemplates.length)];
        
        const baseHp = GAME_CONFIG.BASE_ENEMY_HP;
        const hpMultiplier = GAME_CONFIG.ENEMY_HP_MULTIPLIER;
        const maxHp = Math.floor(baseHp * Math.pow(hpMultiplier, this.enemyLevel - 1));
        
        this.currentEnemy = {
            id: enemyTemplates.indexOf(enemyTemplate),
            name: enemyTemplate.name,
            rarity: enemyTemplate.rarity,
            types: enemyTemplate.types,
            hp: maxHp,
            maxHp: maxHp,
            level: this.enemyLevel,
            image: enemyTemplate.image,
            reward: this.enemyLevel * GAME_CONFIG.REWARD_MULTIPLIER
        };
        
        return this.currentEnemy;
    }
    
    // Наносит урон текущему противнику
    attackEnemy() {
        if (!this.currentEnemy || this.currentEnemy.hp <= 0) {
            return { defeated: true, damage: 0 };
        }
        
        // Получаем общий урон команды
        let totalDamage = this.pokemonManager.getTeamDamage();
        
        // Применяем модификаторы типов
        totalDamage = this.applyTypeAdvantages(totalDamage);
        
        // Наносим урон
        this.currentEnemy.hp -= totalDamage;
        this.totalDamageDealt += totalDamage;
        
        // Тратим энергию покемонов
        this.pokemonManager.applyDamage();
        
        // Проверяем, побежден ли противник
        if (this.currentEnemy.hp <= 0) {
            this.currentEnemy.hp = 0;
            const reward = this.defeatEnemy();
            return { 
                defeated: true, 
                damage: totalDamage, 
                reward: reward,
                enemy: this.currentEnemy 
            };
        }
        
        return { 
            defeated: false, 
            damage: totalDamage,
            remainingHp: this.currentEnemy.hp 
        };
    }
    
    // Применяет преимущества типов
    applyTypeAdvantages(baseDamage) {
        if (!this.currentEnemy) return baseDamage;
        
        let multiplier = 1.0;
        const enemyTypes = this.currentEnemy.types;
        
        // Проверяем каждый покемон в команде
        for (const pokemon of this.pokemonManager.team) {
            for (const pokemonType of pokemon.types) {
                const typeInfo = GAME_CONFIG.POKEMON_TYPES[pokemonType];
                
                // Проверяем сильные стороны
                for (const strongAgainst of typeInfo.strong) {
                    if (enemyTypes.includes(strongAgainst)) {
                        multiplier += 0.5; // +50% урона
                    }
                }
                
                // Проверяем слабые стороны
                for (const weakAgainst of typeInfo.weak) {
                    if (enemyTypes.includes(weakAgainst)) {
                        multiplier -= 0.5; // -50% урона
                    }
                }
            }
        }
        
        // Ограничиваем множитель
        multiplier = Math.max(0.1, Math.min(2.0, multiplier));
        
        return Math.floor(baseDamage * multiplier);
    }
    
    // Обрабатывает победу над противником
    defeatEnemy() {
        const reward = this.currentEnemy.reward;
        this.enemiesDefeated++;
        this.enemyLevel++;
        
        // Добавляем опыт всем покемонам в команде
        for (const pokemon of this.pokemonManager.team) {
            this.pokemonManager.addExperience(pokemon.id, this.enemyLevel * 10);
        }
        
        // Создаем нового противника
        setTimeout(() => {
            this.createNewEnemy();
            this.updateUI();
        }, 1000);
        
        return reward;
    }
    
    // Обновляет UI боя
    updateUI() {
        if (!this.currentEnemy) return;
        
        // Обновляем HP бар
        const hpPercent = (this.currentEnemy.hp / this.currentEnemy.maxHp) * 100;
        const hpBar = document.getElementById('enemy-hp-bar');
        const hpText = document.getElementById('enemy-hp-text');
        
        if (hpBar) {
            hpBar.style.width = `${hpPercent}%`;
            
            // Меняем цвет в зависимости от HP
            if (hpPercent > 50) {
                hpBar.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
            } else if (hpPercent > 25) {
                hpBar.style.background = 'linear-gradient(90deg, #ffc107, #ffca2c)';
            } else {
                hpBar.style.background = 'linear-gradient(90deg, #dc3545, #e35d6a)';
            }
        }
        
        if (hpText) {
            hpText.textContent = `${this.currentEnemy.hp}/${this.currentEnemy.maxHp} HP`;
        }
        
        // Обновляем информацию о противнике
        const enemyName = document.getElementById('enemy-name');
        const enemyLevel = document.getElementById('enemy-level');
        const enemyRarity = document.getElementById('enemy-rarity');
        const enemyImage = document.getElementById('enemy-image');
        
        if (enemyName) enemyName.textContent = this.currentEnemy.name;
        if (enemyLevel) enemyLevel.textContent = this.currentEnemy.level;
        if (enemyRarity) {
            enemyRarity.textContent = GAME_CONFIG.RARITIES[this.currentEnemy.rarity].name;
            enemyRarity.className = `enemy-rarity ${this.currentEnemy.rarity.toLowerCase()}`;
        }
        if (enemyImage && this.currentEnemy.image) {
            enemyImage.src = this.currentEnemy.image;
        }
        
        // Обновляем общий урон команды
        const totalDamageElement = document.getElementById('total-damage');
        if (totalDamageElement) {
            totalDamageElement.textContent = this.pokemonManager.getTeamDamage();
        }
    }
    
    // Создает эффект урона
    createDamageEffect(damage, x, y) {
        const effect = document.createElement('div');
        effect.className = 'damage-effect';
        effect.textContent = `-${damage}`;
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        
        document.body.appendChild(effect);
        
        // Удаляем эффект после анимации
        setTimeout(() => effect.remove(), 1000);
    }
    
    // Запускает авто-атаку
    startAutoAttack(interval = GAME_CONFIG.AUTO_ATTACK_INTERVAL) {
        if (this.autoAttackInterval) {
            clearInterval(this.autoAttackInterval);
        }
        
        this.autoAttackInterval = setInterval(() => {
            this.autoAttack();
        }, interval);
    }
    
    // Останавливает авто-атаку
    stopAutoAttack() {
        if (this.autoAttackInterval) {
            clearInterval(this.autoAttackInterval);
            this.autoAttackInterval = null;
        }
    }
    
    // Авто-атака
    autoAttack() {
        const result = this.attackEnemy();
        
        if (result.defeated && result.reward) {
            this.showNotification(`Противник побежден! +${result.reward} поке-баксов`, 'info');
            
            // Проигрываем звук победы
            if (typeof GameSoundGenerator !== 'undefined') {
                GameSoundGenerator.playVictory();
            }
        }
        
        this.updateUI();
    }
    
    // Уведомление
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Экспорт системы боя
window.BattleSystem = BattleSystem;