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
        this._createGrid();
        return this.scene;
     }

     _createGrid() {
        const gridHelper = new THREE.GridHelper(20, 20, 0x4488ff, 0x335588);
        gridHelper.position.y = -1.2;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.3;
        this.scene.add(gridHelper);
        
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
        floorPlane.position.y = -1.1;
        floorPlane.receiveShadow = true; 
        this.scene.add(floorPlane);
    }

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