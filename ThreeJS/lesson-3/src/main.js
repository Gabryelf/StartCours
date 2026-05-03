import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';
import { ModelLoader } from './core/ModelLoader.js';
import { MODELS_CONFIG } from './config/models.js';

class Game {
    constructor() {
        this.renderer = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.modelLoader = null;
        
        this.time = 0;
        
        this.init();
    }

    init() {
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

        // ЗАГРУЗЧИК МОДЕЛЕЙ 👈 НОВОЕ
        this.modelLoader = new ModelLoader(scene);
        this.modelLoader.setModels(MODELS_CONFIG.ships);
        
        // Загружаем первую модель
        this.loadCurrentModel();

        // UI КНОПКИ 👈 НОВОЕ
        this.setupUI();

        window.addEventListener('resize', () => this.onWindowResize());

        this.animate();
    }

    async loadCurrentModel() {
        const modelInfo = this.modelLoader.getCurrentModelInfo();
        this.updateUIStatus('Загрузка...');
        
        try {
            await this.modelLoader.showModel(this.modelLoader.currentIndex);
            this.updateUIStatus('✅ Готов');
            this.updateUIName(modelInfo.name);
        } catch (error) {
            this.updateUIStatus('❌ Ошибка загрузки');
            console.error(error);
        }
    }

    setupUI() {
        const prevBtn = document.getElementById('prev-model');
        const nextBtn = document.getElementById('next-model');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', async () => {
                await this.modelLoader.switchToPrev();
                this.updateUIName(this.modelLoader.getCurrentModelInfo().name);
                this.updateUIStatus('Загрузка...');
                // Статус обновится после загрузки в loadCurrentModel
                setTimeout(() => this.updateUIStatus('✅ Готов'), 1000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', async () => {
                await this.modelLoader.switchToNext();
                this.updateUIName(this.modelLoader.getCurrentModelInfo().name);
                this.updateUIStatus('Загрузка...');
                setTimeout(() => this.updateUIStatus('✅ Готов'), 1000);
            });
        }
    }

    updateUIName(name) {
        const nameElement = document.getElementById('model-name');
        if (nameElement) nameElement.textContent = name;
    }

    updateUIStatus(status) {
        const statusElement = document.getElementById('model-status');
        if (statusElement) statusElement.textContent = status;
    }

    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016;
        
        // Вращаем текущую модель
        if (this.modelLoader && this.modelLoader.currentModel) {
            const speed = this.modelLoader.getCurrentModelInfo().rotationSpeed;
            this.modelLoader.currentModel.rotation.y = this.time * speed * 10;
        }
        
        this.sceneManager.update(this.time);
        this.lightManager.update(this.time);
        this.cameraManager.update();
        
        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera()
        );
    }
}

const game = new Game();