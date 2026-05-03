export const MODELS_CONFIG = {
    ships: [
        {
            id: 'assault',
            name: 'Штурмовой корабль',
            url: 'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/models/ships/scout.glb',
            color: 0xff4444,
            scale: 1.0,
            rotationSpeed: 0.005
        },
        {
            id: 'freighter',
            name: 'Грузовой корабль',
            url: 'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/models/ships/freighter.glb',
            color: 0x44ff44,
            scale: 0.8,
            rotationSpeed: 0.003
        },
        {
            id: 'scout',
            name: 'Разведчик',
            url: 'https://raw.githubusercontent.com/Gabryelf/Atlas-Assets/main/docs/models/ships/assault.glb',
            color: 0x44aaff,
            scale: 0.7,
            rotationSpeed: 0.008
        }
    ],
    loading: {
        showProgress: true,
        defaultScale: 1.0
    }
};