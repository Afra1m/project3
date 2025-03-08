document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product-list');

    // Функция для получения товаров с сервера
    function fetchProducts() {
        fetch('http://localhost:3000/api/products') // запрос на сервер для получения товаров
            .then(response => response.json())  // ответ сервера в формате JSON
            .then(products => {
                productList.innerHTML = '';  // Очистить текущий список товаров
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>Цена: ${product.price}</p>
                        <p>Описание: ${product.description}</p>
                        <p><strong>ID товара:</strong> ${product.id}</p> <!-- Отображаем ID товара -->
                        <p><strong>Категория:</strong> ${product.categories.join(', ')}</p>
                    `;
                    productList.appendChild(productCard);
                });
            })
            .catch(err => console.error('Ошибка при получении товаров:', err));  // если ошибка
    }

    // Инициализация, когда страница загружается
    fetchProducts();
});
