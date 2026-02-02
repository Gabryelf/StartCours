// Управление интерфейсом
const UIManager = {
    // Обновление главного экрана
    updateMainScreen(gameState) {
        document.getElementById('mainLevel').textContent = gameState.level;
        document.getElementById('mainHints').textContent = gameState.hints;
        document.getElementById('mainAttempts').textContent = gameState.revealAttempts;
        
        const dailyBtn = document.getElementById('dailyMode');
        const dailyStatus = document.getElementById('dailyStatus');
        
        if (gameState.dailyCompleted) {
            dailyStatus.textContent = 'Пройдено';
            dailyStatus.className = 'mode-status status-completed';
            dailyBtn.disabled = true;
        } else {
            dailyStatus.textContent = 'Доступно';
            dailyStatus.className = 'mode-status status-available';
            dailyBtn.disabled = false;
        }
    },
    
    // Обновление игрового экрана
    updateGameScreen(gameState) {
        // Обновление статистики в хедере
        document.getElementById('currentLevel').textContent = gameState.level;
        document.getElementById('score').textContent = gameState.score;
        
        // Обновление попыток
        if (gameState.levelData) {
            const remainingAttempts = gameState.levelData.maxAttempts - gameState.attemptsUsed;
            document.getElementById('remainingAttempts').textContent = remainingAttempts;
            document.getElementById('totalLetters').textContent = gameState.levelData.maxAttempts;
        }
        
        // Обновление информации
        if (gameState.levelData) {
            const foundCount = gameState.foundWords.length;
            const totalWords = gameState.levelData.targetWords.length;
            document.getElementById('wordInfo').textContent = 
                `Найдено слов: ${foundCount}/${totalWords}`;
        }
    },
    
    // Отображение сетки слов
    renderWordsGrid(gameState) {
        const container = document.getElementById('wordsGrid');
        container.innerHTML = '';
        
        if (!gameState.levelData || !gameState.levelData.targetWords) {
            return;
        }
        
        gameState.levelData.targetWords.forEach(word => {
            const wordRow = document.createElement('div');
            wordRow.className = 'word-row';
            
            const isFound = gameState.foundWords.includes(word);
            
            gameState.levelData.wordCells[word].forEach((cell, index) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'letter-cell';
                
                if (isFound || cell.revealed) {
                    cellElement.textContent = cell.letter;
                    cellElement.classList.add('revealed');
                }
                
                wordRow.appendChild(cellElement);
            });
            
            container.appendChild(wordRow);
        });
    },
    
    // Отображение текущего ввода
    renderCurrentInput(gameState) {
        const container = document.getElementById('currentInput');
        container.innerHTML = '';
        
        gameState.currentInput.forEach(letter => {
            const div = document.createElement('div');
            div.className = 'input-letter';
            div.textContent = letter;
            container.appendChild(div);
        });
    },
    
    // Отображение круга с буквами
    renderCircleInput(gameState) {
        const container = document.getElementById('circleInput');
        container.innerHTML = '';
        
        if (!gameState.levelData || !gameState.levelData.availableLetters) {
            return;
        }
        
        // Центральная кнопка подтверждения
        const center = document.createElement('div');
        center.className = 'circle-center';
        center.innerHTML = '<i class="fas fa-check"></i>';
        center.title = 'Проверить слово';
        container.appendChild(center);
        
        // Буквы по кругу
        const letters = gameState.levelData.availableLetters;
        const radius = 75;
        const centerX = 110;
        const centerY = 110;
        
        letters.forEach((letter, index) => {
            const angle = (index / letters.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            const btn = document.createElement('div');
            btn.className = 'circle-letter';
            btn.textContent = letter;
            btn.style.left = `${x - 18}px`;
            btn.style.top = `${y - 18}px`;
            btn.title = `Набрать букву ${letter}`;
            
            container.appendChild(btn);
        });
    },
    
    // Показать экран завершения уровня
    showLevelComplete(gameState) {
        if (!gameState.levelData) return;
        
        document.getElementById('resultFound').textContent = 
            `${gameState.foundWords.length}/${gameState.levelData.targetWords.length}`;
        document.getElementById('resultScore').textContent = gameState.score;
        document.getElementById('resultAttempts').textContent = 
            gameState.levelData.maxAttempts - gameState.attemptsUsed;
        document.getElementById('resultNextLevel').textContent = gameState.level + 1;
        
        document.getElementById('resultIcon').textContent = '🏆';
        document.getElementById('resultTitle').textContent = 'Уровень пройден!';
        document.getElementById('resultMessage').textContent = 
            `Отлично! Вы нашли все ${gameState.levelData.targetWords.length} слов.`;
        
        document.getElementById('nextLevelBtn').style.display = 'flex';
    },
    
    // Показать экран провала уровня
    showLevelFailed(gameState) {
        if (!gameState.levelData) return;
        
        document.getElementById('resultFound').textContent = 
            `${gameState.foundWords.length}/${gameState.levelData.targetWords.length}`;
        document.getElementById('resultScore').textContent = gameState.score;
        document.getElementById('resultAttempts').textContent = 0;
        document.getElementById('resultNextLevel').textContent = gameState.level;
        
        document.getElementById('resultIcon').textContent = '😔';
        document.getElementById('resultTitle').textContent = 'Уровень не пройден';
        document.getElementById('resultMessage').textContent = 
            `Попытки закончились. Попробуйте еще раз!`;
        
        document.getElementById('nextLevelBtn').style.display = 'none';
    },
    
    // Показать сообщение
    showMessage(text, icon = '✨') {
        document.getElementById('messageIcon').textContent = icon;
        document.getElementById('messageText').textContent = text;
        document.getElementById('messageOverlay').classList.add('active');
        
        setTimeout(() => {
            if (document.getElementById('messageOverlay').classList.contains('active')) {
                this.hideMessage();
            }
        }, 2000);
    },
    
    // Скрыть сообщение
    hideMessage() {
        document.getElementById('messageOverlay').classList.remove('active');
    }
};