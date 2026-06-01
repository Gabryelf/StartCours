//________________встроенный модуль javascript
const http = require('http');
//________________сторонний модуль добавленный через npm
const websocket = require('ws');
//________________создаем сервер из модуля http
const server = http.createServer((req, res) => {
    res.end('------------Connected-----------');
});

const wss = new websocket.WebSocketServer({server: server});

wss.on('headers', (headers, req) => {
    console.log(headers);
});

wss.on('connection', (ws, req) => {
    ws.send('Добро пожаловать на Web Socket Server!');
    ws.on('message', (data) => {
        console.log(data.toString());
    });
})

//________________поднимаем сервер на порту 8000
server.listen(8000, () => {
    console.log('Сервер запущен: http://localhost:8000'); 
});

