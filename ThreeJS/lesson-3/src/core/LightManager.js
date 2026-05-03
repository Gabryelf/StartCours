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
        
        return this.lights;
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

    _createAmbientLight() {
        const config = LIGHTS_CONFIG.ambient;
        const light = new THREE.AmbientLight(config.color, config.intensity);
        this.scene.add(light);
        this.lights.ambient = light;
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