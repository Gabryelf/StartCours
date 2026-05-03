# 🚀 УРОК 1: Модульная сцена - Добавление освещения и сетки

## Пошаговое руководство по добавлению LightManager и визуальных элементов

Это руководство продолжает предыдущее. Вы уже создали работающую сцену со звёздами и камерой. Теперь добавим освещение и визуальные ориентиры.

---

## ШАГ 1: Создаём конфиг освещения

**Файл:** `src/config/lights.js`

```javascript
export const LIGHTS_CONFIG = {
    ambient: {
        color: 0x404060,
        intensity: 0.6
    },
    
    main: {
        type: 'directional',
        color: 0xffffff,
        intensity: 1.2,
        position: { x: 5, y: 10, z: 7 },
        castShadow: true,
        shadowMapSize: 1024
    },
    
    rim: {
        type: 'directional',
        color: 0x6688aa,
        intensity: 0.8,
        position: { x: -3, y: 2, z: -4 }
    },
    
    fill: {
        type: 'point',
        color: 0x4466aa,
        intensity: 0.3,
        position: { x: 0, y: -2, z: 0 }
    },
    
    back: {
        type: 'point',
        color: 0xffaa66,
        intensity: 0.4,
        position: { x: 0, y: 1, z: -5 }
    }
};
```

**Что мы сделали:** Описали 5 источников света:
- **ambient** - рассеянный свет (освещает всё)
- **main** - основной направленный свет (как солнце)
- **rim** - контровой свет (выделяет края)
- **fill** - заполняющий свет снизу
- **back** - подсветка сзади

---

## ШАГ 2: Создаём LightManager (пустой класс)

**Файл:** `src/core/LightManager.js`

```javascript
import * as THREE from 'three';
import { LIGHTS_CONFIG } from '../config/lights.js';

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
    }

    createAll() {
        console.log('✅ LightManager: создаю источники света');
        return this.lights;
    }
}
```

**Проверка:** Ошибок нет, но света пока нет.

---

## ШАГ 3: Добавляем AmbientLight (рассеянный свет)

**В файл `src/core/LightManager.js` добавьте метод:**

```javascript
_createAmbientLight() {
    const config = LIGHTS_CONFIG.ambient;
    const light = new THREE.AmbientLight(config.color, config.intensity);
    this.scene.add(light);
    this.lights.ambient = light;
    console.log('  ✅ AmbientLight добавлен');
}
```

**И в методе `createAll` вызовите его:**

```javascript
createAll() {
    this._createAmbientLight();
    return this.lights;
}
```

**Проверка:** Сцена стала чуть светлее, но теней нет.

---

## ШАГ 4: Добавляем DirectionalLight (основной свет)

**Добавьте метод в LightManager:**

```javascript
_createMainLight() {
    const config = LIGHTS_CONFIG.main;
    const light = new THREE.DirectionalLight(config.color, config.intensity);
    light.position.set(config.position.x, config.position.y, config.position.z);
    
    if (config.castShadow) {
        light.castShadow = true;
        light.shadow.mapSize.width = config.shadowMapSize;
        light.shadow.mapSize.height = config.shadowMapSize;
    }
    
    this.scene.add(light);
    this.lights.main = light;
    console.log('  ✅ MainLight добавлен');
}
```

**Обновите `createAll`:**

```javascript
createAll() {
    this._createAmbientLight();
    this._createMainLight();  // 👈 ДОБАВЛЕНО
    return this.lights;
}
```

**Проверка:** Появилось направление света, объекты стали объёмными.

---

## ШАГ 5: Добавляем RimLight (контровой свет)

**Добавьте метод:**

```javascript
_createRimLight() {
    const config = LIGHTS_CONFIG.rim;
    const light = new THREE.DirectionalLight(config.color, config.intensity);
    light.position.set(config.position.x, config.position.y, config.position.z);
    this.scene.add(light);
    this.lights.rim = light;
    console.log('  ✅ RimLight добавлен');
}
```

**Обновите `createAll`:**

```javascript
createAll() {
    this._createAmbientLight();
    this._createMainLight();
    this._createRimLight();   // 👈 ДОБАВЛЕНО
    return this.lights;
}
```

---

## ШАГ 6: Добавляем FillLight (заполняющий свет снизу)

**Добавьте метод:**

```javascript
_createFillLight() {
    const config = LIGHTS_CONFIG.fill;
    const light = new THREE.PointLight(config.color, config.intensity);
    light.position.set(config.position.x, config.position.y, config.position.z);
    this.scene.add(light);
    this.lights.fill = light;
    console.log('  ✅ FillLight добавлен');
}
```

