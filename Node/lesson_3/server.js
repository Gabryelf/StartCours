const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const helper = require("./utils/helper");
const fileManager = require("./utils/fileManager");

let notes = [];

// Инициализация
(async () => {
    notes = await fileManager.loadFile().catch(() => []);
})();

const server = http.createServer(async (req, res) => {
    const { url, method } = req;
    
    if (url === '/favicon.ico') return res.end();
    
    try {
        // Статика
        if (url === '/' && method === 'GET') {
            const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        }
        else if (url === '/app.js' && method === 'GET') {
            const js = await fs.readFile(path.join(__dirname, 'app.js'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(js);
        }
        // API
        else if (url === '/api/notes' && method === 'GET') {
            res.end(JSON.stringify(notes));
        }
        else if (url === '/api/notes' && method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const { title, content } = JSON.parse(body);
                
                notes.push({
                    id: notes.length + 1,
                    title, 
                    content,
                    date: new Date().toLocaleString()
                });
                
                notes = helper.reindexId(notes);
                await fileManager.saveFile(notes);
                res.end(JSON.stringify({ success: true }));
            });
        }
        else if (url.startsWith('/api/notes/') && method === 'DELETE') {
            const id = parseInt(url.split('/')[3]);
            
            if (id > 0 && id <= notes.length) {
                notes.splice(id - 1, 1);
                notes = helper.reindexId(notes);
                await fileManager.saveFile(notes);
                res.end(JSON.stringify({ success: true }));
            }
        }
        else {
            res.writeHead(404);
            res.end('Not Found');
        }
    } catch (error) {
        res.writeHead(500);
        res.end('Server Error');
    }
});

server.listen(3000, () => console.log('http://localhost:3000'));