
# 🚀 УРОК с 1 по 5: Модульная сцена (Three.js)

Полный код проекта: управление сценой, камерой, освещением, загрузка 3D-моделей и вспомогательные объекты.

## Структура проекта

```
project/
├── index.html
├── style.css (не включён в код)
├── src/
│   ├── main.js
│   ├── core/
│   │   ├── SceneManager.js
│   │   ├── CameraManager.js
│   │   ├── LightManager.js
│   │   ├── ModelLoader.js
│   │   
│   ├── config/
│   │   ├── camera.js
│   │   ├── light.js
│   │   ├── model.js
│   │   └── scene.js
│   └── utils/
│       └── Settings.js 
```

---

## 1. index.html

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Урок 5: Модульная сцена</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- UI элементы поверх 3D сцены -->
    <div id="info">
        <h1>🚀 УРОК 5: Модульная сцена</h1>
        <p>Сцена | Камера | Звёзды | Контроллер | Освещение | Сетка</p>
    </div>
    <div class="status">
        ✅ Совершена загрузка модели
    </div>

    <!-- Import Map: говорит браузеру, где искать модули -->
    <script type="importmap">
        {
            "imports": {
                "three": "./node_modules/three/build/three.module.js",
                "three/addons/": "./node_modules/three/examples/jsm/"
            }
        }
    </script>
    
    <!-- Главный модуль приложения -->
    <script type="module" src="./src/main.js"></script>
</body>
</html>
```

---

## 2. src/main.js (главный модуль)

```javascript
import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';
import { Settings } from './utils/Settings.js';
import { ModelLoader } from './core/ModelLoader.js';
import { MODELS_CONFIG } from './config/model.js';

class Game {
    constructor() {
        this.renderer = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.modelLoader = null;
        this.camera = null;

        this.settings = null;

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
        this.lightManager.createAll();

        this.modelLoader = new ModelLoader(scene);
        this.modelLoader.setModels(MODELS_CONFIG.ships);

        this.settings = new Settings(scene);
        this.settings.createAllSettigs();

        this.loadCurrentModel();

        window.addEventListener('resize', () => this.onWindowResize());

        this.animate();
    }

    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    async loadCurrentModel(){
        await this.modelLoader.showModel(this.modelLoader.currentIndex);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.sceneManager.update();
        this.cameraManager.update();
        this.lightManager.update();
        
        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera()
        );
    }
}

const game = new Game();
```

---

## 3. Конфигурационные файлы (config/)

### config/camera.js

```javascript
// === НАСТРОЙКИ КАМЕРЫ ===

export const CAMERA_CONFIG = {
    // === ПАРАМЕТРЫ КАМЕРЫ ===
    fov: 45,        // Field of View (угол обзора) в градусах
                    // 45° - угол как у глаза человека
                    // Меньше - телескоп, больше - широкий угол
    
    near: 0.1,      // Ближняя плоскость отсечения
                    // Объекты ближе 0.1 не видны
    far: 1000,      // Дальняя плоскость отсечения
                    // Объекты дальше 1000 не видны
    
    // === ПОЗИЦИЯ КАМЕРЫ ===
    position: {
        x: 5,       // смещение вправо
        y: 4,       // высота
        z: 8        // расстояние от центра
    },
    
    // === ТОЧКА НАБЛЮДЕНИЯ ===
    target: {
        x: 0,
        y: 0,
        z: 0        // камера смотрит в центр сцены
    },
    
    // === НАСТРОЙКИ УПРАВЛЕНИЯ ===
    controls: {
        enableDamping: true,    // плавность (инерция)
        dampingFactor: 0.05,    // сила инерции
        autoRotate: false,      // автоматическое вращение
        enableZoom: true,       // разрешить zoom
        enablePan: true,        // разрешить панорамирование
        zoomSpeed: 1.2,         // скорость зума
        rotateSpeed: 1.0        // скорость вращения
    }
};
```

### config/light.js

```javascript
export const LIGHT_CONFIG = {
    // основной источник света - солнце
    main: {
        type: 'directional',
        color: '0xffffff',
        intensity: 1.2,
        position: {x: 5, y:10, z: 7},
        castShadow: true,
        shadowMapSize: 1024
    },
    // направленный свет - лучи
    ambient: {
        type: 'directional',
        color: '0xFAFF8C',
        intensity: 0.8,
        position: {x: -3, y:2, z: -4},
    },
    // источник контрового цвета - свет сзади от камеры
    rim: {
        type: 'directional',
        color: '0xFAFF8C',
        intensity: 0.3,
        position: {x: 0, y:-2, z: 0},
    },
    // нижний свет - заполняющий
    fill: {
        type: 'point',
        color: '0xFFEA8C',
        intensity: 0.3,
        position: {x: 0, y:-2, z: 0},
    },
    // подсветка
    back: {
        type: 'point',
        color: '0xFFEA8C',
        intensity: 0.4,
        position: {x: 0, y:1, z: -5},
    }
};
```

### config/model.js

```javascript
export const MODELS_CONFIG = {
    ships: [
        {
            id: 'assault',
            name: 'Штурмовой корабль',
            url: 'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/models/ships/scout.glb',
            color: 0xff4444,
            scale: 1.0,
            rotationSpeed: 0.005
        }
    ],
    loading: {
        showProgress: true,
        defaultScale: 1.0
    }
};
```

### config/scene.js

```javascript
// === НАСТРОЙКИ СЦЕНЫ ===

