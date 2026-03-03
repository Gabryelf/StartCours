# Занятие 2: Первые рисунки на canvas

## 🎯 Цели занятия
1. Закрепить Git-процесс (обновление develop, создание веток, PR)
2. Понять основы canvas: координаты, фигуры, цвета
3. Нарисовать первые элементы игры
4. Увидеть, как части от разных команд собираются вместе

## 📋 Подготовка до занятия (для ментора)

Перед началом занятия:
- [ ] Смержить все PR с первого занятия в develop
- [ ] Проверить, что в develop всё работает (открывается index.html без ошибок)
- [ ] Создать issue на каждую команду для этого занятия

## 🚀 Ход занятия (90 минут)

### 1. Разбор домашки и обновление репозитория (10 минут)

**Открываем GitHub и смотрим:**
- "Все молодцы, все PR приняты! Теперь наш общий код в develop."
- Показываю, как выглядят закрытые PR и как изменился репозиторий

**Обновляем локальный репозиторий:**
```bash
# Шаг 1. Переключаемся на develop
git checkout develop

# Шаг 2. Тянем все изменения
git pull origin develop

# Шаг 3. Смотрим, что появились новые файлы
ls -la js/          # должны быть core.js, ui.js, ai.js и т.д.

# Шаг 4. Открываем index.html в браузере
# Откройте файл через "Open with Live Server" в VS Code
# Или просто дважды кликните по index.html
```

**Открываем консоль браузера (F12):**
- Должны увидеть все приветствия от команд
- Если какое-то приветствие не появилось — ищем, почему не подключился скрипт

### 2. Теория: Canvas и Git Workflow (15 минут)

#### Canvas (5 минут)
Показываю на экране основы:
```javascript
// Получаем элемент и контекст
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Координаты: (0,0) — левый верхний угол
ctx.fillStyle = 'red';           // цвет заливки
ctx.fillRect(50, 50, 100, 80);   // x, y, ширина, высота

ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.arc(200, 200, 30, 0, Math.PI*2); // x, y, радиус, начало, конец
ctx.fill();

ctx.strokeStyle = 'green';
ctx.lineWidth = 3;
ctx.strokeRect(300, 300, 100, 50);   // только контур

// Текст
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.fillText('Привет, мир!', 400, 100);
```

#### Git Workflow (5 минут)
Повторяем схему, но теперь добавляем важный шаг — обновление своей ветки:

```
1. git checkout develop
2. git pull origin develop           (получили изменения всех)
3. git checkout -b feature/задача    (создали новую ветку ОТ develop)
   ... работаем ...
4. git add .
5. git commit -m "описание"
6. git push --set-upstream origin feature/задача
7. открываем PR на GitHub
```

#### Доска проектов (5 минут)
Показываю, как работать с Projects:
- Открываем вкладку Projects в репозитории
- Видим колонки: To do, In progress, Review, Done
- Каждая задача — это issue
- Перетаскиваем карточки по мере выполнения

**Правила:**
- Взял задачу → переместил в "In progress"
- Открыл PR → переместил в "Review"
- PR принят → переместил в "Done"

### 3. Практика: Рисуем общую картину (50 минут)

#### Получаем задания

Каждая команда заходит в Issues и находит задачу с меткой своей команды. Если issues не созданы — создаю прямо сейчас на глазах у всех.

**Задания в деталях:**

---

#### 🟦 Команда Core Mechanics: Рисуем башни

**Файл:** `js/core.js`

**Задача:** Написать функцию `drawTower(ctx, x, y, side)`

**Код:**
```javascript
// core.js
export function drawTower(ctx, x, y, side) {
    // Цвет зависит от стороны
    ctx.fillStyle = side === 'player' ? '#3a6ea5' : '#a53a3a';
    
    // Рисуем основание башни
    ctx.fillRect(x, y, 50, 80);
    
    // Рисуем крышу
    ctx.fillStyle = side === 'player' ? '#2a4f7a' : '#7a2a2a';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 25, y - 20);
    ctx.lineTo(x + 50, y);
    ctx.fill();
    
    // Рисуем зубец на башне
    ctx.fillStyle = '#888';
    ctx.fillRect(x + 20, y - 5, 10, 5);
}
```

**Проверка:** После написания функции, лид должен добавить её вызов в `main.js`:
```javascript
// main.js (временный код для проверки)
import { drawTower } from './core.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

drawTower(ctx, 100, 200, 'player');
drawTower(ctx, 600, 200, 'enemy');
```

---

#### 🟩 Команда Game State & UI: Полоска эликсира

**Файл:** `js/ui.js`

**Задача:** Написать функцию `drawElixirBar(ctx, x, y, value, max)`

**Код:**
```javascript
// ui.js
export function drawElixirBar(ctx, x, y, value, max) {
    const width = 200;
    const height = 25;
    const fillPercent = value / max;
    const fillWidth = width * fillPercent;
    
    // Фон (пустая полоска)
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, width, height);
    
    // Заполненная часть
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(x, y, fillWidth, height);
    
    // Рамка
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Текст с количеством
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`${value}/${max}`, x + 10, y + 18);
    
    // Подпись
    ctx.font = '12px Arial';
    ctx.fillStyle = '#ddd';
    ctx.fillText('Эликсир', x + width - 70, y - 5);
}
```