**Обновите `createAll`:**

```javascript
createAll() {
    this._createAmbientLight();
    this._createMainLight();
    this._createRimLight();
    this._createFillLight();   // 👈 ДОБАВЛЕНО
    return this.lights;
}
```

---

## ШАГ 7: Добавляем BackLight (подсветка сзади)

**Добавьте метод:**

```javascript
_createBackLight() {
    const config = LIGHTS_CONFIG.back;
    const light = new THREE.PointLight(config.color, config.intensity);
    light.position.set(config.position.x, config.position.y, config.position.z);
    this.scene.add(light);
    this.lights.back = light;
    console.log('  ✅ BackLight добавлен');
}
```

**Обновите `createAll`:**

```javascript
createAll() {
    this._createAmbientLight();
    this._createMainLight();
    this._createRimLight();
    this._createFillLight();
    this._createBackLight();   // 👈 ДОБАВЛЕНО
    return this.lights;
}
```

**Проверка:** Все 5 источников света добавлены. Сцена хорошо освещена.

---

## ШАГ 8: Добавляем анимацию света (пульсация)

**В LightManager добавьте метод `update`:**

```javascript
update(time) {
    // Пульсация контрового света
    if (this.lights.rim) {
        const baseIntensity = LIGHTS_CONFIG.rim.intensity;
        this.lights.rim.intensity = baseIntensity + Math.sin(time * 2) * 0.15;
    }
    
    // Пульсация заднего света
    if (this.lights.back) {
        const baseIntensity = LIGHTS_CONFIG.back.intensity;
        this.lights.back.intensity = baseIntensity + Math.sin(time * 1.5) * 0.1;
    }
}
```

**Проверка:** Свет мягко пульсирует, создавая живой эффект.

---

## ШАГ 9: Добавляем сетку и пол в SceneManager

**В файл `src/core/SceneManager.js` добавьте метод `_createGrid`:**

```javascript
_createGrid() {
    // 1. ОПОРНАЯ СЕТКА (помогает ориентироваться в пространстве)
    const gridHelper = new THREE.GridHelper(20, 20, 0x4488ff, 0x335588);
    gridHelper.position.y = -1.2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    this.scene.add(gridHelper);
    
    // 2. ОТРАЖАЮЩАЯ ПЛОСКОСТЬ (пол)
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
    floorPlane.rotation.x = -Math.PI / 2;  // поворачиваем горизонтально
    floorPlane.position.y = -1.1;
    floorPlane.receiveShadow = true;
    this.scene.add(floorPlane);
    
    console.log('✅ Сетка и пол добавлены');
}
```

**В методе `create` вызовите этот метод:**

```javascript
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
    this._createGrid();  // 👈 ДОБАВЛЕНО
    
    return this.scene;
}
```

**Проверка:** Теперь видна синяя сетка и полупрозрачный пол под ней.

---

## ШАГ 10: Добавляем тестовый объект (чтобы увидеть эффект света)

**В SceneManager добавьте метод:**

```javascript
addTestObject() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xff6600,
        metalness: 0.6,
        roughness: 0.4
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.position.y = 0.5;
    
    this.scene.add(cube);
    return cube;
}
```

---

## ШАГ 11: Обновляем main.js - добавляем LightManager

**В `src/main.js` добавьте импорт:**

```javascript
import { LightManager } from './core/LightManager.js';
```

**В конструктор добавьте:**

```javascript
this.lightManager = null;
```

**В методе `init` после создания камеры добавьте:**

```javascript
this.lightManager = new LightManager(scene);
this.lightManager.createAll();
```

**В методе `animate` добавьте:**

```javascript
this.lightManager.update(this.time);
```

**Полный метод `init` теперь:**

```javascript
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

    this.lightManager = new LightManager(scene);  // 👈 ДОБАВЛЕНО
    this.lightManager.createAll();                // 👈 ДОБАВЛЕНО

    window.addEventListener('resize', () => this.onWindowResize());

    this.animate();
}
```

**Полный метод `animate`:**

```javascript
animate() {
    requestAnimationFrame(() => this.animate());

    this.time += 0.016;

    this.sceneManager.update(this.time);
    this.lightManager.update(this.time);  // 👈 ДОБАВЛЕНО
    this.cameraManager.update();

    this.renderer.render(
        this.sceneManager.getScene(),
        this.cameraManager.getCamera()
    );
}
```

---

## ШАГ 12: Добавляем тестовый куб (опционально)

**В `src/main.js` добавьте в конструктор:**

