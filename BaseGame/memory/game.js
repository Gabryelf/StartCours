// ВСЯ логика игры в одном файле
// Используем IIFE (Immediately Invoked Function Expression) чтобы не засорять глобальную область

const Game = (function() {
    // Приватные переменные
    let cards = [];
    let openedCards = [];
    let attempts = 0;
    let pairsFound = 0;
    let locked = false;
    let cardsImages = [];
    
    // DOM элементы
    let boardElement;
    let attemptsElement;
    let pairsFoundElement;
    
    // Вспомогательные функции
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    function render() {
        // Обновляем статистику
        if (attemptsElement) attemptsElement.textContent = attempts;
        if (pairsFoundElement) pairsFoundElement.textContent = pairsFound;
        
        // Очищаем доску
        if (!boardElement) return;
        boardElement.innerHTML = '';
        
        // Рисуем карточки
        cards.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            if (card.isMatched) cardDiv.classList.add('matched');
            
            if (card.isFlipped || card.isMatched) {
                const img = document.createElement('img');
                img.src = card.image;
                img.alt = 'card';
                cardDiv.appendChild(img);
            } else {
                const front = document.createElement('div');
                front.className = 'card-front';
                front.textContent = '❓';
                cardDiv.appendChild(front);
            }
            
            cardDiv.onclick = (function(idx) {
                return function() { handleCardClick(idx); };
            })(index);
            
            boardElement.appendChild(cardDiv);
        });
    }
    
    function handleCardClick(index) {
        if (locked) return;
        if (cards[index].isFlipped) return;
        if (cards[index].isMatched) return;
        
        cards[index].isFlipped = true;
        openedCards.push(index);
        render();
        
        if (openedCards.length === 2) {
            attempts++;
            render();
            
            const [i1, i2] = openedCards;
            const card1 = cards[i1];
            const card2 = cards[i2];
            
            if (card1.image === card2.image) {
                card1.isMatched = true;
                card2.isMatched = true;
                pairsFound++;
                openedCards = [];
                render();
                
                if (pairsFound === cardsImages.length) {
                    setTimeout(() => {
                        alert(`🎉 Победа! Попыток: ${attempts}`);
                    }, 50);
                }
            } else {
                locked = true;
                setTimeout(() => {
                    cards[i1].isFlipped = false;
                    cards[i2].isFlipped = false;
                    openedCards = [];
                    locked = false;
                    render();
                }, 800);
            }
        }
    }
    
    function resetGame() {
        if (!cardsImages.length) return;
        
        let deck = [...cardsImages, ...cardsImages];
        deck = shuffle(deck);
        
        cards = deck.map((image, index) => ({
            id: index,
            image: image,
            isFlipped: false,
            isMatched: false
        }));
        
        openedCards = [];
        attempts = 0;
        pairsFound = 0;
        locked = false;
        
        render();
    }
    
    function initGame(images, boardEl, attemptsEl, pairsFoundEl) {
        cardsImages = images;
        boardElement = boardEl;
        attemptsElement = attemptsEl;
        pairsFoundElement = pairsFoundEl;
        
        resetGame();
    }
    
    // Публичное API
    return {
        init: initGame,
        restart: resetGame
    };
})();