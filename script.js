// ===================================
// ADVANCED JAVASCRIPT WITH FEATURES
// ===================================

// Sample Products Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones Pro",
        description: "Premium noise-cancelling wireless headphones with 40-hour battery life",
        price: 299.99,
        oldPrice: 399.99,
        category: "Electronics",
        image: "headphones.png",
        stock: 25,
        rating: 4.8,
        reviews: 156,
        isNew: true,
        onSale: true
    },
    {
        id: 2,
        name: "Smart Watch Ultra",
        description: "Advanced fitness tracker with GPS and heart rate monitoring",
        price: 449.99,
        category: "Electronics",
        image: "smartwatch.png",

        stock: 18,
        rating: 4.6,
        reviews: 89,
        isNew: true
    },
    {
        id: 3,
        name: "Running Shoes Elite",
        description: "Professional running shoes with responsive cushioning",
        price: 159.99,
        oldPrice: 189.99,
        category: "Sports",
        image: "shoes.png",
        stock: 45,
        rating: 4.7,
        reviews: 234,
        onSale: true
    },
    {
        id: 4,
        name: "Laptop Backpack Pro",
        description: "Water-resistant backpack with USB charging port",
        price: 79.99,
        category: "Accessories",
        image: "backpack.png",
        stock: 62,
        rating: 4.5,
        reviews: 178
    },
    {
        id: 5,
        name: "Smart Coffee Maker",
        description: "WiFi-enabled coffee maker with app control",
        price: 199.99,
        oldPrice: 249.99,
        category: "Home",
        image: "coffee.png",
        stock: 33,
        rating: 4.4,
        reviews: 92,
        onSale: true
    },
    {
        id: 6,
        name: "Yoga Mat Premium",
        description: "Extra thick non-slip exercise mat with carrying strap",
        price: 49.99,
        category: "Sports",
        image: "yoga.png",
        stock: 78,
        rating: 4.9,
        reviews: 312,
        isNew: true
    },
    {
        id: 7,
        name: "Bluetooth Speaker Max",
        description: "360° sound wireless speaker with deep bass",
        price: 129.99,
        category: "Electronics",
        image: "speaker.png",
        stock: 41,
        rating: 4.6,
        reviews: 167
    },
    {
        id: 8,
        name: "Gaming Mouse RGB",
        description: "12000 DPI gaming mouse with programmable buttons",
        price: 69.99,
        oldPrice: 89.99,
        category: "Electronics",
        image: "mouse.png",
        stock: 55,
        rating: 4.7,
        reviews: 203,
        onSale: true
    },
    {
        id: 9,
        name: "Insulated Water Bottle",
        description: "24oz stainless steel bottle keeps drinks cold 24hrs",
        price: 34.99,
        category: "Sports",
        image: "bottle.png",
        stock: 89,
        rating: 4.8,
        reviews: 456
    },
    {
        id: 10,
        name: "LED Desk Lamp Smart",
        description: "Adjustable brightness desk lamp with wireless charging",
        price: 59.99,
        category: "Home",
        image: "lamp.png",
        stock: 36,
        rating: 4.5,
        reviews: 124
    },
    {
        id: 11,
        name: "Phone Case Premium",
        description: "Military-grade protection with card holder",
        price: 29.99,
        category: "Accessories",
        image: "phonecase.png",
        stock: 124,
        rating: 4.6,
        reviews: 289
    },
    {
        id: 12,
        name: "Polarized Sunglasses",
        description: "UV400 protection with lightweight titanium frame",
        price: 89.99,
        oldPrice: 119.99,
        category: "Accessories",
        image: "sunglasses.png",
        stock: 47,
        rating: 4.7,
        reviews: 178,
        onSale: true
    }
];

