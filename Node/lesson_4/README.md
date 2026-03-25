
# СЕРВЕРНАЯ ЧАСТЬ (server.js)

## Подключение модулей
```javascript
const http = require('http');
```
- `require` - это функция в Node.js для подключения встроенных модулей
- `http` - встроенный модуль для создания HTTP сервера
- Строка подключает модуль http, чтобы мы могли создать веб-сервер

```javascript
const fs = require('fs').promises;
```
- `fs` (file system) - модуль для работы с файлами
- `.promises` - версия модуля, которая использует async/await (современный стиль)
- Позволит нам читать и записывать файлы на диске

```javascript
const path = require('path');
```
- `path` - модуль для работы с путями к файлам
- Помогает правильно соединять части пути (папки, имена файлов)

```javascript
const fileManager = require('./utils/fileManager');
const helper = require('./utils/helper');
```
- Подключаем наши собственные файлы из папки utils
- `./` означает "текущая папка"
- fileManager будет работать с файлом заметок
- helper содержит вспомогательные функции

## Глобальная переменная
```javascript
let notes = [];
```
- `let` - создаем переменную, которая может меняться
- `notes` - массив для хранения всех заметок в памяти сервера
- Пока пустой, но скоро загрузим из файла

## Загрузка заметок при старте
```javascript
(async () => {
```
- Создаем и сразу вызываем асинхронную функцию
- `async` - функция может использовать `await` (ждать выполнения)
- Нужно, чтобы подождать загрузки из файла

```javascript
    try {
        notes = await fileManager.loadFile();
```
- `try` - пробуем выполнить код
- `await` - ждем, пока загрузится файл
- `fileManager.loadFile()` - функция из fileManager, читает файл с заметками
- Результат сохраняем в переменную notes

```javascript
    } catch {
        notes = [];
```
- `catch` - если произошла ошибка (файла нет или он битый)
- Просто оставляем пустой массив

```javascript
    }
})();
```
- Закрываем try/catch и сразу вызываем функцию

## Создание сервера
```javascript
const server = http.createServer(async (req, res) => {
```
- Создаем HTTP сервер
- `req` (request) - объект запроса (что прислал браузер)
- `res` (response) - объект ответа (что отправит сервер)
- Функция будет вызываться при каждом запросе к серверу

## Получаем URL и метод запроса
```javascript
    const { url, method } = req;
```
- Деструктуризация - достаем свойства из объекта req
- `url` - адрес, который запросил браузер (например, "/" или "/api/notes")
- `method` - HTTP метод (GET, POST, DELETE и т.д.)

## Игнорируем favicon
```javascript
    if (url === '/favicon.ico') {
        res.end();
        return;
    }
```
- Браузер всегда запрашивает иконку для вкладки
- Мы ее не храним, поэтому просто завершаем ответ (`res.end()`)
- `return` - выходим из функции, дальше не идем

## Обработка запросов
```javascript
    try {
```
- Пробуем обработать запрос, если ошибка - поймаем в catch

### Главная страница
```javascript
        if (url === '/' && method === 'GET') {
```
- Если запросили корень сайта (`/`) методом GET
- Это когда просто открывают сайт http://localhost:3000

```javascript
            const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8');
```
- `__dirname` - текущая папка, где лежит server.js
- `path.join` - соединяет части в правильный путь для ОС
- Читаем файл index.html в кодировке UTF-8
- `await` - ждем, пока файл прочитается

```javascript
            res.writeHead(200, { 'Content-Type': 'text/html' });
```
- `writeHead` - пишем заголовки ответа
- `200` - статус "OK" (все хорошо)
- `Content-Type: text/html` - говорим браузеру, что это HTML

```javascript
            res.end(html);
            return;
```
- `end` - отправляем HTML и завершаем ответ
- `return` - выходим

### Файл со скриптом
```javascript
        if (url === '/app.js' && method === 'GET') {
```
- Если запросили файл app.js

```javascript
            const js = await fs.readFile(path.join(__dirname, 'app.js'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(js);
            return;
```
- Читаем, говорим что это JavaScript, отправляем

### API: Получить все заметки
```javascript
        if (url === '/api/notes' && method === 'GET') {
```
- Запрос на /api/notes методом GET

```javascript
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(notes));
            return;
```
- Отправляем массив notes в формате JSON
- `JSON.stringify` - превращает массив в JSON-строку

### API: Добавить заметку
```javascript
        if (url === '/api/notes' && method === 'POST') {
```
- Запрос на /api/notes методом POST (создание новой заметки)

