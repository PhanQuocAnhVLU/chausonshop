-- ============================================================
-- CHÂU SƠN SHOP — TẠO KHO LƯU ẢNH SẢN PHẨM (SUPABASE STORAGE)
-- Chạy file này TRONG Supabase SQL Editor (Project của bạn)
-- Chỉ cần chạy 1 LẦN DUY NHẤT.
-- ============================================================

-- 1) Tạo bucket "product-images" (công khai để ảnh hiển thị được lên web)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2) Ai cũng xem được ảnh (khách hàng xem sản phẩm trên web)
drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

-- 3) Chỉ admin (đã đăng nhập vào trang quản trị) mới được tải ảnh lên
drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- 4) Chỉ admin mới được thay/sửa ảnh đã tải lên
drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- 5) Chỉ admin mới được xóa ảnh
drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');
