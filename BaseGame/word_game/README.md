# Полное пошаговое руководство по созданию игры "Word Wonders"

## 📋 Обзор проекта
Игра "Word Wonders" - это HTML5 игра на русском языке, где игрок должен составлять слова из букв, расположенных по кругу. Проект состоит из 8 файлов с чистым разделением на логические компоненты.

<details>
<summary><strong>📁 Этап 1: Подготовка структуры проекта</strong></summary>

## Шаг 1.1: Создание папок проекта
Создайте на своем компьютере следующую структуру папок:
```
word-wonders-game/
├── css/
├── js/
└── data/
```

**Объяснение:**
- Папка `css/` будет содержать все стили
- Папка `js/` будет содержать JavaScript код
- Папка `data/` будет содержать словарь слов

## Шаг 1.2: Создание файла index.html
В корневой папке создайте файл `index.html` и откройте его в редакторе кода.

**Зачем это нужно:**
Это главный HTML файл, который является точкой входа в наше приложение. Он связывает все остальные файлы.

## Шаг 1.3: Создание CSS файлов
В папке `css/` создайте два файла:
- `main.css` - основные стили
- `components.css` - стили компонентов

**Разделение на файлы необходимо для:**
1. Упрощения поддержки кода
2. Четкого разделения обязанностей
3. Возможности переиспользования стилей

## Шаг 1.4: Создание JavaScript файлов
В папке `js/` создайте 4 файла:
- `config.js` - конфигурация игры
- `utils.js` - вспомогательные функции
- `game.js` - основная игровая логика
- `ui.js` - управление интерфейсом

**Важность разделения:**
- `config.js` содержит константы и настройки
- `utils.js` содержит утилиты без побочных эффектов
- `game.js` содержит бизнес-логику игры
- `ui.js` отвечает за отображение

## Шаг 1.5: Создание файла со словами
В папке `data/` создайте файл `words.js` - здесь будет наш словарь русских слов.

**Почему слова вынесены отдельно:**
1. Легко добавлять новые слова
2. Не загромождает основной код
3. Можно загружать разные словари

</details>

<details>
<summary><strong>🎮 Этап 2: Создание HTML структуры</strong></summary>

## Шаг 2.1: Базовый HTML каркас
Откройте `index.html` и добавьте базовую структуру:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Word Wonders</title>
</head>
<body>
    <!-- Здесь будет наш код -->
</body>
</html>
```

**Объяснение:**
- `<!DOCTYPE html>` - объявление типа документа
- `<html lang="ru">` - указание языка страницы
- `<meta charset="UTF-8">` - поддержка русских символов
- `<meta name="viewport">` - адаптивность для мобильных устройств

## Шаг 2.2: Подключение CSS файлов
Внутри `<head>` добавьте:

```html
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/components.css">
```

**Порядок важен:** сначала `main.css` (общие стили), потом `components.css` (стили компонентов).

## Шаг 2.3: Создание экранов игры
Внутри `<body>` добавьте три основных экрана:

```html
<div id="mainScreen" class="screen active">
    <!-- Главное меню -->
</div>

<div id="gameScreen" class="screen">
    <!-- Игровой экран -->
</div>

<div id="resultScreen" class="screen">
    <!-- Экран результатов -->
</div>
```

**Принцип работы экранов:**
- Класс `screen` делает все экраны скрытыми по умолчанию
- Класс `active` показывает текущий экран
- JavaScript будет переключать класс `active` между экранами

## Шаг 2.4: Создание главного меню
Внутри `#mainScreen` добавьте:

```html
<div class="logo">
    <h1>WORD WONDERS</h1>
    <p>Собирай слова из букв</p>
</div>

<div class="mode-buttons">
    <button id="infiniteMode" class="mode-btn">
        <div>Бесконечная игра</div>
        <div class="subtitle">Уровни со сложностью</div>
    </button>
    
    <button id="dailyMode" class="mode-btn">
        <div>Слово дня</div>
        <div class="subtitle">Новая тема каждый день</div>
    </button>
</div>
```

