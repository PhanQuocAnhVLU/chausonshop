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
const VIEW_TITLES = { overview: 'Tổng quan', orders: 'Đơn hàng', products: 'Sản phẩm', visitors: 'Khách truy cập' };

function switchView(view) {
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.admin-view').forEach(el => el.classList.toggle('active', el.id === 'view-' + view));
  document.getElementById('pageTitle').textContent = VIEW_TITLES[view] || '';

  if (view === 'overview') loadOverview();
  if (view === 'orders') loadOrders();
  if (view === 'products') loadProducts();
  if (view === 'visitors') loadVisitors();
}

// ========================= OVERVIEW =========================
async function loadOverview() {
  const container = document.getElementById('view-overview');
  container.innerHTML = '<div class="loading-spin">Đang tải dữ liệu...</div>';

  const since14 = new Date();
  since14.setDate(since14.getDate() - 13);
  since14.setHours(0, 0, 0, 0);

  const [ordersRes, itemsRes, eventsRes] = await Promise.all([
    sb.from('orders').select('*').order('created_at', { ascending: false }),
    sb.from('order_items').select('product_name, qty, price'),
    sb.from('site_events').select('event_type, session_id, created_at').gte('created_at', since14.toISOString())
  ]);

  const orders = ordersRes.data || [];
  const items = itemsRes.data || [];
  const events = eventsRes.data || [];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter(o => new Date(o.created_at) >= today);
  const revenueTotal = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const uniqueSessions = new Set(events.filter(e => e.event_type === 'page_view').map(e => e.session_id)).size;

  // Top products by qty sold
  const productMap = {};
  items.forEach(it => {
    productMap[it.product_name] = (productMap[it.product_name] || 0) + it.qty;
  });
  const topProducts = Object.entries(productMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Revenue by day (last 14 days)
  const dayLabels = [];
  const dayRevenue = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dEnd = new Date(d); dEnd.setDate(dEnd.getDate() + 1);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const sum = orders
      .filter(o => o.status !== 'cancelled' && new Date(o.created_at) >= d && new Date(o.created_at) < dEnd)
      .reduce((s, o) => s + Number(o.total), 0);
    dayLabels.push(label);
    dayRevenue.push(sum);
  }

  container.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="label">Đơn hàng hôm nay</div><div class="value">${ordersToday.length}</div></div>
      <div class="stat-card"><div class="label">Tổng doanh thu (trừ đơn hủy)</div><div class="value">${revenueTotal.toLocaleString('vi-VN')}đ</div></div>
      <div class="stat-card"><div class="label">Đơn chờ xác nhận</div><div class="value danger">${pendingCount}</div></div>
      <div class="stat-card"><div class="label">Khách truy cập (14 ngày)</div><div class="value">${uniqueSessions}</div></div>
    </div>

    <div class="card">
      <h3>Doanh thu 14 ngày gần nhất</h3>
      <canvas id="revenueChartCanvas" height="90"></canvas>
    </div>

    <div class="card">
      <h3>Sản phẩm bán chạy nhất</h3>
      ${topProducts.length === 0 ? '<div class="empty-state">Chưa có dữ liệu đơn hàng</div>' : `
      <table>
        <thead><tr><th>Sản phẩm</th><th>Số lượng đã bán</th></tr></thead>
        <tbody>
          ${topProducts.map(([name, qty]) => `<tr><td>${name}</td><td>${qty}</td></tr>`).join('')}
        </tbody>
      </table>`}
    </div>
  `;

  const ctx = document.getElementById('revenueChartCanvas');
  if (revenueChart) revenueChart.destroy();
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

// ========================= ORDERS =========================
async function loadOrders() {
  const container = document.getElementById('view-orders');
  container.innerHTML = '<div class="loading-spin">Đang tải đơn hàng...</div>';

  const { data: orders, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error) {
    container.innerHTML = `<div class="empty-state">Lỗi tải đơn hàng: ${error.message}</div>`;
    return;
  }

  container.innerHTML = `
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
      o.customer_name.toLowerCase().includes(search) ||
      o.customer_phone.includes(search) ||
      o.order_code.toLowerCase().includes(search)
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
            <td>${o.order_code}</td>
            <td>${o.customer_name}</td>
            <td>${o.customer_phone}</td>
            <td>${Number(o.total).toLocaleString('vi-VN')}đ</td>
            <td>${new Date(o.created_at).toLocaleString('vi-VN')}</td>
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
}

