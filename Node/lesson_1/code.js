// приложение для работы с заметками в консоле с помощью node на javascript
// работаем со стрелочными функциями, строкой ввода и массивами 
// версия 003 дата обновления 11.03.2026

// импортируем библиотеку для работы со строкой ввода
const readline = require('readline');
// вызов кастомных вспомогательных функций
const helpers = require('./utils/helpers');
// вызов кастомного декоратора
const Decorator = require('./utils/decorator');
// создаем на основе строки ввода удобный интерфейс - вопрос / ответ в консоли
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// имя проекта - название приложения
const PROJECT_NAME = "Book_Note";
// заметки
let entries = [];

// функция приветствия пользователя
const showWelcome = () => {
    Decorator.welcome(PROJECT_NAME);
};


// функция добавления заметки
const addEntry = () => {
    rl.question('О чем вы хотите написать? Задайте заголовок: ', (title) => {
        rl.question('Запишите ваши мысли: ', (content) => {
            const newEntry = {
                id: entries.length + 1,
                name: title,
                content: content,
                date: helpers.formatDate()
            };
        
            entries.push(newEntry);
            const stats = helpers.getStats(entries);

            console.log('Ваша запись сохранена!');
            console.log(`Всего записей: ${stats.total}`);

            showMenu();
        });
    });
};

// функция показа всех заметок
const showEntries = () => {
    Decorator.showAllEntries(entries);
    showMenu();
};

// функция показа меню для выбора действия
const showMenu = () => {
    Decorator.showMenu(PROJECT_NAME);

    rl.question('Ваш выбор (1-4): ', (choice) => {
        switch(choice){
            case '1':
                addEntry();
                break;
            case '2':
                showEntries();
                break;
            case '3':
                Decorator.goodbye(PROJECT_NAME);
                rl.close();
                break;
            case '4':
                deleteEntry();
                break;
            default:
                console.log("Неверный выбор!");
                showMenu();
                break;
        }
    });
};

// функция удаления заметки (с автоматической перенумерацией)
const deleteEntry = () => {
    if(!helpers.hasEntries(entries)){
        console.log("Нет заметок для удаления!");
        showMenu();
        return;
    }

    console.log("\n--- Ваши заметки ---");
    entries.forEach((entry) => {
        console.log(`[${entry.id}] ${entry.name}`);
    });

    rl.question("\nНомер заметки для удаления (0 - отмена): ", (choice) => {
        const num = parseInt(choice);
        
        if(num === 0){
            console.log("Отмена");
        }
        else if(num > 0 && num <= entries.length){
            entries.splice(num - 1, 1);
            entries = helpers.reindexIds(entries);
            const stats = helpers.getStats(entries);
            console.log(`Теперь заметок: ${stats.total}`);
        }
        else{
            console.log("Неправильный номер!");
        }
        showMenu();
    });
}

showWelcome();
showMenu();