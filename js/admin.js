// ================================================================
// admin.js — Logic cho trang quản trị Châu Sơn Shop
// ================================================================

const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

let revenueChart = null;
let visitsChart = null;
let allProductsCache = [];
const PRODUCT_IMAGE_BUCKET = 'product-images';
const CONTENT_STORAGE_KEY = 'chauson_admin_content_v1';

function resolveImageUrl(path) {
  if (!path) return 'https://via.placeholder.com/80?text=No+Image';
  if (/^https?:\/\//i.test(path)) return path;
  return '../' + path;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + 'đ';
}

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('vi-VN');
}

function getStatusBadgeClass(status) {
  return `badge-${status || 'pending'}`;
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || 'Không rõ';
}

function getDefaultContentSettings() {
  const shopInfo = (typeof SHOP_INFO !== 'undefined' && SHOP_INFO) ? SHOP_INFO : {};
  const categoryCount = Array.isArray(CATEGORIES) ? CATEGORIES.length : 0;
  const bannerCount = Array.isArray(BANNERS) ? BANNERS.length : 0;

  return {
    name: shopInfo.name || 'Châu Sơn Shop',
    hotline: shopInfo.hotline || '0987.153.876',
    address: shopInfo.address1 || '',
    workingHours: shopInfo.workingHours || '8h00–21h30',
    deliveryTime: shopInfo.deliveryTime || '2–4 ngày',
    description: shopInfo.tagline || 'Chuyên Hàng Nhập',
    categoryCount,
    bannerCount
  };
}

function getContentSettings() {
  try {
    const saved = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!saved) return getDefaultContentSettings();
    return { ...getDefaultContentSettings(), ...JSON.parse(saved) };
  } catch (error) {
    return getDefaultContentSettings();
  }
}

function saveContentSettings(settings) {
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(settings));
}

function downloadCsv(filename, rows) {
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// ========================= AUTH =========================
async function initAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    showDashboard(session.user.email);
  } else {
    showLogin();
  }

  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      showDashboard(session.user.email);
    } else if (event === 'SIGNED_OUT') {
      showLogin();
    }
  });
}

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboardScreen').style.display = 'none';
}

function showDashboard(email) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboardScreen').style.display = 'block';
  document.getElementById('userEmail').textContent = email;
  switchView('overview');
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    errEl.textContent = 'Đăng nhập thất bại: ' + (error.message === 'Invalid login credentials'
      ? 'Sai email hoặc mật khẩu.' : error.message);
    errEl.style.display = 'block';
  }
});

function logout() {
  sb.auth.signOut();
}

// ========================= NAV =========================
const VIEW_TITLES = { overview: 'Tổng quan', orders: 'Đơn hàng', products: 'Sản phẩm', coupons: 'Mã giảm giá', reviews: 'Đánh giá', visitors: 'Khách truy cập', content: 'Nội dung & cài đặt' };

function switchView(view) {
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.admin-view').forEach(el => el.classList.toggle('active', el.id === 'view-' + view));
  document.getElementById('pageTitle').textContent = VIEW_TITLES[view] || '';

  if (view === 'overview') loadOverview();
  if (view === 'orders') loadOrders();
  if (view === 'products') loadProducts();
  if (view === 'coupons') loadCoupons();
  if (view === 'reviews') loadAdminReviews();
  if (view === 'visitors') loadVisitors();
  if (view === 'content') loadContent();
}

