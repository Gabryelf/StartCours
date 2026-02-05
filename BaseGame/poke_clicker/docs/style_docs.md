# Шпаргалка по CSS-стилям для кликера

## Общие сбросы и настройки

### `*` (универсальный селектор)
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}
```
- **Что делает**: Применяет стили ко всем элементам
- **Для чего**:
  - `margin: 0; padding: 0;` - убирает стандартные отступы браузера
  - `box-sizing: border-box;` - включает альтернативную блочную модель (ширина включает padding и border)
  - `font-family: Arial, sans-serif;` - устанавливает шрифт по умолчанию

## Основные контейнеры

### `body`
```css
body {
    background: linear-gradient(135deg, #131314 0%, #262427 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}
```
- **Что делает**: Стилизует тело страницы
- **Для чего**:
  - `linear-gradient()` - создает градиентный фон
  - `min-height: 100vh;` - минимальная высота = высота окна
  - `display: flex;` - включает Flexbox
  - `justify-content: center; align-items: center;` - центрирует по горизонтали и вертикали
  - `padding: 20px;` - внутренние отступы

### `.container`
```css
.container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding: 30px;
    max-width: 700px;
    width: 100%;
}
```
- **Что делает**: Основной контейнер контента
- **Для чего**:
  - `border-radius` - скругляет углы
  - `box-shadow` - добавляет тень для эффекта глубины
  - `max-width` - ограничивает максимальную ширину
  - `width: 100%` - растягивается на всю доступную ширину

## Шапка (Header)

### Заголовок `h1`
```css
h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 2.5rem;
}
```
- **Что делает**: Стилизует основной заголовок
- **Для чего**:
  - `rem` - относительная единица (1rem = размер шрифта root элемента)

### Контейнеры счетчиков
```css
.score-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}
```
- **Что делает**: Располагает элементы счетчиков
- **Для чего**:
  - `flex-wrap: wrap;` - позволяет перенос на новую строку
  - `gap: 20px;` - расстояние между элементами (современная альтернатива margin)

### Элементы счетчиков
```css
.score, .next-level {
    background: #f8f9fa;
    padding: 15px 25px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 250px;
}
```
- **Что делает**: Стили для блоков с информацией
- **Для чего**:
  - `display: flex;` - горизонтальное выравнивание содержимого
  - `align-items: center;` - вертикальное центрирование
  - `gap: 10px;` - расстояние между дочерними элементами

## Основное изображение

### Контейнер изображения
```css
.main-image-container {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 15px;
}
```
- **Что делает**: Создает фон и отступы вокруг изображения

### Само изображение
```css
#main-image {
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border: 5px solid white;
    transition: transform 0.3s ease;
}

#main-image:hover {
    transform: scale(1.02);
}
```
- **Что делает**: Стилизует основное изображение
- **Для чего**:
  - `width: 100%; max-width: 300px;` - адаптивная ширина с ограничением
  - `height: auto;` - сохраняет пропорции
  - `transition` - плавная анимация при наведении
  - `:hover` - эффект при наведении курсора

## Кнопка клика

### Основные стили кнопки
```css
#click-button {
    background: linear-gradient(45deg, #c4a51e, #e2eb70);
    color: white;
    border: none;
    padding: 20px 40px;
    font-size: 1.5rem;
    border-radius: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin: 0 auto 15px;
    transition: all 0.2s ease;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    min-width: 250px;
}
```
- **Что делает**: Создает стилизованную кнопку
- **Для чего**:
  - `cursor: pointer;` - меняет курсор на "руку"
  - `margin: 0 auto;` - центрирование
  - `transition: all 0.2s ease;` - плавные переходы всех свойств

### Состояния кнопки
```css
#click-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
}

#click-button:active {
    transform: translateY(1px);
    box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
}
```
- **Что делает**: Эффекты при взаимодействии
- **Для чего**:
  - `:hover` - стили при наведении
  - `:active` - стили при нажатии
  - `transform: translateY()` - смещение по вертикали

## Прогресс-бар

### Контейнер прогресс-бара
```css
.progress-bar {
    height: 20px;
    background: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
}
```
- **Что делает**: Создает фон для прогресс-бара
- **Для чего**:
  - `overflow: hidden;` - скрывает выходящее за границы содержимое
  - `border-radius` - скругленные края

### Заполняющая часть
```css
.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    width: 0%;
    transition: width 0.5s ease;
    border-radius: 10px;
}
```
- **Что делает**: Индикатор прогресса
- **Для чего**:
  - `width: 0%;` - начальное состояние (будет меняться через JS)
  - `transition` - плавное изменение ширины

## Инструкции (подвал)

### Блок инструкций
```css
.instructions {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
}
```
- **Что делает**: Создает выделенный блок для текста
- **Для чего**: Визуальное отделение вспомогательной информации

## Адаптивность (Media Queries)

### Мобильная адаптация
```css
@media (max-width: 768px) {
    /* Стили для экранов меньше 768px */
}
```
- **Что делает**: Адаптивные стили
- **Для чего**:
  - Уменьшение отступов и размеров
  - Изменение макета
  - Улучшение читаемости на мобильных

## Ключевые CSS-свойства в этом проекте:

### Flexbox свойства:
- `display: flex` - включает flex-контейнер
- `justify-content` - выравнивание по главной оси
- `align-items` - выравнивание по поперечной оси
- `flex-wrap` - перенос элементов
- `gap` - расстояние между элементами

### Фоновые эффекты:
- `background: linear-gradient()` - градиентный фон
- `box-shadow` - тени для глубины
- `border-radius` - скругление углов

### Анимации:
- `transition` - плавные переходы
- `transform` - трансформации (scale, translate)
- `:hover`, `:active` - псевдоклассы состояний

### Единицы измерения:
- `rem` - относительно root шрифта
- `px` - фиксированные пиксели
- `%` - проценты от родителя
- `vh` - проценты от высоты viewport
