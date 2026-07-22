import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const TO_EMAIL = "phancloneanh@gmail.com";
const FROM_EMAIL = "donhang@chausonshop.com"; // Dùng domain đã verify trên Resend

serve(async (req) => {
  try {
    // Supabase Webhook gửi payload dạng { type, table, record, old_record }
    const payload = await req.json();
    const order = payload.record;

    if (!order) {
      return new Response("No record found", { status: 400 });
    }

    // Format tiền VN
    const formatVND = (amount: number) =>
      new Intl.NumberFormat("vi-VN").format(amount) + "đ";

    const total = formatVND(order.total || 0);
    const orderDate = order.created_at
      ? new Date(order.created_at).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      : "N/A";

    const paymentMap: Record<string, string> = {
      COD: "💵 Thanh toán khi nhận hàng (COD)",
      Transfer: "🏦 Chuyển khoản ngân hàng (TPBank)",
      MoMo: "📱 MoMo",
    };
    const paymentLabel = paymentMap[order.payment_method] || order.payment_method || "N/A";

    const statusMap: Record<string, string> = {
      pending: "⏳ Chờ xử lý",
      confirmed: "✅ Đã xác nhận",
      shipping: "🚚 Đang giao",
      completed: "🎉 Hoàn thành",
      cancelled: "❌ Đã hủy",
    };
    const statusLabel = statusMap[order.status] || order.status || "pending";

    const emailHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đơn hàng mới từ Châu Sơn Shop</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2e7d32,#66bb6a);padding:32px;text-align:center;">
              <div style="font-size:32px;margin-bottom:8px;">🌿</div>
              <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">CHÂU SƠN SHOP</h1>
              <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Chuyên Hàng Nhập</p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#fff8e1;border-bottom:3px solid #f59e0b;padding:16px 32px;text-align:center;">
              <p style="margin:0;font-size:17px;font-weight:700;color:#92400e;">
                🛒 Bạn có đơn hàng mới!
              </p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding:28px 32px;">
              
              <!-- Mã đơn -->
              <div style="background:#f0fdf4;border:2px dashed #4caf50;border-radius:10px;padding:16px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">MÃ ĐƠN HÀNG</p>
                <p style="margin:0;font-size:24px;font-weight:800;color:#1b5e20;font-family:monospace;letter-spacing:3px;">${order.order_code || "N/A"}</p>
              </div>

              <!-- Thông tin khách hàng -->
              <h3 style="margin:0 0 12px;font-size:15px;color:#333;border-bottom:2px solid #e8f5e9;padding-bottom:8px;">👤 Thông tin khách hàng</h3>
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
                <tr>
                  <td style="color:#666;width:40%;">Họ tên:</td>
                  <td style="color:#111;font-weight:600;">${order.customer_name || "N/A"}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="color:#666;">Điện thoại:</td>
                  <td style="color:#111;font-weight:600;">${order.customer_phone || "N/A"}</td>
                </tr>
                <tr>
                  <td style="color:#666;">Địa chỉ:</td>
                  <td style="color:#111;">${order.customer_address || "N/A"}</td>
                </tr>
                ${order.customer_note ? `
                <tr style="background:#f9f9f9;">
                  <td style="color:#666;">Ghi chú:</td>
                  <td style="color:#e65100;font-style:italic;">${order.customer_note}</td>
                </tr>` : ""}
              </table>

              <!-- Thông tin đơn hàng -->
              <h3 style="margin:0 0 12px;font-size:15px;color:#333;border-bottom:2px solid #e8f5e9;padding-bottom:8px;">📦 Chi tiết đơn hàng</h3>
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
                <tr>
                  <td style="color:#666;width:40%;">Ngày đặt:</td>
                  <td style="color:#111;">${orderDate}</td>
                </tr>
                <tr style="background:#f9f9f9;">
                  <td style="color:#666;">Thanh toán:</td>
                  <td style="color:#111;">${paymentLabel}</td>
                </tr>
                <tr>
                  <td style="color:#666;">Trạng thái:</td>
                  <td style="color:#111;">${statusLabel}</td>
                </tr>
              </table>

              <!-- Tổng tiền -->
              <div style="background:linear-gradient(135deg,#e8f5e9,#c8e6c9);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 4px;font-size:13px;color:#388e3c;">TỔNG GIÁ TRỊ ĐƠN HÀNG</p>
                <p style="margin:0;font-size:30px;font-weight:800;color:#1b5e20;">${total}</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;">
                <a href="https://chausonshop.vercel.app/admin.html" 
                   style="display:inline-block;background:linear-gradient(135deg,#2e7d32,#66bb6a);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
                  👉 Xem & Xử lý đơn hàng
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f5;padding:18px 32px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;font-size:12px;color:#999;">
                © 2025 Châu Sơn Shop · Hotline: <strong>0987.153.876</strong>
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#bbb;">Email này được tự động gửi khi có đơn hàng mới.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Gửi email qua Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Châu Sơn Shop <onboarding@resend.dev>",
        to: [TO_EMAIL],
        subject: `🛒 Đơn hàng mới: ${order.order_code || "N/A"} — ${total}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: data }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
