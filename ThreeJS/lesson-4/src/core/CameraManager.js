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

    createControls() {
        this.controls = new OrbitControls(this.camera, this.rendererDomElement);
        
        this.controls.enableDamping = CAMERA_CONFIG.controls.enableDamping;
        this.controls.dampingFactor = CAMERA_CONFIG.controls.dampingFactor;
        this.controls.autoRotate = CAMERA_CONFIG.controls.autoRotate;
        this.controls.enableZoom = CAMERA_CONFIG.controls.enableZoom;
        this.controls.enablePan = CAMERA_CONFIG.controls.enablePan;
        this.controls.zoomSpeed = CAMERA_CONFIG.controls.zoomSpeed;
        this.controls.rotateSpeed = CAMERA_CONFIG.controls.rotateSpeed;
        
        this.controls.target.set(
            CAMERA_CONFIG.target.x,
            CAMERA_CONFIG.target.y,
            CAMERA_CONFIG.target.z
        );
        
        return this.controls;
    }

    update() {
        if (this.controls) {
            this.controls.update();
        }
        
        // Если есть цель, камера смотрит на неё
        if (this.target && !this.controls.autoRotate) {
            this.controls.target.copy(this.target.position);
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    getCamera() {
        return this.camera;
    }

    getControls() {
        return this.controls;
    }

    setTarget(targetModel) {
        this.target = targetModel;
    }
}