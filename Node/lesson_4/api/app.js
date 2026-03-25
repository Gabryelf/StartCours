window.showNotes = showNotes;
window.addNote = addNote;
window.deleteNote = deleteNote;
window.editNote = editNote;

let notes = [];

// Элементы страницы
const statsEl   = document.getElementById('stats');
const contentEl = document.getElementById('content');

// Загрузить заметки с сервера
async function loadNotes() {
    try {
        const res = await fetch('/api/notes');
        notes = await res.json();
        statsEl.innerText = `Заметок: ${notes.length}`;
    } catch (err) {
        console.error('Ошибка загрузки заметок', err);
        statsEl.innerText = 'Ошибка загрузки';
    }
}

// Показать все заметки
async function showNotes() {
    await loadNotes();

    if (notes.length === 0) {
        contentEl.innerHTML = '<p>Пока нет заметок</p>';
        return;
    }

    let html = '<h3>Заметки:</h3>';
    notes.forEach(note => {
        html += `
            <div style="border:1px solid #ccc; margin:8px 0; padding:10px; border-radius:4px;">
                <small>[${note.id}] ${note.date}</small><br>
                <strong>${note.title}</strong><br>
                ${note.content}
            </div>
        `;
    });

    contentEl.innerHTML = html;
}

// Добавить новую заметку
async function addNote() {
    const title   = prompt('Заголовок заметки:');
    const content = prompt('Текст заметки:');

    if (!title || !content) return;

    try {
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });

        // После добавления сразу обновляем список
        await showNotes();
    } catch (err) {
        alert('Не удалось добавить заметку');
        console.error(err);
    }
}

// Удалить заметку
async function deleteNote() {
    await loadNotes();

    if (notes.length === 0) {
        alert('Нет заметок для удаления');
        return;
    }

    const list = notes.map(n => `${n.id}: ${n.title}`).join('\n');
    const input = prompt(`Введите номер заметки для удаления:\n\n${list}`);

    if (!input) return;

    const id = parseInt(input);
    if (isNaN(id)) {
        alert('Нужно ввести число');
        return;
    }

    try {
        const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await showNotes();
        } else {
            alert('Не удалось удалить заметку');
        }
    } catch (err) {
        alert('Ошибка при удалении');
        console.error(err);
    }
}

async function editNote() {
    await loadNotes();
    
    if (notes.length === 0) {
        alert('Нет заметок для редактирования');
        return;
    }
    
    const list = notes.map(note => `${note.id}: ${note.title}`).join('\n');
    const input_id = prompt(`Выберите номер заметки для редактирования:\n\n${list}`);
    
    if (!input_id) return;
    
    const id = parseInt(input_id);
    if (isNaN(id)) {
        alert('Нужно ввести число');
        return;
    }
    // Находим заметку по id
    const note = notes.find(note => note.id === id); 
    if (!note) {
        alert('Заметка не найдена');
        return;
    }
    
    const newTitle = prompt('Редактировать заголовок:', note.title);
    const newContent = prompt('Редактировать текст:', note.content);
    
    if (newTitle && newContent) {
        const updateRes = await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });
        
        if (updateRes.ok) {
            await showNotes();
            alert('Заметка успешно обновлена!');
        } else {
            const error = await updateRes.json();
            alert(`Ошибка: ${error.error || 'Не удалось обновить заметку'}`);
        }
    }
}

// При загрузке страницы сразу показываем заметки
loadNotes();