export const SCENE_CONFIG = {
    // Цвет фона (космос) - используется HEX формат
    // 0x050518 - это тёмно-синий цвет
    background: 0x050518,
    
    // Настройки тумана (создаёт эффект глубины)
    fog: {
        enabled: true,
        color: 0x050518,    // цвет тумана (должен совпадать с фоном)
        density: 0.01       // плотность: чем выше, тем быстрее объекты исчезают
    },
    
    // Настройки звёздного поля
    stars: {
        count: 2000,         // количество звёзд
        size: 0.15,          // размер каждой звезды
        color: 0xffffff,     // белый цвет
        range: 400           // разброс звёзд в пространстве
    }
};
```

---

## 4. Ядро приложения (core/)

### core/SceneManager.js

```javascript
// === УПРАВЛЯЮЩИЙ СЦЕНАМИ ===
import * as THREE from 'three';
import { SCENE_CONFIG } from '../config/scene.js';
 
export class SceneManager {
    constructor() {
        this.scene = null;
        this.stars = null;
    }
    
    create() {    
        this.scene = new THREE.Scene();
         
        this.scene.background = new THREE.Color(SCENE_CONFIG.background);

        if (SCENE_CONFIG.fog.enabled) {
            this.scene.fog = new THREE.FogExp2(
                SCENE_CONFIG.fog.color,
                SCENE_CONFIG.fog.density
            );
        }    
        this._createStars();
        return this.scene;
    }

    _createStars() {
        const { count, size, color, range } = SCENE_CONFIG.stars;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        
        for (let i = 0; i < count; i++) {
            positions.push((Math.random() - 0.5) * range);
            positions.push((Math.random() - 0.5) * range);
            positions.push((Math.random() - 0.5) * range);
        }
        
        geometry.setAttribute('position', 
            new THREE.BufferAttribute(new Float32Array(positions), 3));
        
        const material = new THREE.PointsMaterial({
            color: color,      // цвет звезд
            size: size,        // размер каждой точки
            transparent: true, // разрешает прозрачность
            opacity: 0.8       // начальная прозрачность 80%
        });
        
        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }
 
    getScene() {
        return this.scene;
    }
 
    update() {
        if (this.stars && this.stars.material) {
            this.stars.material.opacity = 0.7 + Math.random() * 0.5;
        }
    }
}
```

### core/CameraManager.js

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CAMERA_CONFIG } from '../config/camera.js';

export class CameraManager {
    constructor(rendererDomElement) {
        this.camera = null;
        this.controls = null;
        this.rendererDomElement = rendererDomElement;
    }

    create() {
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_CONFIG.fov,
            window.innerWidth / window.innerHeight,
            CAMERA_CONFIG.near,
            CAMERA_CONFIG.far
        );

        this.camera.position.set(
            CAMERA_CONFIG.position.x,
            CAMERA_CONFIG.position.y,
            CAMERA_CONFIG.position.z
        );

        this.camera.lookAt(
            CAMERA_CONFIG.target.x,
            CAMERA_CONFIG.target.y,
            CAMERA_CONFIG.target.z
        );
        
        return this.camera;
    }
   
    createControls(){
        const {
            enableDamping, dampingFactor, autoRotate, 
            enableZoom, zoomSpeed, rotateSpeed
        } = CAMERA_CONFIG.controls;

        this.controls = new OrbitControls(this.camera, this.rendererDomElement);

        this.controls.enableDamping = enableDamping;
        this.controls.dampingFactor = dampingFactor;
        this.controls.autoRotate = autoRotate;
        this.controls.enableZoom = enableZoom;
        this.controls.zoomSpeed = zoomSpeed;
        this.controls.rotateSpeed = rotateSpeed;

        this.controls.target.set(
            CAMERA_CONFIG.target.x,
            CAMERA_CONFIG.target.y,
            CAMERA_CONFIG.target.z
        );

        return this.controls;
    }

    update(){
        if(this.controls){
            this.controls.update();
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    getCamera() {
        return this.camera;
    }

    getControls(){
        return this.controls;
    }
}
```