```javascript
            let body = '';
            req.on('data', chunk => body += chunk);
```
- Данные приходят частями (chunk'ами)
- Собираем все части в строку body

```javascript
            req.on('end', async () => {
```
- Когда все данные получены, начинаем обработку

```javascript
                try {
                    const { title, content } = JSON.parse(body);
```
- `JSON.parse` - превращаем JSON-строку обратно в объект
- Достаем поля title и content

```javascript
                    notes.push({
                        id: notes.length + 1,
                        title,
                        content,
                        date: new Date().toLocaleString()
                    });
```
- Добавляем новую заметку в массив
- id = текущая длина + 1 (будет переиндексировано позже)
- title, content - из запроса
- date - текущая дата и время

```javascript
                    notes = helper.reindexId(notes);
                    await fileManager.saveFile(notes);
```
- Переиндексируем id (чтобы шли по порядку 1,2,3...)
- Сохраняем на диск через fileManager

```javascript
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
```
- Отправляем ответ об успехе

### API: Удалить заметку
```javascript
        if (url.startsWith('/api/notes/') && method === 'DELETE') {
            const id = parseInt(url.split('/')[3]);
```
- Проверяем, начинается ли URL с /api/notes/
- Разбиваем URL по / и берем 4-й элемент (индекс 3)
- Превращаем в число

```javascript
            if (id > 0 && id <= notes.length) {
                notes.splice(id - 1, 1);
```
- Проверяем, что такой id существует
- `splice` - удаляем 1 элемент на позиции id-1

```javascript
                notes = helper.reindexId(notes);
                await fileManager.saveFile(notes);
```
- Переиндексируем и сохраняем

```javascript
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
```
- Отправляем успех

### 404 - Не найдено
```javascript
        res.writeHead(404);
        res.end('Not Found');
```
- Если ни одно условие не подошло, отправляем 404

## Обработка ошибок
```javascript
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end('Server Error');
    }
```
- Если в try произошла ошибка, ловим её здесь
- `500` - внутренняя ошибка сервера

## Запуск сервера
```javascript
server.listen(3000, () => {
    console.log('Сервер запущен → http://localhost:3000');
});
```
- Сервер начинает слушать порт 3000
- Когда запустится, выводим сообщение

# КЛИЕНТСКАЯ ЧАСТЬ (app.js)

## Глобальные переменные
```javascript
let notes = [];
```
- Массив для заметок на клиенте
- Будем хранить копию с сервера

```javascript
const statsEl   = document.getElementById('stats');
const contentEl = document.getElementById('content');
```
- Находим элементы на странице по их id
- `statsEl` - для отображения статистики
- `contentEl` - для отображения списка заметок

## Функция загрузки заметок
```javascript
async function loadNotes() {
```
- Объявляем асинхронную функцию

```javascript
    try {
        const res = await fetch('/api/notes');
```
- `fetch` - встроенная функция браузера для HTTP запросов
- Отправляем GET запрос на /api/notes
- `await` - ждем ответа

```javascript
        notes = await res.json();
```
- `res.json()` - извлекаем JSON из ответа
- Сохраняем в переменную notes

```javascript
        statsEl.innerText = `Заметок: ${notes.length}`;
```
- Обновляем текст в элементе stats
- Показываем количество заметок

```javascript
    } catch (err) {
        console.error('Ошибка загрузки заметок', err);
        statsEl.innerText = 'Ошибка загрузки';
    }
```
- Если ошибка, выводим в консоль
- Показываем сообщение об ошибке

## Функция показа заметок
```javascript
async function showNotes() {
    await loadNotes();
```
- Сначала загружаем свежие заметки с сервера

```javascript
    if (notes.length === 0) {
        contentEl.innerHTML = '<p>Пока нет заметок</p>';
        return;
    }
```
- Если заметок нет, показываем сообщение и выходим

```javascript
    let html = '<h3>Заметки:</h3>';
```
- Начинаем собирать HTML строку

```javascript
    notes.forEach(note => {
        html += `
            <div style="border:1px solid #ccc; margin:8px 0; padding:10px; border-radius:4px;">
                <small>[${note.id}] ${note.date}</small><br>
                <strong>${note.title}</strong><br>
                ${note.content}
            </div>
        `;
    });
```
- Для каждой заметки добавляем HTML блок
- Используем шаблонные строки (`` ` ``) для вставки значений
- `+=` добавляем к существующей строке

```javascript
    contentEl.innerHTML = html;
```
- Вставляем собранный HTML в элемент content

## Функция добавления заметки
```javascript
async function addNote() {
    const title   = prompt('Заголовок заметки:');
    const content = prompt('Текст заметки:');
```
- `prompt` - показывает диалоговое окно с полем ввода
- Запрашиваем заголовок и текст

```javascript
    if (!title || !content) return;
```
- Если пользователь ничего не ввел или нажал Отмена, выходим

```javascript
    try {
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
```
- Отправляем POST запрос
- `headers` - говорим, что отправляем JSON
- `body` - сами данные, превращенные в JSON

```javascript
        await showNotes();
```
- После добавления обновляем список заметок

## Функция удаления заметки
```javascript
async function deleteNote() {
    await loadNotes();
```
- Сначала загружаем актуальный список

```javascript
    if (notes.length === 0) {
        alert('Нет заметок для удаления');
        return;
    }
```
- Если заметок нет, показываем сообщение и выходим

```javascript
    const list = notes.map(n => `${n.id}: ${n.title}`).join('\n');
```
- `map` - создаем новый массив из строк вида "id: заголовок"
- `join('\n')` - объединяем массив в строку с переносами строк

```javascript
    const input = prompt(`Введите номер заметки для удаления:\n\n${list}`);
```
- Показываем список и просим ввести номер

```javascript
    if (!input) return;
    const id = parseInt(input);
    if (isNaN(id)) {
        alert('Нужно ввести число');
        return;
    }
```
- Проверяем, что ввели число

```javascript
    try {
        const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await showNotes();
        } else {
            alert('Не удалось удалить заметку');
        }
```
- Отправляем DELETE запрос на /api/notes/число
- `res.ok` - true если статус ответа 200-299
- Если успешно, обновляем список

## Автоматический запуск
```javascript
loadNotes();
```
- Вызываем функцию загрузки сразу при загрузке страницы
- Чтобы сразу показать количество заметок

# Как всё работает вместе:

1. Пользователь открывает http://localhost:3000
2. Сервер отдает index.html
3. Браузер загружает index.html, видит тег `<script src="app.js">` и загружает app.js
4. app.js сразу вызывает `loadNotes()`, загружая заметки с сервера через API
5. Пользователь нажимает кнопки, вызывая функции из app.js
6. Функции общаются с сервером через API
7. Сервер обновляет файл notes.json на диске
8. Страница обновляется, показывая актуальные данные
