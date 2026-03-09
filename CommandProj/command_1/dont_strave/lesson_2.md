Отличная задача! Вот обновлённое руководство, где каждая команда получает несколько маленьких заданий, чтобы каждый участник сделал свой коммит:

---

# Занятие 2: Основы Git, canvas, первый рисунок

## Подготовка ментора (до занятия)

- [ ] Проверить и смерджить все PR с прошлого занятия в `develop`
- [ ] Обновить локальную ветку `develop`
- [ ] Создать файлы для каждой команды с заготовками (см. ниже)
- [ ] Создать issue на каждого участника

### Шаблон issue для участника
```markdown
## Задача: Добавить [конкретный элемент] в [файл]

**Задание:**
- [ ] Создать ветку `feature/[имя]-[элемент]` от `develop`
- [ ] В файле `js/[файл].js` добавить функцию `window.draw[Элемент]`
- [ ] Закоммитить изменения
- [ ] Открыть PR в `develop`

**Что нужно сделать:**
[Подробное описание задачи]

**Критерии приёмки:**
- [ ] Функция принимает ctx, x, y (и другие параметры если нужно)
- [ ] Функция рисует правильную фигуру
- [ ] В консоли нет ошибок
```

---

## Ход занятия 2 (90 минут)

### 10 мин: Разбор ДЗ и повторение Git

**Показываю на экране:**
> "На прошлом занятии мы создали файлы. Сейчас я их всех смерджил в `develop`. Давайте обновимся!"

```bash
git checkout develop
git pull origin develop
```

### 15 мин: Теория

#### Часть 1. Глобальные функции (5 мин)

> "Мы будем использовать простой подход: все функции будут доступны через `window`. Это значит, что мы пишем:"

```javascript
window.drawSomething = function(ctx, x, y) {
    // код
};
```

> "И потом можем вызвать из любого места просто `drawSomething(ctx, 100, 100)`"

#### Часть 2. Canvas API — 10 мин

**Показываю пример:**
```html
<canvas id="gameCanvas" width="800" height="600" style="border:1px solid black;"></canvas>
<script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Круг
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(100, 100, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Прямоугольник
    ctx.fillStyle = 'blue';
    ctx.fillRect(200, 100, 50, 50);
    
    // Линия
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 100);
    ctx.lineTo(400, 200);
    ctx.stroke();
</script>
```

### 60 мин: Практика (каждый делает свой коммит!)

#### Этап 1. Integration & QA создают основу (5 мин)

**Файл `index.html`** (уже есть):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Наша игра</title>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600" style="border:1px solid black;"></canvas>
    
    <!-- Порядок важен! Сначала функции, потом main -->
    <script src="js/core.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/ai.js"></script>
    <script src="js/graphics.js"></script>
    <script src="js/effects.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

**Файл `js/main.js`**:
```javascript
// Получаем canvas и контекст
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function gameLoop() {
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ЗДЕСЬ БУДУТ ВЫЗОВЫ ФУНКЦИЙ
    
    requestAnimationFrame(gameLoop);
}

// Запускаем игру
gameLoop();
```

---

#### Этап 2. Каждый создаёт свою ветку (3 мин)

> "Теперь каждый создаёт свою ветку от свежего develop"

```bash
git checkout develop
git pull origin develop
git checkout -b feature/[своё-имя]-[что-делает]
```

---

#### Этап 3. Выполняем задания (40 мин)

### Команда Core Mechanics (2-3 человека)

**Файл:** `js/core.js`

##### Участник 1: Игрок (основа)
```javascript
// Задание: нарисовать основу игрока - жёлтый круг
window.drawPlayerBase = function(ctx, x, y) {
    // TODO: Жёлтый круг радиусом 15
    // Используй: fillStyle = 'yellow', arc, fill
}
```

##### Участник 2: Глаза игрока
```javascript
// Задание: нарисовать глаза игроку
window.drawPlayerEyes = function(ctx, x, y) {
    // TODO: Два белых круга радиусом 3 на позициях (x-5, y-5) и (x+5, y-5)
    // Потом два чёрных круга радиусом 1.5 внутри них
    // Используй: fillStyle = 'white', arc, fill, потом fillStyle = 'black'
}
```

