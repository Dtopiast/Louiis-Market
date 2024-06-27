let cart = [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    let savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function addToCart(productId, name, price) {
    let item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ id: productId, name: name, price: price, quantity: 1 });
    }
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

function updateItemQuantity(productId, newQuantity) {
    let item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartDisplay() {
    let cartItems = document.getElementById('cart-items');
    let cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        let itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong> - $${item.price}
            </div>
            <div class="cart-item-actions">
                <button onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart('${item.id}')">&times;</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}

function updateCartCount() {
    let cartCount = document.getElementById('cart-count');
    let count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'inline' : 'none';
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadCart();
    updateCartDisplay();
    updateCartCount();

    let modal = document.getElementById('cart-modal');
    let btn = document.getElementById('cart-button');
    let span = document.getElementsByClassName('close')[0];
    let checkoutBtn = document.getElementById('checkout-button');

    btn.onclick = function() {
        modal.style.display = 'block';
        updateCartDisplay();
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    checkoutBtn.onclick = function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
        } else {
            alert('¡Gracias por tu compra! Total: $' + document.getElementById('cart-total').textContent);
            cart = [];
            saveCart();
            updateCartDisplay();
            updateCartCount();
            modal.style.display = 'none';
        }
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            let productId = this.getAttribute('data-product-id');
            let productName = this.closest('article').querySelector('h3').textContent;
            let productPrice = parseFloat(this.closest('article').querySelector('.price').textContent.replace('$', ''));
            addToCart(productId, productName, productPrice);
            this.classList.add('added-to-cart');
            setTimeout(() => this.classList.remove('added-to-cart'), 300);
        });
    });
});