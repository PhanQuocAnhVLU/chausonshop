const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

// The first 13 products that were fetched from Tiki and might have wrong generic images (like a book or scale)
const products = [
  { id: 1,  keyword: "Viên uống Tinh Chất Hàu Tươi Tỏi Nghệ Orihiro Nhật Bản" },
  { id: 2,  keyword: "Nattokinase 2000FU Orihiro Nhật Bản" },
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
  { id: 13, keyword: "Kirkland Signature Vitamin D3 2000 IU 600 viên của Mỹ" }
];

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const contentType = res.headers['content-type'] || '';
        if (!contentType.includes('image')) {
          res.resume();
          return resolve(false);
        }

        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const sz = fs.statSync(destPath).size;
          // Reject dummy images (often identical sizes like 102895, 1105, 9383049, or very small)
          if (sz < 5000 || sz === 102895 || sz === 1105 || sz === 9383049 || sz === 608160 || sz === 639658) { 
            fs.unlinkSync(destPath); 
            resolve(false); 
          } else {
            resolve(true);
          }
        });
      } else if ([301, 302].includes(res.statusCode) && res.headers.location) {
        downloadImage(res.headers.location, destPath).then(resolve);
      } else {
        res.resume();
        resolve(false);
      }
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(8000, () => { req.destroy(); resolve(false); });
  });
}

async function searchBing(keyword) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(keyword + " shopee vn")}&form=HDRSC2`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const regex = /murl&quot;:&quot;(https:\/\/[^&]+(?:jpg|jpeg|png))&quot;/ig;
        let match;
        const urls = [];
        while ((match = regex.exec(html)) !== null) {
          urls.push(match[1]);
        }
        resolve(urls);
      });
    }).on('error', () => resolve([]));
  });
}

async function main() {
  let successCount = 0;
  console.log(`🔍 Fetching 13 missing product images via Bing HTML Scraper...`);

  for (const p of products) {
    const destPath = path.join(imgDir, `bing3-prod-${p.id}.jpg`);
    process.stdout.write(`[${String(p.id).padStart(2)}] ${p.keyword.substring(0, 35).padEnd(35)} → `);
    
    const urls = await searchBing(p.keyword);
    
    let downloaded = false;
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      // Skip bad domains
      if (url.includes('hangngoainhap') || url.includes('pinterest') || url.includes('logo')) {
        continue;
      }
      
      const ok = await downloadImage(url, destPath);
      if (ok) {
        console.log(`✅ OK`);
        downloaded = true;
        successCount++;
        break;
      }
    }
    
    if (!downloaded) {
      console.log('❌ ALL FAILED');
    }
    
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n✅ Downloaded ${successCount}/${products.length} images.`);

  if (successCount > 0) {
    const dataPath = path.join(__dirname, 'js', 'data.js');
    let code = fs.readFileSync(dataPath, 'utf8');
    
    code = code.replace(/\{ id: (\d+), categoryId:[^}]+\}/g, (match, idStr) => {
      const id = parseInt(idStr);
      if (fs.existsSync(path.join(imgDir, `bing3-prod-${id}.jpg`))) {
        return match.replace(/image: "images\/[^"]*"/, `image: "images/bing3-prod-${id}.jpg"`);
      }
      return match;
    });
    
    fs.writeFileSync(dataPath, code, 'utf8');
    console.log('📝 data.js updated with valid Bing3 images!');
  }
}

main();
