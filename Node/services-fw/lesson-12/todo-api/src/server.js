import express from 'express';
import { taskRouter } from './routes/task.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json()); // модуль для чтения JSON из body
app.use('/tasks', taskRouter); // монтируем роутер

app.get('/', (req, res) => {
    res.send('Todo API is running 🚀');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});