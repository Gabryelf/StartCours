const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const fileManager = require('./utils/fileManager');
const helper = require('./utils/helper');

let notes = [];

// При старте сервера сразу загружаем заметки из файла (или пустой массив)
(async () => {
    try {
        notes = await fileManager.loadFile();
    } catch {
        notes = [];
    }
})();

const server = http.createServer(async (req, res) => {
    const { url, method } = req;

    // Игнорируем запрос favicon
    if (url === '/favicon.ico') {
        res.end();
        return;
    }

    try {
        // Главная страница
        if (url === '/' && method === 'GET') {
            const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }

        // Файл со скриптом
        if (url === '/app.js' && method === 'GET') {
            const js = await fs.readFile(path.join(__dirname, 'app.js'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(js);
            return;
        }

        // ────────────────────────────────────────────────
        // API
        // ────────────────────────────────────────────────

        // Получить все заметки
        if (url === '/api/notes' && method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(notes));
            return;
        }

        // Добавить новую заметку
        if (url === '/api/notes' && method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    const { title, content } = JSON.parse(body);

                    // Добавляем заметку
                    notes.push({
                        id: notes.length + 1,
                        title,
                        content,
                        date: new Date().toLocaleString()
                    });

                    // Переиндексируем id (1,2,3...)
                    notes = helper.reindexId(notes);

                    // Сохраняем на диск
                    await fileManager.saveFile(notes);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, error: 'Bad request' }));
                }
            });
            return;
        }

        // Удалить заметку по id
        if (url.startsWith('/api/notes/') && method === 'DELETE') {
            const id = parseInt(url.split('/')[3]);

            if (id > 0 && id <= notes.length) {
                notes.splice(id - 1, 1);           // удаляем
                notes = helper.reindexId(notes);   // обновляем номера
                await fileManager.saveFile(notes); // сохраняем

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ success: false, error: 'Note not found' }));
            }
            return;
        }

        // Всё остальное — 404
        res.writeHead(404);
        res.end('Not Found');
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end('Server Error');
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен → http://localhost:3000');
});