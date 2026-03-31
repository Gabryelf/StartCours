const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        popup: './src/popup/popup.js',
        content: './src/content/content.js'
    },
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/[name].js',
        clean: true
    },
    
    mode: 'development',
    
    // Отключаем eval для совместимости с расширениями
    devtool: false,
    
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/popup/popup.html', to: 'popup/popup.html' },
                { from: 'src/icons', to: 'icons' }
            ]
        })
    ],
    
    // Добавляем настройки для оптимизации
    optimization: {
        // Убираем eval из продакшн сборки
        minimize: false
    }
};