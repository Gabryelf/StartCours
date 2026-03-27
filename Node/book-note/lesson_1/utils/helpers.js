// вспомогательные функции

// Функция для переиндексации ID заметок
const reindexIds = (entries) => {
    return entries.map((entry, index) => ({ ...entry, id: index + 1 }));
};

// Функция для форматирования даты
const formatDate = (date = new Date()) => {
    return date.toLocaleString();
};

// Функция для проверки наличия заметок
const hasEntries = (entries) => {
    return entries.length > 0;
};

// Функция для получения статистики
const getStats = (entries) => {
    return {
        total: entries.length,
        lastEntry: entries.length > 0 ? entries[entries.length - 1] : null
    };
};

// Экспортируем все функции
module.exports = {
    reindexIds,
    formatDate,
    hasEntries,
    getStats
};