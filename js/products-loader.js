// ================================================================
// products-loader.js — Nạp sản phẩm THẬT từ Supabase thay cho data.js
// Nếu lỗi kết nối, tự động dùng dữ liệu mẫu (PRODUCTS_FALLBACK) để
// trang web không bị vỡ.
// ================================================================

window.PRODUCTS = window.PRODUCTS || [];

function mapDbProduct(row) {
  return {
    id: row.id,                     // uuid thật (dùng cho admin / order_items)
    legacyId: row.legacy_id,
    categoryId: row.category_id,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    image: row.image,
    badge: row.badge,
    tag: row.tag,
    rating: Number(row.rating || 5),
    reviews: row.reviews || 0,
    sold: row.sold || 0,
    isNew: !!row.is_new,
    isSale: !!row.is_sale,
    isBestSeller: !!row.is_best_seller,
    stock: row.stock
  };
}

async function loadProductsFromSupabase() {
  try {
    const { data, error } = await sb
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      window.PRODUCTS = data.map(mapDbProduct);
    } else if (typeof PRODUCTS_FALLBACK !== 'undefined') {
      window.PRODUCTS = PRODUCTS_FALLBACK;
    }
  } catch (err) {
    console.warn('[products-loader] Không tải được từ Supabase, dùng dữ liệu mẫu:', err.message);
    if (typeof PRODUCTS_FALLBACK !== 'undefined') {
      window.PRODUCTS = PRODUCTS_FALLBACK;
    }
  } finally {
    window.__productsReady = true;
    document.dispatchEvent(new Event('productsReady'));
  }
}

loadProductsFromSupabase();

// Helper: các trang gọi hàm này thay vì nghe DOMContentLoaded trực tiếp,
// đảm bảo PRODUCTS đã có dữ liệu thật trước khi render.
function onProductsReady(callback) {
  if (window.__productsReady) {
    callback();
  } else {
    document.addEventListener('productsReady', callback, { once: true });
  }
}
