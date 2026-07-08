// generate_product_images.cjs
// Tạo ảnh SVG riêng biệt cho từng sản phẩm
const fs = require('fs');
const path = require('path');

const products = [
  // Thực phẩm chức năng
  { id: 1,  label: "Essence Of Red\nKangaroo", sub: "Hỗ Trợ Sinh Lý Nam", emoji: "🦘", color1: "#b71c1c", color2: "#e53935" },
  { id: 2,  label: "Oyster Plus\nGoodhealth", sub: "Tinh Chất Hàu Lùn Úc", emoji: "🦪", color1: "#1a237e", color2: "#1565c0" },
  { id: 3,  label: "Centrum Silver\nUltra Mens 50+", sub: "Vitamin Tổng Hợp Mỹ", emoji: "💊", color1: "#1b5e20", color2: "#388e3c" },
  { id: 4,  label: "SR Triple\nOmega-3", sub: "Dầu Cá Omega-3 Mỹ", emoji: "🐟", color1: "#01579b", color2: "#0288d1" },
  { id: 5,  label: "Minci Ideal\n40 Viên", sub: "Viên Uống Giảm Cân", emoji: "⚖️", color1: "#4a148c", color2: "#7b1fa2" },
  { id: 6,  label: "Blackmores\nBio C 1000mg", sub: "Vitamin C Úc 62 Viên", emoji: "🍊", color1: "#e65100", color2: "#f57c00" },
  // Chống lão hóa
  { id: 7,  label: "Costar Royal\nJelly 1450mg", sub: "Sữa Ong Chúa 365 Viên", emoji: "🍯", color1: "#f57f17", color2: "#fbc02d" },
  { id: 8,  label: "Vitamin E\n400IU Kirkland", sub: "500 Softgels - Mỹ", emoji: "💛", color1: "#827717", color2: "#afb42b" },
  { id: 9,  label: "NMN 24000+\nTochukasou", sub: "Chống Lão Hóa Nhật 90V", emoji: "🌸", color1: "#880e4f", color2: "#c2185b" },
  { id: 10, label: "Collagen\nElasten Đức", sub: "Nước Uống 28 Ống", emoji: "💎", color1: "#311b92", color2: "#512da8" },
  { id: 11, label: "Nhau Thai Ngựa\nPremium", sub: "Placenta 450000mg", emoji: "🐴", color1: "#3e2723", color2: "#6d4c41" },
  { id: 12, label: "Collagen\nShiseido Nhật", sub: "The Collagen EXR 126V", emoji: "🌺", color1: "#ad1457", color2: "#e91e63" },
  // Xương khớp
  { id: 13, label: "Bio Island\nMilk Calcium", sub: "Bone Care 150 Viên Úc", emoji: "🦴", color1: "#37474f", color2: "#546e7a" },
  { id: 14, label: "Schiff Move\nFree Ultra", sub: "Triple Action Mỹ", emoji: "🏃", color1: "#1b5e20", color2: "#2e7d32" },
  { id: 15, label: "Schiff Move\nFree Advanced", sub: "Joint Health 200V", emoji: "💪", color1: "#0d47a1", color2: "#1565c0" },
  { id: 16, label: "Glucosamine\nOrihiro 900", sub: "1500mg Nhật Bản", emoji: "🏋️", color1: "#bf360c", color2: "#d84315" },
  { id: 17, label: "Calcium Mag\nZinc + D3", sub: "300 Viên Của Mỹ", emoji: "🧊", color1: "#006064", color2: "#00838f" },
  // Mỹ phẩm
  { id: 18, label: "Olay Collagen\nB3 Firming", sub: "Body Lotion Dưỡng Thể", emoji: "🧴", color1: "#880e4f", color2: "#ad1457" },
  { id: 19, label: "Genie Sauna\nBelly Hot", sub: "Kem Tan Mỡ Hàn 150g", emoji: "🔥", color1: "#b71c1c", color2: "#c62828" },
  { id: 20, label: "Medi-Peel\nNaite Cream", sub: "Kem Dưỡng Cổ 100ml", emoji: "✨", color1: "#4a148c", color2: "#6a1b9a" },
  { id: 21, label: "Chacott\nCleansing Water", sub: "Nước Tẩy Trang Nhật", emoji: "💧", color1: "#01579b", color2: "#0277bd" },
  { id: 22, label: "Nuwhite N1\nMibiti Mỹ", sub: "Kem Hồng Nhi Hoa", emoji: "🌷", color1: "#e91e63", color2: "#f06292" },
  { id: 23, label: "Klairs\nVitamin C Drop", sub: "Serum HA 35ml Hàn", emoji: "🍋", color1: "#f57f17", color2: "#ff8f00" },
  // Sâm nấm cao
  { id: 24, label: "Cao Hồng Sâm\nDuzon Health", sub: "6 Năm Tuổi Hàn 4 Lọ", emoji: "🌿", color1: "#1b5e20", color2: "#2e7d32" },
  { id: 25, label: "Nước Nhung Hươu\nHồng Sâm 365", sub: "Hansusam 30 Gói", emoji: "🦌", color1: "#3e2723", color2: "#5d4037" },
  { id: 26, label: "Hồng Sâm Won\nCheongKwanJang", sub: "Hàn Quốc Chính Hãng", emoji: "🍵", color1: "#b71c1c", color2: "#c62828" },
  { id: 27, label: "An Cung Ngưu\nHoàng Hoàn", sub: "Kwang Dong 10 Viên", emoji: "🐂", color1: "#4e342e", color2: "#6d4c41" },
  { id: 28, label: "Cao Hồng Sâm\n365 Hàn Quốc", sub: "6 Năm 240g × 2 Lọ", emoji: "🫙", color1: "#1a237e", color2: "#283593" },
  // Mẹ và bé
  { id: 29, label: "Gummy Vites\nL'il Critters", sub: "Vitamin Gấu Dẻo 300V", emoji: "🐻", color1: "#e65100", color2: "#ef6c00" },
  { id: 30, label: "Biogaia\nGouttes 5ml", sub: "Men Vi Sinh Pháp", emoji: "🍼", color1: "#0288d1", color2: "#039be5" },
  { id: 31, label: "GH Creation EX\nNhật Bản", sub: "Hỗ Trợ Tăng Chiều Cao", emoji: "📏", color1: "#00695c", color2: "#00897b" },
  { id: 32, label: "Milk Calcium\nHealthy Care", sub: "60 Viên Sữa Canxi Úc", emoji: "🥛", color1: "#37474f", color2: "#455a64" },
  { id: 33, label: "High DHA\nHealthy Care", sub: "DHA Cho Bé 60 Viên", emoji: "🧠", color1: "#1565c0", color2: "#1976d2" },
  // Bánh kẹo
  { id: 34, label: "Anthon Berg\nChocolate 64", sub: "Socola Rượu Mỹ", emoji: "🍫", color1: "#3e2723", color2: "#4e342e" },
  { id: 35, label: "Hershey's\nNuggets 1.47kg", sub: "Kẹo Socola 145 Viên", emoji: "🍬", color1: "#880e4f", color2: "#ad1457" },
  { id: 36, label: "Haribo\nGoldbears 1kg", sub: "Kẹo Dẻo Gấu Đức", emoji: "🐻", color1: "#f9a825", color2: "#fbc02d" },
  { id: 37, label: "Oreo\nMega Stuf", sub: "Bánh Quy Double 482g", emoji: "🍪", color1: "#212121", color2: "#424242" },
  // Thêm sản phẩm bán chạy
  { id: 38, label: "Vitamin E\n400IU Kirkland", sub: "500 Softgels Mỹ", emoji: "💊", color1: "#558b2f", color2: "#689f38" },
  { id: 39, label: "Stud 100\nSpray Delay", sub: "Xịt Kéo Dài For Men", emoji: "💪", color1: "#1b5e20", color2: "#2e7d32" },
  { id: 40, label: "Inner Gel\nWettrust 30 Ống", sub: "Dịch Vệ Sinh Hàn Quốc", emoji: "🌸", color1: "#880e4f", color2: "#c2185b" },
  { id: 41, label: "Lindt\nExcellence 90%", sub: "Socola Đen Thụy Sĩ", emoji: "🍫", color1: "#4e342e", color2: "#6d4c41" }
];

