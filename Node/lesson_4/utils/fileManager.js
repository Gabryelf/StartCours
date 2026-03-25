import fs from 'fs/promises';

const path = 'data/notes.json';

export const saveFile = async (notes) => {
  try {
    const jsonData = JSON.stringify(notes, null, 2);
    await fs.writeFile(path, jsonData);
  } catch (error) {
    throw new Error(`Ошибка сохранения файла: ${error.message}`);
  }
};

export const loadFile = async () => {
  try {
    const jsonData = await fs.readFile(path, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw new Error(`Ошибка загрузки файла: ${error.message}`);
  }
};