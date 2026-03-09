const fs = require('fs').promises
const readline = require('readline')
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const NODES_FILE = path.join(__dirname, 'notes.json');

async function loadNotes(){
    try{
        const data = await fs.readFile(NODES_FILE, 'utf8');
        return JSON.parse(data);
    }
    catch(error){
        return [];
    }
}

async function saveNotes(notes){
    try{
        await fs.writeFile(NODES_FILE, JSON.stringify(notes, null, 2), 'utf8');
    }
    catch(error){
        console.error('ERROR!!!', error.message)
    }
}

async function createNotes(){
    return new Promise((resolve) => {
        console.log('---Создание новой заметки---');
        console.log('---'.repeat(30));

        rl.question('Заголовок', (title) => {
            rl.question('Содержание', (content) => {
                const newNote = {
                    id: Date.now(),
                    title: title,
                    content: content,
                    date: new Date().toLocaleString()
                };

                resolve(newNote);
            });
        });
    });
}

async function addNote(){
    try{
        const newNote = await createNotes();

        const notes = await loadNotes();

        notes.push(newNote);
        await saveNotes(notes);

        console.log(`Всего заметок ${notes.length}`);
    }
    catch(error){
        console.log('ERROR!!!', error.message);
    }

    showMenu();
}

async function viewNotes(){
    try{
        const notes = await loadNotes();

        console.log('---Все заметки---');

        if(notes.length === 0){
            console.log('Пока нет заметок!');
        }
        else{
            notes.forEach((note, index) => {
                console.log(`\n [${index + 1}] ${note.title}`);
                console.log(` ID ${note.id}`);
                console.log(` ${note.date}`);
                console.log(` ${note.content}`);
                console.log(`_`.repeat(30));
                
            });
            console.log(`\nВсего заметок ${notes.length}`);
        }
    }
    catch(error){
        console.log('ERROR!!!', error.message);
    }

    showMenu();
}

async function deleteNote(){
    try{
        const notes = await loadNotes();

        if(notes.length === 0){
            console.log('📭 Нет заметок для удаления');
            showMenu();
            return;
        }

        console.log('---Выберите заметку для удаления---');
        notes.forEach((note, index) => {
            console.log(`[${index + 1}] . ${note.title} . (${note.date})`);
        });

        rl.question('Введите номер заметки для удаления или 0 для отмены', async (choice) => {
            if(choice === '0'){
                console.log('Отмена удаления!');
            }
            else if(index >= 0 && index <= notes.length){
                const deleted = notes.splice(index, 1);
                await saveNotes(notes);
                console.log(`Заметка "${deleted[0].title}" удалена!`);
            }
            else{
                console.log('Неверный номер!')
            }
            showMenu();
        });
        
    }
    catch{
        console.log('ERROR!!!', error.message);
        showMenu();
    }
}

async function exportToFile(){
    try{
        const notes = await loadNotes();
        const exportFile = path.join(__dirname, 'notes_file.txt');

        let content = "---Export Save Notes---";
        content += `Дата экспорта: ${new Date.toLocalString()} \n`;
        content += '='.repeat(30) + '\n';

        notes.forEach(note => {
            content += `${note.title} \n`;
            content += `${note.date} \n`;
            content += `${note.content} \n`;
            content += '='.repeat(30) + '\n';
        });

        content += `Всего заметок ${notes.length}`;
        await fs.writeFile(exportFile, content, 'utf8');
    }
    catch{

    }
    showMenu();
}

async function showMenu(){
    console.log("1. Добавить заметку");
    console.log("2. Посмотреть заметки");
    console.log("3. Удалить заметку");
    console.log("4. Экспортировать в файл");
    console.log("5. Выход");
    rl.question('---Выберите действие (1-5)--- \n', (choice) => {
        switch(choice){
            case '1':
                addNote();
                break;
            case '2':
                viewNotes();
                break;
            case '3':
                deleteNote();
                break;
            case '4':
                exportToFile();
                break;
            case '5':
                console.log('До свидания!');
                rl.close();
                break;
            default:
                console.log('Неизвестная команда!');
                showMenu();
                break;
        }
    });
}


console.log('\n' + '='.repeat(50));
console.log('📚 ПРОГРАММА ДЛЯ ЗАМЕТОК С СОХРАНЕНИЕМ В ФАЙЛ');
console.log('='.repeat(50));

// Запуск
showMenu();