// ================================================================
// tracking.js — Ghi lại hoạt động trên web (dùng cho trang Admin)
// ================================================================

function getSessionId() {
  let sid = localStorage.getItem('chausonSessionId');
  if (!sid) {
    sid = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('chausonSessionId', sid);
  }
  return sid;
}

async function trackEvent(eventType, metadata = {}) {
  try {
    await sb.from('site_events').insert({
      event_type: eventType,
      page: window.location.pathname.split('/').pop() || 'index.html',
      session_id: getSessionId(),
      metadata
    });
  } catch (err) {
    // Không chặn trải nghiệm người dùng nếu tracking lỗi
    console.warn('[tracking] lỗi ghi sự kiện:', err.message);
  }
}

// Ghi nhận lượt xem trang mỗi khi tải trang
document.addEventListener('DOMContentLoaded', () => {
  trackEvent('page_view');
});

// Bọc addToCart (nếu có ở cart.js) để tự động log sự kiện add_to_cart
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.addToCart === 'function') {
    const originalAddToCart = window.addToCart;
    window.addToCart = function (productId) {
      originalAddToCart(productId);
      const product = (window.PRODUCTS || []).find(p => p.id === productId);
      trackEvent('add_to_cart', {
        productId,
        productName: product ? product.name : null
      });
    };
  }
});
