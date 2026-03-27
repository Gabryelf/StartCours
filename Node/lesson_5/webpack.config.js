const path = require('path');

module.exports = {
    // Точка входа — главный файл нашего приложения
    entry: './script.js',
    
    // Точка выхода — куда и как сложить собранный файл
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    
    // Режим: development — для разработки, production — для публикации
    mode: 'development'
};