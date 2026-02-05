// ==============================
// СИСТЕМА ТУТОРИАЛА (исправленная)
// ==============================

class TutorialSystem {
    constructor(game) {
        this.game = game;
        this.currentStep = 0;
        this.totalSteps = 5;
        this.isTutorialActive = true;
        this.tutorialElement = document.getElementById('tutorial');
        
        this.init();
    }
    
    init() {
        console.log('🎮 Инициализация туториала...');
        
        // Проверяем, проходил ли игрок туториал
        const hasCompletedTutorial = localStorage.getItem('pokemon_tutorial_completed');
        
        if (hasCompletedTutorial === 'true') {
            console.log('✅ Игрок уже прошел туториал');
            this.hideTutorial();
            return;
        }
        
        this.showTutorial();
        this.bindEvents();
    }
    
    showTutorial() {
        if (this.tutorialElement) {
            this.tutorialElement.style.display = 'flex';
            this.showStep(1);
            console.log('👋 Туториал показан');
        } else {
            console.error('❌ Элемент туториала не найден');
        }
    }
    
    hideTutorial() {
        if (this.tutorialElement) {
            this.tutorialElement.style.display = 'none';
        }
        this.isTutorialActive = false;
        
        // Разблокируем кнопку атаки
        const attackButton = document.getElementById('attack-button');
        if (attackButton) {
            attackButton.disabled = false;
            attackButton.classList.remove('disabled');
        }
        
        // Запускаем авто-атаку
        if (this.game.battleSystem) {
            this.game.battleSystem.startAutoAttack();
        }
        
        console.log('🎉 Туториал завершен');
    }
    
    showStep(stepNumber) {
        console.log(`📝 Показываем шаг ${stepNumber}`);
        
        // Скрываем все шаги
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepElement = document.getElementById(`step-${i}`);
            if (stepElement) {
                stepElement.classList.remove('active');
            }
        }
        
        // Показываем текущий шаг
        const currentStepElement = document.getElementById(`step-${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            this.currentStep = stepNumber;
            
            // Обновляем текст кнопки
            this.updateButtonText();
        }
    }
    
    updateButtonText() {
        const buttons = document.querySelectorAll('.tutorial-btn');
        buttons.forEach(button => {
            switch(this.currentStep) {
                case 1:
                    button.textContent = 'Начать обучение';
                    break;
                case 2:
                    button.textContent = 'Открыть покебол';
                    break;
                case 3:
                    button.textContent = 'Посмотреть коллекцию';
                    break;
                case 4:
                    button.textContent = 'Выбрать команду';
                    break;
                case 5:
                    button.textContent = 'Начать игру!';
                    break;
            }
        });
    }
    
    bindEvents() {
        console.log('🔗 Привязываем события туториала');
        
        // Обработчики кнопок туториала
        document.querySelectorAll('.tutorial-btn').forEach(button => {
            // Удаляем старые обработчики
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Добавляем новый обработчик
            newButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('🖱️ Нажата кнопка туториала');
                this.handleTutorialAction();
            });
        });
        
        // Обработчик для всех кнопок внутри туториала
        if (this.tutorialElement) {
            this.tutorialElement.addEventListener('click', (e) => {
                if (e.target.classList.contains('tutorial-btn')) {
                    e.stopPropagation();
                }
            });
        }
    }
    
    async handleTutorialAction() {
        console.log(`🎯 Обработка шага ${this.currentStep}`);
        
        switch(this.currentStep) {
            case 1:
                console.log('➡️ Переход к шагу 2');
                this.showStep(2);
                break;
                
            case 2:
                console.log('🎁 Открываем первый покебол');
                await this.openFirstPokeball();
                this.showStep(3);
                break;
                
            case 3:
                console.log('📚 Показываем коллекцию');
                this.showCollection();
                this.showStep(4);
                break;
                
            case 4:
                console.log('👥 Показываем выбор команды');
                this.showTeamSelection();
                this.showStep(5);
                break;
                
            case 5:
                console.log('🚀 Завершаем туториал');
                this.completeTutorial();
                break;
        }
    }
    
    async openFirstPokeball() {
        console.log('🔄 Открываем покебол...');
        
        // Открываем модальное окно покеболов
        this.game.uiManager.showModal('pokeball');
        
        // Ждем, чтобы окно успело открыться
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
            // Открываем обычный покебол
            const pokemon = this.game.shopSystem.openPokeball('NORMAL');
            
            if (pokemon) {
                console.log(`✨ Получен покемон: ${pokemon.name}`);
                
                // Автоматически добавляем покемона в команду
                setTimeout(() => {
                    const result = this.game.addToTeam(pokemon.id);
                    
                    if (result.success) {
                        // Закрываем модальное окно
                        const modal = document.getElementById('pokeball-modal');
                        if (modal) {
                            modal.style.display = 'none';
                        }
                        
                        // Показываем уведомление
                        this.showNotification(`Ты получил ${pokemon.name}! Он добавлен в твою команду.`, 'success');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('❌ Ошибка при открытии покебола:', error);
            this.showNotification('Ошибка при открытии покебола', 'error');
        }
    }
    
    showCollection() {
        console.log('📖 Открываем коллекцию...');
        
        // Открываем коллекцию
        this.game.uiManager.showModal('collection');
        
        // Обновляем UI коллекции
        setTimeout(() => {
            this.game.uiManager.createCollectionUI();
            
            // Автоматически закрываем через 3 секунды
            setTimeout(() => {
                const modal = document.getElementById('collection-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
                console.log('📖 Коллекция просмотрена');
            }, 3000);
        }, 300);
    }
    
    showTeamSelection() {
        console.log('👥 Открываем выбор команды...');
        
        // Открываем выбор команды
        this.game.uiManager.showModal('team');
        
        // Обновляем UI выбора команды
        setTimeout(() => {
            this.game.uiManager.createTeamSelectionUI();
            
            // Автоматически закрываем через 4 секунды
            setTimeout(() => {
                const modal = document.getElementById('team-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
                console.log('👥 Выбор команды просмотрен');
            }, 4000);
        }, 300);
    }
    
    completeTutorial() {
        console.log('🏁 Завершение туториала...');
        
        // Сохраняем статус прохождения туториала
        localStorage.setItem('pokemon_tutorial_completed', 'true');
        
        // Скрываем туториал
        this.hideTutorial();
        
        // Показываем финальное уведомление
        this.showNotification('Туториал завершен! Теперь ты готов к битве! Удачи!', 'success');
        
        // Включаем звук, если доступен
        if (typeof GameSoundGenerator !== 'undefined') {
            GameSoundGenerator.playVictory();
        }
    }
    
    showNotification(message, type = 'info') {
        console.log(`💬 Уведомление: ${message}`);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'error' ? 'exclamation-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        const container = document.getElementById('notification-container');
        if (container) {
            container.appendChild(notification);
            
            // Автоматически удаляем через 5 секунд
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    }
}

// Экспорт системы туториала
window.TutorialSystem = TutorialSystem;