# Занятие 2: Основы Git, canvas, первый рисунок

## Подготовка ментора (до занятия)

- [ ] Проверить и смерджить все PR с прошлого занятия в `develop`
- [ ] Обновить локальную ветку `develop`
- [ ] Подготовить простой пример с canvas для демонстрации
- [ ] Создать issue на каждого участника для второго занятия (шаблон ниже)

### Шаблон issue для второго занятия
```markdown
## Задача: Нарисовать [компонент] на canvas

**Команда:** [название]

**Задание:**
- [ ] Создать ветку `feature/[команда]-draw-[компонент]` от `develop`
- [ ] Написать функцию отрисовки в своём файле
- [ ] Подключить функцию в `main.js`
- [ ] Открыть PR

**Критерии приёмки:**
- [ ] Функция принимает контекст canvas и координаты
- [ ] При вызове функция рисует нужную фигуру
- [ ] В консоли нет ошибок
```

---

## Ход занятия 2 (90 минут)

### 10 мин: Разбор ДЗ и повторение Git

**Открываю GitHub и показываю:**
> "На прошлом занятии все открыли PR, я их смерджил. Теперь в ветке `develop` есть все ваши файлы. Давайте обновим свои локальные копии."

```bash
# Переходим на develop
git checkout develop

# Скачиваем изменения
git pull origin develop

# Смотрим, что появились новые файлы
ls -la js/
```

> "Теперь у всех есть файлы других команд. Именно так мы и будем работать — каждый добавляет свой кусочек, а потом мы всё собираем вместе."

### 20 мин: Теория

#### Часть 1. Git Flow (углублённо) — 10 мин

> "Давайте разберём, что будет, если два человека изменят один файл. Это называется конфликт."

**Демонстрация:**
1. Показываю два окна с разными ветками
2. Вношу изменения в одну строку
3. Пытаюсь смерджить — возникает конфликт

> "Как решать конфликт:"
> 1. Git помечает файл: `<<<<<<<`, `=======`, `>>>>>>>`
> 2. Вы вручную выбираете, что оставить
> 3. Убираете маркеры конфликта
> 4. Коммитите результат

> "Но сегодня мы постараемся избежать конфликтов — каждый работает в своём файле."

#### Часть 2. Canvas API — 10 мин

**Открываю пустой HTML и показываю:**

```html
<canvas id="gameCanvas" width="800" height="600" style="border:1px solid black;"></canvas>
<script>
    // Получаем холст
    const canvas = document.getElementById('gameCanvas');
    
    // Берём контекст — это наша кисть
    const ctx = canvas.getContext('2d');
    
    // Рисуем зелёный прямоугольник
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 50, 50);
    
    // Рисуем красный круг
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(100, 35, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Рисуем текст
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Привет, игра!', 200, 50);
</script>
```

> **Важно про координаты:**
> - (0,0) — левый верхний угол
> - X растёт вправо
> - Y растёт вниз

> **Очистка canvas:**
> ```javascript
> ctx.clearRect(0, 0, canvas.width, canvas.height);
> ```

### 55 мин: Практика

#### Этап 1. Интеграция & QA создают основу (5 мин)

**Команда Integration & QA получает задание:**
> "Вы — наши главные строители. Вам нужно создать фундамент, на котором остальные будут рисовать."

**Задание для Integration & QA:**
1. В `index.html` добавить canvas:
   ```html
   <canvas id="gameCanvas" width="800" height="600" style="border:1px solid black; display: block; margin: 0 auto;"></canvas>
   ```
2. В `js/main.js` написать:
   ```javascript
   // Получаем canvas и контекст
   const canvas = document.getElementById('gameCanvas');
   const ctx = canvas.getContext('2d');
   
   // Функция игрового цикла
   function gameLoop() {
       // Очищаем canvas
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       
       // Здесь будем вызывать функции отрисовки из других команд
       
       // Запрашиваем следующий кадр (пока просто чтобы был)
       requestAnimationFrame(gameLoop);
   }
   
   // Запускаем игру
   gameLoop();
   ```
3. Подключить все JS-файлы как модули (важно!):
   ```html
   <script src="js/main.js" type="module"></script>
   ```

#### Этап 2. Каждая команда создаёт свою ветку (5 мин)

> "Теперь каждый создаёт новую ветку от свежего `develop`."

```bash
# Убеждаемся, что мы на develop и он обновлён
git checkout develop
git pull origin develop

# Создаём ветку для нового задания
git checkout -b feature/[команда]-draw-[что-то]

# Например: feature/core-draw-player
```

#### Этап 3. Выполняем задания (35 мин)

**Задания для команд:**

##### Команда Core Mechanics
**Файл:** `js/core.js`
**Код для добавления:**
```javascript
// Функция отрисовки игрока
export function drawPlayer(ctx, x, y) {
    // Жёлтый круг
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Глаза (чтобы было понятно, куда смотрит)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, y - 5, 3, 0, 2 * Math.PI);
    ctx.fill();
}
```
**Что освоят:**
- Создание и экспорт функций
- Рисование кругов (`arc`)
- Система координат

