const addButton = document.getElementById('addButton');
const addModal = document.getElementById('addProductModal');
const editModal = document.getElementById('editProductModal');
const closeBtns = document.getElementsByClassName('close');

// Show the add product modal when the add button is clicked
addButton.onclick = function() {
    addModal.classList.add('show');
}

// Close the modals when the close buttons are clicked
Array.from(closeBtns).forEach(btn => {
    btn.onclick = function() {
        addModal.classList.remove('show');
        editModal.classList.remove('show');
    }
});

// Close the modals when clicking outside of them
window.onclick = function(event) {
    if (event.target == addModal) {
        addModal.classList.remove('show');
    }
    if (event.target == editModal) {
        editModal.classList.remove('show');
    }
}

// Handle the form submission for adding a new product
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
    } else {
        const newProduct = {
            id: Date.now(),
            name: name,
            description: description,
            rating: rating,
            price: price
        };
        addProduct(newProduct);
        displayProducts();
    }

    // Reset form and close modal
    this.reset();
    addModal.classList.remove('show');
});

// Handle the form submission for editing an existing product
document.getElementById('editProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const imageFile = document.getElementById('editProductImage').files[0];
    const description = document.getElementById('editProductDescription').value;
    const rating = parseFloat(document.getElementById('editProductRating').value);
    const price = parseFloat(document.getElementById('editProductPrice').value);

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;
            const updatedProduct = {
                id: id,
                name: name,
                image: imageDataUrl,
                description: description,
                rating: rating,
                price: price
            };
            updateProduct(id, updatedProduct);
            displayProducts();
        }
        reader.readAsDataURL(imageFile);
    } else {
        const updatedProduct = {
            id: id,
            name: name,
            description: description,
            rating: rating,
            price: price
        };
        updateProduct(id, updatedProduct);
        displayProducts();
    }

    // Reset form and close modal
    this.reset();
    editModal.classList.remove('show');
});

// Add a new product to the local storage
function addProduct(product) {
    const products = loadProducts();
    products.push(product);
    saveProducts(products);
}

// Update an existing product in the local storage
function updateProduct(id, product) {
    const products = loadProducts();
    const productIndex = products.findIndex(p => p.id == id);
    if (productIndex > -1) {
        products[productIndex] = product;
        saveProducts(products);
    }
}

// Delete a product from the local storage
function deleteProduct(id) {
    let products = loadProducts();
    products = products.filter(product => product.id != id);
    saveProducts(products);
    displayProducts();
}

// Save the products to local storage
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// Load the products from local storage
function loadProducts() {
    const products = localStorage.getItem("products");
    return products ? JSON.parse(products) : [];
}

// Display the products on the page
function displayProducts() {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = ""; // Clear existing products
    
    const products = loadProducts();
    products.forEach((product) => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create a product card element
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
        <button class="remove-product" onclick="deleteProduct(${product.id})">Remove</button>
    `;
    return productCard;
}

// Populate the edit form with the product data and show the edit modal
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

// Load and display the products when the page is loaded
window.addEventListener("DOMContentLoaded", displayProducts);