// Global State
let state = {
    products: products,
    filteredProducts: [...products],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
    currentCategory: 'all',
    currentSort: 'default',
    viewMode: 'grid',
    darkMode: localStorage.getItem('darkMode') === 'true'
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);
    
    // Initialize dark mode
    if (state.darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
    
    // Display products
    displayProducts(state.filteredProducts);
    updateCart();
    updateWishlist();
    setupEventListeners();
    
    // Back to top button
    window.addEventListener('scroll', handleScroll);
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);
    
    // Search
    document.getElementById('search-toggle').addEventListener('click', () => {
        document.getElementById('search-overlay').classList.add('active');
        document.getElementById('search-input').focus();
    });
    
    document.getElementById('close-search').addEventListener('click', () => {
        document.getElementById('search-overlay').classList.remove('active');
    });
    
    document.getElementById('search-form').addEventListener('submit', handleSearch);
    document.getElementById('search-input').addEventListener('input', debounce(handleSearchInput, 300));
    
    // Cart
    document.getElementById('cart-toggle').addEventListener('click', () => {
        document.getElementById('cart-sidebar').classList.add('open');
    });
    
    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-sidebar').classList.remove('open');
    });
    
    // Wishlist
    document.getElementById('wishlist-toggle').addEventListener('click', () => {
        document.getElementById('wishlist-sidebar').classList.add('open');
    });
    
    document.getElementById('close-wishlist').addEventListener('click', () => {
        document.getElementById('wishlist-sidebar').classList.remove('open');
    });
    
    // Categories
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.addEventListener('click', handleCategoryClick);
    });
    
    // Sort
    document.getElementById('sort-select').addEventListener('change', handleSort);
    
    // View toggle
    document.getElementById('grid-view').addEventListener('click', () => setViewMode('grid'));
    document.getElementById('list-view').addEventListener('click', () => setViewMode('list'));
    
    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    
    // Back to top
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Close sidebars on outside click
    document.addEventListener('click', (e) => {
        const cartSidebar = document.getElementById('cart-sidebar');
        const wishlistSidebar = document.getElementById('wishlist-sidebar');
        
        if (!cartSidebar.contains(e.target) && 
            !document.getElementById('cart-toggle').contains(e.target) &&
            cartSidebar.classList.contains('open')) {
            cartSidebar.classList.remove('open');
        }
        
        if (!wishlistSidebar.contains(e.target) && 
            !document.getElementById('wishlist-toggle').contains(e.target) &&
            wishlistSidebar.classList.contains('open')) {
            wishlistSidebar.classList.remove('open');
        }
    });
}

// Dark Mode Toggle
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', state.darkMode);
    document.getElementById('theme-toggle').textContent = state.darkMode ? '☀️' : '🌙';
    showNotification(state.darkMode ? 'Dark mode enabled' : 'Light mode enabled');
}

// Display Products
function displayProducts(productsToDisplay) {
    const container = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');
    const productCount = document.getElementById('product-count');
    
    container.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        noResults.style.display = 'block';
        container.style.display = 'none';
        productCount.textContent = '0 Products';
        return;
    }
    
    noResults.style.display = 'none';
    container.style.display = 'grid';
    productCount.textContent = `${productsToDisplay.length} Product${productsToDisplay.length !== 1 ? 's' : ''}`;
    
    productsToDisplay.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    
    const isInWishlist = state.wishlist.some(item => item.id === product.id);
    const stars = '⭐'.repeat(Math.floor(product.rating));
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-image" 
                 onerror="this.src='placeholder.jpg'">
            
            <div class="product-badges">
                ${product.isNew ? '<span class="badge-pill badge-new">NEW</span>' : ''}
                ${product.onSale ? `<span class="badge-pill badge-sale">-${discount}%</span>` : ''}
            </div>
            
            <div class="product-actions-overlay">
                <button class="action-btn" onclick="toggleWishlist(${product.id})" aria-label="Add to wishlist">
                    ${isInWishlist ? '❤️' : '🤍'}
                </button>
                <button class="action-btn" onclick="quickView(${product.id})" aria-label="Quick view">
                    👁️
                </button>
            </div>
        </div>
        
        <div class="product-info">
            <span class="product-category">${escapeHtml(product.category)}</span>
            <h3 class="product-title">${escapeHtml(product.name)}</h3>
            <p class="product-description">${escapeHtml(product.description)}</p>
            
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span class="rating-count">(${product.reviews})</span>
            </div>
            
            <div class="product-footer">
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                
                <button class="add-to-cart-btn" 
                        onclick="addToCart(${product.id})"
                        ${product.stock === 0 ? 'disabled' : ''}
                        aria-label="Add ${escapeHtml(product.name)} to cart">
                    <span>🛒</span>
                    <span>${product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Search Functionality
function handleSearch(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    performSearch(query);
    document.getElementById('search-overlay').classList.remove('active');
}

function handleSearchInput(e) {
    const query = e.target.value;
    if (query.length >= 2) {
        showSearchSuggestions(query);
    } else {
        document.getElementById('search-suggestions').innerHTML = '';
    }
}

function performSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        state.filteredProducts = filterByCategory(state.products, state.currentCategory);
    } else {
        const categoryFiltered = filterByCategory(state.products, state.currentCategory);
        state.filteredProducts = categoryFiltered.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    sortProducts(state.currentSort);
    displayProducts(state.filteredProducts);
    showNotification(`Found ${state.filteredProducts.length} products`);
}

