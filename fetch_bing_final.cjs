const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

// The 19 products that failed (because Chiaki/Tiki returned dummy or didn't have them)
const products = [
  { id: 14, keyword: "Viên uống vitamin E 180mg 400IU Kirkland" },
  { id: 15, keyword: "The Collagen Shiseido nước Nhật Bản 10 chai" },
  { id: 16, keyword: "Chai xịt keo ong Vitatree Propolis Spray" },
  { id: 17, keyword: "Nature's Bounty Biotin 10000mcg" },
  { id: 18, keyword: "Schiff Move Free Joint Health Advanced 200 viên" },
  { id: 19, keyword: "Nature Made Magnesium Glycinate 200mg" },
  { id: 20, keyword: "Kem dưỡng da vùng cổ Medi-Peel Naite Thread Neck Cream" },
  { id: 21, keyword: "Kem hồng nhũ hoa Nuwhite N1" },
  { id: 22, keyword: "Kem đánh trắng răng Nuskin AP24" },
  { id: 23, keyword: "Viên uống trắng da chống nắng Fresa" },
  { id: 24, keyword: "Dịch vệ sinh phụ nữ Inner Gel Wettrust" },
  { id: 25, keyword: "Xịt Stud 100 Spray Delay For Men" },
  { id: 26, keyword: "Cao hồng sâm 365 Hàn Quốc 250g" },
  { id: 27, keyword: "Nước nhung hươu hồng sâm Hansusam" },
  { id: 28, keyword: "An Cung Ngưu Hoàng Hoàn Kwang Dong" },
  { id: 29, keyword: "Socola rượu Anthon Berg 64 chai" },
  { id: 30, keyword: "Kẹo socola Hershey's Nuggets 1.47kg" },
  { id: 31, keyword: "Kẹo dẻo gấu Haribo Goldbears 1kg" },
  { id: 32, keyword: "Bánh quy Oreo Mega Stuf" }
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
  console.log(`🔍 Fetching 19 missing product images via Bing HTML Scraper...`);

  for (const p of products) {
    const destPath = path.join(imgDir, `bing2-prod-${p.id}.jpg`);
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

  console.log(`\n✅ Downloaded ${successCount}/${products.length} missing images.`);

  if (successCount > 0) {
    const dataPath = path.join(__dirname, 'js', 'data.js');
    let code = fs.readFileSync(dataPath, 'utf8');
    
    code = code.replace(/\{ id: (\d+), categoryId:[^}]+\}/g, (match, idStr) => {
      const id = parseInt(idStr);
      if (fs.existsSync(path.join(imgDir, `bing2-prod-${id}.jpg`))) {
        return match.replace(/image: "images\/[^"]*"/, `image: "images/bing2-prod-${id}.jpg"`);
      }
      return match;
    });
    
    fs.writeFileSync(dataPath, code, 'utf8');
    console.log('📝 data.js updated with valid Bing2 images!');
  }
}

main();