async function viewOrderDetail(orderId) {
  const { data: items, error } = await sb.from('order_items').select('*').eq('order_id', orderId);
  const o = (window.__ordersCache || []).find(x => x.id === orderId);
  if (!o) return;

  const itemsHtml = error
    ? `<p>Lỗi tải chi tiết: ${error.message}</p>`
    : items.map(it => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;">
        <span>${it.product_name} × ${it.qty}</span><span>${Number(it.price * it.qty).toLocaleString('vi-VN')}đ</span>
      </div>`).join('');

  openModal(`
    <h3>Đơn hàng ${o.order_code}</h3>
    <p style="font-size:13.5px;line-height:1.8;">
      <b>Khách:</b> ${o.customer_name} — ${o.customer_phone}<br>
      <b>Địa chỉ:</b> ${o.customer_address}<br>
      ${o.customer_email ? `<b>Email:</b> ${o.customer_email}<br>` : ''}
      ${o.note ? `<b>Ghi chú:</b> ${o.note}<br>` : ''}
      <b>Thanh toán:</b> ${o.payment_method}
    </p>
    <hr style="margin:14px 0;border:none;border-top:1px solid #eee;">
    ${itemsHtml}
    <hr style="margin:14px 0;border:none;border-top:1px solid #eee;">
    <div style="display:flex;justify-content:space-between;font-weight:700;">
      <span>Tổng cộng</span><span>${Number(o.total).toLocaleString('vi-VN')}đ</span>
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
  allProductsCache = products;

  container.innerHTML = `
    <div class="toolbar">
      <input type="text" id="productSearch" placeholder="Tìm sản phẩm..." oninput="renderProductsTable()" style="min-width:220px">
      <button class="btn btn-primary" onclick="openProductForm()">+ Thêm sản phẩm</button>
    </div>
    <div class="card"><div id="productsTableWrap"></div></div>
  `;
  renderProductsTable();
}

function renderProductsTable() {
  const search = (document.getElementById('productSearch')?.value || '').toLowerCase();
  const filtered = allProductsCache.filter(p => p.name.toLowerCase().includes(search));
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
            <td><img src="../${p.image}" onerror="this.src='https://via.placeholder.com/40'" style="width:40px;height:40px;object-fit:cover;border-radius:6px;"></td>
            <td style="max-width:280px;">${p.name}</td>
            <td>${p.category_id}</td>
            <td>${Number(p.price).toLocaleString('vi-VN')}đ</td>
            <td>${p.stock ?? '-'}</td>
            <td>${p.is_active ? '✅' : '⛔'}</td>
            <td style="white-space:nowrap;">
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
      <input type="text" id="pf_name" required value="${p ? escapeHtml(p.name) : ''}">
      <div class="field-row">
        <div><label>Giá bán</label><input type="number" id="pf_price" required value="${p ? p.price : ''}"></div>
        <div><label>Giá gốc</label><input type="number" id="pf_original" value="${p && p.original_price ? p.original_price : ''}"></div>
      </div>
      <div class="field-row">
        <div><label>Danh mục (id)</label><input type="text" id="pf_category" required value="${p ? p.category_id : ''}"></div>
        <div><label>Tồn kho</label><input type="number" id="pf_stock" value="${p && p.stock != null ? p.stock : 100}"></div>
      </div>
      <label>Đường dẫn ảnh</label>
      <input type="text" id="pf_image" value="${p ? escapeHtml(p.image || '') : ''}" placeholder="images/ten-anh.jpg">
      <label>Nhãn (tag)</label>
      <input type="text" id="pf_tag" value="${p ? escapeHtml(p.tag || '') : ''}">
      <label><input type="checkbox" id="pf_active" ${!p || p.is_active ? 'checked' : ''} style="width:auto;display:inline-block;"> Hiện trên web</label>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Hủy</button>
        <button type="submit" class="btn btn-primary">Lưu</button>
      </div>
    </form>
  `);

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

  // Views by day
  const dayLabels = [];
  const dayViews = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
    const dEnd = new Date(d); dEnd.setDate(dEnd.getDate() + 1);
    dayLabels.push(`${d.getDate()}/${d.getMonth() + 1}`);
    dayViews.push(pageViews.filter(e => new Date(e.created_at) >= d && new Date(e.created_at) < dEnd).length);
  }

  // Top pages
  const pageMap = {};
  pageViews.forEach(e => { pageMap[e.page || 'khác'] = (pageMap[e.page || 'khác'] || 0) + 1; });
  const topPages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  container.innerHTML = `
    <div class="stat-grid">
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
        <tbody>${topPages.map(([page, c]) => `<tr><td>${page}</td><td>${c}</td></tr>`).join('')}</tbody>
      </table>`}
    </div>

    <div class="card">
      <h3>Hoạt động gần đây</h3>
      ${events.length === 0 ? '<div class="empty-state">Chưa có hoạt động</div>' : `
      <table>
        <thead><tr><th>Thời gian</th><th>Loại</th><th>Trang</th></tr></thead>
        <tbody>
          ${events.slice(0, 50).map(e => `<tr><td>${new Date(e.created_at).toLocaleString('vi-VN')}</td><td>${e.event_type}</td><td>${e.page || '-'}</td></tr>`).join('')}
        </tbody>
      </table>`}
    </div>
  `;

  const ctx = document.getElementById('visitsChartCanvas');
  if (visitsChart) visitsChart.destroy();
  visitsChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: dayLabels, datasets: [{ label: 'Lượt xem', data: dayViews, backgroundColor: '#43a047' }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

// ========================= MODAL HELPERS =========================
function openModal(html) {
  document.getElementById('modalBoxContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

initAuth();
