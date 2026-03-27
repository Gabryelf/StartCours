//=============================
// Осеовной скрипт приложения
//=============================

// импорты
const readline = require("readline"); // импортируем модуль из node
const helper = require("./utils/helper"); // импортируем свои модули 
const Decorator = require("./utils/decorator");
const fileManager = require("./utils/fileManager");

// инициализация ввода вывода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// переменные
const NAME_PROJ = '"NOTE"-"BOOK"';
let notes = [];
let welcome = `Тебя приветствует приложение ${NAME_PROJ}`;

// Промис-обертка для question
const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

//=============================
// Функции
//=============================

//приветствие
const welcomeApp = async () => {
  try {
    // Загружаем заметки при старте
    notes = await fileManager.loadFile();
    Decorator.presentWelcome(welcome);
    await showMenu();
  } catch (error) {
    // Если файла нет, начинаем с пустым массивом
    notes = [];
    Decorator.presentWelcome(welcome);
    await showMenu();
  }
};

//добавление заметки
const addNote = async () => {
  try {
    const title = await question("Введите заголовок  ");
    const content = await question("Напишите текст заметки  ");
    
    const newNote = {
      id: notes.length + 1,
      title: title,
      content: content,
      date: new Date().toLocaleString()
    };
    
    notes.push(newNote);
    await fileManager.saveFile(notes);
    console.log(`Заметка ${newNote.title} сохранена!`);

    await showMenu();
  } catch (error) {
    console.log("Ошибка при добавлении заметки:", error.message);
    await showMenu();
  }
}; 

//просмотр всех заметок
const showNotes = async () => {
  Decorator.showFormatAllNotes(notes);
  await showMenu();
};

//меню программы
const showMenu = async () => {
  helper.statsNotes(notes);
  Decorator.presentMenu();

  try {
    const choice = await question("Выберите пункт от 1 до 4  ");
    
    switch(choice){
      case '1':
        await addNote();
        break;
      case '2':
        await showNotes();
        break;
      case '3':
        await deleteNote();
        break;
      case '4':
        console.log("Завершение работы!");
        rl.close();
        break;
      default:
        console.log("Нет такого пункта!");
        await showMenu();
    }
  } catch (error) {
    console.log("Ошибка в меню:", error.message);
    rl.close();
  }
};

//удаление заметки
const deleteNote = async () => {
  try {
    if(notes.length === 0){
      console.log("У вас пока нет заметок!");
      await showMenu();
      return;
    }
    
    notes.forEach((note) => {
      console.log(`\n * [${note.id}] * ${note.title} *`);
    });
    
    const choice = await question("Введите номер заметки для удаления или 0 для отмены  ");
    let num = parseInt(choice);
    
    if(num === 0){
      await showMenu();
    }
    else if(num > 0 && num <= notes.length){
      notes.splice(num - 1, 1);
      notes = helper.reindexId(notes);
      await fileManager.saveFile(notes);
      console.log(`Заметка удалена!`);
      await showMenu();
    }
    else{
      console.log("Нет подходящей заметки!");
      await showMenu();
    }
  } catch (error) {
    console.log("Ошибка при удалении:", error.message);
    await showMenu();
  }
};

//запуск программы
welcomeApp();