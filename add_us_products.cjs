const https = require('https');
const fs = require('fs');
const path = require('path');

// List of real US functional food/supplement products to add
const usProducts = [
  { id: 20, name: "Centrum Silver Ultra Mens 50+ 275 Viên Của Mỹ", tag: "Vitamin tổng hợp", price: 750000, originalPrice: 890000, badge: "HOT", rating: 4.9, reviews: 215, sold: 1200, isBestSeller: true, isSale: true, isNew: false },
  { id: 21, name: "Dầu cá SR Triple Strength Omega-3 Fish Oil 150 viên của Mỹ", tag: "Hỗ trợ tim mạch", price: 1060000, originalPrice: 1200000, badge: "CHÍNH HÃNG", rating: 4.7, reviews: 98, sold: 445, isBestSeller: false, isSale: false, isNew: false },
  { id: 22, name: "Schiff Move Free Joint Health Advanced 200 viên Mỹ", tag: "Hỗ trợ xương khớp", price: 980000, originalPrice: 1250000, badge: "HOT", rating: 4.8, reviews: 176, sold: 880, isBestSeller: true, isSale: true, isNew: false },
  { id: 23, name: "Nature Made Fish Oil 1200mg 200 viên Mỹ Omega 3", tag: "Hỗ trợ tim mạch", price: 620000, originalPrice: 790000, badge: null, rating: 4.7, reviews: 134, sold: 670, isBestSeller: false, isSale: true, isNew: false },
  { id: 24, name: "Kirkland Signature Vitamin D3 2000 IU 600 viên của Mỹ", tag: "Vitamin D", price: 430000, originalPrice: 560000, badge: "BÁN CHẠY", rating: 4.9, reviews: 302, sold: 1500, isBestSeller: true, isSale: true, isNew: false },
  { id: 25, name: "Nature's Bounty Biotin 10000mcg 120 viên của Mỹ", tag: "Tóc - Móng - Da", price: 360000, originalPrice: 480000, badge: null, rating: 4.6, reviews: 89, sold: 520, isBestSeller: false, isSale: true, isNew: false },
  { id: 26, name: "Garden of Life Vitamin Code Raw Iron 30 viên Mỹ", tag: "Bổ máu", price: 490000, originalPrice: 620000, badge: "MỚI", rating: 4.5, reviews: 67, sold: 210, isBestSeller: false, isSale: true, isNew: true },
  { id: 27, name: "Melatonin 10mg Nature Made 90 viên Mỹ hỗ trợ giấc ngủ", tag: "Hỗ trợ giấc ngủ", price: 320000, originalPrice: 420000, badge: null, rating: 4.8, reviews: 241, sold: 930, isBestSeller: true, isSale: true, isNew: false },
  { id: 28, name: "NOW Foods CoQ10 600mg 60 viên Mỹ tăng cường sức khỏe tim", tag: "Hỗ trợ tim mạch", price: 870000, originalPrice: 1100000, badge: "HOT", rating: 4.7, reviews: 112, sold: 560, isBestSeller: false, isSale: true, isNew: false },
  { id: 29, name: "Vicks NyQuil Cold & Flu Relief 48 Liquicaps của Mỹ", tag: "Cảm cúm", price: 440000, originalPrice: 580000, badge: null, rating: 4.6, reviews: 78, sold: 340, isBestSeller: false, isSale: true, isNew: false },
  { id: 30, name: "Nature Made Magnesium Glycinate 200mg 60 viên Mỹ", tag: "Bổ sung Magie", price: 560000, originalPrice: 720000, badge: "MỚI", rating: 4.8, reviews: 93, sold: 410, isBestSeller: false, isSale: true, isNew: true },
  { id: 31, name: "Spring Valley Zinc 50mg 200 viên Mỹ tăng đề kháng", tag: "Tăng đề kháng", price: 280000, originalPrice: 360000, badge: null, rating: 4.7, reviews: 158, sold: 720, isBestSeller: false, isSale: true, isNew: false },
  { id: 32, name: "Culturelle Pro Strength Daily Probiotic 30 viên Mỹ", tag: "Hỗ trợ tiêu hóa", price: 680000, originalPrice: 850000, badge: "BÁN CHẠY", rating: 4.8, reviews: 187, sold: 840, isBestSeller: true, isSale: true, isNew: false },
  { id: 33, name: "GNC Mega Men Sport Multivitamin 180 viên Mỹ cho nam", tag: "Vitamin tổng hợp", price: 820000, originalPrice: 1050000, badge: "HOT", rating: 4.7, reviews: 124, sold: 580, isBestSeller: false, isSale: true, isNew: false },
  { id: 34, name: "One A Day Women's Petites Multivitamin 160 viên Mỹ", tag: "Sức khỏe nữ giới", price: 590000, originalPrice: 760000, badge: null, rating: 4.6, reviews: 145, sold: 490, isBestSeller: false, isSale: true, isNew: false },
];

const imgDir = path.join(__dirname, 'images');

async function fetchBingImage(keyword) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(keyword)}&form=HDRSC2`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const match = html.match(/murl&quot;:&quot;(https:\/\/[^&]+(?:jpg|jpeg|png))&quot;/i);
        resolve(match ? match[1] : null);
      });
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : require('http');
    const req = client.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(8000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  let success = 0;
  console.log(`Fetching ${usProducts.length} US supplement product images...`);

  for (const p of usProducts) {
    process.stdout.write(`[${p.id}] ${p.name.substring(0, 40)}... `);
    const imgUrl = await fetchBingImage(p.name);
    if (imgUrl) {
      const ok = await downloadImage(imgUrl, path.join(imgDir, `exact-${p.id}.jpg`));
      console.log(ok ? 'OK' : 'DL FAILED');
      if (ok) success++;
    } else {
      console.log('NOT FOUND');
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nDownloaded ${success}/${usProducts.length} images.`);

  // Append products to data.js
  const dataPath = path.join(__dirname, 'js', 'data.js');
  let dataCode = fs.readFileSync(dataPath, 'utf8');

  // Build new product entries
  const newEntries = usProducts.map(p => {
    return `  { id: ${p.id}, categoryId: "thuc-pham-chuc-nang", name: "${p.name}", price: ${p.price}, originalPrice: ${p.originalPrice}, image: "images/exact-${p.id}.jpg", badge: ${p.badge ? '"'+p.badge+'"' : 'null'}, rating: ${p.rating}, reviews: ${p.reviews}, sold: ${p.sold}, tag: "${p.tag}", isNew: ${p.isNew}, isSale: ${p.isSale}, isBestSeller: ${p.isBestSeller} }`;
  }).join(',\n');

  // Insert before closing ]; of PRODUCTS array
  dataCode = dataCode.replace(/\n\];\n\n\/\/ Helper functions/, `,\n${newEntries}\n];\n\n// Helper functions`);

  fs.writeFileSync(dataPath, dataCode, 'utf8');
  console.log('✅ data.js updated with US supplement products!');
}

main();
