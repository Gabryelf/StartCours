Express-приложение! 

## **Файл `app.js` (главный файл сервера)**

```javascript
import express from "express";
```
**Импорт Express-фреймворка** - подключаем библиотеку для создания веб-сервера. Используем синтаксис ES-модулей (import вместо require).

```javascript
import apiRoutes from "./routes/api.js";
import pageRoutes from "./routes/pages.js";
```
**Импорт маршрутов** - подключаем наши роутеры: `apiRoutes` для обработки API-запросов, `pageRoutes` для отдачи HTML-страниц.

```javascript
const app = express();
const port = 3000;
```
- `app` - создаем экземпляр Express-приложения
- `port` - порт, на котором сервер будет слушать соединения (стандарт для разработки)

```javascript
app.use(express.json());
```
**Middleware для парсинга JSON** - автоматически преобразует входящие JSON-данные из `req.body` в JavaScript-объект. Без этого `req.body` был бы `undefined`.

```javascript
app.use(express.urlencoded({ extended: true }));
```
**Middleware для парсинга URL-encoded данных** - обрабатывает данные из HTML-форм (формат `key=value&key2=value2`). `extended: true` позволяет использовать вложенные объекты.

```javascript
app.use(express.static("public"));
```
**Статическая файловая папка** - все файлы из папки `public` (CSS, JS, изображения) автоматически доступны по корневому URL. Например, `public/script.js` → `http://localhost:3000/script.js`

```javascript
app.use("/api", apiRoutes);
```
**Подключение API-маршрутов** - все запросы, начинающиеся с `/api`, передаются в `apiRoutes`. Пример: `/api/send-message`

```javascript
app.use("/", pageRoutes);
```
**Подключение страничных маршрутов** - запросы к корню `/` обрабатывает `pageRoutes` (отдаст HTML)

```javascript
app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});
```
**Запуск сервера** - начинает прослушивать входящие соединения на порту 3000. Колбэк выполняется после успешного запуска.

---

## **Файл `routes/pages.js` (маршруты для страниц)**

```javascript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
```
- `path` - модуль для работы с путями файлов
- `fileURLToPath` - конвертирует URL в путь файловой системы

```javascript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```
**Имитация `__dirname` в ES-модулях** - в CommonJS были глобальные переменные `__filename` и `__dirname`, в ES-модулях их нет, создаем вручную:
- `__filename` - полный путь к текущему файлу
- `__dirname` - путь к папке текущего файла

```javascript
const router = express.Router();
```
**Создание роутера** - изолированный набор маршрутов, который потом подключим в `app.js`

```javascript
router.get("/", (req, res) => {
```
Обработчик **GET-запроса** к корневому пути `/`. `req` - объект запроса, `res` - объект ответа.

```javascript
    res.sendFile(path.join(__dirname, "../public", "index.html"));
```
**Отправка HTML-файла** - `sendFile` читает и отправляет файл. `path.join` создает правильный путь: из папки `routes` поднимаемся на уровень выше (`../`), заходим в `public` и берем `index.html`

```javascript
export default router;
```
**Экспорт роутера** - чтобы использовать в `app.js`

---

## **Файл `routes/api.js` (API-маршруты)**

```javascript
import express from "express";
const router = express.Router();
```
Аналогично - создаем роутер.

```javascript
router.post("/send-message", (req, res) => {
```
Обработчик **POST-запроса** на `/api/send-message` (полный путь формируется из префикса `/api` в `app.js` + этот путь).

```javascript
    const {message} = req.body;
```
**Деструктуризация тела запроса** - извлекаем поле `message` из JSON, который прислал клиент. Работает благодаря `express.json()` middleware.

```javascript
    const processMessage = {
        length: message.length,
        wordCount: message.trim().split(/\s+/).length
    };
```
**Обработка сообщения**:
- `length` - количество символов (включая пробелы)
- `trim()` - удаляет пробелы в начале и конце
- `split(/\s+/)` - разбивает по одному и более пробелам
- `.length` - количество слов

```javascript
    res.json(processMessage);
```
**Отправка JSON-ответа** - автоматически устанавливает заголовок `Content-Type: application/json` и преобразует объект в JSON-строку.

---

## **Файл `public/script.js` (клиентский JavaScript)**

```javascript
async function sendMessage(){
```
Асинхронная функция, вызываемая по кнопке.

```javascript
    const message = document.getElementById('message').value;
```
Получаем значение из input-поля с id="message".

```javascript
    const response = await fetch("api/send-message", {
        method: "POST",
        headers: {
            "content-type" : "application/json",
        },
        body: JSON.stringify({message: message})
    });
```
**Отправка POST-запроса**:
- `fetch` - современный API для HTTP-запросов
- `await` - ждем ответа от сервера
- URL относительный (`api/send-message` → `http://localhost:3000/api/send-message`)
- `method: "POST"` - тип запроса
- `headers` - говорим серверу, что шлем JSON
- `body` - превращаем объект в JSON-строку

```javascript
    const data = await response.json();
```
Парсим JSON-ответ от сервера в JavaScript-объект.

```javascript
    document.getElementById('length').textContent = data.length;
    document.getElementById('wordCount').textContent = data.wordCount;
```
Обновляем HTML-элементы: вставляем полученную длину и количество слов.

---

## **Файл `public/index.html`**

```html
<div class="input-group">
    <label for="message">Ваше сообщение:</label>
    <input type="text" id="message" placeholder="Например: Привет, мир!" autocomplete="off">
</div>
```
Поле ввода с id="message" (используется в скрипте).

```html
<button onclick="sendMessage()">Отправить на сервер ✨</button>
```
Кнопка, по клику вызывает функцию `sendMessage()`.

```html
<div class="result" id="result">
    <div class="result-item">
        <span class="result-label">Длина текста:</span>
        <span class="result-value" id="length"></span>
    </div>
    ...
</div>
```
Контейнеры для результатов: `#length` и `#wordCount` будут заполнены из скрипта.

```html
<script src="/script.js"></script>
```
Подключаем клиентский скрипт (браузер сам скачает его из папки `public` благодаря `express.static`).

---

## **Поток данных в приложении:**

1. Пользователь открывает `http://localhost:3000` → сервер отдает `index.html`
2. Браузер загружает `script.js`
3. Пользователь вводит текст и нажимает кнопку
4. JavaScript отправляет POST на `/api/send-message`
5. Express принимает запрос → `apiRoutes` → `router.post`
6. Сервер вычисляет длину и слова → отправляет JSON обратно
7. JavaScript обновляет страницу без перезагрузки (AJAX)
