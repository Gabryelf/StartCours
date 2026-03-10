// приложение для работы с заметками в консоле с помощью node на javascript
// работаем со стрелочными функциями, строкой ввода и массивами 
// версия 002 дата обновления 10.03.2026

// импортируем библиотеку для работы со строкой ввода
const readline = require('readline');
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
    console.log("\n");
    console.log("=".repeat(30));
    console.log(PROJECT_NAME);
    console.log("=".repeat(30));
};
// функция добавления заметки
const addEntry = () => {
    rl.question('О чем вы хотите написать? Задайте заголовок', (title) => {
        rl.question('Запишите ваши мысли!', (content) => {
            const newEntry = {
                id: entries.length + 1,
                name: title,
                content: content,
                date: new Date().toLocaleString()
            };
        

        entries.push(newEntry);

        console.log('Ваша запись сохранена!');
        console.log(`Всего записей  ${entries.length}`);

        showMenu();
        });
    });
};
// функция показа всех заметок
const showEntries = () => {
    console.log('\n--- Все записи ---');

    if(entries.length === 0){
        console.log(`Пока в ${PROJECT_NAME} пусто!`);
    }else{
        entries.forEach((entry) => {
            console.log(`\n[${entry.id}] ${entry.name}`);
            console.log(`  ${entry.date}`);
            console.log(`  ${entry.content}`);
            console.log('-'.repeat(30));
        });
    }

    showMenu();
};
// функция показа меню для выбора действия
const showMenu = () => {
    console.log("\n --- Выберите действие для продолжения ---");
    console.log("1. Добавить запись");
    console.log("2. Посмотреть все записи");
    console.log("3. Выход из программы");
    console.log("4. Удаление по выбору");

    rl.question('Пункт выбора 1 - 3', (choice) => {
        switch(choice){
            case '1':
                addEntry();
                break;
            case '2':
                showEntries();
                break;
            case '3':
                console.log("Завершаем программу! До свидания!");
                rl.close();
                break;
            case '4':
                deleteEntry();
                break;
            default:
                console.log("Что то пошло не так... выходим в меню!");
                showMenu();
                break;
        }
    });

};
// функция удаления заметки
const deleteEntry = () => {
    if(entries.length === 0){
        console.log("У вас нет подходящих заметок!");
        showMenu();
        return;
    }

    console.log("___ Все ваши заметки ___")
    console.log(`Всего заметок ${entries.length}`)
    entries.forEach((entry) => {
        console.log(`[${entry.id}] * ${entry.name} * ${entry.date}`)
    });

    rl.question("Выберите номер заметки для удаления или 0 для отмены", (choice) => {

        const num = parseInt(choice);
        if(num === 0){
            console.log("Отмена удаления!");
        }
        else if(num <= entries.length && num > 0){
            entries.splice(num - 1, 1);
            console.log(`Заметка ${num} удалена`);
        }
        else{
            console.log("Не правильный номер заметки!");
        }
        showMenu();
    });

}

showWelcome();
showMenu();
