class ConsoleDecorator {
    // Рисует разделитель
    static drawLine() {
        console.log('='.repeat(50));
    }

    // Показ заметки
    static showEntry(entry) {
        console.log(`\n┌─ Заметка #${entry.id}`);
        console.log(`│ * ${entry.name}`);
        console.log(`│ * ${entry.date}`);
        console.log(`│ * ${entry.content}`);
        console.log(`└${'─'.repeat(48)}`);
    }
    // Показ всех заметок
    static showAllEntries(entries, projectName) {

        if (entries.length === 0) {
            this.warning(`В книге заметок пока пусто!`);
            return;
        }

        console.log(`* ${projectName} *`);
        entries.forEach(entry => this.showEntry(entry));
        this.drawLine();
        console.log(`Всего заметок: ${entries.length}`);
    }

    // Меню
    static showMenu(projectName) {
        console.log('\n');
        console.log(` МЕНЮ ${projectName} `);
        this.drawLine();
        console.log(`1. Добавить запись`);
        console.log(`2. Посмотреть все записи`);
        console.log(`3. Выход из программы`);
        console.log(`4. Удалить заметку`);
        this.drawLine();
    }

    // Приветствие
    static welcome(projectName) {
        console.log('\n');
        console.log(` ДОБРО ПОЖАЛОВАТЬ В ${projectName} `);
        console.log(`* Ваш личный дневник заметок *`);
        this.drawLine();
    }

    // Прощание
    static goodbye(projectName) {
        console.log('\n');
        console.log(' ДО СВИДАНИЯ! ');
        console.log(`Спасибо за использование ${projectName}!`);
        this.drawLine();
    }
}

module.exports = ConsoleDecorator;