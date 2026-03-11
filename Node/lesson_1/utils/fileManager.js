const fs = require('fs');
const fileName = 'notes.json'; // файл будет в той же папке, где и index.js

// Сохранить заметки
const saveNotes = (notes) => {
    // Превращаем массив в строку JSON
    const jsonData = JSON.stringify(notes);
    // Записываем в файл
    fs.writeFileSync(fileName, jsonData);
    console.log(' * Заметки сохранены в файл *');
};

// Загрузить заметки
const loadNotes = () => {
    try {
        // Пробуем прочитать файл
        const jsonData = fs.readFileSync(fileName, 'utf8');
        // Превращаем JSON обратно в массив
        return JSON.parse(jsonData);
    } catch (error) {
        // Если файла нет или он битый - возвращаем пустой массив
        return [];
    }
};

module.exports = { saveNotes, loadNotes };