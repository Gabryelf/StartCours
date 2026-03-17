let notes = [];

async function load() {
    let r = await fetch('/api/notes');
    notes = await r.json();
    stats.innerText = 'Заметок: ' + notes.length;
}

async function show() {
    await load();
    let h = '<h3>Все заметки:</h3>';
    notes.forEach(n => {
        h += '<div style="border:1px solid black; margin:5px; padding:5px;">';
        h += '[' + n.id + '] ' + n.date + '<br><b>' + n.title + '</b><br>' + n.content + '</div>';
    });
    content.innerHTML = h || '<p>Нет заметок</p>';
}

async function add() {
    let t = prompt('Заголовок?');
    let c = prompt('Текст?');
    if (t && c) {
        await fetch('/api/notes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: t, content: c})
        });
        load();
        show();
    }
}

async function del() {
    await load();
    if (!notes.length) return alert('Нет заметок');
    let ids = notes.map(n => n.id + ': ' + n.title).join('\n');
    let id = prompt('Номер для удаления?\n' + ids);
    if (id) {
        await fetch('/api/notes/' + id, {method: 'DELETE'});
        load();
        show();
    }
}

let stats = document.getElementById('stats');
let content = document.getElementById('content');
load();