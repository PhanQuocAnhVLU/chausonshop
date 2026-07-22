-- ============================================================
-- TẠO DATABASE WEBHOOK ĐỂ TỰ ĐỘNG GỬI EMAIL KHI CÓ ĐƠN MỚI
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- Bật extension HTTP (cần để gọi webhook từ trigger)
create extension if not exists "http" with schema "extensions";
create extension if not exists "pg_net" with schema "extensions";

-- Tạo function trigger gọi Edge Function khi insert đơn hàng mới
create or replace function notify_new_order_trigger()
returns trigger as $$
declare
  edge_function_url text;
  request_id bigint;
begin
  -- URL của Edge Function (thay byhddpyoctjabtcqtygu bằng project ref thực tế nếu khác)
  edge_function_url := 'https://byhddpyoctjabtcqtygu.supabase.co/functions/v1/notify-new-order';

  -- Gọi Edge Function bất đồng bộ qua pg_net
  select net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5aGRkcHlvY3RqYWJ0Y3F0eWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjU0NTAsImV4cCI6MjA2NjM0MTQ1MH0.vyCCqGwkNsMGZlT9w8nBCFiBFiUGSoROuqY2uTfYR20'
    ),
    body := row_to_json(NEW)::jsonb
  ) into request_id;

  return NEW;
end;
$$ language plpgsql security definer;

-- Xoá trigger cũ nếu có
drop trigger if exists on_new_order_notify on orders;

-- Tạo trigger: chạy sau khi INSERT vào bảng orders
create trigger on_new_order_notify
  after insert on orders
  for each row
  execute function notify_new_order_trigger();
