import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileName = join(__dirname, '../notes.json');

// Сохранить заметки
export const saveNotes = async (notes) => {
    try {
        // Превращаем массив в строку JSON
        const jsonData = JSON.stringify(notes, null, 2);
        // Записываем в файл
        await fs.writeFile(fileName, jsonData, 'utf8');
        console.log(' * Заметки сохранены в файл *');
    } catch (error) {
        console.error('Ошибка при сохранении заметок:', error);
        throw error;
    }
};

// Загрузить заметки
export const loadNotes = async () => {
    try {
        // Пробуем прочитать файл
        const jsonData = await fs.readFile(fileName, 'utf8');
        // Превращаем JSON обратно в массив
        return JSON.parse(jsonData);
    } catch (error) {
        // Если файла нет или он битый - возвращаем пустой массив
        return [];
    }
};