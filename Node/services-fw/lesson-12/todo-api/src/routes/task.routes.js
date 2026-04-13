import { Router } from 'express';

export const taskRouter = Router();

// Временное хранилище в памяти
let tasks = [];

taskRouter.get('/', (req, res) => {
    res.json(tasks);
});

taskRouter.post('/', (req, res) => {
    const newTask = {
      id: tasks.length + 1,
      title: req.body.title,
      completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

tasks.push({ id: 1, title: 'Тестовая заметка', completed: false });
tasks.push({ id: 2, title: 'Тестовая заметка2', completed: true });