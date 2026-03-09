const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const PROJECT_NAME = "Book_Note";

let entries = [];

const showWelcome = () => {
    console.log("\n");
    console.log("=".repeat(30));
    console.log(PROJECT_NAME);
    console.log("=".repeat(30));
};

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

const showMenu = () => {
    console.log("\n --- Выберите действие для продолжения ---");
    console.log("1. Добавить запись");
    console.log("2. Посмотреть все записи");
    console.log("3. Выход из программы");

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
            default:
                console.log("Что то пошло не так... выходим в меню!");
                showMenu();
                break;
        }
    });

};

showWelcome();
showMenu();
