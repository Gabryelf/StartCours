# Переход с CommonJS на ES Modules (mjs) - Пошаговое руководство

## Что такое ES Modules и зачем переходить?

**ES Modules (ESM)** - это официальный стандарт модулей в JavaScript, в отличие от CommonJS (require/module.exports), который был создан для Node.js. 

### Преимущества ES Modules:
- **Асинхронная загрузка** - модули загружаются асинхронно
- **Статическая структура** - позволяет делать tree-shaking (удаление неиспользуемого кода)
- **Современный синтаксис** - `import/export` вместо `require/module.exports`
- **Поддержка в браузерах** - один код может работать и на сервере, и в браузере
- **Будущее стандарта** - все новые возможности JS ориентированы на ESM

---

## Шаг 1: Подготовка проекта

### 1.1 Создайте файл package.json (если его нет)

```bash
npm init -y
```

### 1.2 Добавьте поле "type": "module" в package.json

```json
{
  "name": "notes-app",
  "version": "1.0.0",
  "type": "module",  // ← ЭТО КЛЮЧЕВОЙ МОМЕНТ!
  "description": "Notes manager application",
  "main": "index.mjs",
  "scripts": {
    "start": "node index.mjs"
  },
  "dependencies": {}
}
```

**Объяснение:** `"type": "module"` говорит Node.js, что все `.js` файлы в проекте следует интерпретировать как ES Modules. Мы же будем использовать расширение `.mjs` для явного указания.

---

## Шаг 2: Переименование файлов

### 2.1 Измените расширения файлов:

```bash
# Переименовываем основные файлы
mv index.js index.mjs
mv utils/helper.js utils/helper.mjs
mv utils/fileManager.js utils/fileManager.mjs
```

**Объяснение:** Расширение `.mjs` явно указывает, что файл использует ES Modules. Это помогает редакторам кода и инструментам правильно обрабатывать файлы.

### 2.2 Обновите index.html для работы с ESM

В `index.html` измените подключение скрипта:

```html
<!-- Было: -->
<script src="app.js"></script>

<!-- Стало: -->
<script type="module" src="app.js"></script>
```

**Объяснение:** Атрибут `type="module"` позволяет браузеру загружать скрипт как ES Module, поддерживая import/export.

---

## Шаг 3: Преобразование index.mjs

### 3.1 Замените require на import

**Было (CommonJS):**
```javascript
const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const helper = require("./utils/helper");
const fileManager = require("./utils/fileManager");
```

**Стало (ES Modules):**
```javascript
import http from "http";
import { promises as fs } from "fs";
import path from "path";

import * as helper from "./utils/helper.mjs";
import * as fileManager from "./utils/fileManager.mjs";
```

**Объяснение:**
- `import ... from` - основной синтаксис импорта
- Для `fs` мы используем деструктуризацию: `{ promises as fs }`
- Обязательно указываем расширение `.mjs` при импорте локальных файлов

### 3.2 Полный код index.mjs:

```javascript
import http from "http";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import * as helper from "./utils/helper.mjs";
import * as fileManager from "./utils/fileManager.mjs";

// Получаем __dirname в ESM (в CommonJS он был доступен автоматически)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let notes = fileManager.loadFile();

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  // ROOT ROUTERS
  if (url === "/" && method === "GET") {
    const html = await fs.readFile(path.join(__dirname, "index.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (url === "/app.js" && method === "GET") {
    const js = await fs.readFile(path.join(__dirname, "app.js"), "utf-8");
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(js);
    return;
  }

  // API ROUTERS
  if (url === "/api/notes" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }

  if (url === "/api/notes" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      console.log("create start");
      const { title, content } = JSON.parse(body);
      const newNote = {
        id: notes.length + 1,
        title: title,
        content: content,
        date: new Date().toLocaleString(),
      };
      console.log("create end");
      notes.push(newNote);
      fileManager.saveFile(notes);
      console.log(`Заметка ${newNote.title} сохранена!`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  if (url.startsWith("/api/notes/") && method === "DELETE") {
    const id = parseInt(url.split("/")[3]);
    notes.splice(id - 1, 1);
    notes = helper.reindexId(notes);
    fileManager.saveFile(notes);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  if (url.startsWith("/api/notes/") && method === "PUT") {
    let body = "";
    const id = parseInt(url.split("/")[3]);
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      console.log("edit start");
      const { title, content } = JSON.parse(body);

      notes[id - 1] = {
        ...notes[id - 1],
        title: title,
        content: content,
        date: new Date().toLocaleString(),
      };
      fileManager.saveFile(notes);
      console.log("edit end");
      console.log(`Заметка ${title} изменена!`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    });
  }
  return;
});

server.listen(3000, () => {
  console.log("Сервер запущен на порту http://localhost:3000");
});
```