function showSearchSuggestions(query) {
    const results = state.products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    const suggestionsDiv = document.getElementById('search-suggestions');
    
    if (results.length > 0) {
        suggestionsDiv.innerHTML = `
            <h4 style="margin-bottom: 1rem;">Suggestions:</h4>
            ${results.map(product => `
                <div style="padding: 0.5rem; cursor: pointer; border-radius: 0.5rem; transition: background 0.2s;"
                     onmouseover="this.style.background='var(--bg-tertiary)'"
                     onmouseout="this.style.background='transparent'"
                     onclick="document.getElementById('search-input').value='${escapeHtml(product.name)}'; performSearch('${escapeHtml(product.name)}')">
                    <strong>${escapeHtml(product.name)}</strong>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">$${product.price.toFixed(2)}</div>
                </div>
            `).join('')}
        `;
    } else {
        suggestionsDiv.innerHTML = '';
    }
}

// Category Filter
function handleCategoryClick(e) {
    document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    state.currentCategory = e.target.dataset.category;
    state.filteredProducts = filterByCategory(state.products, state.currentCategory);
    sortProducts(state.currentSort);
    displayProducts(state.filteredProducts);
    
    showNotification(`Filtered by ${state.currentCategory === 'all' ? 'All Products' : state.currentCategory}`);
}

function filterByCategory(products, category) {
    return category === 'all' ? [...products] : products.filter(p => p.category === category);
}

// Sorting
function handleSort(e) {
    state.currentSort = e.target.value;
    sortProducts(state.currentSort);
    displayProducts(state.filteredProducts);
}

function sortProducts(sortType) {
    switch(sortType) {
        case 'price-low':
            state.filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            state.filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            state.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            state.filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            state.filteredProducts.sort((a, b) => a.id - b.id);
    }
}

// View Mode
function setViewMode(mode) {
    state.viewMode = mode;
    const container = document.getElementById('products-container');
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    
    if (mode === 'grid') {
        container.classList.remove('list-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        container.classList.add('list-view');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    }
}

// Cart Functions
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
            showNotification(`Increased quantity of "${product.name}"`);
        } else {
            showNotification(`Maximum stock reached for "${product.name}"`, 'error');
            return;
        }
    } else {
        state.cart.push({...product, quantity: 1});
        showNotification(`"${product.name}" added to cart`);
    }
    
    saveCart();
    updateCart();
}

function removeFromCart(productId) {
    const item = state.cart.find(i => i.id === productId);
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
    showNotification(`"${item.name}" removed from cart`);
}

