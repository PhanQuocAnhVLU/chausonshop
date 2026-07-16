-- ============================================================
-- RPC CHUYỂN TRẠNG THÁI ĐƠN HÀNG THÀNH "ĐÃ XÁC NHẬN"
-- Dùng khi khách hàng bấm nút "Tôi đã chuyển khoản xong"
-- ============================================================

create or replace function confirm_order_payment(p_order_code text)
returns void as $$
begin
  update orders
  set status = 'confirmed'
  where order_code = p_order_code and status = 'pending';
end;
$$ language plpgsql security definer;