**Проверка в main.js:**
```javascript
drawElixirBar(ctx, 300, 50, 5, 10);
```

---

#### 🟪 Команда AI & Balance: Области спавна

**Файл:** `js/ai.js`

**Задача:** Написать функцию `drawSpawnArea(ctx, side)`

**Код:**
```javascript
// ai.js
export function drawSpawnArea(ctx, side) {
    const canvas = ctx.canvas;
    
    if (side === 'player') {
        // Левая половина для игрока
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
        
        // Добавляем текст
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('⚔️ Твоя территория', 50, 100);
    } else {
        // Правая половина для врага
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('👾 Территория врага', canvas.width / 2 + 50, 100);
    }
}
```

**Проверка в main.js:**
```javascript
drawSpawnArea(ctx, 'player');
drawSpawnArea(ctx, 'enemy');
```

---

#### 🟨 Команда Assets & Graphics: Заглушки юнитов

**Файл:** `js/graphics.js` (создать новый файл)

**Задача:** Написать функцию `drawPlaceholderUnit(ctx, x, y, type)`

**Код:**
```javascript
// graphics.js
export function drawPlaceholderUnit(ctx, x, y, type) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    
    // Выбираем цвет в зависимости от типа
    switch(type) {
        case 'knight':
            ctx.fillStyle = '#aaa'; // серый
            break;
        case 'archer':
            ctx.fillStyle = '#6b8e23'; // оливковый
            break;
        case 'mage':
            ctx.fillStyle = '#4682b4'; // стальной синий
            break;
        default:
            ctx.fillStyle = '#fff';
    }
    
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
    
    // Рисуем маленький значок типа
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(type[0].toUpperCase(), x - 5, y + 5);
}
```

**Проверка в main.js:**
```javascript
// Рисуем тестовый отряд
drawPlaceholderUnit(ctx, 200, 300, 'knight');
drawPlaceholderUnit(ctx, 300, 350, 'archer');
drawPlaceholderUnit(ctx, 400, 280, 'mage');
```

---

#### 🟧 Команда Sound & Effects: Эффект взрыва

**Файл:** `js/effects.js` (создать новый файл)

**Задача:** Написать функцию `drawExplosion(ctx, x, y)`

**Код:**
```javascript
// effects.js
export function drawExplosion(ctx, x, y) {
    // Рисуем несколько кругов разного цвета для эффекта взрыва
    
    // Внутренняя часть (яркая)
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0';
    ctx.fill();
    
    // Средняя часть
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#f80';
    ctx.globalAlpha = 0.6;
    ctx.fill();
    
    // Внешняя часть
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fillStyle = '#f00';
    ctx.globalAlpha = 0.3;
    ctx.fill();
    
    // Возвращаем прозрачность
    ctx.globalAlpha = 1.0;
    
    // Искры (несколько точек)
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const sparkX = x + Math.cos(angle) * 30;
        const sparkY = y + Math.sin(angle) * 30;
        
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffa500';
        ctx.fill();
    }
}
```

**Проверка в main.js:**
```javascript
drawExplosion(ctx, 400, 300);
```

---

#### 🟥 Команда Integration & QA: Сборка всего вместе

**Файл:** `js/main.js`

**Задача:** Собрать все функции в правильном порядке, чтобы получилась единая сцена

**Код main.js:**
```javascript
// main.js
import { drawTower } from './core.js';
import { drawElixirBar } from './ui.js';
import { drawSpawnArea } from './ai.js';
import { drawPlaceholderUnit } from './graphics.js';
import { drawExplosion } from './effects.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function drawGame() {
    // 1. Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Рисуем фон (области спавна)
    drawSpawnArea(ctx, 'player');
    drawSpawnArea(ctx, 'enemy');
    
    // 3. Рисуем башни
    drawTower(ctx, 100, 200, 'player');
    drawTower(ctx, 600, 200, 'enemy');
    
    // 4. Рисуем тестовых юнитов
    drawPlaceholderUnit(ctx, 200, 300, 'knight');
    drawPlaceholderUnit(ctx, 300, 350, 'archer');
    drawPlaceholderUnit(ctx, 500, 280, 'mage');
    drawPlaceholderUnit(ctx, 550, 400, 'knight');
    
    // 5. Рисуем эффекты
    drawExplosion(ctx, 400, 300);
    
    // 6. Рисуем интерфейс поверх всего
    drawElixirBar(ctx, 300, 50, 5, 10);
}

// Запускаем отрисовку
drawGame();

// Для отладки: перерисовываем при изменении размера окна
window.addEventListener('resize', drawGame);
```

### 4. Открываем Pull Request (10 минут)

Теперь каждая команда должна открыть PR со своим кодом.

**Порядок действий:**

