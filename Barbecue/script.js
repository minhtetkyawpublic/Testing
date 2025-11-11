// Menu data
const menuItems = [
    {
        id: 1,
        name: "Texas Brisket",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        description: "Slow-smoked beef brisket with our signature rub"
    },
    {
        id: 2,
        name: "St. Louis Ribs",
        price: 22.99,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        description: "Full rack of pork ribs with tangy BBQ sauce"
    },
    {
        id: 3,
        name: "Pulled Pork Sandwich",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        description: "Tender pulled pork on a brioche bun with coleslaw"
    },
    {
        id: 4,
        name: "BBQ Chicken Platter",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        description: "Half chicken with your choice of sauce"
    },
    {
        id: 5,
        name: "Smoked Sausage",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        description: "House-made smoked sausage with peppers and onions"
    },
    {
        id: 6,
        name: "BBQ Combo Platter",
        price: 32.99,
        image: "https://cdn.pixabay.com/photo/2015/07/19/18/41/bbq-851835_1280.jpg",
        description: "Sample our best: brisket, ribs, sausage, and chicken"
    }
];

// Cart state
let cart = [];

// DOM elements
const menuGrid = document.getElementById('menu-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const emptyCartMessage = document.getElementById('empty-cart-message');
const saveVoucherBtn = document.getElementById('save-voucher');
const voucher = document.getElementById('voucher');
const voucherItems = document.getElementById('voucher-items');
const voucherTotal = document.getElementById('voucher-total');
const orderDate = document.getElementById('order-date');

// Initialize the menu
function initializeMenu() {
    menuGrid.innerHTML = '';
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-img">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span class="price">$${item.price.toFixed(2)}</span>
                <button class="btn add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        menuGrid.appendChild(card);
    });

    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add item to cart
function addToCart(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = menuItems.find(menuItem => menuItem.id === itemId);
    
    // Check if item is already in cart
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

// Update quantity of item in cart
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.appendChild(emptyCartMessage);
        cartTotal.textContent = 'Total: $0.00';
        return;
    }
    
    emptyCartMessage.remove();
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <button class="btn btn-secondary remove" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    
    // Add event listeners to cart controls
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(itemId, 1);
        });
    });
    
    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

// Generate voucher content
function generateVoucherContent() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some items before saving a voucher.');
        return false;
    }
    
    voucherItems.innerHTML = '';
    let total = 0;
    
    // Set current date
    const now = new Date();
    orderDate.textContent = `Order Date: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const voucherItem = document.createElement('div');
        voucherItem.className = 'voucher-item';
        voucherItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        voucherItems.appendChild(voucherItem);
    });
    
    voucherTotal.textContent = `$${total.toFixed(2)}`;
    return true;
}

// Save voucher as image
function saveVoucherAsImage() {
    if (!generateVoucherContent()) return;
    
    // Show voucher
    voucher.style.display = 'block';
    
    // Use html2canvas to capture the voucher as image
    html2canvas(voucher).then(canvas => {
        // Convert canvas to image
        const image = canvas.toDataURL('image/png');
        
        // Create download link
        const link = document.createElement('a');
        link.download = `bbq-order-${new Date().getTime()}.png`;
        link.href = image;
        link.click();
        
        // Hide voucher after download
        voucher.style.display = 'none';
    });
}

// Event listeners
saveVoucherBtn.addEventListener('click', saveVoucherAsImage);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMenu();
    updateCartDisplay();
});