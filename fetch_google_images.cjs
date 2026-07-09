const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const imgDir = path.join(__dirname, 'images');

const products = [
  { id: 1,  keyword: "Viên uống hỗ trợ tiêu hóa dạ dày Tinh Chất Hàu Tươi Tỏi Nghệ Orihiro Nhật 180 Viên" },
  { id: 2,  keyword: "Viên uống Nattokinase 2000FU Orihiro của Nhật Bản" },
  { id: 3,  keyword: "Centrum Silver Ultra Mens 50+ 275 Viên Của Mỹ" },
  { id: 4,  keyword: "Dầu cá SR Triple Strength Omega-3 Fish Oil 150 viên của Mỹ" },
  { id: 5,  keyword: "Nature Made Fish Oil 1200mg 200 viên Mỹ Omega 3" },
  { id: 6,  keyword: "NOW Foods CoQ10 600mg 60 viên Mỹ" },
  { id: 7,  keyword: "Culturelle Pro Strength Daily Probiotic 30 viên Mỹ" },
  { id: 8,  keyword: "GNC Mega Men Sport Multivitamin 180 viên Mỹ" },
  { id: 9,  keyword: "One A Day Women's Petites Multivitamin 160 viên Mỹ" },
  { id: 10, keyword: "Melatonin 10mg Nature Made 90 viên Mỹ" },
  { id: 11, keyword: "Spring Valley Zinc 50mg 200 viên Mỹ" },
  { id: 12, keyword: "Garden of Life Vitamin Code Raw Iron 30 viên Mỹ" },
  { id: 13, keyword: "Kirkland Signature Vitamin D3 2000 IU 600 viên của Mỹ" },
  { id: 14, keyword: "Viên uống vitamin E 180mg 400IU Kirkland 500 softgels của Mỹ" },
  { id: 15, keyword: "The Collagen Shiseido dạng nước Nhật Bản 10 chai x 50ml" },
  { id: 16, keyword: "Chai xịt keo ong Vitatree Super Propolis Spray Complex 30ml Úc" },
  { id: 17, keyword: "Nature's Bounty Biotin 10000mcg 120 viên của Mỹ" },
  { id: 18, keyword: "Schiff Move Free Joint Health Advanced 200 viên Mỹ" },
  { id: 19, keyword: "Nature Made Magnesium Glycinate 200mg 60 viên Mỹ" },
  { id: 20, keyword: "Kem dưỡng da vùng cổ Medi-Peel Naite Thread Neck Cream 100ml" },
  { id: 21, keyword: "Kem hồng nhũ hoa Nuwhite N1 Mibiti Prudente Professional Mỹ" },
  { id: 22, keyword: "Kem đánh trắng răng Nuskin AP24 Whitening Fluoride Toothpaste Mỹ" },
  { id: 23, keyword: "Viên uống trắng da chống nắng Fresa Whitening & Sunblock" },
  { id: 24, keyword: "Dịch vệ sinh phụ nữ Inner Gel Wettrust 30 ống hồng Hàn Quốc" },
  { id: 25, keyword: "Xịt kéo dài thời gian quan hệ Stud 100 Spray Delay For Men" },
  { id: 26, keyword: "Cao hồng sâm 365 Hàn Quốc 6 năm tuổi Hộp 250g chính hãng" },
  { id: 27, keyword: "Nước nhung hươu hồng sâm núi 365 Hansusam Hàn Quốc hộp 30 gói" },
  { id: 28, keyword: "An Cung Ngưu Hoàng Hoàn Kwang Dong Hàn Quốc hộp 10 viên" },
  { id: 29, keyword: "Socola rượu Anthon Berg Since 1884 Chocolate 64 chai của Mỹ" },
  { id: 30, keyword: "Kẹo socola Hershey's Nuggets Assortment 1.47kg 145 viên Mỹ" },
  { id: 31, keyword: "Kẹo dẻo gấu Haribo Goldbears 1kg Đức chính hãng" },
  { id: 32, keyword: "Bánh quy Oreo Mega Stuf Double 482g Mỹ" }
];

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    if (url.startsWith('data:image')) {
      // Handle base64
      const matches = url.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        fs.writeFile(destPath, matches[2], 'base64', (err) => {
          resolve(!err);
        });
      } else {
        resolve(false);
      }
    } else {
      const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode === 200) {
          const file = fs.createWriteStream(destPath);
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(true); });
        } else {
          resolve(false);
        }
      });
      req.on('error', () => resolve(false));
      req.setTimeout(10000, () => { req.destroy(); resolve(false); });
    }
  });
}

async function main() {
  console.log('🚀 Launching headless browser for Google Images...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  let success = 0;
  
  for (const p of products) {
    const destPath = path.join(imgDir, `real-prod-${p.id}.jpg`);
    process.stdout.write(`[${String(p.id).padStart(2)}] ${p.keyword.substring(0, 35).padEnd(35)} → `);
    
    try {
      const query = encodeURIComponent(p.keyword + ' shopee tiki lazada');
      const searchUrl = `https://www.google.com/search?tbm=isch&q=${query}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Get the first image thumbnail
      const imgUrl = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        for (const img of imgs) {
          const src = img.src || img.getAttribute('src');
          if (src && (src.startsWith('data:image/jpeg;base64') || src.includes('encrypted-tbn0.gstatic.com'))) {
            // Ignore tiny 1x1 tracking pixels
            if (img.width > 50 && img.height > 50) {
              return src;
            }
          }
        }
        return null;
      });
      
      if (imgUrl) {
        const ok = await downloadImage(imgUrl, destPath);
        console.log(ok ? '✅ OK' : '❌ DL Failed');
        if (ok) success++;
      } else {
        console.log('❌ No image found');
      }
    } catch(e) {
      console.log(`❌ Error: ${e.message.substring(0, 30)}`);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }
  
  await browser.close();
  
  console.log(`\n✅ Downloaded ${success}/${products.length} images from Google Images!`);
  
  if (success > 0) {
    const dataPath = path.join(__dirname, 'js', 'data.js');
    let code = fs.readFileSync(dataPath, 'utf8');
    code = code.replace(/\{ id: (\d+), categoryId:[^}]+\}/g, (match, idStr) => {
      const id = parseInt(idStr);
      if (fs.existsSync(path.join(imgDir, `real-prod-${id}.jpg`))) {
        return match.replace(/image: "images\/[^"]*"/, `image: "images/real-prod-${id}.jpg"`);
      }
      return match;
    });
    fs.writeFileSync(dataPath, code, 'utf8');
    console.log('📝 data.js updated!');
  }
}

main().catch(console.error);