**Структура кнопок:**
- Каждая кнопка имеет уникальный `id` для JavaScript
- `.subtitle` - дополнительное описание режима
- `.mode-buttons` - контейнер для вертикального расположения

## Шаг 2.5: Создание игрового экрана
Внутри `#gameScreen` добавьте три основных секции:

### Шаг 2.5.1: Шапка игры
```html
<div class="game-header">
    <button id="backBtn" class="icon-btn">←</button>
    <div class="stats">
        <div class="stat">🎯 <span id="currentLevel">1</span></div>
        <div class="stat">⭐ <span id="score">0</span></div>
        <div class="stat">❤️ <span id="attempts">5</span></div>
    </div>
    <button id="resetBtn" class="icon-btn">↺</button>
</div>
```

**Элементы шапки:**
- Кнопка "назад" для возврата в меню
- Блок статистики с уровнем, очками и попытками
- Кнопка сброса текущего слова

### Шаг 2.5.2: Область слов
```html
<div class="words-area">
    <div id="wordsGrid"></div>
    <div class="word-info" id="wordInfo">Найди все слова</div>
</div>
```

**Назначение:**
- `#wordsGrid` - будет заполняться словами через JavaScript
- `#wordInfo` - отображает прогресс поиска слов

### Шаг 2.5.3: Область ввода
```html
<div class="input-area">
    <div id="currentInput" class="current-input"></div>
    <div class="circle-input" id="circleInput"></div>
</div>
```

**Компоненты ввода:**
- `#currentInput` - показывает текущее составленное слово
- `#circleInput` - круг с буквами для выбора

## Шаг 2.6: Создание экрана результатов
Внутри `#resultScreen` добавьте:

```html
<div id="resultIcon" class="result-icon">🎉</div>
<h2 id="resultTitle">Уровень пройден!</h2>
<p id="resultMessage">Отлично!</p>

<div class="result-stats">
    <div>Найдено слов: <span id="resultFound">0/0</span></div>
    <div>Заработано очков: <span id="resultScore">0</span></div>
    <div>Новый уровень: <span id="resultNextLevel">2</span></div>
</div>

<div class="result-buttons">
    <button id="nextLevelBtn" class="btn btn-primary">Следующий уровень</button>
    <button id="backToMenuBtn" class="btn btn-secondary">В меню</button>
</div>
```

**Элементы экрана результатов:**
- Иконка результата (меняется в зависимости от исхода)
- Статистика уровня
- Кнопки для продолжения или возврата

## Шаг 2.7: Подключение JavaScript файлов
В конце `<body>` добавьте:

```html
<script src="data/words.js"></script>
<script src="js/config.js"></script>
<script src="js/utils.js"></script>
<script src="js/game.js"></script>
<script src="js/ui.js"></script>
```

**Важен порядок подключения:**
1. `words.js` - данные должны загрузиться первыми
2. `config.js` - конфигурация для остальных файлов
3. `utils.js` - утилиты, используемые в других файлах
4. `game.js` - основная логика
5. `ui.js` - интерфейс, который использует логику

</details>

<details>
<summary><strong>🎨 Этап 3: Создание стилей (CSS)</strong></summary>

## Шаг 3.1: Основные стили (main.css)

### Шаг 3.1.1: Сброс и базовые стили
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}
```

**Объяснение:**
- Убираем стандартные отступы у всех элементов
- `box-sizing: border-box` - включает padding и border в ширину элемента
- `-webkit-tap-highlight-color` - убирает синее выделение при тапе на мобильных

### Шаг 3.1.2: Стили body
```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #f8fafc;
    height: 100vh;
    overflow: hidden;
    touch-action: manipulation;
}
```

**Детали:**
- Градиентный фон от темно-синего к синему
- `100vh` - занимает всю высоту окна
- `overflow: hidden` - предотвращает скроллинг
- `touch-action: manipulation` - улучшает touch-события на мобильных

### Шаг 3.1.3: Стили экранов
```css
.screen {
    display: none;
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    flex-direction: column;
}

