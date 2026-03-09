const STORAGE_KEY = 'my_notes';

function loadNotes() {
    const notesJson = localStorage.getItem(STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
}

function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    displayNotes();
}

function displayNotes() {
    const notes = loadNotes();
    const notesDiv = document.getElementById('notes');
    
    if (notes.length === 0) {
        notesDiv.innerHTML = '<p>Пока нет заметок. Создайте первую!</p>';
        return;
    }

    let html = '<h2>Сохраненные заметки:</h2>';
    notes.forEach(note => {
        html += `
            <div class="note">
                <button class="delete-btn" onclick="deleteNote(${note.id})">❌</button>
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <small>📅 ${note.date}</small>
            </div>
        `;
    });
    
    notesDiv.innerHTML = html;
}

function saveToLocalStorage() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        alert('Пожалуйста, заполните и заголовок, и содержание!');
        return;
    }

    const notes = loadNotes();
    
    const newNote = {
        id: Date.now(), 
        title: title,
        content: content,
        date: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes(notes);

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';

    alert('✅ Заметка сохранена в localStorage!');
}

function deleteNote(id) {
    if (confirm('Удалить эту заметку?')) {
        const notes = loadNotes();
        const filteredNotes = notes.filter(note => note.id !== id);
        saveNotes(filteredNotes);
    }
}

function clearAllNotes() {
    if (confirm('Вы уверены, что хотите удалить ВСЕ заметки?')) {
        localStorage.removeItem(STORAGE_KEY);
        displayNotes();
    }
}

displayNotes();