const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');

// Включаем парсинг JSON
app.use(express.json());

// Получение списка всех товаров
app.get('/api/products', (req, res) => {
    fs.readFile('products.json', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        res.json(JSON.parse(data));  // Отправляем товары в формате JSON
    });
});

// Добавление нового товара
app.post('/api/products', (req, res) => {
    const newProduct = req.body;

    fs.readFile('products.json', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }

        const products = JSON.parse(data);

        // Генерация нового ID (если список товаров пустой, id будет 1)
        const newId = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;

        // Создаем новый товар с id
        const productWithId = { id: newId, ...newProduct };

        // Добавляем товар в список
        products.push(productWithId);

        // Записываем обновленный список обратно в файл
        fs.writeFile('products.json', JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи в файл');
            }
            res.status(201).json(productWithId);  // Отправляем товар с id клиенту
        });
    });
});

// Редактирование товара
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    fs.readFile('products.json', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const products = JSON.parse(data);
        const index = products.findIndex(product => product.id === parseInt(productId));  // Приводим к числу
        if (index === -1) {
            return res.status(404).send('Товар не найден');
        }
        products[index] = { ...products[index], ...updatedProduct };
        fs.writeFile('products.json', JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи в файл');
            }
            res.json(products[index]);
        });
    });
});

// Удаление товара
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    fs.readFile('products.json', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        const products = JSON.parse(data);
        const filteredProducts = products.filter(product => product.id !== parseInt(productId));  // Приводим к числу
        if (filteredProducts.length === products.length) {
            return res.status(404).send('Товар не найден');
        }
        fs.writeFile('products.json', JSON.stringify(filteredProducts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи в файл');
            }
            res.status(204).send();
        });
    });
});

// Статические файлы из папки frontend
app.use(express.static(path.join(__dirname, '../frontend')));  // Путь для статических файлов

// Страница для администратора
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Страница для пользователя
app.get('/user', (req, res) => {
    const filePath = path.join(__dirname, '../frontend', 'user.html');
    console.log('Sending user.html from:', filePath);  // Логируем путь
    res.sendFile(filePath);  // Отдаём user.html
});

// Главная страница (если хотите отдавать user.html по дефолту)
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../frontend', 'user.html');
    console.log('Sending user.html from:', filePath);  // Логируем путь
    res.sendFile(filePath);  // По умолчанию тоже user.html
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
