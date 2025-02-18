const addButton = document.getElementById('addButton');
        const addModal = document.getElementById('addProductModal');
        const editModal = document.getElementById('editProductModal');
        const closeBtns = document.getElementsByClassName('close');

        addButton.onclick = function() {
            addModal.classList.add('show');
        }

        Array.from(closeBtns).forEach(btn => {
            btn.onclick = function() {
                addModal.classList.remove('show');
                editModal.classList.remove('show');
            }
        });

        window.onclick = function(event) {
            if (event.target == addModal) {
                addModal.classList.remove('show');
            }
            if (event.target == editModal) {
                editModal.classList.remove('show');
            }
        }

        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('productName').value;
            const imageFile = document.getElementById('productImage').files[0];
            const description = document.getElementById('productDescription').value;
            const rating = parseFloat(document.getElementById('productRating').value);
            const price = parseFloat(document.getElementById('productPrice').value);

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageDataUrl = e.target.result;
                    const newProduct = {
                        id: Date.now(),
                        name: name,
                        image: imageDataUrl,
                        description: description,
                        rating: rating,
                        price: price
                    };
                    addProduct(newProduct);
                    displayProducts();
                }
                reader.readAsDataURL(imageFile);
            }

            // Reset form and close modal
            this.reset();
            addModal.classList.remove('show');
        });

        document.getElementById('editProductForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = document.getElementById('editProductId').value;
            const name = document.getElementById('editProductName').value;
            const imageFile = document.getElementById('editProductImage').files[0];
            const description = document.getElementById('editProductDescription').value;
            const rating = parseFloat(document.getElementById('editProductRating').value);
            const price = parseFloat(document.getElementById('editProductPrice').value);

            const products = loadProducts();
            const productIndex = products.findIndex(product => product.id == id);

            if (productIndex > -1) {
                if (imageFile) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        products[productIndex].image = e.target.result;
                        products[productIndex].name = name;
                        products[productIndex].description = description;
                        products[productIndex].rating = rating;
                        products[productIndex].price = price;
                        saveProducts(products);
                        displayProducts();
                    }
                    reader.readAsDataURL(imageFile);
                } else {
                    products[productIndex].name = name;
                    products[productIndex].description = description;
                    products[productIndex].rating = rating;
                    products[productIndex].price = price;
                    saveProducts(products);
                    displayProducts();
                }
            }

            // Reset form and close modal
            this.reset();
            editModal.classList.remove('show');
        });

        function saveProducts(products) {
            localStorage.setItem("products", JSON.stringify(products));
        }

        function loadProducts() {
            const products = localStorage.getItem("products");
            return products ? JSON.parse(products) : [];
        }

        function addProduct(product) {
            const products = loadProducts();
            products.push(product);
            saveProducts(products);
        }

        function displayProducts() {
            const productGrid = document.getElementById("productGrid");
            

            const products = loadProducts();
            products.forEach((product) => {
                const productCard = createProductCard(product);
                productGrid.appendChild(productCard);
            });
        }

        function createProductCard(product) {
            const productCard = document.createElement("div");
            productCard.className = "product-card";
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Rating: ${product.rating.toFixed(2)}/5</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button class="add-to-cart">Add to Cart</button>
                <button class="edit-product" onclick="editProduct(${product.id})">Edit</button>
                <button class="remove-product" onclick="removeProduct(${product.id})">Remove</button>
            `;
            return productCard;
        }

        function editProduct(id) {
            const products = loadProducts();
            const product = products.find(product => product.id == id);

            if (product) {
                document.getElementById('editProductId').value = product.id;
                document.getElementById('editProductName').value = product.name;
                document.getElementById('editProductDescription').value = product.description;
                document.getElementById('editProductRating').value = product.rating;
                document.getElementById('editProductPrice').value = product.price;
                editModal.classList.add('show');
            }
        }

        function removeProduct(id) {
            let products = loadProducts();
            products = products.filter(product => product.id != id);
            saveProducts(products);
            displayProducts();
        }

        window.addEventListener("DOMContentLoaded", displayProducts);