.screen.active {
    display: flex;
}
```

**Механика переключения экранов:**
- Все экраны скрыты по умолчанию (`display: none`)
- Активный экран показывается как flex-контейнер
- `position: fixed` - экраны занимают все окно браузера

### Шаг 3.1.4: Стили главного экрана
```css
#mainScreen {
    justify-content: center;
    align-items: center;
    padding: 20px;
    gap: 40px;
}
```

**Flexbox выравнивание:**
- `justify-content: center` - вертикальное центрирование
- `align-items: center` - горизонтальное центрирование
- `gap: 40px` - расстояние между логотипом и кнопками

### Шаг 3.1.5: Стили логотипа
```css
.logo h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    background: linear-gradient(45deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

**Градиентный текст:**
- Создает красивый градиент от синего к фиолетовому
- `-webkit-background-clip: text` - обрезает фон по тексту
- `-webkit-text-fill-color: transparent` - делает текст прозрачным

### Шаг 3.1.6: Анимации
```css
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); display: none; }
}
```

**Назначение анимаций:**
- `fadeIn` - для плавного появления элементов
- `fadeOut` - для скрытия всплывающих сообщений

## Шаг 3.2: Стили компонентов (components.css)

### Шаг 3.2.1: Базовые стили кнопок
```css
.btn {
    padding: 12px 20px;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn:active {
    transform: scale(0.98);
}
```

**Эффекты взаимодействия:**
- `transition` - плавные анимации
- `transform: scale(0.98)` - эффект нажатия

### Шаг 3.2.2: Кнопки режимов игры
```css
.mode-btn {
    background: #374151;
    border: none;
    color: white;
    padding: 15px;
    border-radius: 12px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    animation: fadeIn 0.3s backwards;
}

.mode-btn:first-child {
    animation-delay: 0.1s;
}

.mode-btn:last-child {
    animation-delay: 0.2s;
}
```

**Поэтапная анимация:**
- Каждая кнопка появляется с небольшой задержкой
- `backwards` - применяет начальные значения анимации сразу

### Шаг 3.2.3: Шапка игры
```css
.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 10px;
}

.stats {
    display: flex;
    gap: 15px;
}

.stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 1.1rem;
}
```

**Flexbox для выравнивания:**
- Пространство между элементами распределяется равномерно
- `gap` создает отступы между элементами статистики

### Шаг 3.2.4: Сетка слов
```css
.words-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
}

.word-row {
    display: flex;
    gap: 5px;
}

.letter-cell {
    width: 40px;
    height: 40px;
    border: 2px solid #4b5563;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    transition: all 0.3s;
}

.letter-cell.revealed {
    background: linear-gradient(45deg, #059669, #10b981);
    border-color: #059669;
    transform: scale(1.05);
}
```

**Стили для найденных слов:**
- Зеленый градиентный фон
- Увеличение на 5% для визуального акцента
- Плавный переход состояний

### Шаг 3.2.5: Область текущего ввода
```css
.current-input {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-bottom: 25px;
    min-height: 45px;
}

.input-letter {
    width: 45px;
    height: 45px;
    background: linear-gradient(45deg, #374151, #4b5563);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

**Визуальная иерархия:**
- Буквы ввода больше, чем в сетке слов
- Тень создает глубину
- Центрирование по горизонтали

### Шаг 3.2.6: Круг с буквами (самая сложная часть)
```css
.circle-input {
    position: relative;
    width: 220px;
    height: 220px;
    margin: 0 auto;
}

.circle-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}
```

**Центрирование круга:**
- `position: absolute` вырывает элемент из потока
- `top: 50%; left: 50%` - позиционирует в центр родителя
- `transform: translate(-50%, -50%)` - корректирует на половину размеров элемента

### Шаг 3.2.7: Буквы по кругу
```css
.circle-letter {
    position: absolute;
    width: 45px;
    height: 45px;
    background: linear-gradient(45deg, #374151, #4b5563);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s;
}
```

**Примечание:** Позиционирование букв будет рассчитываться в JavaScript на основе тригонометрии.

### Шаг 3.2.8: Экран результатов
```css
.result-stats {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin: 20px 0;
    text-align: left;
}

.result-stats div {
    margin: 8px 0;
    display: flex;
    justify-content: space-between;
}
```

**Стили статистики:**
- Полупрозрачный фон для контраста
- Пространство между строками
- Выравнивание текста и чисел по краям

### Шаг 3.2.9: Всплывающие сообщения
```css
.floating-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: bold;
    z-index: 1000;
    animation: fadeOut 2s forwards;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

**Поведение сообщений:**
- Фиксированное позиционирование по центру экрана
- Высокий `z-index` для отображения поверх всего
- Автоматическое скрытие через 2 секунды

</details>

<details>
<summary><strong>⚙️ Этап 4: Создание JavaScript логики</strong></summary>

## Шаг 4.1: Словарь слов (data/words.js)

```javascript
// Основной словарь слов
const WORD_LIST = {
    // Общие слова
    common: [
        'КОТ', 'ДОМ', 'МАК', 'РОТ', 'ЛЕС', 'СОН', 'НОС', 'РАК', 'КОЗА', 'ЛИСА',
        'МОРЕ', 'РЕКА', 'ПОЛЕ', 'ГОРА', 'РУКА', 'НОГА', 'ГЛАЗ', 'УХО', 'РОТ', 'НОС',
        'ВОДА', 'ОГОНЬ', 'ВЕТЕР', 'СОЛНЦЕ', 'ЛУНА', 'ЗВЕЗДА', 'ПТИЦА', 'РЫБА', 'ЦВЕТОК', 'ДЕРЕВО',
        'СТОЛ', 'СТУЛ', 'ДВЕРЬ', 'ОКНО', 'КНИГА', 'РУЧКА', 'БУМАГА', 'ЧАСЫ', 'ТЕЛЕФОН', 'КОМПЬЮТЕР',
        'МАШИНА', 'ПОЕЗД', 'САМОЛЕТ', 'ВЕЛОСИПЕД', 'ТЕЛЕВИЗОР', 'РАДИО', 'МУЗЫКА', 'ФИЛЬМ', 'ИГРА', 'ШКОЛА'
    ],
    
    // Ежедневные темы
    dailyThemes: [
        {
            name: 'Животные',
            words: ['КОТ', 'СОБАКА', 'ЛЕВ', 'СЛОН', 'ТИГР'],
            letters: ['К', 'О', 'Т', 'С', 'Б', 'А', 'Л', 'Е', 'В', 'Н', 'И', 'Г', 'Р']
        },
        {
            name: 'Города',
            words: ['МОСКВА', 'ПАРИЖ', 'ЛОНДОН', 'ТОКИО', 'БЕРЛИН'],
            letters: ['М', 'О', 'С', 'К', 'В', 'А', 'П', 'Р', 'И', 'Ж', 'Л', 'Н', 'Д', 'Т', 'Б', 'Е']
        },
        {
            name: 'Профессии',
            words: ['ВРАЧ', 'УЧИТЕЛЬ', 'ПОВАР', 'ИНЖЕНЕР', 'ПРОГРАММИСТ'],
            letters: ['В', 'Р', 'А', 'Ч', 'У', 'И', 'Т', 'Е', 'Л', 'Ь', 'П', 'О', 'Н', 'Ж', 'Г', 'М', 'С']
        },
        {
            name: 'Еда',
            words: ['ЯБЛОКО', 'ХЛЕБ', 'СУП', 'САЛАТ', 'ТОРТ'],
            letters: ['Я', 'Б', 'Л', 'О', 'К', 'Х', 'Е', 'С', 'У', 'П', 'А', 'Т', 'Р']
        }
    ],
    
    // Русский алфавит
    alphabet: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
};
```

**Структура данных:**
- `common` - основной словарь для бесконечного режима
- `dailyThemes` - тематические наборы для режима "Слово дня"
- `alphabet` - весь русский алфавит (может пригодиться для расширения)

## Шаг 4.2: Конфигурация (js/config.js)

```javascript
// Конфигурация игры
const CONFIG = {
    // Настройки игры
    INITIAL_LEVEL: 1,
    INITIAL_SCORE: 0,
    INITIAL_ATTEMPTS: 5,
    MAX_LEVEL: 50,
    
    // Настройки генерации уровней
    MIN_WORDS_PER_LEVEL: 3,
    MAX_WORDS_PER_LEVEL: 5,
    MAX_LETTERS_IN_CIRCLE: 8,
    CIRCLE_RADIUS: 75,
    CIRCLE_CENTER_X: 110,
    CIRCLE_CENTER_Y: 110,
    
    // Настройки очков
    POINTS_PER_LETTER: 10,
    BONUS_PER_LEVEL: 100,
    
    // Настройки сложности
    LEVEL_MULTIPLIER: 0.1,
    ATTEMPTS_PER_LEVEL: 1,
    
    // Настройки интерфейса
    LETTER_CELL_SIZE: 40,
    INPUT_LETTER_SIZE: 45,
    CIRCLE_LETTER_SIZE: 45
};
```

**Важность конфигурации:**
- Все настройки в одном месте
- Легко изменять баланс игры
- Константы вместо "магических чисел" в коде

## Шаг 4.3: Вспомогательные функции (js/utils.js)

### Шаг 4.3.1: Перемешивание массива
```javascript
shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
```

**Алгоритм Фишера-Йетса:**
- Создает копию массива (чтобы не мутировать оригинал)
- Проходит массив с конца к началу
- Меняет каждый элемент со случайным элементом перед ним

### Шаг 4.3.2: Подсчет букв в слове
```javascript
countLetters(word) {
    const counts = {};
    for (const letter of word) {
        counts[letter] = (counts[letter] || 0) + 1;
    }
    return counts;
}
```

**Пример работы:**
Для слова "КОТ": `{К: 1, О: 1, Т: 1}`
Для слова "МАМА": `{М: 2, А: 2}`

### Шаг 4.3.3: Проверка возможности составить слово
```javascript
canFormWord(word, availableLetters) {
    const wordCounts = this.countLetters(word);
    const availableCounts = this.countLetters(availableLetters);
    
    for (const letter in wordCounts) {
        if (!availableCounts[letter] || availableCounts[letter] < wordCounts[letter]) {
            return false;
        }
    }
    return true;
}
```

**Логика проверки:**
1. Подсчитываем буквы в слове и доступных буквах
2. Проверяем, что для каждой буквы слова есть достаточно таких же букв в доступных

### Шаг 4.3.4: Функции для ежедневного режима
```javascript
getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

getDailyThemeIndex() {
    const today = new Date();
    return today.getDate() % WORD_LIST.dailyThemes.length;
}
```

**Механика "Слова дня":**
- Каждый день выбирается новая тема
- Темы циклически повторяются
- Используется дата для детерминированного выбора

## Шаг 4.4: Основная игровая логика (js/game.js)

### Шаг 4.4.1: Класс Game и конструктор
```javascript
class Game {
    constructor() {
        this.state = {
            mode: 'infinite',
            level: CONFIG.INITIAL_LEVEL,
            score: CONFIG.INITIAL_SCORE,
            attempts: CONFIG.INITIAL_ATTEMPTS,
            currentInput: [],
            foundWords: [],
            levelData: null,
            dailyCompleted: false,
            dailyDate: null
        };
        
        this.init();
    }
}
```

**Состояние игры содержит:**
- `mode` - текущий режим игры
- `level` - текущий уровень
- `score` - общее количество очков
- `attempts` - оставшиеся попытки
- `currentInput` - текущее составляемое слово
- `foundWords` - уже найденные слова
- `levelData` - данные текущего уровня

### Шаг 4.4.2: Инициализация игры
```javascript
init() {
    this.setupDaily();
    this.setupEventListeners();
    console.log('Игра инициализирована');
}
```

**Последовательность инициализации:**
1. Настройка ежедневного режима
2. Настройка обработчиков событий
3. Логирование успешной инициализации

### Шаг 4.4.3: Настройка обработчиков событий
```javascript
setupEventListeners() {
    // Главный экран
    document.getElementById('infiniteMode').addEventListener('click', 
        () => this.start('infinite'));
    
    // Игровой экран
    document.getElementById('backBtn').addEventListener('click', 
        () => UI.showScreen('mainScreen'));
    
    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (UI.currentScreen === 'gameScreen') {
            if (e.key === 'Enter') this.submitWord();
            if (e.key === 'Backspace') this.removeLastLetter();
            if (/^[а-яА-Яa-zA-Z]$/.test(e.key)) {
                this.addLetter(e.key.toUpperCase());
            }
            UI.updateGameScreen(this.state);
        }
    });
}
```

**Три типа обработчиков:**
1. Клики по кнопкам
2. Клики по буквам в круге
3. Нажатия клавиш клавиатуры

### Шаг 4.4.4: Генерация уровня
```javascript
generateLevel() {
    const levelMultiplier = 1 + (this.state.level - 1) * CONFIG.LEVEL_MULTIPLIER;
    const wordCount = Math.min(
        CONFIG.MIN_WORDS_PER_LEVEL + Math.floor(this.state.level / 2),
        CONFIG.MAX_WORDS_PER_LEVEL
    );
    
    // Выбираем слова
    const selectedWords = [];
    const usedWords = new Set();
    
    for (let i = 0; i < wordCount; i++) {
        let word;
        do {
            word = Utils.randomElement(WORD_LIST.common);
        } while (usedWords.has(word) || word.length < 3);
        
        selectedWords.push(word);
        usedWords.add(word);
    }
    
    // Собираем все буквы
    const allLetters = selectedWords.join('').split('');
    
    // Берем уникальные буквы для круга
    let circleLetters = Utils.unique(allLetters);
    if (circleLetters.length > CONFIG.MAX_LETTERS_IN_CIRCLE) {
        // Выбираем самые частые буквы
        const letterCounts = Utils.countLetters(allLetters);
        circleLetters = Object.keys(letterCounts)
            .sort((a, b) => letterCounts[b] - letterCounts[a])
            .slice(0, CONFIG.MAX_LETTERS_IN_CIRCLE);
    }
    
    // Перемешиваем буквы
    circleLetters = Utils.shuffle(circleLetters);
    
    this.state.levelData = {
        words: selectedWords,
        letters: circleLetters,
        allLetters: allLetters
    };
}
```

**Алгоритм генерации:**
1. Определяем количество слов на основе уровня
2. Выбираем уникальные слова из словаря
3. Собираем все буквы выбранных слов
4. Выбираем самые частые буквы для круга
5. Перемешиваем буквы в круге

### Шаг 4.4.5: Работа с вводом
```javascript
addLetter(letter) {
    if (this.state.currentInput.length < 15) {
        this.state.currentInput.push(letter);
        UI.updateGameScreen(this.state);
    }
}

removeLastLetter() {
    if (this.state.currentInput.length > 0) {
        this.state.currentInput.pop();
        UI.updateGameScreen(this.state);
    }
}

submitWord() {
    const word = this.state.currentInput.join('').toUpperCase();
    
    if (word.length < 2) {
        UI.showMessage('Минимум 2 буквы!', '⚠️');
        return;
    }
    
    if (this.state.levelData.words.includes(word)) {
        if (!this.state.foundWords.includes(word)) {
            // Слово найдено
            this.state.foundWords.push(word);
            const points = word.length * CONFIG.POINTS_PER_LETTER;
            this.state.score += points;
            
            UI.showMessage(`+${points} очков!`, '✨');
            
            // Проверка завершения уровня
            if (this.state.foundWords.length === this.state.levelData.words.length) {
                setTimeout(() => this.levelComplete(), 500);
            }
        } else {
            UI.showMessage('Уже найдено!', 'ℹ️');
        }
    } else {
        // Неправильное слово
        this.state.attempts--;
        UI.showMessage('Нет такого слова', '❌');
        
        if (this.state.attempts <= 0) {
            setTimeout(() => this.levelFailed(), 500);
        }
    }
    
    this.resetInput();
    UI.updateGameScreen(this.state);
}
```

**Логика проверки слова:**
1. Проверка минимальной длины
2. Поиск слова в списке слов уровня
3. Проверка, не найдено ли слово ранее
4. Начисление очков или уменьшение попыток

## Шаг 4.5: Управление интерфейсом (js/ui.js)

### Шаг 4.5.1: Управление экранами
```javascript
showScreen(screenId) {
    this.currentScreen = screenId;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}
```

**Механика переключения:**
1. Запоминаем текущий экран
2. Убираем класс `active` у всех экранов
3. Добавляем класс `active` к нужному экрану

### Шаг 4.5.2: Отрисовка круга с буквами
```javascript
renderCircleInput(state) {
    const container = document.getElementById('circleInput');
    container.innerHTML = '';
    
    // Центральная кнопка
    const center = document.createElement('div');
    center.className = 'circle-center';
    center.textContent = '✓';
    center.title = 'Проверить слово';
    container.appendChild(center);
    
    // Буквы по кругу
    const letters = state.levelData.letters;
    const radius = CONFIG.CIRCLE_RADIUS;
    const centerX = CONFIG.CIRCLE_CENTER_X;
    const centerY = CONFIG.CIRCLE_CENTER_Y;
    
    letters.forEach((letter, index) => {
        const angle = (index / letters.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        const btn = document.createElement('div');
        btn.className = 'circle-letter';
        btn.textContent = letter;
        btn.style.left = `${x - CONFIG.CIRCLE_LETTER_SIZE / 2}px`;
        btn.style.top = `${y - CONFIG.CIRCLE_LETTER_SIZE / 2}px`;
        btn.title = `Добавить букву ${letter}`;
        
        container.appendChild(btn);
    });
}
```

**Тригонометрия для круга:**
- `2 * Math.PI` - полный круг в радианах
- `Math.cos(angle)` и `Math.sin(angle)` - координаты на окружности
- Вычитание половины размера для центрирования букв

### Шаг 4.5.3: Отрисовка сетки слов
```javascript
renderWordsGrid(state) {
    const container = document.getElementById('wordsGrid');
    container.innerHTML = '';
    container.className = 'words-grid';
    
    state.levelData.words.forEach(word => {
        const row = document.createElement('div');
        row.className = 'word-row';
        
        word.split('').forEach((letter, index) => {
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            
            if (state.foundWords.includes(word)) {
                cell.textContent = letter;
                cell.classList.add('revealed');
            }
            
            row.appendChild(cell);
        });
        
        container.appendChild(row);
    });
}
```

**Динамическое создание DOM:**
1. Очищаем контейнер
2. Для каждого слова создаем строку
3. Для каждой буквы создаем ячейку
4. Если слово найдено - показываем буквы и добавляем стиль

### Шаг 4.5.4: Всплывающие сообщения
```javascript
showMessage(text, icon = '') {
    const message = document.createElement('div');
    message.className = 'floating-message';
    message.innerHTML = icon ? `${icon} ${text}` : text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 1500);
}
```

**Временные сообщения:**
1. Создаем элемент с сообщением
2. Добавляем его в body
3. Устанавливаем таймер на удаление
4. Проверяем существование parentNode перед удалением

### Шаг 4.5.5: Создание экземпляра игры
```javascript
// В конце файла game.js
const game = new Game();
```

**Инициализация приложения:**
- Создается единственный экземпляр игры
- Все остальные компоненты работают через этот экземпляр

</details>

## 🎯 Итог

Вы успешно создали игру "Word Wonders" с нуля! Вот что было сделано:

1. **Структура проекта** - организовали файлы по папкам
2. **HTML разметка** - создали три основных экрана игры
3. **CSS стили** - реализовали адаптивный и красивый дизайн
4. **JavaScript логика** - написали всю игровую механику

**Ключевые особенности реализации:**
- Чистое разделение кода на модули
- Адаптивный дизайн для мобильных устройств
- Два режима игры: бесконечный и ежедневный
- Динамическая генерация уровней
- Поддержка клавиатуры и touch-ввода
- Анимации и визуальная обратная связь

**Что можно улучшить в будущем:**
1. Добавить звуковые эффекты
2. Реализовать систему достижений
3. Добавить больше тем для ежедневного режима
4. Реализовать онлайн-таблицу рекордов
5. Добавить подсказки за очки

Игра готова к использованию! Откройте файл `index.html` в браузере и начинайте играть.
