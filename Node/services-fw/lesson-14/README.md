**ES modules (import)**:

## **server.js**
```javascript
import Fastify from 'fastify';
import routes from './routes.js';

const fastify = Fastify({ logger: false });

fastify.register(routes);

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Сервер на http://localhost:3000');
});
```

## **routes.js**
```javascript
import api from './api.js';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (fastify) => {
  fastify.get('/', (req, reply) => {
    reply.sendFile('index.html');
  });
  
  fastify.post('/check', async (req, reply) => {
    const result = api.checkPalindrome(req.body.text);
    reply.send({ success: result });
  });
  
  fastify.register(fastifyStatic, {
    root: __dirname,
  });
};
```

## **api.js**
```javascript
export default {
  checkPalindrome: (text) => {
    const clean = text.toLowerCase().replace(/[^a-zа-я0-9]/g, '');
    return clean === clean.split('').reverse().join('');
  }
};
```

## **index.html**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Палиндром</title>
</head>
<body>
    <input type="text" id="text">
    <button onclick="check()">Проверить</button>
    <div id="result"></div>

    <script>
        async function check() {
            const text = document.getElementById('text').value;
            const res = await fetch('/check', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text: text})
            });
            const data = await res.json();
            document.getElementById('result').innerHTML = 
                data.success ? '✅ Успех! Палиндром' : '❌ Не палиндром';
        }
    </script>
</body>
</html>
```

## **package.json**
```json
{
  "type": "module",
  "dependencies": {
    "@fastify/static": "^6.10.0",
    "fastify": "^4.21.0"
  }
}
```

## **Запуск:**
```bash
npm install
node server.js
```
