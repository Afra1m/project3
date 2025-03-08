document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product-list');
    const addForm = document.getElementById('add-product-form');
    const deleteForm = document.getElementById('delete-product-form');

    // Функция для получения товаров с сервера
    function fetchProducts() {
        fetch('http://localhost:3000/api/products')
            .then(response => response.json())
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
            });
    }

    // Добавление нового товара
    addForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        const newProduct = { name, price, description, categories: [category] };

        fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
            .then(response => response.json())
            .then(() => {
                fetchProducts();  // Обновить список товаров после добавления
            });
    });

    // Удаление товара
    deleteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const productId = document.getElementById('delete-id').value;

        fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 204) {
                    alert('Товар удален');
                    fetchProducts();  // Обновить список товаров после удаления
                } else {
                    alert('Товар не найден');
                }
            });
    });

    // Инициализация
    fetchProducts();
});
