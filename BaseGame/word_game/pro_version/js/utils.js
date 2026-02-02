// Вспомогательные функции
const Utils = {
    // Перемешивание массива (алгоритм Фишера-Йетса)
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    // Получить уникальные элементы массива
    getUnique(array) {
        return [...new Set(array)];
    },
    
    // Подсчет повторяющихся элементов
    countOccurrences(array) {
        const counts = {};
        array.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        return counts;
    },
    
    // Проверка, можно ли составить слово из доступных букв
    canFormWord(word, availableLetters, availableCounts) {
        const wordLetters = word.split('');
        const wordCounts = this.countOccurrences(wordLetters);
        
        for (const letter in wordCounts) {
            if (!availableCounts[letter] || availableCounts[letter] < wordCounts[letter]) {
                return false;
            }
        }
        return true;
    },
    
    // Получить дату в формате строки
    getTodayString() {
        return new Date().toDateString();
    },
    
    // Получить индекс темы дня
    getDailyThemeIndex() {
        return new Date().getDate() % WORD_LIST.dailyThemes.length;
    }
};