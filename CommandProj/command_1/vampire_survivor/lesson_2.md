# Занятие 2: Основы Git, canvas и первый рисунок

## Привет снова! 👋

На прошлом занятии мы настроили всё окружение и познакомились с процессом. Сегодня мы углубимся в работу с Git и сделаем важный шаг — нарисуем первую графику на canvas. К концу занятия у нас будет статичная сцена с игроком, врагами и интерфейсом!

## Цель занятия
- Закрепить навыки работы с Git (ветки, PR, ревью)
- Изучить основы canvas: контекст, координаты, примитивы
- Нарисовать каждый свою часть будущей игры
- Научиться работать с `requestAnimationFrame`
- Объединить результаты в единую сцену

---

## 1. Разбор домашки и повторение Git (15 минут)

### Что должно было быть сделано
- Все PR с прошлого занятия влиты в `develop`
- Вы прочитали `CONTRIBUTING.md`

### Как теперь начать новую задачу
Перед началом работы всегда обновляем локальную `develop`:
```bash
git checkout develop
git pull origin develop
```

### Создаём новую ветку для занятия 2
```bash
git checkout -b feature/lesson2-название-команды
```

---

## 2. Теория: Canvas (15 минут)

Canvas — это элемент HTML5, на котором мы можем рисовать с помощью JavaScript.

### Основные概念
1. **Получение контекста**
   ```javascript
   const canvas = document.getElementById('gameCanvas');
   const ctx = canvas.getContext('2d');
   ```
   `ctx` — это объект, через который мы рисуем.

2. **Система координат**
   - Начало координат (0, 0) — **левый верхний угол**
   - Ось X растёт вправо
   - Ось Y растёт вниз

3. **Рисование прямоугольников**
   ```javascript
   ctx.fillStyle = 'red';      // цвет заливки
   ctx.fillRect(50, 50, 100, 100); // x, y, width, height
   ```

4. **Рисование кругов**
   ```javascript
   ctx.beginPath();
   ctx.arc(200, 200, 30, 0, Math.PI * 2); // x, y, радиус, начало, конец
   ctx.fillStyle = 'blue';
   ctx.fill();
   ```

5. **Текст**
   ```javascript
   ctx.font = '20px Arial';
   ctx.fillStyle = 'white';
   ctx.fillText('Score: 0', 10, 20);
   ```

6. **Очистка canvas**
   ```javascript
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ```
   **Важно:** Без очистки старые рисунки остаются, и получается "смазывание".

---

## 3. Практика: рисуем игру (60 минут)

### Общая структура
В `index.html` уже есть элемент canvas. В `main.js` мы будем писать игровой цикл, который:
1. Очищает экран
2. Вызывает функции отрисовки из разных модулей
3. Запрашивает следующий кадр через `requestAnimationFrame`

### Задания для команд

#### Команда Core Mechanics
**Задача:** Написать функцию `drawPlayer`, которая рисует игрока (синий круг).

**Файл:** `js/core.js`

**Код:**
```javascript
// Добавляем в core.js
export function drawPlayer(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    // Добавим контур, чтобы лучше было видно
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}
```

**Важно:** Функция ничего не знает о координатах игрока — она получает их как аргументы. Это позволит позже передавать реальные координаты игрока.

---

#### Команда Game State & UI
**Задача:** Написать функцию `drawScoreAndTime`, которая рисует текст интерфейса.

**Файл:** `js/ui.js`

**Код:**
```javascript
export function drawScoreAndTime(ctx, score, time) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // Форматируем время как MM:SS
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    ctx.fillText(`Time: ${timeString}`, 10, 60);
}
```

---

#### Команда AI & Balance
**Задача:** Написать функцию `drawEnemy`, которая рисует врагов разных типов.

**Файл:** `js/ai.js`

**Код:**
```javascript
export function drawEnemy(ctx, x, y, type) {
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    
    // Разные типы врагов — разные цвета
    if (type === 'slow') {
        ctx.fillStyle = 'darkred';
    } else if (type === 'fast') {
        ctx.fillStyle = 'orange';
    } else {
        ctx.fillStyle = 'purple'; // для остальных типов
    }
    
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
}
```

---

#### Команда Assets & Graphics
**Задача:** Написать функцию `drawProjectile`, которая рисует снаряд.

**Файл:** `js/graphics.js`

**Код:**
```javascript
export function drawProjectile(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
}
```

---

#### Команда Sound & Effects
**Задача:** Написать функцию `drawExplosion`, которая рисует эффект взрыва.

**Файл:** `js/effects.js`

**Код:**
```javascript
export function drawExplosion(ctx, x, y) {
    // Рисуем круг с градиентом для эффекта взрыва
    const gradient = ctx.createRadialGradient(x, y, 5, x, y, 20);
    gradient.addColorStop(0, 'yellow');
    gradient.addColorStop(0.5, 'orange');
    gradient.addColorStop(1, 'red');
    
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
}
```

---

#### Команда Integration & QA
**Задача:** Собрать всё вместе в `main.js` и создать игровой цикл.

