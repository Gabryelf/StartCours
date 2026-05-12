export const SHIP_STATS = {
    assault: {
        id: 'assault',
        name: 'Штурмовик',
        class: 'Истребитель',
        health: 120,
        armor: 80,
        damage: 35,
        speed: 8.5,
        turnSpeed: 6.0,
        weapons: {
            primary: { name: 'Торпеда', damage: 35, cooldown: 800, ammo: 1, spread: 0 },
            secondary: { name: 'Залп', damage: 15, cooldown: 400, ammo: 3, spread: 0.05 },
            tertiary: { name: 'Подавление', damage: 5, cooldown: 200, ammo: 8, spread: 0.15 }
        }
    },
    freighter: {
        id: 'freighter',
        name: 'Грузовик',
        class: 'Танк',
        health: 200,
        armor: 120,
        damage: 20,
        speed: 4.5,
        turnSpeed: 3.0,
        weapons: {
            primary: { name: 'Тяжелая торпеда', damage: 45, cooldown: 1200, ammo: 1, spread: 0 },
            secondary: { name: 'Двойной залп', damage: 12, cooldown: 500, ammo: 2, spread: 0.08 },
            tertiary: { name: 'Шквальный огонь', damage: 4, cooldown: 150, ammo: 12, spread: 0.2 }
        }
    },
    scout: {
        id: 'scout',
        name: 'Разведчик',
        class: 'Стелс',
        health: 80,
        armor: 40,
        damage: 25,
        speed: 12.0,
        turnSpeed: 8.5,
        weapons: {
            primary: { name: 'Быстрая торпеда', damage: 25, cooldown: 600, ammo: 1, spread: 0 },
            secondary: { name: 'Точный залп', damage: 18, cooldown: 300, ammo: 3, spread: 0.02 },
            tertiary: { name: 'Рой', damage: 6, cooldown: 180, ammo: 6, spread: 0.12 }
        }
    }
};