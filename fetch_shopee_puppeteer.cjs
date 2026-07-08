const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const imgDir = path.join(__dirname, 'images');

const products = [
  { id: 1,  keyword: "Orihiro hàu tươi tỏi nghệ 180 viên" },
  { id: 2,  keyword: "Nattokinase 2000FU Orihiro" },
  { id: 3,  keyword: "Centrum Silver Ultra Men 50+" },
  { id: 4,  keyword: "SR Triple Strength Omega-3 Fish Oil" },
  { id: 5,  keyword: "Nature Made Fish Oil 1200mg 200 viên" },
  { id: 6,  keyword: "NOW Foods CoQ10 600mg" },
  { id: 7,  keyword: "Culturelle Pro Strength Daily Probiotic" },
  { id: 8,  keyword: "GNC Mega Men Sport Multivitamin" },
  { id: 9,  keyword: "One A Day Women Petites Multivitamin" },
  { id: 10, keyword: "Melatonin 10mg Nature Made" },
  { id: 11, keyword: "Spring Valley Zinc 50mg 200 viên" },
  { id: 12, keyword: "Garden of Life Vitamin Code Raw Iron" },
  { id: 13, keyword: "Kirkland Vitamin D3 2000IU 600 viên" },
  { id: 14, keyword: "Vitamin E 400IU Kirkland 500 softgels" },
  { id: 15, keyword: "The Collagen Shiseido nước 50ml Nhật" },
  { id: 16, keyword: "Vitatree Propolis Spray 30ml" },
  { id: 17, keyword: "Biotin 10000mcg Nature Bounty 120 viên" },
  { id: 18, keyword: "Schiff Move Free Joint Health 200 viên" },
  { id: 19, keyword: "Nature Made Magnesium Glycinate 200mg" },
  { id: 20, keyword: "Medi Peel Naite Thread Neck Cream 100ml" },
  { id: 21, keyword: "Nuwhite N1 kem hồng nhũ hoa" },
  { id: 22, keyword: "Nuskin AP24 Whitening Toothpaste" },
  { id: 23, keyword: "Fresa Whitening Sunblock viên uống trắng da" },
  { id: 24, keyword: "Inner Gel Wettrust 30 ống Hàn Quốc" },
  { id: 25, keyword: "Stud 100 Spray Delay For Men" },
  { id: 26, keyword: "Cao hồng sâm 365 Hàn Quốc 250g" },
  { id: 27, keyword: "Nước nhung hươu hồng sâm Hansusam Hàn Quốc" },
  { id: 28, keyword: "An Cung Ngưu Hoàng Hoàn Kwang Dong" },
  { id: 29, keyword: "Anthon Berg Chocolate rượu 64 chai" },
  { id: 30, keyword: "Hershey's Nuggets Assortment 1.47kg" },
  { id: 31, keyword: "Haribo Goldbears kẹo dẻo gấu 1kg" },
  { id: 32, keyword: "Oreo Mega Stuf Double 482g" },
];

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const sz = fs.statSync(destPath).size;
          if (sz < 5000) { fs.unlinkSync(destPath); resolve(false); }
          else resolve(true);
        });
      } else if ([301, 302].includes(res.statusCode) && res.headers.location) {
        downloadImage(res.headers.location, destPath).then(resolve);
      } else resolve(false);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(10000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  console.log('🚀 Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  
  // Set realistic browser headers
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });
  
  let success = 0;
  
  for (const p of products) {
    const destPath = path.join(imgDir, `prod-${p.id}.jpg`);
    if (fs.existsSync(destPath)) {
      console.log(`[${p.id}] Already exists, skipping.`);
      success++;
      continue;
    }
    
    process.stdout.write(`[${String(p.id).padStart(2)}] ${p.keyword.substring(0, 35).padEnd(35)} → `);
    
    try {
      const searchUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(p.keyword)}&sortBy=relevancy`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      
      // Wait for product images to load
      await page.waitForSelector('img[src*="shopee"]', { timeout: 10000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));
      
      // Get first product image URL
      const imgUrl = await page.evaluate(() => {
        // Find product card images
        const imgs = document.querySelectorAll('img');
        for (const img of imgs) {
          const src = img.src || img.getAttribute('src') || '';
          if (src.includes('cf.shopee.vn') || src.includes('down.i.alicdn') || src.includes('shopee.vn/file')) {
            return src;
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
  
  console.log(`\n✅ Downloaded ${success}/${products.length} images from Shopee!`);
  
  if (success > 0) {
    const dataPath = path.join(__dirname, 'js', 'data.js');
    let code = fs.readFileSync(dataPath, 'utf8');
    code = code.replace(/\{ id: (\d+), categoryId:[^}]+\}/g, (match, idStr) => {
      const id = parseInt(idStr);
      if (fs.existsSync(path.join(imgDir, `prod-${id}.jpg`))) {
        return match.replace(/image: "images\/[^"]*"/, `image: "images/prod-${id}.jpg"`);
      }
      return match;
    });
    fs.writeFileSync(dataPath, code, 'utf8');
    console.log('📝 data.js updated!');
  }
}

main().catch(console.error);