**Важное дополнение:** В ESM нет глобальных переменных `__dirname` и `__filename`. Их нужно создавать вручную с помощью `fileURLToPath` и `import.meta.url`.

---

## Шаг 4: Преобразование helper.mjs

### 4.1 Замените module.exports на export

**Было (CommonJS):**
```javascript
const reindexId = (notes) => {
  return notes.map((notes, index) => ({...notes, id:index + 1}));
};

const statsNotes = (notes) => {
  console.log(`Всего заметок ${notes.length}`);
};

module.exports = {reindexId, statsNotes};
```

**Стало (ES Modules):**
```javascript
export const reindexId = (notes) => {
  return notes.map((notes, index) => ({...notes, id:index + 1}));
};

export const statsNotes = (notes) => {
  console.log(`Всего заметок ${notes.length}`);
};
```

**Объяснение:** 
- `export const` - именованный экспорт
- Можно также использовать `export { reindexId, statsNotes }` в конце файла

---

## Шаг 5: Преобразование fileManager.mjs

### 5.1 Создайте fileManager.mjs

Предполагая, что `fileManager.js` выглядит примерно так:

```javascript
// fileManager.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NOTES_FILE = path.join(__dirname, "notes.json");

export const loadFile = () => {
  try {
    const data = fs.readFileSync(NOTES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const saveFile = (notes) => {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), "utf-8");
};
```

**Объяснение:** 
- Используем `export` для каждой функции
- Также нужно получить `__dirname` для корректных путей

---

## Шаг 6: Преобразование Decorator.mjs

### 6.1 Преобразуйте класс Decorator

**Было (CommonJS):**
```javascript
class Decorator {
  // ... методы
}
module.exports = Decorator;
```

**Стало (ES Modules):**
```javascript
export default class Decorator {
  // ... методы
}
```

**Объяснение:** 
- `export default` используется для экспорта одного основного значения из модуля
- При импорте можно использовать любое имя: `import MyDecorator from "./Decorator.mjs"`

---

## Шаг 7: Обновление клиентского кода (app.js)

### 7.1 Изменения в app.js

Клиентский код уже работает с `fetch` API, но добавим `async/await` для улучшения читаемости:

```javascript
// app.js
const stats = document.getElementById("stats");
const notes_conteiner = document.getElementById("content");

let notes = [];

async function loadNotes() {
  try {
    const res = await fetch("/api/notes");
    notes = await res.json();
    if (notes.length === 0) {
      stats.innerText = "У вас нет заметок. Создайте свою первую заметку! \n\n";
    } else {
      stats.innerText = `Заметок ${notes.length}`;
    }
  } catch (error) {
    console.log("Ошибка", error);
    stats.innerText = `Информации о заметках нет`;
  }
}

async function addNote() {
  const title = prompt("Введите название ");
  const content = prompt("Введите содержание ");
  if (!title || !content) {
    alert("Заметка не может содержать пустое название или содержание!");
    return;
  }
  try {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    await showNotes();
  } catch (error) {
    console.log("ERROR", error.message);
  }
}

async function showNotes() {
  await loadNotes();
  if (notes.length === 0) {
    notes_conteiner.innerHTML = "<h2>Пока у вас нет заметок!</h2>";
    return;
  }
  
  let html = "<h2>--- Заметки ---</h2>";
  notes.forEach((note) => {
    html += `
      <div style="background-color: #030202; color: #008f4a;" class="note_conteiner">
        <small>[${note.id}] ${note.date}</small>
        <strong>${note.title}</strong>
        <strong>${note.content}</strong>
      </div>
    `;
  });
  notes_conteiner.innerHTML = html;
}

async function deleteNote() {
  await loadNotes();
  if (notes.length === 0) {
    alert("Пока нечего удалить! Заметок нет!");
    return;
  }
  
  const list = notes.map((note) => `[${note.id}] ${note.title}`).join("\n");
  const input = prompt(`Введите номер заметки для удаления:\n\n${list}`);
  
  const id_input = parseInt(input);
  if (!id_input) return;
  
  if (id_input > 0 && id_input <= notes.length) {
    const res = await fetch(`/api/notes/${id_input}`, { method: "DELETE" });
    if (res.ok) {
      await showNotes();
    }
  } else {
    alert("Отмена удаления! Необходимо указать номер существующей заметки!");
  }
}

async function editNote() {
  await loadNotes();
  if (notes.length === 0) {
    alert("Пока нечего редактировать! Создайте заметку!");
    return;
  }
  
  const list = notes.map((note) => `[${note.id}] ${note.title}`).join("\n");
  const input = prompt(`Введите номер заметки для изменения:\n\n${list}`);
  
  const id_input = parseInt(input);
  if (!id_input) return;
  
  if (id_input < 1 || id_input > notes.length) {
    alert("Такой заметки не существует!");
    return;
  }
  
  const note = notes.find((note) => note.id === id_input);
  const title = prompt("Введите название", note.title);
  const content = prompt("Введите содержание", note.content);
  
  if (!title || !content) {
    alert("Заметка не может содержать пустое название или содержание!");
    return;
  }
  
  try {
    await fetch(`/api/notes/${id_input}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    await showNotes();
  } catch (error) {
    console.log("ERROR", error.message);
  }
}

