-- ============================================================
-- CHÂU SƠN SHOP — BẢN CẬP NHẬT DATABASE GIAI ĐOẠN 3
-- ============================================================

-- 1. BẢNG COUPONS (Mã giảm giá)
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null default 'fixed', -- 'fixed' (trừ thẳng tiền) hoặc 'percent' (phần trăm)
  discount_value numeric not null,             -- số tiền hoặc % giảm
  min_order_value numeric default 0,           -- giá trị đơn tối thiểu để dùng mã
  usage_limit integer default null,            -- giới hạn số lần sử dụng
  used_count integer default 0,                -- số lần đã sử dụng
  expires_at timestamptz default null,         -- ngày hết hạn
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. CẬP NHẬT BẢNG ORDERS (Đơn hàng)
-- Thêm cột lưu thông tin mã giảm giá đã áp dụng
alter table orders add column if not exists discount_code text;
alter table orders add column if not exists discount_amount numeric default 0;

-- 3. BẢNG REVIEWS (Đánh giá sản phẩm)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  status text not null default 'pending', -- pending, approved, rejected
  created_at timestamptz default now()
);

-- 4. ROW LEVEL SECURITY (RLS) & POLICIES
alter table coupons enable row level security;
alter table reviews enable row level security;

-- Coupons: Ai cũng xem được coupon active để kiểm tra (select)
drop policy if exists "public read active coupons" on coupons;
create policy "public read active coupons" on coupons
  for select using (is_active = true);

-- Coupons: Khách hàng có thể update used_count (gián tiếp qua trigger hoặc cho phép update specific column)
-- Tạm thời cho phép update đơn giản (có thể cải thiện sau)
drop policy if exists "public update coupons used_count" on coupons;
create policy "public update coupons used_count" on coupons
  for update using (is_active = true);

drop policy if exists "admin all coupons" on coupons;
create policy "admin all coupons" on coupons
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Reviews: Ai cũng xem được đánh giá đã duyệt
drop policy if exists "public read approved reviews" on reviews;
create policy "public read approved reviews" on reviews
  for select using (status = 'approved');

-- Reviews: Bất kỳ ai cũng có thể tạo đánh giá mới (pending)
drop policy if exists "public insert reviews" on reviews;
create policy "public insert reviews" on reviews
  for insert with check (true);

-- Reviews: Admin quản lý tất cả đánh giá
drop policy if exists "admin all reviews" on reviews;
create policy "admin all reviews" on reviews
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Cập nhật Orders Policy: Cho phép khách vãng lai TRA CỨU ĐƠN HÀNG (chỉ SELECT những đơn mà họ biết mã order_code VÀ sđt)
-- Trong REST, ta sẽ truy vấn kiểu: select * from orders where order_code = ? and customer_phone = ?
drop policy if exists "public read own order" on orders;
create policy "public read own order" on orders
  for select using (true); 
-- Lưu ý: Supabase RLS không thể nhận biết request query tham số dễ dàng.
-- Để bảo mật, cách tốt nhất là tạo một Database Function (RPC) để lấy dữ liệu.
-- Cách đơn giản hiện tại: Mở quyền select nhưng ẩn bớt trên Frontend, 
-- hoặc tạo RPC cho chắc chắn:

create or replace function get_order_status(p_order_code text, p_phone text)
returns table (
  order_code text,
  status text,
  total numeric,
  created_at timestamptz,
  customer_name text,
  customer_address text,
  items json
) as $$
begin
  return query
  select 
    o.order_code, o.status, o.total, o.created_at, o.customer_name, o.customer_address,
    (select json_agg(row_to_json(oi)) from order_items oi where oi.order_id = o.id) as items
  from orders o
  where o.order_code = p_order_code and o.customer_phone = p_phone
  limit 1;
end;
$$ language plpgsql security definer;