**Файл:** `main.js`

**Код:**
```javascript
import { drawPlayer } from './js/core.js';
import { drawScoreAndTime } from './js/ui.js';
import { drawEnemy } from './js/ai.js';
import { drawProjectile } from './js/graphics.js';
import { drawExplosion } from './js/effects.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Игровой цикл
function gameLoop() {
    // 1. Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Рисуем интерфейс (пока с тестовыми значениями)
    drawScoreAndTime(ctx, 0, 0);
    
    // 3. Рисуем игрока в центре
    drawPlayer(ctx, 400, 300);
    
    // 4. Рисуем врагов в разных местах
    drawEnemy(ctx, 200, 150, 'slow');
    drawEnemy(ctx, 600, 200, 'fast');
    drawEnemy(ctx, 300, 450, 'flying');
    
    // 5. Рисуем снаряд рядом с игроком
    drawProjectile(ctx, 415, 315);
    
    // 6. Рисуем эффект взрыва
    drawExplosion(ctx, 500, 400);
    
    // Запрашиваем следующий кадр
    requestAnimationFrame(gameLoop);
}

// Запускаем игру
gameLoop();
```

**Дополнительные задачи для команды QA:**
- Проверить PR всех команд на конфликты
- Убедиться, что все функции экспортируются правильно
- Помочь другим, если что-то идёт не так
- Добавить комментарии в `main.js`, объясняющие каждый шаг

---

## 4. Работа с Pull Request и ревью (15 минут)

### Как проходит ревью
1. Вы открываете PR из своей ветки в `develop`
2. Назначаете ревьювера (я или кто-то из другой команды)
3. Ревьювер смотрит код и оставляет комментарии
4. Вы исправляете замечания и обновляете PR
5. После одобрения PR вливается в `develop`

### Что проверяем на ревью
- [ ] Код работает без ошибок
- [ ] Функции экспортируются (export)
- [ ] Нет конфликтов с `develop`
- [ ] Осмысленные названия переменных
- [ ] Есть комментарии к сложным местам

### Команда QA сегодня отвечает за:
- Проверку всех PR
- Разрешение конфликтов (если помогут)
- Финальную проверку, что всё работает вместе

---

## 5. Завершение и домашнее задание (15 минут)

### Проверяем результат
После того как все PR влиты, открываем `index.html` в браузере. Мы должны увидеть:
- Синий круг (игрок) в центре
- Красный, оранжевый и фиолетовый круги (враги) по углам
- Жёлтый круг (снаряд) рядом с игроком
- Градиентный круг (взрыв) где-то на экране
- Текст "Score: 0" и "Time: 00:00" вверху слева

### Что мы сегодня освоили
- ✅ Работа с canvas (круги, текст, градиенты)
- ✅ Система координат canvas
- ✅ Игровой цикл с `requestAnimationFrame`
- ✅ Разделение кода на модули
- ✅ Полноценный цикл работы с Git (ветка → PR → ревью → merge)

### Домашнее задание
1. **Для всех:** Убедиться, что ваш PR влит и локальная версия игры работает
2. **Core Mechanics:** Подумать, как сделать функцию `drawPlayer` более интересной (добавить глаза, улыбку)
3. **AI & Balance:** Добавить 2 новых типа врагов с другими цветами и размерами
4. **Game State & UI:** Добавить отображение здоровья игрока (полоска или текст)
5. **Assets & Graphics:** Добавить анимацию снаряда (пусть он слегка меняет размер или цвет)
6. **Sound & Effects:** Сделать так, чтобы взрыв "пульсировал" (менял размер)
7. **Integration & QA:** Создать Issue на каждое улучшение и распределить задачи на следующее занятие

---

## Важные моменты и частые ошибки

### Ошибка 1: Не импортированы функции
```javascript
// Неправильно
drawPlayer(ctx, 400, 300); // Ошибка: drawPlayer is not defined

// Правильно
import { drawPlayer } from './js/core.js';
```

### Ошибка 2: Забыли type="module" в HTML
В `index.html` подключение должно быть:
```html
<script type="module" src="main.js"></script>
```
Иначе импорты не работают.

### Ошибка 3: Не очистили canvas
Без `ctx.clearRect()` старые кадры будут видны, и получится "след" от движения.

### Ошибка 4: Конфликты при merge
Если при создании PR GitHub говорит о конфликтах, не паникуем:
```bash
git checkout develop
git pull origin develop
git checkout feature/lesson2-...
git merge develop
# Решаем конфликты вручную в файлах
git add .
git commit -m "Resolve merge conflicts"
git push origin feature/lesson2-...
```

---

## Чек-лист на конец занятия
- [ ] Я создал ветку от актуальной `develop`
- [ ] Я написал свою функцию отрисовки
- [ ] Я экспортировал функцию (export)
- [ ] Я проверил, что функция работает локально
- [ ] Я сделал commit и push
- [ ] Я открыл PR и назначил ревьювера
- [ ] Я исправил замечания (если были)
- [ ] Мой PR влит в `develop`
- [ ] Локально после merge всё рисуется правильно

---
