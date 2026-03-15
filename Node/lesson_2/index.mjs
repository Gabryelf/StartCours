// приложение для работы с заметками в консоле с помощью node на javascript
// работаем со стрелочными функциями, строкой ввода и массивами 
// версия 005 дата обновления 15.03.2026

import readline from 'readline';
import * as helpers from './utils/helper.mjs';
import Decorator from './utils/decorator.mjs';
import { saveNotes, loadNotes } from './utils/fileManager.mjs';

// создаем на основе строки ввода удобный интерфейс - вопрос / ответ в консоли
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// имя проекта - название приложения
const PROJECT_NAME = "Book_Note";
// заметки
let entries = [];

// Функция для асинхронного вопроса
const question = (query) => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

// функция инициализации приложения
const initApp = async () => {
    try {
        entries = await loadNotes();
        showWelcome();
        await showMenu();
    } catch (error) {
        console.error('Ошибка при загрузке заметок:', error);
        entries = [];
        showWelcome();
        await showMenu();
    }
};

// функция приветствия пользователя
const showWelcome = () => {
    Decorator.welcome(PROJECT_NAME);
};

// функция добавления заметки
const addEntry = async () => {
    try {
        const title = await question('О чем вы хотите написать? Задайте заголовок: ');
        const content = await question('Запишите ваши мысли: ');
        
        const newEntry = {
            id: entries.length + 1,
            name: title,
            content: content,
            date: helpers.formatDate()
        };
    
        entries.push(newEntry);
        await saveNotes(entries);
        const stats = helpers.getStats(entries);

        console.log('Ваша запись сохранена!');
        console.log(`Всего записей: ${stats.total}`);

        await showMenu();
    } catch (error) {
        console.error('Ошибка при добавлении заметки:', error);
        await showMenu();
    }
};

// функция показа всех заметок
const showEntries = async () => {
    Decorator.showAllEntries(entries, PROJECT_NAME);
    await showMenu();
};

// функция поиска заметок
const searchEntries = async () => {
    if (!helpers.hasEntries(entries)) {
        console.log("\nНет заметок для поиска!");
        await showMenu();
        return;
    }

    console.log("\n🔍 Поиск заметок");
    Decorator.drawLine();
    console.log("1. Поиск по ID");
    console.log("2. Поиск по названию");
    console.log("3. Поиск по содержимому");
    console.log("4. Вернуться в меню");
    Decorator.drawLine();

    const choice = await question('Выберите тип поиска (1-4): ');
    
    switch(choice) {
        case '1':
            await searchById();
            break;
        case '2':
            await searchByTitle();
            break;
        case '3':
            await searchByContent();
            break;
        case '4':
            await showMenu();
            break;
        default:
            console.log("❌ Неверный выбор!");
            await searchEntries();
            break;
    }
};

// поиск по ID
const searchById = async () => {
    const idStr = await question('Введите ID заметки: ');
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
        console.log("❌ Пожалуйста, введите число!");
        await searchEntries();
        return;
    }
    
    const entry = entries.find(e => e.id === id);
    
    if (entry) {
        console.log("\n✅ Найдена заметка:");
        Decorator.showEntry(entry);
    } else {
        console.log(`❌ Заметка с ID ${id} не найдена!`);
    }
    
    await askForNewSearch();
};

// поиск по названию
const searchByTitle = async () => {
    const searchTerm = await question('Введите текст для поиска в названиях: ');
    const results = entries.filter(entry => 
        entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displaySearchResults(results, searchTerm);
    await askForNewSearch();
};

// поиск по содержимому
const searchByContent = async () => {
    const searchTerm = await question('Введите текст для поиска в содержимом: ');
    const results = entries.filter(entry => 
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displaySearchResults(results, searchTerm);
    await askForNewSearch();
};

// отображение результатов поиска
const displaySearchResults = (results, searchTerm) => {
    if (results.length > 0) {
        console.log(`\n✅ Найдено заметок: ${results.length}`);
        results.forEach(entry => Decorator.showEntry(entry));
    } else {
        console.log(`❌ Заметок с "${searchTerm}" не найдено!`);
    }
};

// вопрос о новом поиске
const askForNewSearch = async () => {
    const answer = await question('\n🔍 Выполнить новый поиск? (да/нет): ');
    if (answer.toLowerCase() === 'да' || answer.toLowerCase() === 'д' || answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        await searchEntries();
    } else {
        await showMenu();
    }
};

// функция показа меню для выбора действия
const showMenu = async () => {
    Decorator.showMenu(PROJECT_NAME);

    const choice = await question('Ваш выбор (1-5): ');
    
    switch(choice){
        case '1':
            await addEntry();
            break;
        case '2':
            await showEntries();
            break;
        case '3':
            await searchEntries();
            break;
        case '4':
            Decorator.goodbye(PROJECT_NAME);
            rl.close();
            break;
        case '5':
            await deleteEntry();
            break;
        default:
            console.log("❌ Неверный выбор!");
            await showMenu();
            break;
    }
};

// функция удаления заметки (с автоматической перенумерацией)
const deleteEntry = async () => {
    if(!helpers.hasEntries(entries)){
        console.log("📭 Нет заметок для удаления!");
        await showMenu();
        return;
    }

    console.log("\n📋 --- Ваши заметки ---");
    entries.forEach((entry) => {
        console.log(`[${entry.id}] ${entry.name}`);
    });

    const choice = await question("\n🗑️  Номер заметки для удаления (0 - отмена): ");
    const num = parseInt(choice);
    
    if(num === 0){
        console.log("❌ Отмена");
    }
    else if(num > 0 && num <= entries.length){
        entries.splice(num - 1, 1);
        entries = helpers.reindexIds(entries);
        await saveNotes(entries);
        const stats = helpers.getStats(entries);
        console.log(`✓ Заметка удалена. Теперь заметок: ${stats.total}`);
    }
    else{
        console.log("❌ Неправильный номер!");
    }
    await showMenu();
};

// Обработка закрытия приложения
process.on('SIGINT', () => {
    Decorator.goodbye(PROJECT_NAME);
    rl.close();
    process.exit(0);
});

// Запускаем приложение
initApp();