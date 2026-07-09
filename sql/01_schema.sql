-- ============================================================
-- CHÂU SƠN SHOP — SCHEMA CHO HỆ THỐNG QUẢN LÝ (ADMIN DASHBOARD)
-- Chạy file này TRƯỚC trong Supabase SQL Editor
-- ============================================================

create extension if not exists pgcrypto;

-- ============ 1. PRODUCTS (sản phẩm) ============
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer,                 -- id cũ trong data.js (để đối chiếu)
  category_id text not null,
  name text not null,
  price numeric not null default 0,
  original_price numeric,
  image text,
  badge text,
  tag text,
  rating numeric default 5,
  reviews integer default 0,
  sold integer default 0,
  is_new boolean default false,
  is_sale boolean default false,
  is_best_seller boolean default false,
  is_active boolean default true,    -- ẩn/hiện sản phẩm trên web
  stock integer default 100,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ 2. ORDERS (đơn hàng) ============
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text not null,
  note text,
  payment_method text default 'COD',
  status text not null default 'pending',   -- pending | confirmed | shipping | completed | cancelled
  subtotal numeric not null default 0,
  shipping_fee numeric not null default 0,
  total numeric not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,   -- lưu snapshot tên/giá tại thời điểm mua
  price numeric not null,
  qty integer not null default 1,
  image text
);

-- ============ 3. SITE_EVENTS (theo dõi hoạt động / khách truy cập) ============
create table if not exists site_events (
  id bigint generated always as identity primary key,
  event_type text not null,   -- page_view | add_to_cart | search | checkout_start | order_placed
  page text,
  session_id text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- ============ INDEXES ============
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_orders_created on orders(created_at);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_site_events_created on site_events(created_at);
create index if not exists idx_site_events_type on site_events(event_type);
create index if not exists idx_site_events_session on site_events(session_id);

-- ============ AUTO updated_at ============
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();

-- ============ ROW LEVEL SECURITY ============
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table site_events enable row level security;

-- Products: ai cũng xem được sản phẩm đang active; chỉ admin (đã đăng nhập) mới sửa/xóa/thêm
drop policy if exists "public read active products" on products;
create policy "public read active products" on products
  for select using (is_active = true);

drop policy if exists "admin read all products" on products;
create policy "admin read all products" on products
  for select using (auth.role() = 'authenticated');

drop policy if exists "admin write products" on products;
create policy "admin write products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Orders: khách vãng lai đặt được đơn (insert), chỉ admin xem/sửa
drop policy if exists "public create orders" on orders;
create policy "public create orders" on orders
  for insert with check (true);

drop policy if exists "admin read orders" on orders;
create policy "admin read orders" on orders
  for select using (auth.role() = 'authenticated');

drop policy if exists "admin update orders" on orders;
create policy "admin update orders" on orders
  for update using (auth.role() = 'authenticated');

drop policy if exists "admin delete orders" on orders;
create policy "admin delete orders" on orders
  for delete using (auth.role() = 'authenticated');

-- Order items: khách tạo được (đi kèm với đơn hàng họ vừa tạo), chỉ admin xem
drop policy if exists "public create order items" on order_items;
create policy "public create order items" on order_items
  for insert with check (true);

drop policy if exists "admin read order items" on order_items;
create policy "admin read order items" on order_items
  for select using (auth.role() = 'authenticated');

-- Site events: ai cũng ghi được (tracking ẩn danh), chỉ admin xem
drop policy if exists "public log events" on site_events;
create policy "public log events" on site_events
  for insert with check (true);

drop policy if exists "admin read events" on site_events;
create policy "admin read events" on site_events
  for select using (auth.role() = 'authenticated');