##### Команда Game State & UI
**Файл:** `js/ui.js`
**Код для добавления:**
```javascript
export function drawHungerHealth(ctx, hunger, health) {
    const barWidth = 200;
    const barHeight = 20;
    const startX = 10;
    let startY = 10;
    
    // Здоровье (красная полоска)
    ctx.fillStyle = 'red';
    ctx.fillRect(startX, startY, (health / 100) * barWidth, barHeight);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(startX, startY, barWidth, barHeight);
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`HP: ${health}`, startX + barWidth + 10, startY + 15);
    
    // Голод (зелёная полоска)
    startY += barHeight + 5;
    ctx.fillStyle = 'green';
    ctx.fillRect(startX, startY, (hunger / 100) * barWidth, barHeight);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(startX, startY, barWidth, barHeight);
    ctx.fillStyle = 'black';
    ctx.fillText(`Hunger: ${hunger}`, startX + barWidth + 10, startY + 15);
}
```
**Что освоят:**
- Рисование прямоугольников (`fillRect`, `strokeRect`)
- Работа с текстом (`fillText`)
- Простая логика преобразования чисел

##### Команда AI & Balance
**Файл:** `js/ai.js`
**Код для добавления:**
```javascript
export function drawEnemy(ctx, x, y, type) {
    // Выбираем цвет в зависимости от типа
    let color;
    if (type === 'spider') {
        color = 'red';
    } else if (type === 'hound') {
        color = 'brown';
    } else {
        color = 'gray';
    }
    
    // Рисуем тело
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Глаза (злые)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, y - 5, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, y - 5, 2, 0, 2 * Math.PI);
    ctx.fill();
}
```
**Что освоят:**
- Условные операторы (`if/else`)
- Параметры функций
- Переиспользование кода

##### Команда Assets & Graphics
**Файл:** `js/graphics.js`
**Код для добавления:**
```javascript
export function drawTree(ctx, x, y) {
    // Ствол
    ctx.fillStyle = 'brown';
    ctx.fillRect(x - 5, y - 20, 10, 40);
    
    // Крона (три зелёных круга)
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(x, y - 30, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 10, y - 20, 12, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 10, y - 20, 12, 0, 2 * Math.PI);
    ctx.fill();
}
```
**Что освоят:**
- Композиция фигур
- Рисование прямоугольников и кругов вместе

##### Команда Sound & Effects
**Файл:** `js/effects.js`
**Код для добавления:**
```javascript
export function drawPickupEffect(ctx, x, y) {
    // Рисуем искры (4 линии)
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    
    // Линия вверх
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 20);
    ctx.stroke();
    
    // Линия вниз
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 20);
    ctx.stroke();
    
    // Линия влево
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 20, y);
    ctx.stroke();
    
    // Линия вправо
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20, y);
    ctx.stroke();
}
```
**Что освоят:**
- Рисование линий (`moveTo`, `lineTo`, `stroke`)
- Работа с углами (пока просто линии)

##### Команда Integration & QA
**Задание:**
1. Убедиться, что все правильно импортируют функции
2. В `main.js` добавить вызовы всех функций:
   ```javascript
   import { drawPlayer } from './core.js';
   import { drawHungerHealth } from './ui.js';
   import { drawEnemy } from './ai.js';
   import { drawTree } from './graphics.js';
   import { drawPickupEffect } from './effects.js';
   
   function gameLoop() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       
       // Рисуем всё (порядок важен!)
       drawTree(ctx, 200, 300);
       drawTree(ctx, 500, 400);
       drawEnemy(ctx, 300, 200, 'spider');
       drawEnemy(ctx, 600, 350, 'hound');
       drawPlayer(ctx, 400, 300);
       drawPickupEffect(ctx, 450, 250);
       drawHungerHealth(ctx, 75, 60); // голод 75, здоровье 60
       
       requestAnimationFrame(gameLoop);
   }
   ```
3. Помогать всем с Git
4. Проверить, что после мержа всё работает

#### Этап 4. Коммит, пуш и PR (10 мин)

> "Теперь так же, как на прошлом занятии:"
```bash
git add .
git commit -m "feat: add [что-то] drawing function"
git push origin feature/...
# Открываем PR на GitHub
```

### 05 мин: Подведение итогов

**Открываю финальную версию на экране:**
> "Посмотрите, что у нас получилось! На одном canvas мы собрали рисунки от всех команд. Это и есть наша будущая игра.
>
> **Что мы освоили за два занятия:**
> - ✅ Git: клонирование, ветки, коммиты, пуши, PR
> - ✅ Работу в команде через GitHub
> - ✅ Основы canvas
> - ✅ Разделение кода на модули
> - ✅ Первый визуальный результат
>
> **Домашнее задание:**
> 1. Поэкспериментируйте со своими функциями: поменяйте цвета, размеры, положение
> 2. Откройте PR с улучшениями
> 3. Подумайте, какие данные (массивы, объекты) нам понадобятся для хранения состояния игры"

---
