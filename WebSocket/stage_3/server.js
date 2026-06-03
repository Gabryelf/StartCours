const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8000, () => {
    console.log('http://localhost:8000');
});
const io = socketio(expressServer);

io.on('connection', (socket) => {
    console.log(socket.id, 'has connected');

    //socket.emit('messageFromServer', {data: "Welcom to the socket io server!"})
    socket.on('newMessageFromServer', (dataFromClients) => { 
        io.emit('newMessageToClients', {text:dataFromClients.text});
    });
});

