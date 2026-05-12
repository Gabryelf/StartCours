import * as THREE from 'three';
import { io } from 'socket.io-client';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';
import { ModelLoader } from './core/ModelLoader.js';
import { GameEngine } from './core/GameEngine.js';
import { SHIP_STATS } from './config/shipStats.js';
import { MODELS_CONFIG } from './config/models.js';

class Game {
    constructor() {
        this.renderer = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.modelLoader = null;
        
        // Мультиплеер
        this.socket = null;
        this.sessionId = null;
        this.playerId = null;
        this.gameEngine = null;
        
        // Выбор корабля
        this.selectedShipId = 'assault';
        this.shipConfirmed = false;
        
        this.time = 0;
        
        this.init();
        this.setupUI();
    }

    async init() {
        // Рендерер
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        // Сцена
        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();

        // Камера
        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createControls();

        // Освещение
        this.lightManager = new LightManager(scene);
        this.lightManager.createAll();

        // Загрузчик моделей
        this.modelLoader = new ModelLoader(scene);
        this.modelLoader.setModels(MODELS_CONFIG.ships);
        
        // Загружаем первую модель
        await this.modelLoader.showModel(0);
        this.selectedShipId = MODELS_CONFIG.ships[0].id;
        this.updateShipStatsPreview(this.selectedShipId);

        window.addEventListener('resize', () => this.onWindowResize());

        this.animate();
    }

