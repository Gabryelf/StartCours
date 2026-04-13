// Чистая бизнес-логика, не зависит от Express
let tasks = [
    { id: 1, title: 'Изучить Express', completed: false },
    { id: 2, title: 'Сделать первый модуль', completed: false }
  ];
  
  export const getAllTasks = () => {
    return tasks;
  };
  
  export const createTask = (title) => {
    const newTask = {
      id: tasks.length + 1,
      title,
      completed: false
    };
    tasks.push(newTask);
    return newTask;
  };
  
  export const deleteTask = (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    const deleted = tasks.splice(index, 1)[0];
    return deleted;
  };