// ========================= OVERVIEW =========================
async function loadOverview() {
  const container = document.getElementById('view-overview');
  container.innerHTML = '<div class="loading-spin">Đang tải dữ liệu...</div>';

  const since14 = new Date();
  since14.setDate(since14.getDate() - 13);
  since14.setHours(0, 0, 0, 0);

  const [ordersRes, itemsRes, eventsRes, productsRes] = await Promise.all([
    sb.from('orders').select('*').order('created_at', { ascending: false }),
    sb.from('order_items').select('product_name, qty, price'),
    sb.from('site_events').select('event_type, session_id, created_at').gte('created_at', since14.toISOString()),
    sb.from('products').select('id, name, stock, is_active').order('stock', { ascending: true })
  ]);

  if (ordersRes.error || itemsRes.error || eventsRes.error || productsRes.error) {
    const error = ordersRes.error || itemsRes.error || eventsRes.error || productsRes.error;
    container.innerHTML = `<div class="empty-state">Lỗi tải dữ liệu tổng quan: ${error.message}</div>`;
    return;
  }

  const orders = ordersRes.data || [];
  const items = itemsRes.data || [];
  const events = eventsRes.data || [];
  const products = productsRes.data || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter(o => new Date(o.created_at) >= today);
  const revenueTotal = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);
  const revenueToday = ordersToday.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => (p.stock ?? 0) <= 10).slice(0, 5);
  const uniqueSessions = new Set(events.filter(e => e.event_type === 'page_view').map(e => e.session_id)).size;

  const productMap = {};
  items.forEach(it => {
    productMap[it.product_name] = (productMap[it.product_name] || 0) + Number(it.qty || 0);
  });
  const topProducts = Object.entries(productMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const dayLabels = [];
  const dayRevenue = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dEnd = new Date(d);
    dEnd.setDate(dEnd.getDate() + 1);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const sum = orders
      .filter(o => o.status !== 'cancelled' && new Date(o.created_at) >= d && new Date(o.created_at) < dEnd)
      .reduce((s, o) => s + Number(o.total), 0);
    dayLabels.push(label);
    dayRevenue.push(sum);
  }

  const recentOrders = orders.slice(0, 5);
  window.__ordersCache = orders;

  container.innerHTML = `
    <div class="hero-card">
      <div>
        <h3>Hệ thống quản lý bán hàng</h3>
        <p>Theo dõi doanh thu, đơn hàng và tồn kho chỉ trong một màn hình.</p>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
        <div class="hero-badge">Cập nhật real-time</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
          <button class="btn btn-outline" style="background:#fff;color:#1b5e20;border:1px solid #fff;" onclick="exportOverviewCsv()">Xuất báo cáo CSV</button>
          <button class="btn btn-outline" style="background:#fff;color:#1b5e20;border:1px solid #fff;" onclick="switchView('orders')">Xem đơn hàng</button>
        </div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="stat-card"><div class="label">Đơn hàng hôm nay</div><div class="value">${ordersToday.length}</div></div>
      <div class="stat-card"><div class="label">Doanh thu hôm nay</div><div class="value">${formatCurrency(revenueToday)}</div></div>
      <div class="stat-card"><div class="label">Đơn chờ xác nhận</div><div class="value danger">${pendingCount}</div></div>
      <div class="stat-card"><div class="label">Khách truy cập (14 ngày)</div><div class="value">${uniqueSessions}</div></div>
    </div>

    <div class="card">
      <h3>Doanh thu 14 ngày gần nhất</h3>
      <canvas id="revenueChartCanvas" height="90"></canvas>
    </div>

    <div class="summary-grid">
      <div class="card" style="margin-bottom:0;">
        <h3>Đơn hàng gần đây</h3>
        <div class="mini-list">
          ${recentOrders.length === 0 ? '<div class="empty-state">Chưa có đơn hàng</div>' : recentOrders.map(order => `
            <div class="mini-item">
              <div>
                <div>${escapeHtml(order.order_code)}</div>
                <div class="mini-text">${escapeHtml(order.customer_name)} • ${formatDateTime(order.created_at)}</div>
              </div>
              <span class="badge ${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card" style="margin-bottom:0;">
        <h3>Sản phẩm sắp hết hàng</h3>
        <div class="mini-list">
          ${lowStockProducts.length === 0 ? '<div class="empty-state">Tất cả sản phẩm đều đủ tồn kho</div>' : lowStockProducts.map(product => `
            <div class="mini-item">
              <div>
                <div>${escapeHtml(product.name)}</div>
                <div class="mini-text">Tồn kho: ${product.stock ?? 0}</div>
              </div>
              <span class="badge badge-warning" style="background:#fff3e0;color:#f57c00">${product.stock ?? 0}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Sản phẩm bán chạy nhất</h3>
      ${topProducts.length === 0 ? '<div class="empty-state">Chưa có dữ liệu đơn hàng</div>' : `
      <table>
        <thead><tr><th>Sản phẩm</th><th>Số lượng đã bán</th></tr></thead>
        <tbody>
          ${topProducts.map(([name, qty]) => `<tr><td>${escapeHtml(name)}</td><td>${qty}</td></tr>`).join('')}
        </tbody>
      </table>`}
    </div>
  `;

  const ctx = document.getElementById('revenueChartCanvas');
  if (revenueChart) revenueChart.destroy();
  if (ctx) {
    revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dayLabels,
        datasets: [{
          label: 'Doanh thu (đ)',
          data: dayRevenue,
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46,125,50,0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }
}

// ========================= ORDERS =========================
async function loadOrders() {
  const container = document.getElementById('view-orders');
  container.innerHTML = '<div class="loading-spin">Đang tải đơn hàng...</div>';

  const { data: orders, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error) {
    container.innerHTML = `<div class="empty-state">Lỗi tải đơn hàng: ${error.message}</div>`;
    return;
  }

  const statusCounts = Object.keys(STATUS_LABELS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  orders.forEach(order => {
    if (statusCounts[order.status] !== undefined) statusCounts[order.status] += 1;
  });

  container.innerHTML = `
    <div class="summary-grid">
      ${Object.entries(statusCounts).map(([key, value]) => `
        <div class="summary-card">
          <div class="label">${getStatusLabel(key)}</div>
          <div class="value">${value}</div>
        </div>
      `).join('')}
    </div>
    <div class="toolbar">
      <select id="orderStatusFilter" onchange="renderOrdersTable()">
        <option value="">Tất cả trạng thái</option>
        ${Object.entries(STATUS_LABELS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
      </select>
      <input type="text" id="orderSearch" placeholder="Tìm theo tên, SĐT, mã đơn..." oninput="renderOrdersTable()" style="min-width:220px">
    </div>
    <div class="card"><div id="ordersTableWrap"></div></div>
  `;

  window.__ordersCache = orders;
  renderOrdersTable();
}

function renderOrdersTable() {
  const orders = window.__ordersCache || [];
  const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
  const search = (document.getElementById('orderSearch')?.value || '').toLowerCase();

  let filtered = orders;
  if (statusFilter) filtered = filtered.filter(o => o.status === statusFilter);
  if (search) {
    filtered = filtered.filter(o =>
      (o.customer_name || '').toLowerCase().includes(search) ||
      String(o.customer_phone || '').includes(search) ||
      String(o.order_code || '').toLowerCase().includes(search)
    );
  }

  const wrap = document.getElementById('ordersTableWrap');
  if (!wrap) return;

  if (filtered.length === 0) {
    wrap.innerHTML = '<div class="empty-state">Chưa có đơn hàng nào</div>';
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead>
        <tr><th>Mã đơn</th><th>Khách hàng</th><th>SĐT</th><th>Tổng tiền</th><th>Ngày đặt</th><th>Trạng thái</th><th></th></tr>
      </thead>
      <tbody>
        ${filtered.map(o => `
          <tr>
            <td>${escapeHtml(o.order_code || '')}</td>
            <td>${escapeHtml(o.customer_name || '')}</td>
            <td>${escapeHtml(o.customer_phone || '')}</td>
            <td>${formatCurrency(o.total)}</td>
            <td>${formatDateTime(o.created_at)}</td>
            <td>
              <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
                ${Object.entries(STATUS_LABELS).map(([k, v]) => `<option value="${k}" ${o.status === k ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </td>
            <td><button class="btn btn-outline btn-sm" onclick="viewOrderDetail('${o.id}')">Chi tiết</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function updateOrderStatus(orderId, status) {
  const { error } = await sb.from('orders').update({ status }).eq('id', orderId);
  if (error) {
    alert('Lỗi cập nhật trạng thái: ' + error.message);
    return;
  }
  const o = (window.__ordersCache || []).find(x => x.id === orderId);
  if (o) o.status = status;
  if (document.getElementById('view-overview').classList.contains('active')) loadOverview();
  renderOrdersTable();
}

async function viewOrderDetail(orderId) {
  const { data: items, error } = await sb.from('order_items').select('*').eq('order_id', orderId);
  const o = (window.__ordersCache || []).find(x => x.id === orderId);
  if (!o) return;

  const itemsHtml = error
    ? `<p>Lỗi tải chi tiết: ${error.message}</p>`
    : (items || []).map(it => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;">
        <span>${escapeHtml(it.product_name || '')} × ${it.qty}</span><span>${formatCurrency(Number(it.price || 0) * Number(it.qty || 0))}</span>
      </div>`).join('');

  openModal(`
    <h3>Đơn hàng ${escapeHtml(o.order_code || '')}</h3>
    <p style="font-size:13.5px;line-height:1.8;">
      <b>Khách:</b> ${escapeHtml(o.customer_name || '')} — ${escapeHtml(o.customer_phone || '')}<br>
      <b>Địa chỉ:</b> ${escapeHtml(o.customer_address || '')}<br>
      ${o.customer_email ? `<b>Email:</b> ${escapeHtml(o.customer_email)}<br>` : ''}
      ${o.note ? `<b>Ghi chú:</b> ${escapeHtml(o.note)}<br>` : ''}
      <b>Thanh toán:</b> ${escapeHtml(o.payment_method || 'COD')}
    </p>
    <hr style="margin:14px 0;border:none;border-top:1px solid #eee;">
    ${itemsHtml}
    <hr style="margin:14px 0;border:none;border-top:1px solid #eee;">
    <div style="display:flex;justify-content:space-between;font-weight:700;">
      <span>Tổng cộng</span><span>${formatCurrency(o.total)}</span>
    </div>
    <div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Đóng</button></div>
  `);
}

// ========================= PRODUCTS =========================
async function loadProducts() {
  const container = document.getElementById('view-products');
  container.innerHTML = '<div class="loading-spin">Đang tải sản phẩm...</div>';

  const { data: products, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    container.innerHTML = `<div class="empty-state">Lỗi tải sản phẩm: ${error.message}</div>`;
    return;
  }
  allProductsCache = products || [];

  container.innerHTML = `
    <div class="summary-grid">
      <div class="summary-card"><div class="label">Tổng sản phẩm</div><div class="value">${products.length}</div></div>
      <div class="summary-card"><div class="label">Đang hiển thị</div><div class="value">${products.filter(p => p.is_active).length}</div></div>
      <div class="summary-card"><div class="label">Đang ẩn</div><div class="value">${products.filter(p => !p.is_active).length}</div></div>
      <div class="summary-card"><div class="label">Hết hàng</div><div class="value">${products.filter(p => (p.stock ?? 0) <= 0).length}</div></div>
    </div>
    <div class="toolbar">
      <input type="text" id="productSearch" placeholder="Tìm sản phẩm..." oninput="renderProductsTable()" style="min-width:220px">
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="exportProductsCsv()">Xuất CSV</button>
        <button class="btn btn-primary" onclick="openProductForm()">+ Thêm sản phẩm</button>
      </div>
    </div>
    <div class="card"><div id="productsTableWrap"></div></div>
  `;
  renderProductsTable();
}

function renderProductsTable() {
  const search = (document.getElementById('productSearch')?.value || '').toLowerCase();
  const filtered = allProductsCache.filter(p => (p.name || '').toLowerCase().includes(search));
  const wrap = document.getElementById('productsTableWrap');
  if (!wrap) return;

  if (filtered.length === 0) {
    wrap.innerHTML = '<div class="empty-state">Chưa có sản phẩm nào</div>';
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead><tr><th>Ảnh</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Hiện trên web</th><th></th></tr></thead>
      <tbody>
        ${filtered.map(p => `
          <tr>
            <td><img src="${resolveImageUrl(p.image)}" onerror="this.src='https://via.placeholder.com/40'" style="width:40px;height:40px;object-fit:cover;border-radius:6px;"></td>
            <td style="max-width:280px;">${escapeHtml(p.name || '')}</td>
            <td>${escapeHtml(p.category_id || '')}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${p.stock ?? '-'}</td>
            <td>${p.is_active ? '✅' : '⛔'}</td>
            <td style="white-space:nowrap;">
              <button class="btn btn-outline btn-sm" onclick="toggleProductStatus('${p.id}', ${!p.is_active})">${p.is_active ? 'Ẩn' : 'Hiện'}</button>
              <button class="btn btn-outline btn-sm" onclick="openProductForm('${p.id}')">Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">Xóa</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function openProductForm(productId) {
  const p = productId ? allProductsCache.find(x => x.id === productId) : null;

  openModal(`
    <h3>${p ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
    <form id="productForm">
      <label>Tên sản phẩm</label>
      <input type="text" id="pf_name" required value="${p ? escapeHtml(p.name || '') : ''}">
      <div class="field-row">
        <div><label>Giá bán</label><input type="number" id="pf_price" required value="${p ? p.price : ''}"></div>
        <div><label>Giá gốc</label><input type="number" id="pf_original" value="${p && p.original_price ? p.original_price : ''}"></div>
      </div>
      <div class="field-row">
        <div><label>Danh mục (id)</label><input type="text" id="pf_category" required value="${p ? p.category_id : ''}"></div>
        <div><label>Tồn kho</label><input type="number" id="pf_stock" value="${p && p.stock != null ? p.stock : 100}"></div>
      </div>
      <label>Ảnh sản phẩm</label>
      <div class="image-upload-box">
        <img id="pf_image_preview" src="${resolveImageUrl(p ? p.image : '')}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
        <div class="image-upload-controls">
          <input type="file" id="pf_image_file" accept="image/png,image/jpeg,image/webp,image/gif">
          <div id="pf_image_status" class="upload-hint">Chọn ảnh từ máy tính — ảnh sẽ tự động tải lên.</div>
          <input type="text" id="pf_image" value="${p ? escapeHtml(p.image || '') : ''}" placeholder="Hoặc dán link ảnh trực tiếp (https://...)">
        </div>
      </div>
      <label>Nhãn (tag)</label>
      <input type="text" id="pf_tag" value="${p ? escapeHtml(p.tag || '') : ''}">
      <label><input type="checkbox" id="pf_active" ${!p || p.is_active ? 'checked' : ''} style="width:auto;display:inline-block;"> Hiện trên web</label>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Hủy</button>
        <button type="submit" class="btn btn-primary">Lưu</button>
      </div>
    </form>
  `);

  const fileInput = document.getElementById('pf_image_file');
  const statusEl = document.getElementById('pf_image_status');
  const submitBtn = document.querySelector('#productForm button[type="submit"]');

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    document.getElementById('pf_image_preview').src = URL.createObjectURL(file);
    statusEl.textContent = '⏳ Đang tải ảnh lên...';
    submitBtn.disabled = true;

    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : 'jpg';
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

      const { error: uploadError } = await sb.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicData } = sb.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
      document.getElementById('pf_image').value = publicData.publicUrl;
      statusEl.textContent = '✅ Tải ảnh lên thành công.';
    } catch (err) {
      statusEl.textContent = '❌ Lỗi tải ảnh: ' + (err.message || err);
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('pf_name').value.trim(),
      price: parseFloat(document.getElementById('pf_price').value) || 0,
      original_price: parseFloat(document.getElementById('pf_original').value) || null,
      category_id: document.getElementById('pf_category').value.trim(),
      stock: parseInt(document.getElementById('pf_stock').value) || 0,
      image: document.getElementById('pf_image').value.trim(),
      tag: document.getElementById('pf_tag').value.trim(),
      is_active: document.getElementById('pf_active').checked
    };

    let error;
    if (p) {
      ({ error } = await sb.from('products').update(payload).eq('id', p.id));
    } else {
      ({ error } = await sb.from('products').insert(payload));
    }

    if (error) {
      alert('Lỗi lưu sản phẩm: ' + error.message);
      return;
    }
    closeModal();
    loadProducts();
  });
}

async function toggleProductStatus(productId, isActive) {
  const { error } = await sb.from('products').update({ is_active: isActive }).eq('id', productId);
  if (error) {
    alert('Lỗi cập nhật trạng thái sản phẩm: ' + error.message);
    return;
  }
  renderProductsTable();
}

async function deleteProduct(productId) {
  if (!confirm('Xóa sản phẩm này? Hành động không thể hoàn tác.')) return;
  const { error } = await sb.from('products').delete().eq('id', productId);
  if (error) {
    alert('Lỗi xóa: ' + error.message);
    return;
  }
  loadProducts();
}

// ========================= VISITORS =========================
async function loadVisitors() {
  const container = document.getElementById('view-visitors');
  container.innerHTML = '<div class="loading-spin">Đang tải dữ liệu truy cập...</div>';

  const since14 = new Date();
  since14.setDate(since14.getDate() - 13);
  since14.setHours(0, 0, 0, 0);

  const { data: events, error } = await sb
    .from('site_events')
    .select('*')
    .gte('created_at', since14.toISOString())
    .order('created_at', { ascending: false })
    .limit(2000);

  if (error) {
    container.innerHTML = `<div class="empty-state">Lỗi tải dữ liệu: ${error.message}</div>`;
    return;
  }

  const pageViews = events.filter(e => e.event_type === 'page_view');
  const addToCarts = events.filter(e => e.event_type === 'add_to_cart');
  const orderPlaced = events.filter(e => e.event_type === 'order_placed');
  const uniqueSessions = new Set(events.map(e => e.session_id));

  const dayLabels = [];
  const dayViews = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dEnd = new Date(d);
    dEnd.setDate(dEnd.getDate() + 1);
    dayLabels.push(`${d.getDate()}/${d.getMonth() + 1}`);
    dayViews.push(pageViews.filter(e => new Date(e.created_at) >= d && new Date(e.created_at) < dEnd).length);
  }

  const pageMap = {};
  pageViews.forEach(e => { pageMap[e.page || 'khác'] = (pageMap[e.page || 'khác'] || 0) + 1; });
  const topPages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  container.innerHTML = `
    <div class="summary-grid">
      <div class="stat-card"><div class="label">Lượt xem trang (14 ngày)</div><div class="value">${pageViews.length}</div></div>
      <div class="stat-card"><div class="label">Phiên truy cập (14 ngày)</div><div class="value">${uniqueSessions.size}</div></div>
      <div class="stat-card"><div class="label">Lượt thêm giỏ hàng</div><div class="value">${addToCarts.length}</div></div>
      <div class="stat-card"><div class="label">Đơn hàng đã đặt</div><div class="value">${orderPlaced.length}</div></div>
    </div>

    <div class="card">
      <h3>Lượt truy cập theo ngày</h3>
      <canvas id="visitsChartCanvas" height="90"></canvas>
    </div>

    <div class="card">
      <h3>Trang được xem nhiều nhất</h3>
      ${topPages.length === 0 ? '<div class="empty-state">Chưa có dữ liệu</div>' : `
      <table>
        <thead><tr><th>Trang</th><th>Lượt xem</th></tr></thead>
        <tbody>${topPages.map(([page, c]) => `<tr><td>${escapeHtml(page)}</td><td>${c}</td></tr>`).join('')}</tbody>
      </table>`}
    </div>

    <div class="card">
      <h3>Hoạt động gần đây</h3>
      ${events.length === 0 ? '<div class="empty-state">Chưa có hoạt động</div>' : `
      <table>
        <thead><tr><th>Thời gian</th><th>Loại</th><th>Trang</th></tr></thead>
        <tbody>
          ${events.slice(0, 50).map(e => `<tr><td>${formatDateTime(e.created_at)}</td><td>${escapeHtml(e.event_type || '')}</td><td>${escapeHtml(e.page || '-')}</td></tr>`).join('')}
        </tbody>
      </table>`}
    </div>
  `;

  const ctx = document.getElementById('visitsChartCanvas');
  if (visitsChart) visitsChart.destroy();
  if (ctx) {
    visitsChart = new Chart(ctx, {
      type: 'bar',
      data: { labels: dayLabels, datasets: [{ label: 'Lượt xem', data: dayViews, backgroundColor: '#43a047' }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }
}

// ========================= MODAL HELPERS =========================
// ========================= COUPONS =========================
async function loadCoupons() {
  const container = document.getElementById('view-coupons');
  container.innerHTML = '<div class="loading-spin">Đang tải mã giảm giá...</div>';

  const { data: coupons, error } = await sb.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) { container.innerHTML = `<div class="empty-state">Lỗi: ${error.message}</div>`; return; }

  container.innerHTML = `
    <div class="toolbar">
      <div style="flex:1;"></div>
      <button class="btn btn-primary" onclick="openCouponForm()">+ Tạo mã mới</button>
    </div>
    <div class="card"><div id="couponsTableWrap"></div></div>
  `;
  window.__couponsCache = coupons || [];
  renderCouponsTable();
}

function renderCouponsTable() {
  const coupons = window.__couponsCache || [];
  const wrap = document.getElementById('couponsTableWrap');
  if (!wrap) return;
  if (coupons.length === 0) {
    wrap.innerHTML = '<div class="empty-state">Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên!</div>';
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr><th>Mã</th><th>Loại</th><th>Giá trị</th><th>Đơn tối thiểu</th><th>Sử dụng</th><th>Hết hạn</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>
        ${coupons.map(c => `
          <tr>
            <td><strong style="font-family:monospace;font-size:14px;">${escapeHtml(c.code)}</strong></td>
            <td>${c.discount_type === 'percent' ? 'Phần trăm' : 'Số tiền'}</td>
            <td style="color:var(--danger);font-weight:700;">${c.discount_type === 'percent' ? `-${c.discount_value}%` : `-${Number(c.discount_value).toLocaleString('vi-VN')}đ`}</td>
            <td>${c.min_order_value ? Number(c.min_order_value).toLocaleString('vi-VN') + 'đ' : 'Không'}</td>
            <td>${c.used_count || 0}${c.usage_limit ? ' / ' + c.usage_limit : ''}</td>
            <td>${c.expires_at ? new Date(c.expires_at).toLocaleDateString('vi-VN') : 'Không'}</td>
            <td><span class="badge ${c.is_active ? 'badge-confirmed' : 'badge-cancelled'}">${c.is_active ? 'Hoạt động' : 'Dừng'}</span></td>
            <td style="white-space:nowrap;">
              <button class="btn btn-outline btn-sm" onclick="toggleCouponStatus('${c.id}', ${!c.is_active})">${c.is_active ? 'Dừng' : 'Kích hoạt'}</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCoupon('${c.id}')">Xóa</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

function openCouponForm() {
  openModal(`
    <h3>Tạo mã giảm giá mới</h3>
    <form id="couponForm">
      <label>Mã (viết in hoa, không dấu)</label>
      <input type="text" id="cf_code" required placeholder="VD: GIAM50K, SALE20" style="text-transform:uppercase;">
      <div class="field-row">
        <div>
          <label>Loại giảm</label>
          <select id="cf_type">
            <option value="fixed">Số tiền cụ thể (đ)</option>
            <option value="percent">Phần trăm (%)</option>
          </select>
        </div>
        <div>
          <label>Giá trị giảm</label>
          <input type="number" id="cf_value" required min="1" placeholder="VD: 50000 hoặc 10">
        </div>
      </div>
      <div class="field-row">
        <div>
          <label>Đơn hàng tối thiểu (đ)</label>
          <input type="number" id="cf_min" min="0" placeholder="0 = không giới hạn">
        </div>
        <div>
          <label>Giới hạn sử dụng</label>
          <input type="number" id="cf_limit" min="1" placeholder="Để trống = không giới hạn">
        </div>
      </div>
      <label>Ngày hết hạn</label>
      <input type="date" id="cf_expires">
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Hủy</button>
        <button type="submit" class="btn btn-primary">Tạo mã</button>
      </div>
    </form>
  `);
  document.getElementById('cf_code').addEventListener('input', function() {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  });
  document.getElementById('couponForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      code: document.getElementById('cf_code').value.trim().toUpperCase(),
      discount_type: document.getElementById('cf_type').value,
      discount_value: parseFloat(document.getElementById('cf_value').value) || 0,
      min_order_value: parseFloat(document.getElementById('cf_min').value) || 0,
      usage_limit: parseInt(document.getElementById('cf_limit').value) || null,
      expires_at: document.getElementById('cf_expires').value || null,
      is_active: true
    };
    const { error } = await sb.from('coupons').insert(payload);
    if (error) { alert('Lỗi: ' + error.message); return; }
    closeModal();
    loadCoupons();
  });
}

async function toggleCouponStatus(id, isActive) {
  await sb.from('coupons').update({ is_active: isActive }).eq('id', id);
  loadCoupons();
}

async function deleteCoupon(id) {
  if (!confirm('Xóa mã giảm giá này?')) return;
  await sb.from('coupons').delete().eq('id', id);
  loadCoupons();
}

// ========================= ADMIN REVIEWS =========================
async function loadAdminReviews() {
  const container = document.getElementById('view-reviews');
  container.innerHTML = '<div class="loading-spin">Đang tải đánh giá...</div>';

  const { data: reviews, error } = await sb.from('reviews').select('*, products(name)').order('created_at', { ascending: false });
  if (error) { container.innerHTML = `<div class="empty-state">Lỗi: ${error.message}</div>`; return; }

  const all = reviews || [];
  const pending = all.filter(r => r.status === 'pending').length;

  container.innerHTML = `
    <div class="summary-grid" style="margin-bottom:20px;">
      <div class="summary-card"><div class="label">Tổng đánh giá</div><div class="value">${all.length}</div></div>
      <div class="summary-card"><div class="label">Chờ duyệt</div><div class="value danger">${pending}</div></div>
      <div class="summary-card"><div class="label">Đã duyệt</div><div class="value">${all.filter(r => r.status === 'approved').length}</div></div>
    </div>
    <div class="toolbar">
      <select id="reviewStatusFilter" onchange="renderReviewsTable()">
        <option value="">Tất cả</option>
        <option value="pending">Chờ duyệt</option>
        <option value="approved">Đã duyệt</option>
        <option value="rejected">Đã từ chối</option>
      </select>
    </div>
    <div class="card"><div id="reviewsTableWrap"></div></div>`;
  window.__reviewsCache = all;
  renderReviewsTable();
}

function renderReviewsTable() {
  const filter = document.getElementById('reviewStatusFilter')?.value || '';
  const reviews = (window.__reviewsCache || []).filter(r => !filter || r.status === filter);
  const wrap = document.getElementById('reviewsTableWrap');
  if (!wrap) return;
  if (reviews.length === 0) { wrap.innerHTML = '<div class="empty-state">Không có đánh giá nào</div>'; return; }
  const statusMap = { pending: '⏳ Chờ duyệt', approved: '✅ Đã duyệt', rejected: '❌ Đã từ chối' };
  wrap.innerHTML = `
    <table>
      <thead><tr><th>Sản phẩm</th><th>Người đánh giá</th><th>Số sao</th><th>Nội dung</th><th>Ngày</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>
        ${reviews.map(r => `
          <tr>
            <td style="max-width:150px;font-size:12px;">${escapeHtml(r.products?.name || 'Không rõ')}</td>
            <td>${escapeHtml(r.customer_name)}</td>
            <td style="color:#FFC107;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</td>
            <td style="max-width:220px;font-size:13px;">${escapeHtml(r.comment || '')}</td>
            <td style="white-space:nowrap;font-size:12px;">${formatDateTime(r.created_at)}</td>
            <td>${statusMap[r.status] || r.status}</td>
            <td style="white-space:nowrap;">
              ${r.status !== 'approved' ? `<button class="btn btn-outline btn-sm" style="color:var(--success)" onclick="setReviewStatus('${r.id}', 'approved')">Duyệt</button>` : ''}
              ${r.status !== 'rejected' ? `<button class="btn btn-danger btn-sm" onclick="setReviewStatus('${r.id}', 'rejected')">Từ chối</button>` : ''}
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

async function setReviewStatus(id, status) {
  const { error } = await sb.from('reviews').update({ status }).eq('id', id);
  if (error) { alert('Lỗi: ' + error.message); return; }
  const r = (window.__reviewsCache || []).find(x => x.id === id);
  if (r) r.status = status;
  renderReviewsTable();
}

function openModal(html) {
  document.getElementById('modalBoxContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

function exportOverviewCsv() {
  const orders = window.__ordersCache || [];
  const rows = [
    ['Mã đơn', 'Khách hàng', 'SĐT', 'Tổng tiền', 'Trạng thái', 'Ngày đặt'],
    ...orders.map(order => [
      order.order_code || '',
      order.customer_name || '',
      order.customer_phone || '',
      Number(order.total || 0),
      getStatusLabel(order.status),
      formatDateTime(order.created_at)
    ])
  ];
  downloadCsv('bao-cao-don-hang.csv', rows);
}

function exportProductsCsv() {
  const rows = [
    ['Tên sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Trạng thái'],
    ...allProductsCache.map(product => [
      product.name || '',
      product.category_id || '',
      Number(product.price || 0),
      Number(product.stock || 0),
      product.is_active ? 'Hiển thị' : 'Ẩn'
    ])
  ];
  downloadCsv('bao-cao-san-pham.csv', rows);
}

async function loadContent() {
  const container = document.getElementById('view-content');
  const settings = getContentSettings();

  container.innerHTML = `
    <div class="content-grid">
      <div class="card">
        <h3>Thông tin cửa hàng</h3>
        <form id="contentForm">
          <div class="setting-group">
            <label>Tên cửa hàng</label>
            <input type="text" id="content_name" value="${escapeHtml(settings.name)}">
          </div>
          <div class="setting-group">
            <label>Mô tả ngắn</label>
            <input type="text" id="content_description" value="${escapeHtml(settings.description)}">
          </div>
          <div class="setting-group">
            <label>Hotline</label>
            <input type="text" id="content_hotline" value="${escapeHtml(settings.hotline)}">
          </div>
          <div class="setting-group">
            <label>Địa chỉ</label>
            <textarea id="content_address">${escapeHtml(settings.address)}</textarea>
          </div>
          <div class="setting-group">
            <label>Giờ làm việc</label>
            <input type="text" id="content_hours" value="${escapeHtml(settings.workingHours)}">
          </div>
          <div class="setting-group">
            <label>Thời gian giao hàng</label>
            <input type="text" id="content_delivery" value="${escapeHtml(settings.deliveryTime)}">
          </div>
          <div class="settings-actions">
            <button type="submit" class="btn btn-primary">Lưu cài đặt</button>
            <button type="button" class="btn btn-outline" onclick="loadContent()">Tải lại</button>
          </div>
        </form>
      </div>
      <div class="card">
        <h3>Tổng quan nội dung</h3>
        <div class="summary-pill">Danh mục: ${settings.categoryCount}</div>
        <div class="summary-pill">Banner: ${settings.bannerCount}</div>
        <div class="summary-pill">Trạng thái: Đang hoạt động</div>
        <div class="mini-list" style="margin-top:16px;">
          <div class="mini-item"><div><strong>Khuyến nghị</strong><div class="mini-text">Cập nhật banner và tin tức thường xuyên để tăng doanh thu.</div></div></div>
          <div class="mini-item"><div><strong>Gợi ý</strong><div class="mini-text">Theo dõi các sản phẩm sắp hết hàng và ưu tiên bán chạy.</div></div></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('contentForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const values = {
      name: document.getElementById('content_name').value.trim(),
      description: document.getElementById('content_description').value.trim(),
      hotline: document.getElementById('content_hotline').value.trim(),
      address: document.getElementById('content_address').value.trim(),
      workingHours: document.getElementById('content_hours').value.trim(),
      deliveryTime: document.getElementById('content_delivery').value.trim()
    };
    const currentSettings = getContentSettings();
    const nextSettings = { ...currentSettings, ...values };
    saveContentSettings(nextSettings);
    alert('Đã lưu cài đặt cửa hàng.');
    loadContent();
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

if (!window.__adminInit) {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeModal();
    });
  }
  window.__adminInit = true;
}

initAuth();
