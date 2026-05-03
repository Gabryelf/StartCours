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

        const positions = new Float32Array(count * 3);
 
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * range;
            positions[i * 3 + 1] = (Math.random() - 0.5) * range * 0.6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * range * 0.5 - 50;
        }
 
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
 
        const material = new THREE.PointsMaterial({
             color: color,
             size: size,
             transparent: true,
             opacity: 0.8
        });
 
        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);       
    }
 
    getScene() {
         return this.scene;
    }
 
    update(time) {
        if (this.stars && this.stars.material) {
            this.stars.material.opacity = 0.7 + Math.sin(time * 3) * 0.1;
        }
    }
}