### core/LightManager.js

```javascript
import * as THREE from 'three';
import { LIGHT_CONFIG } from '../config/light.js';

export class LightManager{
    constructor(scene){
        this.scene = scene;
        this.lights = {};
    }

    createAll(){
        this._createMainLight();
        this._createAmbientLight();
        this._createRimLight();

        return this.lights;
    }

    _createAmbientLight(){
        const config = LIGHT_CONFIG.ambient;
        const light = new THREE.AmbientLight(config.color, config.intensity);
        this.scene.add(light);
        this.lights.ambient = light;
    }

    _createMainLight(){
        const config = LIGHT_CONFIG.main;
        const light = new THREE.DirectionalLight(config.color, config.intensity);
        light.position.set(config.position.x, config.position.y, config.position.z);

        if(config.castShadow){
            light.castShadow = true;
            light.shadow.mapSize.width = config.shadowMapSize;
            light.shadow.mapSize.height = config.shadowMapSize;

            this.scene.add(light);
            this.lights.main = light;
        }
    }

    _createRimLight(){
        const config = LIGHT_CONFIG.rim;
        const light = new THREE.DirectionalLight(config.color, config.intensity);
        light.position.set(config.position.x, config.position.y, config.position.z);

        this.scene.add(light);
        this.lights.rim = light;
    }

    update(){
        if (this.lights.rim) {
            const random = Math.random() * 0.3 - 0.15; // от -0.15 до +0.15
            const baseIntensity = LIGHT_CONFIG.rim.intensity;
            this.lights.rim.intensity = Math.max(0.2, baseIntensity + random);
        }
    }

    getLight(name){
        return this.lights[name];
    }
}
```

### core/ModelLoader.js

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader{
    constructor(scene){
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.modelList = [];
        this.currentModel = null;
        this.currentIndex = 0;
        this.isLoading = false;
    }

    loadModel(url, scale = 1.0) {
        return new Promise((resolve, reject) => {
            this.isLoading = true;
            this.loader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(scale, scale, scale);

                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    this.isLoading = false;
                    resolve(model);
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(2);
                    console.log(`⏳ Загрузка: ${percent}%`);
                },
                (error) => {
                    this.isLoading = false;
                    console.error('❌ Ошибка загрузки модели:', error);
                    reject(error);
                }
            );
        });
    }

    async showModel(index){
        const modelInfo = this.modelsList[index];
        const model = await this.loadModel(modelInfo.url, modelInfo.scale);
        this.currentModel = model;
        model.position.x = -8;
        model.position.z = 8;
        this.scene.add(model);
    }

    setModels(models) {
        this.modelsList = models;
    }

    getCurrentModelInfo() {
        return this.modelsList[this.currentIndex];
    }
}
```

### core/Settings.js

```javascript
import * as THREE from 'three';

export class Settings{
    constructor(scene){
        this.scene = scene;
        this.grid = null;
    }

    createAllSettigs(){
        this._createMoreHelpers();
        this._createMoreMesh();
    }

    _createMoreHelpers(){
        //this._createAxesHelper();
        this._createGridHelper();
        this._createFloorPlane();
        //this._createPlaneHelper();
    }

    _createMoreMesh(){
        this._createBaseCube();
        this._createBaseSphere();
        this._createCustomPhigure();
    }

