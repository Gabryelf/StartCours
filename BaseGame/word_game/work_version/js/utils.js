// Вспомогательные функции
const Utils = {
    // Перемешивание массива
    shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    // Уникальные значения
    unique(array) {
        return [...new Set(array)];
    },
    
    // Получить случайный элемент
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // Подсчет повторений букв в слове
    countLetters(word) {
        const counts = {};
        for (const letter of word) {
            counts[letter] = (counts[letter] || 0) + 1;
        }
        return counts;
    },
    
    // Проверка, можно ли составить слово из букв
    canFormWord(word, availableLetters) {
        const wordCounts = this.countLetters(word);
        const availableCounts = this.countLetters(availableLetters);
        
        for (const letter in wordCounts) {
            if (!availableCounts[letter] || availableCounts[letter] < wordCounts[letter]) {
                return false;
            }
        }
        return true;
    },
    
    // Получить дату в формате YYYY-MM-DD
    getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },
    
    // Получить индекс темы дня
    getDailyThemeIndex() {
        const today = new Date();
        return today.getDate() % WORD_LIST.dailyThemes.length;
    }
};