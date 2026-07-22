-- ============================================================
-- BẢNG TRACKING ĐƠN HÀNG — Lưu lịch sử cập nhật vị trí & trạng thái
-- ============================================================

create table if not exists order_tracking (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  order_code text not null,
  status text not null,
  note text,
  location text,
  created_at timestamptz default now()
);

-- Index để query nhanh theo order_code
create index if not exists idx_order_tracking_order_code on order_tracking(order_code);
create index if not exists idx_order_tracking_order_id on order_tracking(order_id);

-- RLS
alter table order_tracking enable row level security;

-- Khách hàng có thể xem lịch sử tracking theo order_code (không cần đăng nhập)
drop policy if exists "public read tracking" on order_tracking;
create policy "public read tracking" on order_tracking
  for select using (true);

-- Chỉ admin (authenticated) mới được thêm tracking update
drop policy if exists "admin insert tracking" on order_tracking;
create policy "admin insert tracking" on order_tracking
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "admin delete tracking" on order_tracking;
create policy "admin delete tracking" on order_tracking
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- TRIGGER: Tự động tạo bản ghi tracking khi status đơn thay đổi
-- ============================================================
create or replace function auto_log_order_tracking()
returns trigger as $$
declare
  status_note text;
begin
  -- Ghi chú tự động theo trạng thái
  case NEW.status
    when 'pending'   then status_note := 'Đơn hàng đã được đặt thành công, đang chờ xác nhận.';
    when 'confirmed' then status_note := 'Shop đã xác nhận đơn hàng và đang chuẩn bị hàng.';
    when 'shipping'  then status_note := 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển.';
    when 'completed' then status_note := 'Giao hàng thành công. Cảm ơn bạn đã mua sắm tại Châu Sơn Shop!';
    when 'cancelled' then status_note := 'Đơn hàng đã bị hủy.';
    else status_note := 'Trạng thái đơn hàng đã được cập nhật.';
  end case;

  -- Chỉ log khi status thực sự thay đổi
  if (TG_OP = 'INSERT') or (OLD.status is distinct from NEW.status) then
    insert into order_tracking (order_id, order_code, status, note, location)
    values (NEW.id, NEW.order_code, NEW.status, status_note, null);
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Gắn trigger vào bảng orders
drop trigger if exists on_order_status_change on orders;
create trigger on_order_status_change
  after insert or update of status on orders
  for each row
  execute function auto_log_order_tracking();
