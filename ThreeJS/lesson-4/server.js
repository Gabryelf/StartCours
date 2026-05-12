import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname)));

// Хранилище
const sessions = new Map();
const players = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Игрок подключен: ${socket.id}`);
  
  // Создание сессии
  socket.on('create_session', (playerData) => {
    const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const session = {
      id: sessionId,
      host: socket.id,
      players: [{ id: socket.id, name: playerData.name, ship: playerData.ship }],
      status: 'waiting'
    };
    
    sessions.set(sessionId, session);
    players.set(socket.id, { sessionId, name: playerData.name, ship: playerData.ship });
    
    socket.join(sessionId);
    socket.emit('session_created', { sessionId });
    console.log(`🎮 Создана сессия: ${sessionId} (хост: ${socket.id})`);
  });
  
  // Проверка хоста
  socket.on('check_host', (sessionId) => {
    const session = sessions.get(sessionId);
    if (session) {
      socket.emit('host_status', session.host === socket.id);
    }
  });
  
  // Присоединение к сессии
  socket.on('join_session', ({ sessionId, playerData }) => {
    const session = sessions.get(sessionId);
    
    if (!session) {
      socket.emit('error', 'Сессия не найдена');
      return;
    }
    
    if (session.players.length >= 4) {
      socket.emit('error', 'Сессия заполнена (максимум 4 игрока)');
      return;
    }
    
    if (session.status !== 'waiting') {
      socket.emit('error', 'Игра уже началась');
      return;
    }
    
    const newPlayer = { id: socket.id, name: playerData.name, ship: playerData.ship };
    session.players.push(newPlayer);
    players.set(socket.id, { sessionId, name: playerData.name, ship: playerData.ship });
    socket.join(sessionId);
    
    // Обновляем всех игроков в лобби
    io.to(sessionId).emit('player_joined', {
      players: session.players.map(p => ({ id: p.id, name: p.name, ship: p.ship }))
    });
    
    socket.emit('session_joined', { sessionId });
    console.log(`👥 ${playerData.name} присоединился к ${sessionId}`);
  });
  
  
  // Обновление позиции
  socket.on('player_update', (data) => {
    const player = players.get(socket.id);
    if (player && player.sessionId) {
      socket.to(player.sessionId).emit('opponent_update', {
        id: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    }
  });
  
  // Выстрел
  socket.on('shoot', (data) => {
    const player = players.get(socket.id);
    if (player && player.sessionId) {
      socket.to(player.sessionId).emit('opponent_shot', {
        id: socket.id,
        origin: data.origin,
        direction: data.direction,
        weaponType: data.weaponType
      });
    }
  });
  
  // Игрок умер
  socket.on('player_dead', () => {
    const player = players.get(socket.id);
    if (player && player.sessionId) {
      const session = sessions.get(player.sessionId);
      if (session) {
        session.players = session.players.filter(p => p.id !== socket.id);
        io.to(player.sessionId).emit('player_left', socket.id);
        
        if (session.players.length === 1) {
          const winner = session.players[0];
          io.to(player.sessionId).emit('game_over', { winner: winner.name });
          sessions.delete(player.sessionId);
          console.log(`🏆 Победитель: ${winner.name}`);
        } else if (session.host === socket.id && session.players.length > 0) {
          session.host = session.players[0].id;
          io.to(player.sessionId).emit('new_host', session.host);
        }
      }
      players.delete(socket.id);
    }
  });

  // Добавьте эту функцию в server.js
function getRandomSpawnPosition(playerIndex, totalPlayers) {
    // Распределяем игроков по кругу радиусом 15-20 единиц
    const angle = (playerIndex / totalPlayers) * Math.PI * 2;
    const radius = 15;
    return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        y: 0
    };
}

    // В обработчике game_started измените:
    socket.on('start_game', (sessionId) => {
        const session = sessions.get(sessionId);
        
        if (!session) {
            socket.emit('error', 'Сессия не найдена');
            return;
        }
        
        if (session.host !== socket.id) {
            socket.emit('error', 'Только хост может начать игру');
            return;
        }
        
        if (session.players.length < 2) {
            socket.emit('error', 'Нужно минимум 2 игрока');
            return;
        }
        
        session.status = 'playing';
        
        // 👈 ГЕНЕРИРУЕМ ПОЗИЦИИ ДЛЯ ВСЕХ ИГРОКОВ
        const playersWithPositions = session.players.map((player, index) => ({
            id: player.id,
            name: player.name,
            ship: player.ship,
            position: getRandomSpawnPosition(index, session.players.length)
        }));
        
        io.to(sessionId).emit('game_started', {
            players: playersWithPositions,
            startTime: Date.now()
        });
        
        console.log(`🎬 Игра началась в сессии ${sessionId} (${session.players.length} игроков)`);
    });
  
  // Отключение
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    
    if (player && player.sessionId) {
      const session = sessions.get(player.sessionId);
      
      if (session) {
        session.players = session.players.filter(p => p.id !== socket.id);
        io.to(player.sessionId).emit('player_left', socket.id);
        
        if (session.players.length === 0) {
          sessions.delete(player.sessionId);
          console.log(`🗑️ Сессия ${player.sessionId} удалена`);
        } else if (session.players.length === 1) {
          const winner = session.players[0];
          io.to(player.sessionId).emit('game_over', { winner: winner.name });
          sessions.delete(player.sessionId);
          console.log(`🏆 Победитель по отключению: ${winner.name}`);
        } else if (session.host === socket.id) {
          session.host = session.players[0].id;
          io.to(player.sessionId).emit('new_host', session.host);
        }
      }
      
      players.delete(socket.id);
      console.log(`👋 Игрок отключился: ${socket.id}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║     🚀 SPACE ARENA SERVER 🚀          ║
  ║     http://localhost:${PORT}           ║
  ║                                        ║
  ║ 1. Выберите корабль в 3D сцене        ║
  ║ 2. Нажмите "В БОЙ!"                   ║
  ║ 3. Создайте или присоединитесь        ║
  ║ 4. Хост нажимает СТАРТ                ║
  ╚════════════════════════════════════════╝
  `);
});