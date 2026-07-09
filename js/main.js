// ================================================================
// main.js — Core Logic cho Châu Sơn Shop
// ================================================================

// ========================= INIT =========================
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderBanners();
  renderNews();
  initSearch();
  initCart();
  initScrollTop();
  initMobileMenu();
  initCountdown();
  highlightActiveNav();

  // renderBestSellers/renderProductSections phụ thuộc PRODUCTS (Supabase),
  // đợi tải xong để tránh hiển thị rỗng
  onProductsReady(() => {
    renderBestSellers();
    renderProductSections();
  });
});

// ========================= CATEGORIES =========================
function renderCategories() {
  const list = document.getElementById('categoryList');
  if (!list) return;

  list.innerHTML = CATEGORIES.map((cat, i) => `
    <li class="category-item ${i === 0 ? 'active' : ''}"
        onclick="filterByCategory('${cat.id}')"
        data-cat="${cat.id}">
      <div class="cat-icon" style="background: ${cat.color}22; color: ${cat.color};">
        <i class="fas ${cat.icon}"></i>
      </div>
      <span class="cat-name">${cat.name}</span>
      <i class="fas fa-chevron-right cat-arrow"></i>
    </li>
    ${i < CATEGORIES.length - 1 && i % 3 === 2 ? '<div class="category-divider"></div>' : ''}
  `).join('');
}

function filterByCategory(catId) {
  // Update active state
  document.querySelectorAll('.category-item').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === catId);
  });

  // Scroll to section
  const section = document.getElementById(`section-${catId}`);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ========================= HERO BANNER =========================
let currentSlide = 0;
let autoSlideInterval;

