// Управление интерфейсом
const UI = {
    currentScreen: 'mainScreen',
    
    // Показать экран
    showScreen(screenId) {
        this.currentScreen = screenId;
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },
    
    // Обновить игровой экран
    updateGameScreen(state) {
        if (!state.levelData) return;
        
        // Обновить статистику
        document.getElementById('currentLevel').textContent = state.level;
        document.getElementById('score').textContent = state.score;
        document.getElementById('attempts').textContent = state.attempts;
        
        // Обновить информацию
        const foundCount = state.foundWords.length;
        const totalWords = state.levelData.words.length;
        document.getElementById('wordInfo').textContent = 
            `Найдено слов: ${foundCount}/${totalWords}`;
        
        // Отрисовать слова
        this.renderWordsGrid(state);
        
        // Отрисовать текущий ввод
        this.renderCurrentInput(state);
        
        // Отрисовать круг с буквами
        this.renderCircleInput(state);
    },
    
    // Отрисовать сетку слов
    renderWordsGrid(state) {
        const container = document.getElementById('wordsGrid');
        container.innerHTML = '';
        container.className = 'words-grid';
        
        state.levelData.words.forEach(word => {
            const row = document.createElement('div');
            row.className = 'word-row';
            
            word.split('').forEach((letter, index) => {
                const cell = document.createElement('div');
                cell.className = 'letter-cell';
                
                if (state.foundWords.includes(word)) {
                    cell.textContent = letter;
                    cell.classList.add('revealed');
                }
                
                row.appendChild(cell);
            });
            
            container.appendChild(row);
        });
    },
    
    // Отрисовать текущий ввод
    renderCurrentInput(state) {
        const container = document.getElementById('currentInput');
        container.innerHTML = '';
        
        state.currentInput.forEach(letter => {
            const div = document.createElement('div');
            div.className = 'input-letter';
            div.textContent = letter;
            container.appendChild(div);
        });
    },
    
    // Отрисовать круг с буквами
    renderCircleInput(state) {
        const container = document.getElementById('circleInput');
        container.innerHTML = '';
        
        // Центральная кнопка
        const center = document.createElement('div');
        center.className = 'circle-center';
        center.textContent = '✓';
        center.title = 'Проверить слово';
        container.appendChild(center);
        
        // Буквы по кругу
        const letters = state.levelData.letters;
        const radius = CONFIG.CIRCLE_RADIUS;
        const centerX = CONFIG.CIRCLE_CENTER_X;
        const centerY = CONFIG.CIRCLE_CENTER_Y;
        
        letters.forEach((letter, index) => {
            const angle = (index / letters.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            const btn = document.createElement('div');
            btn.className = 'circle-letter';
            btn.textContent = letter;
            btn.style.left = `${x - CONFIG.CIRCLE_LETTER_SIZE / 2}px`;
            btn.style.top = `${y - CONFIG.CIRCLE_LETTER_SIZE / 2}px`;
            btn.title = `Добавить букву ${letter}`;
            
            container.appendChild(btn);
        });
    },
    
    // Показать уровень завершен
    showLevelComplete(state) {
        document.getElementById('resultIcon').textContent = '🎉';
        document.getElementById('resultTitle').textContent = 'Уровень пройден!';
        document.getElementById('resultMessage').textContent = 
            `Отлично! Вы нашли все ${state.levelData.words.length} слов.`;
        
        document.getElementById('resultFound').textContent = 
            `${state.foundWords.length}/${state.levelData.words.length}`;
        document.getElementById('resultScore').textContent = state.score;
        document.getElementById('resultNextLevel').textContent = state.level + 1;
        
        document.getElementById('nextLevelBtn').style.display = 'block';
    },
    
    // Показать уровень провален
    showLevelFailed(state) {
        document.getElementById('resultIcon').textContent = '😔';
        document.getElementById('resultTitle').textContent = 'Попытки закончились';
        document.getElementById('resultMessage').textContent = 
            'Попробуйте еще раз!';
        
        document.getElementById('resultFound').textContent = 
            `${state.foundWords.length}/${state.levelData.words.length}`;
        document.getElementById('resultScore').textContent = state.score;
        document.getElementById('resultNextLevel').textContent = state.level;
        
        document.getElementById('nextLevelBtn').style.display = 'none';
    },
    
    // Показать всплывающее сообщение
    showMessage(text, icon = '') {
        const message = document.createElement('div');
        message.className = 'floating-message';
        message.innerHTML = icon ? `${icon} ${text}` : text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 1500);
    }
};