// Инициализация
loadNotes();

// Экспортируем функции в глобальную область для HTML-обработчиков
window.showNotes = showNotes;
window.addNote = addNote;
window.deleteNote = deleteNote;
window.editNote = editNote;
```

---

## Шаг 8: Исправление HTML-файла

### 8.1 Обновите index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Менеджер заметок</title>
    <style>
        * {
            margin: 10px;
            background-color: #000000;
            color: #ffdd00;
        }
        #stats {
            color: rgb(0, 157, 255);
        }
        body {
            background-color: #000000;
        }
        .btn {
            margin: 5px;
        }
    </style>
</head>
<body>
    <div id="stats" class="alert alert-dark" role="alert"></div>
    <div>
        <button onclick='showNotes()' type="button" class="btn btn-info">Показать заметки</button>
        <button onclick='addNote()' type="button" class="btn btn-success">Добавить заметку</button>
        <button onclick='editNote()' type="button" class="btn btn-warning">Редактировать заметку</button>
        <button onclick='deleteNote()' type="button" class="btn btn-danger">Удалить заметку</button>
    </div>
    <div id="content" class="alert alert-dark" role="alert"></div>

    <script type="module" src="app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

**Исправления:**
1. Исправлена кнопка "Удалить заметку" (было две кнопки с разными стилями)
2. Добавлен `type="module"` к скрипту
3. Исправлены стили

---

## Шаг 9: Проверка и запуск

### 9.1 Проверьте структуру проекта:

```
project/
├── index.mjs
├── app.js
├── index.html
├── package.json
├── utils/
│   ├── helper.mjs
│   ├── fileManager.mjs
│   └── Decorator.mjs
└── notes.json (создастся автоматически)
```

### 9.2 Запустите приложение:

```bash
node index.mjs
# или
npm start
```

### 9.3 Откройте браузер:
```
http://localhost:3000
```

---

## Шаг 10: Возможные проблемы и их решение

### Проблема 1: Ошибка "Cannot use import statement outside a module"

**Решение:** Убедитесь, что в package.json есть `"type": "module"` или используйте расширение `.mjs`.

### Проблема 2: Ошибка "ERR_MODULE_NOT_FOUND"

**Решение:** При импорте локальных файлов всегда указывайте расширение `.mjs`:

```javascript
// Правильно
import * as helper from "./utils/helper.mjs";

// Неправильно
import * as helper from "./utils/helper";
```

### Проблема 3: __dirname is not defined

**Решение:** Добавьте код для получения __dirname:

```javascript
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

---

## Заключение

### Что мы сделали:

1. ✅ Обновили package.json с `"type": "module"`
2. ✅ Переименовали файлы в `.mjs`
3. ✅ Заменили `require` на `import`
4. ✅ Заменили `module.exports` на `export`
5. ✅ Добавили `__dirname` для ESM
6. ✅ Обновили HTML с `type="module"`
7. ✅ Улучшили клиентский код

### Преимущества после перехода:

- **Современный код** - соответствует стандартам JavaScript
- **Единый синтаксис** - серверный и клиентский код используют import/export
- **Готовность к будущему** - поддержка новых возможностей языка
- **Лучшая совместимость** с современными инструментами (Vite, Webpack и др.)

### Дополнительные упражнения:

1. Попробуйте использовать динамический импорт: `import()` для ленивой загрузки
2. Реализуйте импорт JSON файлов напрямую (Node.js поддерживает это в ESM)
3. Добавьте обработку ошибок с помощью try/catch
4. Создайте конфигурационный файл с переменными окружения
