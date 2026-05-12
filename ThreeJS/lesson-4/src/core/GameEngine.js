import * as THREE from 'three';

export class GameEngine {
    constructor(scene, socket, sessionId, playerId, cameraManager) {
        this.scene = scene;
        this.socket = socket;
        this.sessionId = sessionId;
        this.playerId = playerId;
        this.cameraManager = cameraManager;
        
        this.players = new Map(); // id -> { model, stats, health, position, rotation }
        this.projectiles = [];
        this.cooldowns = { primary: 0, secondary: 0, tertiary: 0 };
        this.currentWeapon = 'primary';
        this.boostCooldown = 0;
        this.boostActive = false;
        
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        
        this.localPlayer = null;
        this.setupControls();
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'KeyW': this.controls.forward = true; break;
                case 'KeyS': this.controls.backward = true; break;
                case 'KeyA': this.controls.left = true; break;
                case 'KeyD': this.controls.right = true; break;
                case 'ShiftLeft':
                    if (this.boostCooldown <= 0 && !this.boostActive && this.localPlayer) {
                        this.boostActive = true;
                        this.boostCooldown = 5.0;
                        this.localPlayer.stats.speed *= 2.5;
                        setTimeout(() => {
                            if (this.localPlayer) {
                                this.localPlayer.stats.speed /= 2.5;
                                this.boostActive = false;
                            }
                        }, 2000);
                    }
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            switch(e.code) {
                case 'KeyW': this.controls.forward = false; break;
                case 'KeyS': this.controls.backward = false; break;
                case 'KeyA': this.controls.left = false; break;
                case 'KeyD': this.controls.right = false; break;
            }
        });
        
        // Стрельба ЛКМ
        window.addEventListener('click', (e) => {
            if (e.button === 0 && this.localPlayer) {
                this.shoot('primary');
            }
        });
        
        // Смена оружия ПКМ
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.cycleWeapon();
        });
    }
    
    shoot(weaponType) {
        if (!this.localPlayer) return;
        
        const now = Date.now();
        const cooldown = this.cooldowns[weaponType];
        const weapon = this.localPlayer.stats.weapons[weaponType];
        
        if (cooldown > 0 || !weapon) return;
        
        this.cooldowns[weaponType] = weapon.cooldown;
        
        // Направление выстрела (вперед от корабля)
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyEuler(this.localPlayer.model.rotation);
        
        // Создаем снаряды с разбросом
        for (let i = 0; i < weapon.ammo; i++) {
            const spread = (i - (weapon.ammo - 1) / 2) * weapon.spread;
            const shotDir = direction.clone();
            shotDir.x += spread;
            shotDir.normalize();
            
            // Визуальный эффект выстрела
            this.createMuzzleFlash(this.localPlayer.model.position.clone(), direction);
            
            this.projectiles.push({
                id: Math.random(),
                ownerId: this.playerId,
                position: this.localPlayer.model.position.clone(),
                direction: shotDir,
                damage: weapon.damage,
                weaponType: weaponType,
                startTime: now,
                distance: 0
            });
        }
        
        // Отправляем на сервер
        this.socket.emit('shoot', {
            origin: this.localPlayer.model.position,
            direction: direction,
            weaponType: weaponType
        });
        
        this.showWeaponMessage(weapon.name);
    }
    
    createMuzzleFlash(position, direction) {
        // Создаем временную сферу как вспышку
        const flash = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400 })
        );
        flash.position.copy(position.clone().add(direction.clone().multiplyScalar(1.5)));
        this.scene.add(flash);
        setTimeout(() => this.scene.remove(flash), 100);
    }
    
    cycleWeapon() {
        const weapons = ['primary', 'secondary', 'tertiary'];
        const currentIndex = weapons.indexOf(this.currentWeapon);
        this.currentWeapon = weapons[(currentIndex + 1) % weapons.length];
        const weaponName = this.localPlayer?.stats.weapons[this.currentWeapon]?.name || 'Оружие';
        this.showWeaponMessage(`⚔️ ${weaponName}`);
    }
    
    createShip(model, stats, isLocal = true, position = { x: 0, z: 0, y: 0 }) {
        model.position.set(position.x, position.y, position.z);
        model.scale.set(stats.scale || 1, stats.scale || 1, stats.scale || 1);
        
        // Настройка теней
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        this.scene.add(model);
        
        const player = {
            id: isLocal ? 'local' : `player_${Date.now()}`,
            model: model,
            stats: { ...stats },
            health: stats.health,
            maxHealth: stats.health,
            position: model.position.clone(),
            rotation: model.rotation.clone()
        };
        
        if (isLocal) {
            this.localPlayer = player;
            // Камера следует за игроком
            this.cameraManager.setTarget(model);
        }
        
        this.players.set(player.id, player);
        return player;
    }
    
    addRemotePlayer(playerData) {
        // Создаем временную сферу для противника (пока нет модели)
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0x220000 });
        const dummyModel = new THREE.Mesh(geometry, material);
        dummyModel.castShadow = true;
        
        dummyModel.position.set(playerData.position.x, playerData.position.y, playerData.position.z);
        this.scene.add(dummyModel);
        
        const player = {
            id: playerData.id,
            model: dummyModel,
            stats: { health: 100, name: playerData.name },
            health: 100,
            maxHealth: 100,
            position: dummyModel.position.clone(),
            name: playerData.name
        };
        
        this.players.set(player.id, player);
        this.addOpponentUI(playerData.id, playerData.name);
        
        return player;
    }
    
    addOpponentUI(id, name) {
        const container = document.getElementById('opponents-list');
        if (!container) return;
        
        const existing = document.getElementById(`opponent-${id}`);
        if (existing) existing.remove();
        
        const opponentDiv = document.createElement('div');
        opponentDiv.className = 'opponent-card';
        opponentDiv.id = `opponent-${id}`;
        opponentDiv.innerHTML = `
            <div class="opponent-name">${name}</div>
            <div class="opponent-health-container">
                <div class="opponent-health-bar" style="width:100%"></div>
            </div>
            <div class="opponent-distance">🏹 --- м</div>
        `;
        container.appendChild(opponentDiv);
    }
    
    updateOpponent(data) {
        const player = this.players.get(data.id);
        if (player && player.id !== 'local') {
            player.position.set(data.position.x, data.position.y, data.position.z);
            player.model.position.copy(player.position);
            if (data.rotation) {
                player.model.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            }
        }
    }
    
    addOpponentProjectile(data) {
        // Визуализация выстрела противника
        const projectile = {
            id: Math.random(),
            ownerId: data.id,
            position: new THREE.Vector3(data.origin.x, data.origin.y, data.origin.z),
            direction: new THREE.Vector3(data.direction.x, data.direction.y, data.direction.z),
            damage: 25,
            startTime: Date.now(),
            distance: 0
        };
        this.projectiles.push(projectile);
    }
    
    update(deltaTime) {
        this.updateLocalPlayer(deltaTime);
        this.updateProjectiles(deltaTime);
        this.updateCooldowns(deltaTime);
        this.updateOpponentDistances();
        this.sendPosition();
    }
    
    updateLocalPlayer(deltaTime) {
        if (!this.localPlayer) return;
        
        let move = new THREE.Vector3(0, 0, 0);
        const speed = this.localPlayer.stats.speed;
        const turnSpeed = this.localPlayer.stats.turnSpeed || 3;
        
        if (this.controls.forward) move.z = -speed * deltaTime;
        if (this.controls.backward) move.z = speed * deltaTime;
        
        let turn = 0;
        if (this.controls.left) turn = turnSpeed * deltaTime;
        if (this.controls.right) turn = -turnSpeed * deltaTime;
        
        this.localPlayer.model.rotation.y += turn;
        move.applyEuler(this.localPlayer.model.rotation);
        this.localPlayer.model.position.add(move);
        
        // Границы арены
        const limit = 25;
        this.localPlayer.model.position.x = Math.max(-limit, Math.min(limit, this.localPlayer.model.position.x));
        this.localPlayer.model.position.z = Math.max(-limit, Math.min(limit, this.localPlayer.model.position.z));
        
        this.localPlayer.position.copy(this.localPlayer.model.position);
        this.localPlayer.rotation.copy(this.localPlayer.model.rotation);
    }
    
    updateProjectiles(deltaTime) {
        const now = Date.now();
        const speed = 30; // единиц в секунду
        
        this.projectiles = this.projectiles.filter(projectile => {
            const elapsed = (now - projectile.startTime) / 1000;
            projectile.distance = elapsed * speed;
            
            if (projectile.distance > 100) return false;
            
            const currentPos = projectile.position.clone().add(
                projectile.direction.clone().multiplyScalar(projectile.distance)
            );
            
            // Визуализация снаряда
            if (!projectile.mesh) {
                const geometry = new THREE.SphereGeometry(0.2, 6, 6);
                const material = new THREE.MeshStandardMaterial({ 
                    color: projectile.ownerId === this.playerId ? 0x44ff44 : 0xff4444,
                    emissive: projectile.ownerId === this.playerId ? 0x226622 : 0x442222
                });
                projectile.mesh = new THREE.Mesh(geometry, material);
                this.scene.add(projectile.mesh);
            }
            
            projectile.mesh.position.copy(currentPos);
            
            // Проверка попаданий
            for (const [id, player] of this.players) {
                if (id === projectile.ownerId) continue;
                if (player.id === 'local' && projectile.ownerId === this.playerId) continue;
                
                const dist = currentPos.distanceTo(player.position);
                if (dist < 1.5) {
                    this.hitPlayer(id, projectile.damage);
                    return false;
                }
            }
            
            return true;
        });
    }
    
    hitPlayer(playerId, damage) {
        const player = this.players.get(playerId);
        if (!player) return;
        
        player.health = Math.max(0, player.health - damage);
        
        // Эффект попадания
        this.createHitEffect(player.position);
        
        // Обновляем UI здоровья
        if (playerId === 'local') {
            this.updateHealthUI(player.health, player.maxHealth);
            this.addCombatLog(`💥 Вы получили ${damage} урона! ❤️ ${player.health}/${player.maxHealth}`);
            
            if (player.health <= 0) {
                this.die();
            }
        } else {
            const opponentElement = document.getElementById(`opponent-${playerId}`);
            if (opponentElement) {
                const healthPercent = (player.health / player.maxHealth) * 100;
                const bar = opponentElement.querySelector('.opponent-health-bar');
                if (bar) bar.style.width = `${healthPercent}%`;
            }
            this.addCombatLog(`🎯 Попадание по ${player.name || 'противнику'}! -${damage}`);
            
            if (player.health <= 0) {
                this.eliminateOpponent(playerId);
            }
        }
    }
    
    eliminateOpponent(playerId) {
        const player = this.players.get(playerId);
        if (player) {
            this.scene.remove(player.model);
            this.players.delete(playerId);
            
            const uiElement = document.getElementById(`opponent-${playerId}`);
            if (uiElement) uiElement.remove();
            
            this.addCombatLog(`💀 ${player.name || 'Противник'} уничтожен!`);
            
            // Проверка на победу
            let remainingOpponents = 0;
            for (const [id] of this.players) {
                if (id !== 'local') remainingOpponents++;
            }
            
            if (remainingOpponents === 0) {
                this.win();
            }
        }
    }
    
    die() {
        this.addCombatLog('💀 ВАС УНИЧТОЖИЛИ!');
        this.socket.emit('player_dead');
        this.showGameOver(false);
    }
    
    win() {
        this.addCombatLog('🏆 ПОБЕДА! 🏆');
        this.socket.emit('player_win');
        this.showGameOver(true);
    }
    
    showGameOver(isWin) {
        const overlay = document.getElementById('game-over');
        const message = document.getElementById('victory-message');
        if (overlay && message) {
            message.textContent = isWin ? '🏆 ВЫ ПОБЕДИЛИ! 🏆' : '💀 ВЫ ПРОИГРАЛИ... 💀';
            overlay.style.display = 'flex';
        }
    }
    
    createHitEffect(position) {
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200 });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(position);
        this.scene.add(effect);
        setTimeout(() => this.scene.remove(effect), 200);
    }
    
    updateOpponentDistances() {
        if (!this.localPlayer) return;
        
        for (const [id, player] of this.players) {
            if (id === 'local') continue;
            
            const distance = this.localPlayer.position.distanceTo(player.position);
            const element = document.getElementById(`opponent-${id}`);
            if (element) {
                const distSpan = element.querySelector('.opponent-distance');
                if (distSpan) {
                    distSpan.innerHTML = `🏹 ${Math.round(distance)} м`;
                    
                    // Меняем цвет в зависимости от расстояния
                    if (distance < 10) distSpan.style.color = '#ff4444';
                    else if (distance < 20) distSpan.style.color = '#ffaa44';
                    else distSpan.style.color = '#aaa';
                }
            }
        }
    }
    
    updateHealthUI(current, max) {
        const percent = (current / max) * 100;
        const healthBar = document.getElementById('health-bar');
        if (healthBar) healthBar.style.width = `${percent}%`;
        document.getElementById('health-value').textContent = `${current}/${max}`;
    }
    
    addCombatLog(message) {
        const log = document.getElementById('combat-log');
        if (log) {
            const entry = document.createElement('div');
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
            
            // Ограничиваем количество сообщений
            while (log.children.length > 20) {
                log.removeChild(log.firstChild);
            }
        }
    }
    
    showWeaponMessage(weaponName) {
        const msg = document.getElementById('weapon-message');
        if (msg) {
            msg.textContent = `⚔️ ${weaponName}`;
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 800);
        }
    }
    
    sendPosition() {
        if (this.localPlayer && Date.now() - (this.lastSend || 0) > 50) {
            this.socket.emit('player_update', {
                position: {
                    x: this.localPlayer.position.x,
                    y: this.localPlayer.position.y,
                    z: this.localPlayer.position.z
                },
                rotation: {
                    x: this.localPlayer.rotation.x,
                    y: this.localPlayer.rotation.y,
                    z: this.localPlayer.rotation.z
                }
            });
            this.lastSend = Date.now();
        }
    }
    
    updateCooldowns(deltaTime) {
        for (let key in this.cooldowns) {
            this.cooldowns[key] = Math.max(0, this.cooldowns[key] - deltaTime * 1000);
        }
        this.boostCooldown = Math.max(0, this.boostCooldown - deltaTime);
    }
    
    cleanup() {
        // Удаляем всех игроков и снаряды
        for (const [id, player] of this.players) {
            this.scene.remove(player.model);
        }
        for (const projectile of this.projectiles) {
            if (projectile.mesh) this.scene.remove(projectile.mesh);
        }
        this.players.clear();
        this.projectiles = [];
    }
}