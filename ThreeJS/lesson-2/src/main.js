import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';

class Game {
    constructor() {
        this.renderer = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.camera = null;

        this.time = 0;
        
        this.init();

    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();

        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createControls();

        this.lightManager = new LightManager(scene);
        this.lightManager.createAll();        // добавляем все источники света

        window.addEventListener('resize', () => this.onWindowResize());

        this.animate();
    }

    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.time += 0.016;

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