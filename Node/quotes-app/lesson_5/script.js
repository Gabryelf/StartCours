// Массив для хранения цитат
let quotes = [];

// Загружаем сохранённые цитаты из localStorage
function loadQuotes() {
    const saved = localStorage.getItem('quotes');
    if (saved) {
        quotes = JSON.parse(saved);
    }
    renderQuotes();
}

// Сохраняем цитаты в localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Отображаем все цитаты
function renderQuotes() {
    const quotesList = document.getElementById('quotesList');
    quotesList.innerHTML = '';
    
    quotes.forEach((quote, index) => {
        const quoteCard = document.createElement('div');
        quoteCard.className = 'quote-card';
        quoteCard.innerHTML = `
            <div class="quote-text">"${quote.text}"</div>
            <div class="quote-author">— ${quote.author}</div>
            <button class="delete-btn" data-index="${index}">Удалить</button>
        `;
        quotesList.appendChild(quoteCard);
    });
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            quotes.splice(index, 1);
            saveQuotes();
            renderQuotes();
        });
    });
}

// Добавляем новую цитату
function addQuote() {
    const textInput = document.getElementById('quoteText');
    const authorInput = document.getElementById('quoteAuthor');
    const text = textInput.value.trim();
    const author = authorInput.value.trim();
    
    if (text && author) {
        quotes.push({ text, author });
        saveQuotes();
        renderQuotes();
        textInput.value = '';
        authorInput.value = '';
    } else {
        alert('Пожалуйста, заполните оба поля');
    }
}

// Настраиваем обработчики событий
document.getElementById('addBtn').addEventListener('click', addQuote);
document.getElementById('quoteText').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addQuote();
});

// Загружаем цитаты при старте
loadQuotes();