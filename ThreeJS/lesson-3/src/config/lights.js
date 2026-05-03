/**
 * КОНФИГ ОСВЕЩЕНИЯ
 */

 export const LIGHTS_CONFIG = {
    // === РАССЕЯННЫЙ СВЕТ ===
    // Освещает всё равномерно, не создаёт теней
    ambient: {
        color: 0x404060,
        intensity: 0.6        // 0 - темно, 1 - максимально ярко
    },
    
    // === ОСНОВНОЙ НАПРАВЛЕННЫЙ СВЕТ ===
    // Как солнце - лучи параллельны, создаёт резкие тени
    main: {
        type: 'directional',
        color: 0xffffff,
        intensity: 1.2,
        position: { x: 5, y: 10, z: 7 },
        castShadow: true,               // включить тени
        shadowMapSize: 1024             // качество теней
    },
    
    // === КОНТРОВОЙ СВЕТ ===
    // Подсвечивает объекты сзади-сбоку, выделяет края
    rim: {
        type: 'directional',
        color: 0x6688aa,
        intensity: 0.8,
        position: { x: -3, y: 2, z: -4 }
    },
    
    // === ЗАПОЛНЯЮЩИЙ СВЕТ ===
    // Светит снизу, подсвечивает нижние детали
    fill: {
        type: 'point',          // точечный свет (во все стороны)
        color: 0x4466aa,
        intensity: 0.3,
        position: { x: 0, y: -2, z: 0 }
    },
    
    // === ПОДСВЕТКА СЗАДИ ===
    back: {
        type: 'point',
        color: 0xffaa66,
        intensity: 0.4,
        position: { x: 0, y: 1, z: -5 }
    }
};