##### Участник 3: Объединение (если есть)
```javascript
// Задание: создать полную функцию игрока
window.drawPlayer = function(ctx, x, y) {
    // TODO: Вызвать drawPlayerBase и drawPlayerEyes
    // Подсказка: просто вызови функции выше
}
```

---

### Команда Game State & UI (2-3 человека)

**Файл:** `js/ui.js`

##### Участник 1: Полоска здоровья
```javascript
// Задание: нарисовать красную полоску здоровья
window.drawHealthBar = function(ctx, x, y, healthPercent) {
    const barWidth = 200;
    const barHeight = 20;
    
    // TODO: 
    // 1. Нарисовать красный прямоугольник шириной healthPercent% от barWidth
    // 2. Нарисовать чёрную обводку вокруг всей полоски
    // Используй: fillStyle = 'red', fillRect, strokeStyle = 'black', strokeRect
}
```

##### Участник 2: Полоска голода
```javascript
// Задание: нарисовать зелёную полоску голода
window.drawHungerBar = function(ctx, x, y, hungerPercent) {
    const barWidth = 200;
    const barHeight = 20;
    
    // TODO: 
    // 1. Нарисовать зелёный прямоугольник шириной hungerPercent% от barWidth
    // 2. Нарисовать чёрную обводку вокруг всей полоски
    // Используй: fillStyle = 'green', fillRect, strokeStyle = 'black', strokeRect
}
```

##### Участник 3: Текст и объединение
```javascript
// Задание: добавить подписи к полоскам
window.drawHealthText = function(ctx, x, y, health) {
    // TODO: Написать текст "HP: X" справа от полоски здоровья
    // Используй: font = '14px Arial', fillStyle = 'black', fillText
}

window.drawHungerText = function(ctx, x, y, hunger) {
    // TODO: Написать текст "Hunger: X" справа от полоски голода
}

// Объединение
window.drawHungerHealth = function(ctx, hunger, health) {
    // TODO: Вызвать все функции выше с правильными координатами
    // Подсказка: x = 10, y = 10 для здоровья, y = 35 для голода
}
```

---

### Команда AI & Balance (2-3 человека)

**Файл:** `js/ai.js`

##### Участник 1: Паук
```javascript
// Задание: нарисовать паука (красный)
window.drawSpider = function(ctx, x, y) {
    // TODO: Красный круг радиусом 15
    // Используй: fillStyle = 'red', arc, fill
}
```

##### Участник 2: Гончая
```javascript
// Задание: нарисовать гончую (коричневый)
window.drawHound = function(ctx, x, y) {
    // TODO: Коричневый круг радиусом 15
    // Используй: fillStyle = 'brown', arc, fill
}
```

##### Участник 3: Глаза для врагов
```javascript
// Задание: нарисовать злые глаза
window.drawEnemyEyes = function(ctx, x, y) {
    // TODO: Два белых круга с чёрными зрачками
    // Белые круги радиусом 4 на (x-5, y-5) и (x+5, y-5)
    // Чёрные круги радиусом 2 внутри них
}

// Объединение (если есть)
window.drawEnemy = function(ctx, x, y, type) {
    if (type === 'spider') window.drawSpider(ctx, x, y);
    if (type === 'hound') window.drawHound(ctx, x, y);
    window.drawEnemyEyes(ctx, x, y);
}
```

---

### Команда Assets & Graphics (2-3 человека)

**Файл:** `js/graphics.js`

##### Участник 1: Ствол дерева
```javascript
// Задание: нарисовать ствол дерева
window.drawTreeTrunk = function(ctx, x, y) {
    // TODO: Коричневый прямоугольник 10x40
    // Используй: fillStyle = 'brown', fillRect
    // Подсказка: x-5, y-20, 10, 40
}
```

##### Участник 2: Крона дерева (верх)
```javascript
// Задание: нарисовать верхнюю часть кроны
window.drawTreeTop = function(ctx, x, y) {
    // TODO: Зелёный круг радиусом 15 в позиции (x, y-30)
    // Используй: fillStyle = 'green', arc, fill
}
```