function renderBanners() {
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track) return;

  track.innerHTML = BANNERS.map(b => `
    <div class="slide" style="background: ${b.bgColor};">
      <div class="slide-content">
        <span class="slide-tag">⭐ Hàng Ngoại Nhập Chính Hãng</span>
        <h2 class="slide-title">${b.productName}</h2>
        <div class="slide-discount">
          <div class="discount-badge">GIẢM ${b.discount}%</div>
        </div>
        <div class="slide-prices">
          <span class="price-original">${formatPrice(b.originalPrice)}</span>
          <span class="price-sale">${formatPrice(b.salePrice)}</span>
        </div>
        <a href="san-pham.html" class="slide-cta">
          <i class="fas fa-shopping-cart"></i> MUA NGAY
        </a>
      </div>
      <img src="${b.image}" alt="${b.productName}" class="slide-image" loading="eager" onerror="this.src='https://via.placeholder.com/200x200/cccccc/999999?text=Sản+phẩm'">
      <div class="slide-badge">🏆 ${b.badge}</div>
    </div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = BANNERS.map((_, i) => `
      <button class="slider-dot ${i === 0 ? 'active' : ''}"
              onclick="goToSlide(${i})" aria-label="Slide ${i + 1}"></button>
    `).join('');
  }

  startAutoSlide();
}

function goToSlide(index) {
  currentSlide = (index + BANNERS.length) % BANNERS.length;
  const track = document.getElementById('sliderTrack');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 4500);
}

// Pause on hover
document.addEventListener('DOMContentLoaded', () => {
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }
});

// Touch swipe support
let touchStartX = 0;
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('sliderTrack');
  if (!slider) return;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
  });
});

// ========================= NEWS =========================
function renderNews() {
  const container = document.getElementById('newsList');
  if (!container) return;

  container.innerHTML = NEWS.map(n => `
    <div class="news-item" onclick="window.location.href='tin-tuc.html'">
      <img src="${n.image}" alt="${n.title}" class="news-thumb"
           onerror="this.src='https://via.placeholder.com/60x50/e8f5e9/2e7d32?text=Tin+tức'">
      <div class="news-info">
        <div class="news-title">${n.title}</div>
        <div class="news-time">
          <i class="far fa-clock"></i>
          <span>${n.time}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ========================= BEST SELLERS =========================
let bsCurrentIndex = 0;

function renderBestSellers() {
  const track = document.getElementById('bestsellerTrack');
  if (!track) return;

  const sellers = getBestSellers(8);
  track.innerHTML = sellers.map(p => createBestsellerCard(p)).join('');
}

function createBestsellerCard(p) {
  const discountPercent = p.originalPrice ? getDiscountPercent(p.originalPrice, p.price) : 0;
  return `
    <div class="bestseller-card" onclick="goToProduct('${p.id}')">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/240x240/f5f5f5/bdbdbd?text=Sản+phẩm'">
        ${p.badge ? `<span class="product-badge badge-${p.badge.toLowerCase() === 'hot' ? 'hot' : p.badge.toLowerCase() === 'best' ? 'best' : 'default'}">${p.badge}</span>` : ''}
        ${discountPercent > 0 ? `<span class="product-discount-tag">-${discountPercent}%</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price-row">
          <span class="price-current">${formatPrice(p.price)}</span>
          ${p.originalPrice ? `<span class="price-old">${formatPrice(p.originalPrice)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function scrollBestSellers(direction) {
  const track = document.getElementById('bestsellerTrack');
  if (!track) return;

  const cardWidth = track.querySelector('.bestseller-card')?.offsetWidth || 160;
  const gap = 12;
  const visibleCount = getVisibleBSCount();
  const maxIndex = Math.max(0, getBestSellers(8).length - visibleCount);

  bsCurrentIndex = Math.max(0, Math.min(maxIndex, bsCurrentIndex + direction));
  track.style.transform = `translateX(-${bsCurrentIndex * (cardWidth + gap)}px)`;
}

function getVisibleBSCount() {
  const w = window.innerWidth;
  if (w >= 1200) return 5;
  if (w >= 1024) return 4;
  if (w >= 768) return 3;
  return 2;
}

// ========================= PRODUCT SECTIONS =========================
function renderProductSections() {
  const container = document.getElementById('productSections');
  if (!container) return;

  const sectionsToShow = [
    'thuc-pham-chuc-nang',
    'chong-lao-hoa',
    'my-pham',
    'sam-nam-cao',
    'me-va-be',
    'ho-tro-xuong-khop'
  ];

  container.innerHTML = sectionsToShow.map(catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return '';
    const products = getProductsByCategory(catId, 5);
    if (products.length === 0) return '';

    return `
      <section class="product-section" id="section-${catId}">
        <div class="section-header">
          <h2 class="section-title">${cat.name}</h2>
          <div class="section-tags">
            ${cat.subTags.slice(0, 5).map(tag => `
              <button class="tag-pill" onclick="filterTag(this, '${catId}', '${tag}')">${tag}</button>
            `).join('')}
          </div>
          <a href="san-pham.html?cat=${catId}" class="section-see-all">
            Xem tất cả <i class="fas fa-arrow-right"></i>
          </a>
        </div>
        <div class="products-grid" id="grid-${catId}">
          ${products.map(p => createProductCard(p)).join('')}
        </div>
      </section>
    `;
  }).join('');
}

function filterTag(btn, catId, tag) {
  // Update active tag
  btn.closest('.section-tags').querySelectorAll('.tag-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter products
  const grid = document.getElementById(`grid-${catId}`);
  if (!grid) return;

  let filtered = PRODUCTS.filter(p => p.categoryId === catId);
  if (tag !== 'all') {
    filtered = filtered.filter(p => p.tag === tag);
  }

  if (filtered.length === 0) {
    filtered = getProductsByCategory(catId, 5);
  }

  grid.innerHTML = filtered.slice(0, 5).map(p => createProductCard(p)).join('');
}

// ========================= PRODUCT CARD =========================
function createProductCard(p) {
  const discountPercent = p.originalPrice ? getDiscountPercent(p.originalPrice, p.price) : 0;
  const badgeClass = p.badge ?
    (p.badge === 'HOT' ? 'badge-hot' :
     p.badge === 'MỚI' ? 'badge-new' :
     p.badge === 'SALE' ? 'badge-sale' :
     p.badge === 'BEST' ? 'badge-best' :
     p.badge === 'PREMIUM' ? 'badge-premium' : 'badge-default') : '';

  const stars = Math.round(p.rating || 4.5);

  return `
    <div class="product-card" onclick="goToProduct('${p.id}')">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/240x240/f5f5f5/bdbdbd?text=Sản+phẩm'">
        ${p.badge ? `<span class="product-badge ${badgeClass}">${p.badge}</span>` : ''}
        ${discountPercent > 0 ? `<span class="product-discount-tag">-${discountPercent}%</span>` : ''}
        <div class="product-actions">
          <button class="product-action-btn" title="Yêu thích" onclick="toggleWishlist(event, ${p.id})">
            <i class="far fa-heart"></i>
          </button>
          <button class="product-action-btn" title="Xem nhanh" onclick="quickView(event, ${p.id})">
            <i class="far fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <div class="stars">
            ${'<i class="fas fa-star star"></i>'.repeat(stars)}
            ${stars < 5 ? '<i class="far fa-star star" style="color:#ddd"></i>'.repeat(5 - stars) : ''}
          </div>
          <span class="rating-count">(${p.reviews || 0})</span>
        </div>
        <div class="product-price-row">
          <span class="price-current">${formatPrice(p.price)}</span>
          ${p.originalPrice ? `<span class="price-old">${formatPrice(p.originalPrice)}</span>` : ''}
        </div>
        <button class="product-add-cart" onclick="addToCartFromCard(event, ${p.id})">
          <i class="fas fa-cart-plus"></i> Thêm vào giỏ
        </button>
      </div>
    </div>
  `;
}

// ========================= NAVIGATION =========================
function goToProduct(productId) {
  window.location.href = `chi-tiet-san-pham.html?id=${productId}`;
}

function highlightActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ========================= SEARCH =========================
function initSearch() {
  const input = document.getElementById('searchInput');
  const suggestions = document.getElementById('searchSuggestions');
  const form = document.getElementById('searchForm');

  if (!input || !suggestions) return;

  let searchTimeout;

  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const query = input.value.trim();

    if (query.length < 2) {
      suggestions.classList.remove('active');
      return;
    }

    searchTimeout = setTimeout(() => {
      const results = searchProducts(query).slice(0, 6);
      if (results.length === 0) {
        suggestions.classList.remove('active');
        return;
      }

      suggestions.innerHTML = results.map(p => `
        <div class="suggestion-item" onclick="goToProduct('${p.id}')">
          <img src="${p.image}" alt="${p.name}"
               onerror="this.src='https://via.placeholder.com/40x40/f5f5f5/bdbdbd?text=?'">
          <div class="suggestion-info">
            <div class="suggestion-name">${highlightText(p.name, query)}</div>
            <div class="suggestion-price">${formatPrice(p.price)}</div>
          </div>
        </div>
      `).join('') + `
        <div class="suggestion-item" onclick="performSearch('${query}')"
             style="background: #f0f9f0; justify-content: center; color: var(--primary); font-weight: 600; font-size: 0.8rem;">
          <i class="fas fa-search"></i> Xem tất cả kết quả cho "${query}"
        </div>
      `;
      suggestions.classList.add('active');
    }, 250);
  });

  // Close on click outside
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.classList.remove('active');
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') suggestions.classList.remove('active');
    if (e.key === 'Enter') { e.preventDefault(); performSearch(input.value); }
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      performSearch(input.value);
    });
  }
}

function highlightText(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background: #ffeb3b; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

function performSearch(query) {
  if (query.trim()) {
    window.location.href = `san-pham.html?q=${encodeURIComponent(query.trim())}`;
  }
}

// ========================= CART =========================
let cart = [];

function initCart() {
  const saved = localStorage.getItem('chausonshop_cart');
  if (saved) {
    try { cart = JSON.parse(saved); } catch(e) { cart = []; }
  }
  updateCartUI();

  // Cart toggle
  const cartBtn = document.getElementById('cartBtn');
  const overlay = document.getElementById('miniCartOverlay');
  const closeBtn = document.getElementById('miniCartClose');

  if (cartBtn) cartBtn.addEventListener('click', toggleCart);
  if (overlay) overlay.addEventListener('click', toggleCart);
  if (closeBtn) closeBtn.addEventListener('click', toggleCart);
}

function toggleCart() {
  const miniCart = document.getElementById('miniCart');
  const overlay = document.getElementById('miniCartOverlay');
  if (miniCart) miniCart.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
  document.body.style.overflow = miniCart?.classList.contains('open') ? 'hidden' : '';
  renderCartItems();
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  saveCart();
  updateCartUI();
  renderCartItems();
  showToast(`✅ Đã thêm "${product.name.substring(0, 40)}..." vào giỏ hàng!`, 'success');
}

function addToCartFromCard(event, productId) {
  event.stopPropagation();
  addToCart(productId, 1);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function saveCart() {
  localStorage.setItem('chausonshop_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function renderCartItems() {
  const container = document.getElementById('cartItemsContainer');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="mini-cart-empty">
        <i class="fas fa-shopping-cart"></i>
        <p>Giỏ hàng của bạn đang trống<br>
           <a href="san-pham.html" style="color: var(--primary); font-weight: 600;">Mua sắm ngay →</a>
        </p>
      </div>
    `;
    if (totalEl) totalEl.textContent = '0đ';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img"
           onerror="this.src='https://via.placeholder.com/64x64/f5f5f5/bdbdbd?text=SP'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty('${item.id}', -1)"><i class="fas fa-minus"></i></button>
          <div class="qty-display">${item.qty}</div>
          <button class="qty-btn" onclick="updateQty('${item.id}', 1)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Xóa">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function toggleWishlist(event, productId) {
  event.stopPropagation();
  const btn = event.currentTarget;
  const icon = btn.querySelector('i');
  const isWishlisted = icon.classList.contains('fas');
  icon.className = isWishlisted ? 'far fa-heart' : 'fas fa-heart';
  icon.style.color = isWishlisted ? '' : '#e53935';
  showToast(isWishlisted ? '💔 Đã xóa khỏi yêu thích' : '❤️ Đã thêm vào yêu thích', isWishlisted ? 'info' : 'success');
}

function quickView(event, productId) {
  event.stopPropagation();
  window.location.href = `chi-tiet-san-pham.html?id=${productId}`;
}

// ========================= TOAST =========================
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.success}"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ========================= SCROLL TO TOP =========================
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========================= MOBILE MENU =========================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const closeBtn = document.getElementById('mobileMenuClose');

  if (!menuBtn || !menu) return;

  const toggleMenu = () => {
    menu.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  };

  menuBtn.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

  // Render mobile categories
  const mobileNav = document.getElementById('mobileNavContent');
  if (mobileNav) {
    mobileNav.innerHTML = `
      <div class="mobile-nav-divider">Trang chính</div>
      ${['index.html', 'san-pham.html', 'tin-tuc.html', 'lien-he.html'].map((href, i) => {
        const labels = ['🏠 Trang chủ', '🛍 Sản phẩm', '📰 Tin tức', '📞 Liên hệ'];
        return `<a href="${href}" class="mobile-nav-item">${labels[i]}</a>`;
      }).join('')}
      <div class="mobile-nav-divider">Danh mục sản phẩm</div>
      ${CATEGORIES.map(cat => `
        <div class="mobile-nav-item" onclick="window.location.href='san-pham.html?cat=${cat.id}'">
          <div class="nav-icon" style="background: ${cat.color};">
            <i class="fas ${cat.icon}"></i>
          </div>
          <span>${cat.name}</span>
        </div>
      `).join('')}
    `;
  }
}

// ========================= COUNTDOWN =========================
function initCountdown() {
  const target = new Date();
  target.setHours(23, 59, 59, 999);

  function updateCountdown() {
    const now = new Date();
    let diff = target - now;
    if (diff < 0) diff = 0;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');

    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    if (hoursEl) hoursEl.textContent = pad(h);
    if (minsEl) minsEl.textContent = pad(m);
    if (secsEl) secsEl.textContent = pad(s);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
