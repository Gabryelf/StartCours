import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.currentModel = null;
        this.modelsList = [];
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
                    
                    // Настройка теней для всех частей модели
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    this.isLoading = false;
                    console.log('✅ Модель загружена');
                    resolve(model);
                },
                (progress) => {
                    // Прогресс загрузки
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

    async switchToNext() {
        if (this.isLoading) {
            console.log('⏳ Модель загружается, подождите...');
            return;
        }
        
        this.currentIndex = (this.currentIndex + 1) % this.modelsList.length;
        await this.showModel(this.currentIndex);
    }

    async switchToPrev() {
        if (this.isLoading) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.modelsList.length) % this.modelsList.length;
        await this.showModel(this.currentIndex);
    }

    async showModel(index) {
        if (!this.modelsList[index]) return;
        
        const modelInfo = this.modelsList[index];
        
        // Удаляем текущую модель
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
        }
        
        // Загружаем и добавляем новую
        const model = await this.loadModel(modelInfo.url, modelInfo.scale);
        this.currentModel = model;
        this.scene.add(model);
    }

    setModels(models) {
        this.modelsList = models;
        console.log(`📚 Загружено ${models.length} моделей`);
    }

    getCurrentModelInfo() {
        return this.modelsList[this.currentIndex];
    }
}