##### Участник 3: Боковые части кроны
```javascript
// Задание: нарисовать боковые части кроны
window.drawTreeSides = function(ctx, x, y) {
    // TODO: Два зелёных круга радиусом 12
    // Первый: (x-10, y-20)
    // Второй: (x+10, y-20)
}

// Объединение
window.drawTree = function(ctx, x, y) {
    window.drawTreeTrunk(ctx, x, y);
    window.drawTreeTop(ctx, x, y);
    window.drawTreeSides(ctx, x, y);
}
```

---

### Команда Sound & Effects (2-3 человека)

**Файл:** `js/effects.js`

##### Участник 1: Вертикальные искры
```javascript
// Задание: нарисовать вертикальные линии эффекта
window.drawVerticalSparks = function(ctx, x, y) {
    // TODO: Две жёлтые линии: вверх и вниз от точки
    // Используй: strokeStyle = 'yellow', lineWidth = 2
    // moveTo(x,y) -> lineTo(x, y-20) и moveTo(x,y) -> lineTo(x, y+20)
}
```

##### Участник 2: Горизонтальные искры
```javascript
// Задание: нарисовать горизонтальные линии эффекта
window.drawHorizontalSparks = function(ctx, x, y) {
    // TODO: Две жёлтые линии: влево и вправо от точки
    // moveTo(x,y) -> lineTo(x-20, y) и moveTo(x,y) -> lineTo(x+20, y)
}
```

##### Участник 3: Объединение
```javascript
// Задание: собрать все искры вместе
window.drawPickupEffect = function(ctx, x, y) {
    // TODO: Вызвать обе функции выше
    window.drawVerticalSparks(ctx, x, y);
    window.drawHorizontalSparks(ctx, x, y);
}
```

---

### Команда Integration & QA (2-3 человека)

**Файл:** `js/main.js`

##### Участник 1: Игрок и деревья
```javascript
// Задание: добавить вызовы игрока и деревьев в gameLoop
// После "ЗДЕСЬ БУДУТ ВЫЗОВЫ ФУНКЦИЙ" добавить:
drawTree(ctx, 200, 300);
drawTree(ctx, 500, 400);
drawPlayer(ctx, 400, 300);
```

##### Участник 2: Враги и эффекты
```javascript
// Задание: добавить врагов и эффект подбора
// В gameLoop после кода первого участника добавить:
drawEnemy(ctx, 300, 200, 'spider');
drawEnemy(ctx, 600, 350, 'hound');
drawPickupEffect(ctx, 450, 250);
```

##### Участник 3: Интерфейс
```javascript
// Задание: добавить полоски здоровья и голода
// В gameLoop последними добавить:
drawHungerHealth(ctx, 75, 60);
```

**Также Integration & QA помогают всем с Git и проверяют PR!**

---

#### Этап 4. Коммит и PR (7 мин)

> "Каждый делает свой коммит:"

```bash
# Проверяем что изменили
git status

# Добавляем файл
git add js/название-файла.js

# Делаем коммит (ВАЖНО: понятное название!)
git commit -m "feat: add [что именно сделали]"

# Пушим
git push origin feature/название-ветки

# Открываем PR на GitHub
```

#### Этап 5. Ревью и мерж (5 мин)

> "Integration & QA проверяют PR и мержат. Когда все PR смержены, показываю финальный результат:"

```bash
# Обновляем develop
git checkout develop
git pull origin develop
```

**Открываю `index.html` в браузере - видим полную картину!**

---

## Итог (5 мин)

> "Посмотрите, что получилось! Каждый из вас добавил свой маленький кусочек, и вместе мы создали первую версию игры.
>
> **Что мы освоили:**
> - ✅ Каждый сделал свой коммит
> - ✅ Научились работать в одной кодовой базе
> - ✅ Познакомились с canvas
> - ✅ Увидели, как из кусочков собирается целое
>
> **Домашнее задание:**
> 1. Поэкспериментируйте с параметрами в своих функциях
> 2. Попробуйте добавить новый элемент (например, камень или цветок)
> 3. Откройте PR с улучшением"

---
