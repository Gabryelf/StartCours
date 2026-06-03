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

    socket.on('joinRoom', (roomName) => {
        if (socket.currentRoom) {
            socket.leave(socket.currentRoom);
        }
        socket.join(roomName);
        socket.currentRoom = roomName;
    });

    socket.on('newMessageFromServer', (data) => { 
        if (socket.currentRoom) {
            io.to(socket.currentRoom).emit('newMessageToClients', { 
                text: data.text,
                room: socket.currentRoom
            });
        }
    });
});