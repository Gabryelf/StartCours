// Генерация уровней
const LevelGenerator = {
    // Генерация бесконечного уровня
    generateInfiniteLevel(level, wordList) {
        // Определяем сложность на основе уровня
        const difficulty = Math.min(2 + Math.floor(level / 3), 5);
        const wordCount = difficulty;
        
        // Отбираем слова и буквы с учетом логики
        let selectedWords = [];
        let availableLetters = [];
        let allLetters = [];
        
        // Начинаем с одного случайного слова
        const startWordIndex = Math.floor(Math.random() * wordList.length);
        const startWord = wordList[startWordIndex];
        selectedWords.push(startWord);
        
        // Добавляем все буквы из первого слова с учетом повторений
        const startWordLetters = startWord.split('');
        allLetters.push(...startWordLetters);
        availableLetters = Utils.getUnique(startWordLetters);
        
        // Пытаемся добавить еще слова, которые можно составить из доступных букв
        let availableWords = wordList.filter(word => {
            if (selectedWords.includes(word)) return false;
            
            const availableCounts = Utils.countOccurrences(allLetters);
            return Utils.canFormWord(word, availableLetters, availableCounts);
        });
        
        // Добавляем дополнительные слова
        for (let i = 1; i < wordCount && availableWords.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            const word = availableWords[randomIndex];
            
            selectedWords.push(word);
            allLetters.push(...word.split(''));
            availableLetters = Utils.getUnique(allLetters);
            
            // Обновляем список доступных слов
            availableWords = availableWords.filter(w => w !== word);
            availableWords = availableWords.filter(word => {
                const availableCounts = Utils.countOccurrences(allLetters);
                return Utils.canFormWord(word, availableLetters, availableCounts);
            });
        }
        
        // Если слов меньше нужного количества, добавляем слова с минимальным добавлением букв
        while (selectedWords.length < wordCount) {
            // Находим слово, которое требует минимального количества новых букв
            let bestWord = null;
            let bestNewLetters = Infinity;
            
            wordList.forEach(word => {
                if (selectedWords.includes(word)) return;
                
                const wordLetters = word.split('');
                const newLetters = wordLetters.filter(letter => 
                    !allLetters.includes(letter)
                ).length;
                
                if (newLetters < bestNewLetters && newLetters <= 2) {
                    bestNewLetters = newLetters;
                    bestWord = word;
                }
            });
            
            if (bestWord) {
                selectedWords.push(bestWord);
                allLetters.push(...bestWord.split(''));
                availableLetters = Utils.getUnique(allLetters);
            } else {
                // Если не нашли подходящее слово, добавляем любое
                const remainingWords = wordList.filter(word => !selectedWords.includes(word));
                if (remainingWords.length > 0) {
                    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
                    selectedWords.push(randomWord);
                    allLetters.push(...randomWord.split(''));
                    availableLetters = Utils.getUnique(allLetters);
                } else {
                    break;
                }
            }
        }
        
        // Ограничиваем количество букв в круге до 10
        if (availableLetters.length > 10) {
            // Выбираем 10 самых часто используемых букв
            const letterFrequency = {};
            allLetters.forEach(letter => {
                letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
            });
            
            availableLetters = Object.keys(letterFrequency)
                .sort((a, b) => letterFrequency[b] - letterFrequency[a])
                .slice(0, 10);
        }
        
        // Перемешиваем буквы
        availableLetters = Utils.shuffleArray(availableLetters);
        
        // Инициализируем ячейки для представления
        const wordCells = {};
        selectedWords.forEach(word => {
            wordCells[word] = word.split('').map((letter, index) => ({
                revealed: false,
                letter: letter,
                index: index
            }));
        });
        
        return {
            availableLetters: availableLetters,
            targetWords: selectedWords,
            wordCells: wordCells,
            allLetters: allLetters,
            maxAttempts: Math.max(allLetters.length * 2, 15)
        };
    },
    
    // Генерация ежедневного уровня
    generateDailyLevel() {
        const themeIndex = Utils.getDailyThemeIndex();
        const theme = WORD_LIST.dailyThemes[themeIndex];
        
        // Собираем все буквы (с повторениями)
        const allLetters = [];
        theme.words.forEach(word => {
            allLetters.push(...word.split(''));
        });
        
        // Берем только уникальные буквы для круга (ограничиваем 10)
        let availableLetters = theme.letters.slice(0, 10);
        
        // Проверяем, что все слова можно составить из availableLetters
        theme.words.forEach(word => {
            const wordLetters = word.split('');
            const letterCounts = Utils.countOccurrences(wordLetters);
            
            // Если какой-то буквы не хватает, добавляем её
            for (const letter in letterCounts) {
                const availableCount = availableLetters.filter(l => l === letter).length;
                const neededCount = letterCounts[letter];
                
                if (availableCount < neededCount) {
                    // Добавляем недостающие копии буквы
                    for (let i = availableCount; i < neededCount && availableLetters.length < 10; i++) {
                        availableLetters.push(letter);
                    }
                }
            }
        });
        
        // Инициализируем ячейки для представления
        const wordCells = {};
        theme.words.forEach(word => {
            wordCells[word] = word.split('').map((letter, index) => ({
                revealed: false,
                letter: letter,
                index: index
            }));
        });
        
        return {
            availableLetters: availableLetters,
            targetWords: theme.words,
            wordCells: wordCells,
            allLetters: allLetters,
            maxAttempts: Math.max(allLetters.length * 2, 20),
            themeName: theme.name
        };
    }
};