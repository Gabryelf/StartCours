// вспомогательные функции

// Функция для переиндексации ID заметок
export const reindexIds = (entries) => {
    return entries.map((entry, index) => ({ ...entry, id: index + 1 }));
};

// Функция для форматирования даты
export const formatDate = (date = new Date()) => {
    return date.toLocaleString();
};

// Функция для проверки наличия заметок
export const hasEntries = (entries) => {
    return entries.length > 0;
};

// Функция для получения статистики
export const getStats = (entries) => {
    return {
        total: entries.length,
        lastEntry: entries.length > 0 ? entries[entries.length - 1] : null
    };
};

// Функция для поиска по тексту
export const searchByText = (entries, searchTerm, field = 'all') => {
    const term = searchTerm.toLowerCase();
    
    return entries.filter(entry => {
        if (field === 'name') {
            return entry.name.toLowerCase().includes(term);
        } else if (field === 'content') {
            return entry.content.toLowerCase().includes(term);
        } else {
            return entry.name.toLowerCase().includes(term) || 
                   entry.content.toLowerCase().includes(term);
        }
    });
};