```bash
# 1. Проверяем, что мы в develop и он обновлён
git checkout develop
git pull origin develop

# 2. Создаём новую ветку для этого занятия
git checkout -b feature/draw-название-команды

# 3. Копируем свой код в соответствующий файл
# (если создавали новый файл, не забываем добавить его)
git add .

# 4. Коммитим
git commit -m "feat: add draw functions for [команда]"

# 5. Пушим
git push --set-upstream origin feature/draw-название-команды

# 6. Идём на GitHub и создаём PR
```

**Шаблон описания PR:**
```markdown
## Что сделано
- Добавлена функция `drawTower` для отрисовки башен
- Функция поддерживает разные цвета для игрока и врага
- Добавлен тестовый вызов в main.js

## Как проверить
1. Открыть index.html
2. Убедиться, что башни отображаются (синяя слева, красная справа)

## Связанные issues
Closes #Номер_вашего_issue

## Чек-лист
- [x] Код соответствует заданию
- [x] Проверил локально
- [ ] Назначил ревьювера
```

### 5. Заключение и домашнее задание (5 минут)

**Что мы сегодня сделали:**
- ✅ Научились обновлять репозиторий через git pull
- ✅ Поняли основы canvas
- ✅ Каждый внёс свою часть в общую картинку
- ✅ Увидели, как работает командная разработка

**Домашнее задание:**

Для **всех команд:**
1. Доделать задание, если не успели
2. Открыть PR и назначить ревьювера
3. Посмотреть PR других команд (можно оставлять комментарии)

Для **команды Integration & QA:**
1. Проверить все PR:
   - Корректно ли подключены скрипты
   - Нет ли ошибок в консоли
   - Не перекрывают ли элементы друг друга
2. Написать комментарии, если есть замечания
3. После исправлений — approve и мерж

Для **лидов команд:**
1. Следить, чтобы все участники вашей команды открыли PR
2. Помогать с Git, если возникают проблемы

**Вопросы для размышления (по желанию):**
- Как сделать так, чтобы башни можно было рисовать в любом месте, а не только с фиксированными координатами?
- Что нужно изменить в коде, чтобы добавить новый тип юнита?
- Как заставить эффект взрыва анимироваться?

---

## 🚨 Важные моменты и частые проблемы на втором занятии

### Проблема: Конфликты в main.js
**Причина:** Несколько команд могут редактировать один файл.
**Решение:**
1. Не паниковать, это нормально!
2. При создании PR GitHub покажет конфликт
3. Разрешаем:
   ```bash
   git pull origin develop
   # VS Code подсветит конфликтные места
   # Оставляем нужные строки от обоих изменений
   git add .
   git commit -m "merge: resolve conflicts"
   git push
   ```

### Проблема: Не видно рисунков на canvas
**Причины и решения:**
- Забыли вызвать функцию в main.js → добавить вызов
- Неправильные координаты (x, y за пределами canvas) → проверить значения
- Цвет совпадает с фоном → изменить цвет
- Контекст не получен → проверить строку `const ctx = canvas.getContext('2d')`

### Проблема: Ошибка "Cannot read property 'fillStyle' of null"
**Решение:** Неправильное имя canvas в HTML. Проверить в index.html:
```html
<canvas id="gameCanvas" width="800" height="600"></canvas>
```
И в JS должно быть точно такое же id.

### Проблема: Не импортируется функция
**Решение:** Проверить три вещи:
1. В файле есть `export function...`
2. В main.js правильный путь (например, `'./core.js'`, а не `'core.js'`)
3. В index.html скрипт подключен с `type="module"`:
   ```html
   <script src="js/main.js" type="module"></script>
   ```

---

## ✅ Чек-лист конца второго занятия

К концу занятия (или к следующему разу) у каждого должно быть:
- [ ] Локальный develop обновлён до последней версии
- [ ] Создана новая ветка для задания
- [ ] Написана и проверена функция отрисовки
- [ ] Сделан коммит и пуш
- [ ] Открыт Pull Request с описанием
- [ ] PR перемещён в колонку "Review" на доске Projects

У команды Integration & QA:
- [ ] Проверены все PR на работоспособность
- [ ] Проверено, что итоговая сцена (main.js) отрисовывается корректно
- [ ] Все конфликты (если были) разрешены
- [ ] После проверки PR смержены в develop

---

## 🎁 Бонус: Полезные ссылки и материалы

**Canvas:**
- [MDN Canvas Tutorial](https://developer.mozilla.org/ru/docs/Web/API/Canvas_API/Tutorial) — полный гайд
- [Canvas Cheat Sheet](https://simon.html5.org/dump/html5-canvas-cheat-sheet.html) — шпаргалка по методам

**Git:**
- [Oh Shit, Git!](https://ohshitgit.com/ru) — что делать, если что-то пошло не так
- [Learn Git Branching](https://learngitbranching.js.org/?locale=ru_RU) — интерактивный учебник

**Наш проект:**
- Ссылка на репозиторий: ...
- Ссылка на доску Projects: ...
- Чат команды: ...

---

