// ================================================================
// supabase-client.js — Kết nối Supabase dùng chung cho toàn site
// ================================================================
// Lưu ý: SUPABASE_KEY dưới đây là "publishable key" (khóa công khai),
// được thiết kế để lộ ra trình duyệt — an toàn vì mọi quyền hạn thật
// sự được kiểm soát bằng Row Level Security (RLS) trong Supabase.

const SUPABASE_URL = 'https://byhddpyoctjabtcqtygu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rqLbIukJ7qYNep3EWvXlig__FEIx164';

// `supabase` global đến từ CDN script (@supabase/supabase-js) load trước file này
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
