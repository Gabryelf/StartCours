import { Router } from 'express';
import * as taskService from '../services/task.service.js';

export const taskRouter = Router();

taskRouter.get('/', (req, res) => {
  const tasks = taskService.getAllTasks();
  res.json(tasks);
});

taskRouter.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = taskService.createTask(title);
  res.status(201).json(newTask);
});

taskRouter.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = taskService.deleteTask(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(deleted);
});