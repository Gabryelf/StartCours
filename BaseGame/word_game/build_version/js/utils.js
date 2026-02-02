// js/utils.js
// ============
// В этом файле храним вспомогательные функции, которые используются в разных местах

const Utils = {
    // 1. ФУНКЦИЯ ДЛЯ ПЕРЕМЕШИВАНИЯ МАССИВА
    // Нужно для перемешивания букв в круге
    shuffleArray(array) {
        // Создаем копию массива, чтобы не менять оригинал
        const newArray = [...array];
        
        // Алгоритм Фишера-Йетса (самый эффективный для перемешивания)
        for (let i = newArray.length - 1; i > 0; i--) {
            // Выбираем случайный индекс от 0 до i
            const j = Math.floor(Math.random() * (i + 1));
            
            // Меняем местами элементы i и j
            // Это называется "деструктурирующее присваивание"
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        
        return newArray;
    },
    
    // 2. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ УНИКАЛЬНЫХ ЭЛЕМЕНТОВ
    // Нужно для получения уникальных букв из слов
    getUnique(array) {
        // Set хранит только уникальные значения
        // ... оператор "spread" преобразует Set обратно в массив
        return [...new Set(array)];
    },
    
    // 3. ФУНКЦИЯ ДЛЯ ПОДСЧЕТА ПОВТОРЯЮЩИХСЯ ЭЛЕМЕНТОВ
    // Нужно чтобы знать, сколько раз каждая буква встречается
    countOccurrences(array) {
        const counts = {}; // Объект для хранения счетчиков
        
        array.forEach(item => {
            // Если буква уже встречалась, увеличиваем счетчик
            // Если не встречалась, инициализируем с 1
            counts[item] = (counts[item] || 0) + 1;
        });
        
        return counts;
    },
    
    // 4. ФУНКЦИЯ ПРОВЕРКИ, МОЖНО ЛИ СОСТАВИТЬ СЛОВО
    // Проверяет, есть ли все нужные буквы в доступных
    canFormWord(word, availableLetters, availableCounts) {
        // Разбиваем слово на буквы
        const wordLetters = word.split('');
        
        // Считаем, сколько раз каждая буква нужна
        const wordCounts = this.countOccurrences(wordLetters);
        
        // Проверяем каждую букву
        for (const letter in wordCounts) {
            // Если буквы нет в доступных или её недостаточно
            if (!availableCounts[letter] || availableCounts[letter] < wordCounts[letter]) {
                return false; // Не можем составить слово
            }
        }
        
        return true; // Все буквы есть в нужном количестве
    },
    
    // 5. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ СЕГОДНЯШНЕЙ ДАТЫ
    // Нужно для "Слова дня"
    getTodayString() {
        return new Date().toDateString();
    },
    
    // 6. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ИНДЕКСА ТЕМЫ ДНЯ
    getDailyThemeIndex() {
        // Получаем день месяца (1-31)
        const dayOfMonth = new Date().getDate();
        // Используем остаток от деления, чтобы индекс был от 0 до 3
        return dayOfMonth % WORD_LIST.dailyThemes.length;
    }
};

// Делаем утилиты доступными глобально
window.Utils = Utils;