```javascript
this.testCube = null;
```

**В методе `init` после `lightManager.createAll()` добавьте:**

```javascript
this.testCube = this.sceneManager.addTestObject();
```

**В методе `animate` добавьте анимацию куба:**

```javascript
if (this.testCube) {
    this.testCube.rotation.y = this.time * 0.5;
    this.testCube.rotation.x = Math.sin(this.time * 0.8) * 0.3;
}
```

---

## Итоговый код LightManager.js

```javascript
import * as THREE from 'three';
import { LIGHTS_CONFIG } from '../config/lights.js';

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
    }

    createAll() {
        this._createAmbientLight();
        this._createMainLight();
        this._createRimLight();
        this._createFillLight();
        this._createBackLight();
        
        console.log('✅ LightManager: все источники света созданы');
        return this.lights;
    }

    _createAmbientLight() {
        const config = LIGHTS_CONFIG.ambient;
        const light = new THREE.AmbientLight(config.color, config.intensity);
        this.scene.add(light);
        this.lights.ambient = light;
    }

    _createMainLight() {
        const config = LIGHTS_CONFIG.main;
        const light = new THREE.DirectionalLight(config.color, config.intensity);
        light.position.set(config.position.x, config.position.y, config.position.z);
        
        if (config.castShadow) {
            light.castShadow = true;
            light.shadow.mapSize.width = config.shadowMapSize;
            light.shadow.mapSize.height = config.shadowMapSize;
            
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 20;
            light.shadow.camera.left = -5;
            light.shadow.camera.right = 5;
            light.shadow.camera.top = 5;
            light.shadow.camera.bottom = -5;
        }
        
        this.scene.add(light);
        this.lights.main = light;
    }

    _createRimLight() {
        const config = LIGHTS_CONFIG.rim;
        const light = new THREE.DirectionalLight(config.color, config.intensity);
        light.position.set(config.position.x, config.position.y, config.position.z);
        this.scene.add(light);
        this.lights.rim = light;
    }

    _createFillLight() {
        const config = LIGHTS_CONFIG.fill;
        const light = new THREE.PointLight(config.color, config.intensity);
        light.position.set(config.position.x, config.position.y, config.position.z);
        this.scene.add(light);
        this.lights.fill = light;
    }

    _createBackLight() {
        const config = LIGHTS_CONFIG.back;
        const light = new THREE.PointLight(config.color, config.intensity);
        light.position.set(config.position.x, config.position.y, config.position.z);
        this.scene.add(light);
        this.lights.back = light;
    }

    update(time) {
        if (this.lights.rim) {
            const baseIntensity = LIGHTS_CONFIG.rim.intensity;
            this.lights.rim.intensity = baseIntensity + Math.sin(time * 2) * 0.15;
        }
        
        if (this.lights.back) {
            const baseIntensity = LIGHTS_CONFIG.back.intensity;
            this.lights.back.intensity = baseIntensity + Math.sin(time * 1.5) * 0.1;
        }
    }
    
    getLight(name) {
        return this.lights[name];
    }
}
```

---

## Что вы добавили на этом этапе:

| Шаг | Компонент | Эффект |
|-----|-----------|--------|
| 1-2 | Конфиг + каркас | Основа для света |
| 3 | AmbientLight | Сцена перестала быть чёрной |
| 4 | MainLight | Появились объём и тени |
| 5 | RimLight | Подсветка краёв объектов |
| 6 | FillLight | Подсветка снизу |
| 7 | BackLight | Отделение от фона |
| 8 | Анимация света | Живая пульсация |
| 9 | Сетка и пол | Ориентация в пространстве |
| 10-12 | Тестовый куб | Визуализация эффектов |

---

## Проверка работоспособности

Откройте браузер, вы должны увидеть:

- ✨ **Мерцающие звёзды** на заднем плане
- 🔷 **Синяя опорная сетка** внизу
- 🟠 **Вращающийся оранжевый куб** (если добавили)
- 💡 **Динамическое освещение** (свет пульсирует)
- 🖱️ **Управление камерой** (вращение мышью)

---

## Задания для закрепления

1. **Измените цвета источников света** в `lights.js` (например, основной свет сделайте голубоватым)
2. **Увеличьте интенсивность** fill света до 0.7
3. **Добавьте второй тестовый объект** (сферу) рядом с кубом
4. **Измените скорость пульсации** света в методе `update`

```javascript
// Пример: более быстрая пульсация
this.lights.rim.intensity = baseIntensity + Math.sin(time * 4) * 0.2;
```