    setupUI() {
        // Навигация по кораблям
        const prevBtn = document.getElementById('prev-model');
        const nextBtn = document.getElementById('next-model');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', async () => {
                await this.modelLoader.switchToPrev();
                this.selectedShipId = this.modelLoader.getCurrentModelInfo().id;
                this.updateShipStatsPreview(this.selectedShipId);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', async () => {
                await this.modelLoader.switchToNext();
                this.selectedShipId = this.modelLoader.getCurrentModelInfo().id;
                this.updateShipStatsPreview(this.selectedShipId);
            });
        }
        
        // Подтверждение выбора корабля
        const confirmBtn = document.getElementById('confirm-ship');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.shipConfirmed = true;
                document.getElementById('ship-selection-ui').style.display = 'none';
                document.getElementById('multiplayer-menu').style.display = 'flex';
                
                const shipInfo = SHIP_STATS[this.selectedShipId];
                document.getElementById('selected-ship-info').innerHTML = `
                    <div class="selected-ship">
                        🚀 ${shipInfo.name} (${shipInfo.class})
                        <div class="mini-stats">
                            ❤️${shipInfo.health} 🛡️${shipInfo.armor} 💥${shipInfo.damage}
                        </div>
                    </div>
                `;
            });
        }
        
        // Кнопка назад к выбору
        const backBtn = document.getElementById('back-to-selection');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                document.getElementById('multiplayer-menu').style.display = 'none';
                document.getElementById('ship-selection-ui').style.display = 'block';
                this.shipConfirmed = false;
            });
        }
        
        // Мультиплеер
        document.getElementById('create-session').onclick = () => this.createSession();
        document.getElementById('join-session').onclick = () => this.showJoinPanel();
        document.getElementById('confirm-join').onclick = () => this.joinSession();
        document.getElementById('leave-lobby').onclick = () => this.leaveLobby();
        document.getElementById('start-game-btn').onclick = () => this.startGame();
        document.getElementById('pause-menu-btn').onclick = () => this.showPauseMenu();
        document.getElementById('resume-game').onclick = () => this.hidePauseMenu();
        document.getElementById('close-session').onclick = () => this.closeSession();
        document.getElementById('back-to-menu').onclick = () => this.backToMenu();
    }

    updateShipStatsPreview(shipId) {
        const stats = SHIP_STATS[shipId];
        if (stats) {
            const previewDiv = document.getElementById('ship-stats-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    <div class="stat-line">📋 ${stats.class}</div>
                    <div class="stat-line">❤️ ${stats.health} 🛡️ ${stats.armor}</div>
                    <div class="stat-line">💥 ${stats.damage} ⚡ ${stats.speed}</div>
                    <div class="weapon-preview">
                        🔫 ${stats.weapons.primary.name} | 
                        💥 ${stats.weapons.secondary.name} | 
                        🚀 ${stats.weapons.tertiary.name}
                    </div>
                `;
            }
        }
    }

    showJoinPanel() {
        const panel = document.getElementById('join-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    async createSession() {
        if (!this.shipConfirmed) return;
        
        this.socket = io();
        this.playerId = Math.random().toString(36).substring(7);
        
        this.socket.emit('create_session', {
            name: `Пилот_${this.playerId.slice(0, 4)}`,
            ship: this.selectedShipId
        });
        
        this.socket.on('session_created', (data) => {
            this.sessionId = data.sessionId;
            document.getElementById('multiplayer-menu').style.display = 'none';
            this.showLobby();
        });
        
        this.setupSocketListeners();
    }

    joinSession() {
        const sessionId = document.getElementById('session-id').value;
        if (!sessionId) return;
        
        if (!this.shipConfirmed) return;
        
        this.socket = io();
        this.playerId = Math.random().toString(36).substring(7);
        
        this.socket.emit('join_session', {
            sessionId: sessionId,
            playerData: {
                name: `Пилот_${this.playerId.slice(0, 4)}`,
                ship: this.selectedShipId
            }
        });
        
        this.socket.on('session_joined', (data) => {
            this.sessionId = data.sessionId;
            document.getElementById('multiplayer-menu').style.display = 'none';
            this.showLobby();
        });
        
        this.socket.on('error', (msg) => {
            alert(msg);
        });
        
        this.setupSocketListeners();
    }

    setupSocketListeners() {
        this.socket.on('player_joined', (data) => {
            this.updatePlayersList(data.players);
        });
        
        this.socket.on('game_started', (data) => {
            this.startGameplay(data);
        });
        
        this.socket.on('opponent_update', (data) => {
            if (this.gameEngine) {
                this.gameEngine.updateOpponent(data);
            }
        });
        
        this.socket.on('opponent_shot', (data) => {
            if (this.gameEngine) {
                this.gameEngine.addOpponentProjectile(data);
            }
        });
        
        this.socket.on('player_left', (id) => {
            this.removeOpponent(id);
            this.addCombatLog(`👋 Игрок покинул битву`);
        });
        
        this.socket.on('new_host', (hostId) => {
            if (this.socket.id === hostId) {
                document.getElementById('start-game-btn').style.display = 'block';
                this.addCombatLog('👑 Вы стали хостом!');
            }
        });
    }

    showLobby() {
        document.getElementById('lobby').style.display = 'flex';
        document.getElementById('session-id-display').textContent = this.sessionId;
        
        // Проверяем, хост ли текущий игрок
        this.checkIfHost();
    }

    checkIfHost() {
        // Запрашиваем у сервера информацию о сессии
        if (this.socket) {
            this.socket.emit('check_host', this.sessionId);
            this.socket.once('host_status', (isHost) => {
                if (isHost) {
                    document.getElementById('start-game-btn').style.display = 'block';
                }
            });
        }
    }

    updatePlayersList(players) {
        const container = document.getElementById('players-list');
        if (!container) return;
        
        container.innerHTML = players.map(p => `
            <div class="player-card ${p.id === this.socket?.id ? 'current-player' : ''}">
                <span>${p.name}</span>
                <span class="ship-badge">${SHIP_STATS[p.ship]?.name || p.ship}</span>
                ${p.id === this.socket?.id ? '👤' : ''}
            </div>
        `).join('');
    }

    startGame() {
        if (this.socket) {
            this.socket.emit('start_game', this.sessionId);
        }
    }

    // В методе startGameplay:
    startGameplay(data) {
        document.getElementById('lobby').style.display = 'none';
        document.getElementById('game-hud').style.display = 'block';
        
        const stats = SHIP_STATS[this.selectedShipId];
        
        // 👈 ПЕРЕДАЕМ cameraManager
        this.gameEngine = new GameEngine(
            this.sceneManager.getScene(),
            this.socket,
            this.sessionId,
            this.playerId,
            this.cameraManager  // Добавлено!
        );
        
        // Находим свои позицию
        const myData = data.players.find(p => p.id === this.socket.id);
        const myPosition = myData?.position || { x: 0, z: 0, y: 0 };
        
        this.gameEngine.createShip(this.modelLoader.currentModel, stats, true, myPosition);
        
        // Добавляем противников
        data.players.forEach(player => {
            if (player.id !== this.socket.id) {
                this.gameEngine.addRemotePlayer({
                    id: player.id,
                    name: player.name,
                    ship: player.ship,
                    position: player.position
                });
            }
        });
        
        this.addCombatLog('⚔️ БИТВА НАЧАЛАСЬ! Найдите противника! ⚔️');
    }
    updateStats(stats) {
        document.getElementById('health-value').textContent = stats.health;
        document.getElementById('armor-value').textContent = stats.armor;
        document.getElementById('damage-value').textContent = stats.damage;
    }

    addOpponent(player) {
        const opponentDiv = document.createElement('div');
        opponentDiv.className = 'opponent-card';
        opponentDiv.id = `opponent-${player.id}`;
        opponentDiv.innerHTML = `
            <div>${player.name}</div>
            <div class="opponent-health-bar" style="width:100%"></div>
        `;
        document.getElementById('opponents-list').appendChild(opponentDiv);
    }

    removeOpponent(id) {
        const element = document.getElementById(`opponent-${id}`);
        if (element) element.remove();
    }

    addCombatLog(message) {
        const log = document.getElementById('combat-log');
        if (log) {
            const entry = document.createElement('div');
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
            setTimeout(() => entry.remove(), 5000);
        }
    }

    leaveLobby() {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.sessionId = null;
        document.getElementById('lobby').style.display = 'none';
        document.getElementById('multiplayer-menu').style.display = 'flex';
    }

    showPauseMenu() {
        document.getElementById('pause-menu').style.display = 'flex';
    }

    hidePauseMenu() {
        document.getElementById('pause-menu').style.display = 'none';
    }

    closeSession() {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.backToMenu();
    }

    backToMenu() {
        document.getElementById('pause-menu').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-hud').style.display = 'none';
        document.getElementById('ship-selection-ui').style.display = 'block';
        
        if (this.gameEngine) {
            this.gameEngine.cleanup?.();
            this.gameEngine = null;
        }
        
        this.shipConfirmed = false;
        this.sessionId = null;
    }

    onWindowResize() {
        if (this.cameraManager) {
            this.cameraManager.onWindowResize();
        }
        if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016;
        
        if (this.gameEngine) {
            this.gameEngine.update(1/60);
        }
        
        if (this.sceneManager) {
            this.sceneManager.update(this.time);
        }
        
        if (this.lightManager) {
            this.lightManager.update(this.time);
        }
        
        if (this.cameraManager) {
            this.cameraManager.update();
        }
        
        if (this.renderer && this.sceneManager && this.cameraManager) {
            this.renderer.render(
                this.sceneManager.getScene(),
                this.cameraManager.getCamera()
            );
        }
    }
}

const game = new Game();