const imgDir = path.join(__dirname, 'images');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir);

function makeSVG(p) {
  // Wrap label lines
  const lines = p.label.split('\n');
  const line1 = lines[0] || '';
  const line2 = lines[1] || '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="bg${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${p.color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${p.color2};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="card${p.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.18)" />
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.04)" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="300" height="300" fill="url(#bg${p.id})" rx="12"/>

  <!-- Pattern dots -->
  <circle cx="20" cy="20" r="40" fill="rgba(255,255,255,0.05)"/>
  <circle cx="280" cy="280" r="60" fill="rgba(255,255,255,0.05)"/>
  <circle cx="270" cy="30" r="30" fill="rgba(255,255,255,0.05)"/>
  <circle cx="30" cy="270" r="25" fill="rgba(255,255,255,0.05)"/>

  <!-- Card -->
  <rect x="30" y="30" width="240" height="240" fill="url(#card${p.id})" rx="10" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

  <!-- Emoji icon -->
  <text x="150" y="135" font-size="72" text-anchor="middle" dominant-baseline="middle">${p.emoji}</text>

  <!-- Product line 1 -->
  <text x="150" y="182" font-size="17" font-weight="bold" font-family="Arial,sans-serif"
    text-anchor="middle" fill="white" letter-spacing="0.5">${line1}</text>

  <!-- Product line 2 -->
  <text x="150" y="202" font-size="17" font-weight="bold" font-family="Arial,sans-serif"
    text-anchor="middle" fill="white" letter-spacing="0.5">${line2}</text>

  <!-- Sub label -->
  <text x="150" y="228" font-size="11.5" font-family="Arial,sans-serif"
    text-anchor="middle" fill="rgba(255,255,255,0.80)">${p.sub}</text>

  <!-- ID badge -->
  <rect x="12" y="12" width="36" height="20" rx="4" fill="rgba(0,0,0,0.3)"/>
  <text x="30" y="26" font-size="10" font-family="Arial,sans-serif"
    text-anchor="middle" fill="rgba(255,255,255,0.9)" font-weight="bold">#${p.id}</text>
</svg>`;
}

let count = 0;
products.forEach(p => {
  const svg = makeSVG(p);
  // Save as both .jpg.svg (overriding broken jpg) and .svg
  const svgPath = path.join(imgDir, `product-${p.id}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');
  count++;
  console.log(`✅ product-${p.id}.svg — ${p.label.replace('\n',' ')} ${p.emoji}`);
});

console.log(`\n🎉 Đã tạo ${count} ảnh SVG cho từng sản phẩm!`);
