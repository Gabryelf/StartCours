const fs = require("fs").promises; // Используем promises версию fs
const path = 'notes.json';

const saveFile = async (notes) => {
  try {
    const jsonData = JSON.stringify(notes, null, 2);
    await fs.writeFile(path, jsonData);
  } catch (error) {
    throw new Error(`Ошибка сохранения файла: ${error.message}`);
  }
};

const loadFile = async () => {
  try {
    const jsonData = await fs.readFile(path, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // Файл не найден, возвращаем пустой массив
    }
    throw new Error(`Ошибка загрузки файла: ${error.message}`);
  }
};

module.exports = { saveFile, loadFile };