    _createAxesHelper(){
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    _createBaseCube(){
        const geometry = new THREE.BoxGeometry(5,5,5);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00FF7F,
            roughness: 0.9,
            metalness: 0.9,
            transparent: true,
            opacity: 0.8
        });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
    }

    _createBaseSphere(){
        const geometry = new THREE.SphereGeometry(2, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x7B68EE,
            roughness: 0.5,
            metalness: 0.5,
            transparent: true,
            opacity: 0.9
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = 8;
        this.scene.add(sphere);
    }

    _createCustomPhigure(){
        const geometry = new THREE.BufferGeometry();
        // создаём простую квадратную форму
        const vertices = new Float32Array([
            -1.0, -1.0,  1.0, // v0
            1.0, -1.0,  1.0, // v1
            1.0,  1.0,  1.0, // v2
            1.0,  1.0,  1.0, // v3
            -1.0,  1.0,  1.0, // v4
            -1.0, -1.0,  1.0  // v5
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.material.side = THREE.DoubleSide;
        this.grid.add(mesh);  // ⚠️ Внимание: this.grid может быть null
    }

    _createGridHelper(){
        const size = 10;
        const divisions = 10;
        const gridHelper = new THREE.GridHelper(size, divisions);
        gridHelper.position.y = -3;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.5;
        this.scene.add(gridHelper);
        this.grid = gridHelper;
    }

    _createPlaneHelper(){
        const plane = new THREE.Plane(new THREE.Vector3(1, 1, 1), 9);
        const helper = new THREE.PlaneHelper(plane, 8, 0xffff00);
        this.scene.add(helper);
    }

    _createFloorPlane(){
        const floorPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 12),
            new THREE.MeshStandardMaterial({
                color: 0x112233,
                roughness: 0.8,
                metalness: 0.2,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            })
        );
        floorPlane.rotation.x = -Math.PI / 2;
        floorPlane.position.y = -2.9;
        floorPlane.receiveShadow = true; 
        this.scene.add(floorPlane);
    }
}
```

---

## 5. Замечания и потенциальные ошибки в коде

| Файл | Проблема | Рекомендация |
|------|----------|---------------|
| `main.js` | Импорт `Settings` из `./utils/Settings.js`, но файл лежит в `core/Settings.js` | Исправить путь на `./core/Settings.js` |
| `LightManager.js` | Опечатка: `intesity` вместо `intensity` в `_createAmbientLight` и `_createMainLight` | Исправить на `config.intensity` |
| `LightManager.js` | `_createRimLight` использует `intensity` (верно), но в `LIGHT_CONFIG.rim` поле называется `intensity` ✅ | ОК |
| `LightManager.js` | В `_createMainLight` переменная `intesity` — опечатка | Исправить |
| `ModelLoader.js` | В `showModel` используется `this.modelsList`, но поле называется `this.modelList` (разные имена) | Унифицировать: везде `this.modelsList` |
| `ModelLoader.js` | Не импортирован `MODELS_CONFIG`, но используется в `main.js` для передачи моделей | ✅ (передаётся из main) |
| `Settings.js` | В `_createCustomPhigure()` вызывается `this.grid.add(mesh)`, но `this.grid` создаётся только в `_createGridHelper()` после вызова | Перенести вызов `_createCustomPhigure()` после создания грида или проверять `if(this.grid)` |
| `Settings.js` | Опечатка в названии метода: `createAllSettigs` вместо `createAllSettings` | Можно исправить, но не критично |
| `main.js` | В `animate()` рекурсивный вызов `requestAnimationFrame` обёрнут в стрелку, что создаёт множество вложенных вызовов | Исправить на `requestAnimationFrame(() => this.animate())` — так и есть, но лучше вынести привязку в constructor |

---

## 6. Установка и запуск

```bash
# 1. Инициализация проекта
npm init -y

# 2. Установка Three.js
npm install three

# 3. Запуск (например, с помощью live-server)
npx live-server
```

Или используйте любой HTTP-сервер (VS Code Live Server, http-server и т.д.)

---

## 7. Исправленный минимальный вариант main.js

```javascript
import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';
import { Settings } from './core/Settings.js';  // ✅ исправлен путь
import { ModelLoader } from './core/ModelLoader.js';
import { MODELS_CONFIG } from './config/model.js';

class Game {
    constructor() {
        this.renderer = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.modelLoader = null;
        this.settings = null;

        this.init();
        this.animate = this.animate.bind(this); // ✅ привязываем метод
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
        this.lightManager.createAll();

        this.modelLoader = new ModelLoader(scene);
        this.modelLoader.setModels(MODELS_CONFIG.ships);

        this.settings = new Settings(scene);
        this.settings.createAllSettigs();

        this.loadCurrentModel();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    async loadCurrentModel() {
        await this.modelLoader.showModel(this.modelLoader.currentIndex);
    }

    animate() {
        requestAnimationFrame(this.animate);
        
        if (this.sceneManager) this.sceneManager.update();
        if (this.cameraManager) this.cameraManager.update();
        if (this.lightManager) this.lightManager.update();
        
        if (this.renderer && this.sceneManager && this.cameraManager) {
            this.renderer.render(
                this.sceneManager.getScene(),
                this.cameraManager.getCamera()
            );
        }
    }
}

const game = new Game();
game.animate();
```

---

## 8. Схема работы модулей

```
index.html
    └── main.js
        ├── SceneManager ──> config/scene.js
        ├── CameraManager ──> config/camera.js
        ├── LightManager ───> config/light.js
        ├── ModelLoader ────> config/model.js (через main)
        └── Settings ────────> (без конфига)
```

---