function updateQuantity(productId, change) {
    const item = state.cart.find(i => i.id === productId);
    const product = state.products.find(p => p.id === productId);
    
    if (item) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity <= product.stock) {
            item.quantity = newQuantity;
            saveCart();
            updateCart();
        } else {
            showNotification(`Maximum stock (${product.stock}) reached`, 'error');
        }
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');
    const subtotal = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = calculateTotal();
    
    cartCount.textContent = totalItems;
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = `
            <li class="empty-cart">
                <span class="empty-cart-icon">🛒</span>
                <p>Your cart is empty</p>
            </li>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = state.cart.map(item => `
            <li class="cart-item">
                <img src="${item.image}" alt="${escapeHtml(item.name)}" class="item-image" 
                     onerror="this.src='placeholder.jpg'">
                <div class="item-details">
                    <div class="item-name">${escapeHtml(item.name)}</div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove item">
                    ✕
                </button>
            </li>
        `).join('');
        checkoutBtn.disabled = false;
    }
    
    subtotal.textContent = `$${total.toFixed(2)}`;
    totalPrice.textContent = total.toFixed(2);
}

function calculateTotal() {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = state.products.find(p => p.id === productId);
    const index = state.wishlist.findIndex(item => item.id === productId);
    
    if (index !== -1) {
        state.wishlist.splice(index, 1);
        showNotification(`Removed "${product.name}" from wishlist`);
    } else {
        state.wishlist.push(product);
        showNotification(`Added "${product.name}" to wishlist`);
    }
    
    saveWishlist();
    updateWishlist();
    displayProducts(state.filteredProducts); // Refresh to update heart icons
}

function updateWishlist() {
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistCount = document.getElementById('wishlist-count');
    
    wishlistCount.textContent = state.wishlist.length;
    
    if (state.wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <li class="empty-wishlist">
                <span class="empty-wishlist-icon">❤️</span>
                <p>Your wishlist is empty</p>
            </li>
        `;
    } else {
        wishlistItems.innerHTML = state.wishlist.map(item => `
            <li class="wishlist-item">
                <img src="${item.image}" alt="${escapeHtml(item.name)}" class="item-image"
                     onerror="this.src='placeholder.jpg'">
                <div class="item-details">
                    <div class="item-name">${escapeHtml(item.name)}</div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <button class="btn-primary" onclick="addToCart(${item.id}); toggleWishlist(${item.id})" 
                            style="margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem;">
                        Add to Cart
                    </button>
                </div>
                <button class="item-remove" onclick="toggleWishlist(${item.id})" aria-label="Remove from wishlist">
                    ✕
                </button>
            </li>
        `).join('');
    }
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
}

// Quick View
function quickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quick-view-modal');
    const body = document.getElementById('quick-view-body');
    
    const stars = '⭐'.repeat(Math.floor(product.rating));
    
    body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 900px;">
            <div>
                <img src="${product.image}" alt="${escapeHtml(product.name)}" 
                     style="width: 100%; border-radius: 1rem;" onerror="this.src='placeholder.jpg'">
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <span style="color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.875rem;">${escapeHtml(product.category)}</span>
                <h2 style="font-family: var(--font-display); font-size: 2rem;">${escapeHtml(product.name)}</h2>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--secondary);">${stars}</span>
                    <span style="color: var(--text-secondary);">(${product.reviews} reviews)</span>
                </div>
                <p style="color: var(--text-secondary); line-height: 1.7;">${escapeHtml(product.description)}</p>
                <div style="display: flex; align-items: baseline; gap: 1rem;">
                    <span style="font-size: 2rem; font-weight: 800; color: var(--primary);">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span style="text-decoration: line-through; color: var(--text-tertiary);">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <p style="color: var(--text-secondary);">Stock: <strong>${product.stock}</strong> available</p>
                <button class="btn-primary" onclick="addToCart(${product.id}); closeModal()" 
                        style="width: 100%; padding: 1rem; font-size: 1.125rem; justify-content: center;"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock > 0 ? 'Add to Cart 🛒' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Close on overlay click
    modal.querySelector('.modal-overlay').onclick = closeModal;
    modal.querySelector('.modal-close').onclick = closeModal;
}

function closeModal() {
    document.getElementById('quick-view-modal').classList.remove('active');
}

// Checkout
function handleCheckout() {
    if (state.cart.length === 0) return;
    
    const total = calculateTotal();
    const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const orderSummary = state.cart.map(item => 
        `${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`🎉 Order Summary\n\n${orderSummary}\n\n📦 Total Items: ${itemCount}\n💰 Total: $${total.toFixed(2)}\n\nThank you for shopping at ShopHub!`);
    
    state.cart = [];
    saveCart();
    updateCart();
    document.getElementById('cart-sidebar').classList.remove('open');
    showNotification('Order placed successfully! 🎉');
}

// Notifications
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'error' ? '❌' : '✅';
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-text">${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Scroll Handler
function handleScroll() {
    const backToTop = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// Reset Filters
function resetFilters() {
    state.currentCategory = 'all';
    state.filteredProducts = [...state.products];
    document.getElementById('search-input').value = '';
    document.getElementById('sort-select').value = 'default';
    
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
    });
    
    displayProducts(state.filteredProducts);
    showNotification('Filters reset');
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Console Welcome
console.log('%c🛍️ Welcome to ShopHub!', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%c✨ Advanced E-Commerce Platform', 'color: #f59e0b; font-size: 16px;');