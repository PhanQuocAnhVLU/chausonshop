// ================================================
// cart.js — Quản lý giỏ hàng toàn cục
// ================================================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('chausonCart') || '[]');

function saveCart() {
  localStorage.setItem('chausonCart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  // Badge
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = count;

  // Total price
  const totalEl = document.getElementById('cartTotalPrice');
  if (totalEl) totalEl.textContent = total.toLocaleString('vi-VN') + 'đ';

  // Show/hide footer
  const foot = document.getElementById('cartFoot');
  const empty = document.getElementById('cartEmpty');
  if (foot) foot.style.display = count > 0 ? 'block' : 'none';
  if (empty) empty.style.display = count > 0 ? 'none' : 'block';

  // Render items
  renderCartItems();
}

function renderCartItems() {
  const list = document.getElementById('cartItemsList');
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty" id="cartEmpty">
        <i class="fas fa-shopping-basket"></i>
        <p>Giỏ hàng trống</p>
        <small>Hãy thêm sản phẩm vào giỏ hàng</small>
      </div>`;
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='images/product-1.png'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price.toLocaleString('vi-VN')}đ</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-count">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-del" onclick="removeFromCart(${item.id})" title="Xóa">
        <i class="fas fa-times"></i>
      </button>
    </div>`).join('');
}

function addToCart(productId) {
  if (typeof PRODUCTS === 'undefined') return;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast('✅ Đã thêm vào giỏ hàng!', 'success');

  // Auto-open cart
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  showToast('Đã xóa sản phẩm khỏi giỏ hàng');
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartUI();
}

function toggleCart() {
  const drawer = document.getElementById('miniCartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const isOpen = drawer?.classList.contains('open');

  if (isOpen) {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
  } else {
    openCart();
  }
}

function openCart() {
  document.getElementById('miniCartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
}

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});

// Expose globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;
window.toggleCart = toggleCart;
window.showToast = showToast;
