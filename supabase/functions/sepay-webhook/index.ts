import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  try {
    const payload = await req.json();
    
    console.log("Received webhook from SePay:", payload);

    // SePay payload typically contains:
    // {
    //   id: 1234,
    //   gateway: "Vietcombank",
    //   transactionDate: "2023-10-10 10:10:10",
    //   accountNumber: "123456789",
    //   code: "MB1234",
    //   content: "CS20260722GNFN thanh toan don hang",
    //   transferType: "in",
    //   transferAmount: 50000,
    //   accumulated: 100000,
    //   subAccount: null,
    //   referenceCode: "123456",
    //   description: "CS20260722GNFN thanh toan don hang"
    // }

    // Dựa vào tài liệu SePay, nội dung chuyển khoản nằm trong trường `content` hoặc `description`
    const content = payload.content || payload.description || "";
    const transferAmount = payload.transferAmount || 0;
    
    if (payload.transferType !== "in" || transferAmount <= 0) {
      return new Response("Not an incoming transaction", { status: 200 });
    }

    // Trích xuất mã đơn hàng. Định dạng mã đơn hàng của chúng ta là CS + YYYYMMDD + 4 ký tự random.
    // Ví dụ: CS20260722GNFN
    // Ta có thể dùng Regex để tìm mã đơn hàng trong nội dung chuyển khoản
    const orderCodeMatch = content.match(/CS\d{8}[A-Z0-9]{4}/i);
    
    if (!orderCodeMatch) {
       console.log("No valid order code found in content:", content);
       return new Response("No order code found in transaction content", { status: 200 });
    }

    const orderCode = orderCodeMatch[0].toUpperCase();
    console.log(`Found order code: ${orderCode}. Updating status to confirmed...`);

    // Gọi RPC confirm_order_payment để chuyển status thành confirmed
    const { error } = await supabase.rpc("confirm_order_payment", { p_order_code: orderCode });

    if (error) {
       console.error("Error updating order status:", error);
       return new Response("Error updating order status", { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: `Order ${orderCode} confirmed` }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response("Invalid request", { status: 400 });
  }
});
