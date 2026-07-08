const gis = require('g-i-s');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

const products = [
  { id: 1,  keyword: "Viên uống Tinh Chất Hàu Tươi Tỏi Nghệ Orihiro Nhật 180 Viên" },
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

function searchImages(query) {
  return new Promise((resolve, reject) => {
    gis(query, (error, results) => {
      if (error) {
        resolve([]);
      } else {
        resolve(results.map(r => r.url));
      }
    });
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        // Verify content type is image
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
          // Filter out dummy/placeholder images or tracking pixels
          if (sz < 5000 || sz === 102895 || sz === 9383049) { 
            fs.unlinkSync(destPath); 
            resolve(false); 
          } else {
            resolve(true);
          }
        });
      } else if ([301, 302].includes(res.statusCode) && res.headers.location) {
        // Follow redirect
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

async function main() {
  let successCount = 0;
  console.log(`🔍 Fetching ${products.length} product images from Google Images (via g-i-s)...`);

  for (const p of products) {
    const destPath = path.join(imgDir, `gis-prod-${p.id}.jpg`);
    process.stdout.write(`[${String(p.id).padStart(2)}] ${p.keyword.substring(0, 40).padEnd(40)} → `);
    
    // Add "shopee" to the query to strongly bias towards e-commerce product photos with white backgrounds
    const query = `${p.keyword} shopee`;
    const urls = await searchImages(query);
    
    let downloaded = false;
    for (let i = 0; i < Math.min(urls.length, 10); i++) {
      const url = urls[i];
      // Skip known bad domains that return dummy images or 403s
      if (url.includes('hangngoainhap.com.vn') || url.includes('pinterest') || url.includes('logo')) {
        continue;
      }
      
      const ok = await downloadImage(url, destPath);
      if (ok) {
        console.log(`✅ OK (Image ${i+1})`);
        downloaded = true;
        successCount++;
        break;
      }
    }
    
    if (!downloaded) {
      console.log('❌ ALL FAILED');
    }
    
    // Slight delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n✅ Downloaded ${successCount}/${products.length} images from Google Images.`);

  // Update data.js
  if (successCount > 0) {
    const dataPath = path.join(__dirname, 'js', 'data.js');
    let code = fs.readFileSync(dataPath, 'utf8');
    
    code = code.replace(/\{ id: (\d+), categoryId:[^}]+\}/g, (match, idStr) => {
      const id = parseInt(idStr);
      if (fs.existsSync(path.join(imgDir, `gis-prod-${id}.jpg`))) {
        return match.replace(/image: "images\/[^"]*"/, `image: "images/gis-prod-${id}.jpg"`);
      }
      return match;
    });
    
    fs.writeFileSync(dataPath, code, 'utf8');
    console.log('📝 data.js updated with new Google images!');
  }
}

main();
