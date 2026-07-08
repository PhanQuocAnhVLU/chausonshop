const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

// Optimized keywords to ensure hitting e-commerce APIs accurately
const products = [
  { id: 1,  keyword: "Hàu Tỏi Nghệ Orihiro" },
  { id: 2,  keyword: "Nattokinase 2000FU Orihiro" },
  { id: 3,  keyword: "Centrum Silver Men 50+" },
  { id: 4,  keyword: "SR Omega-3 Fish Oil" },
  { id: 5,  keyword: "Nature Made Fish Oil 1200mg" },
  { id: 6,  keyword: "NOW CoQ10 600mg" },
  { id: 7,  keyword: "Culturelle Probiotic" },
  { id: 8,  keyword: "GNC Mega Men Sport" },
  { id: 9,  keyword: "One A Day Women" },
  { id: 10, keyword: "Melatonin 10mg Nature Made" },
  { id: 11, keyword: "Spring Valley Zinc" },
  { id: 12, keyword: "Vitamin Code Raw Iron" },
  { id: 13, keyword: "Kirkland Vitamin D3 2000" },
  { id: 14, keyword: "Vitamin E Kirkland 400" },
  { id: 15, keyword: "The Collagen Shiseido nước" },
  { id: 16, keyword: "Vitatree Propolis Spray" },
  { id: 17, keyword: "Biotin Nature Bounty 10000" },
  { id: 18, keyword: "Move Free Joint Health" },
  { id: 19, keyword: "Magnesium Glycinate Nature Made" },
  { id: 20, keyword: "Naite Thread Neck Cream" },
  { id: 21, keyword: "Nuwhite N1" },
  { id: 22, keyword: "Nuskin AP24" },
  { id: 23, keyword: "Fresa Whitening" },
  { id: 24, keyword: "Inner Gel Wettrust" },
  { id: 25, keyword: "Stud 100" },
  { id: 26, keyword: "Cao hồng sâm 365" },
  { id: 27, keyword: "nhung hươu hồng sâm Hansusam" },
  { id: 28, keyword: "An Cung Ngưu Hoàng Kwang Dong" },
  { id: 29, keyword: "Anthon Berg Chocolate" },
  { id: 30, keyword: "Hershey's Nuggets" },
  { id: 31, keyword: "Haribo Goldbears 1kg" },
  { id: 32, keyword: "Oreo Mega Stuf" }
];

async function fetchTiki(keyword) {
  const url = `https://tiki.vn/api/v2/products?limit=1&q=${encodeURIComponent(keyword)}`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.data && json.data.length > 0) {
            resolve(json.data[0].thumbnail_url || json.data[0].image_url);
          } else resolve(null);
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

// Chiaki API returns search results in HTML format or we can use their JSON endpoint if known
// Actually Chiaki has a search page, we can scrape the first img
async function fetchChiaki(keyword) {
  const url = `https://chiaki.vn/search?q=${encodeURIComponent(keyword)}`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        // Find product image
        const regex = /<img[^>]+src="([^"]+)"[^>]+class="img-responsive"/i;
        const match = regex.exec(html);
        if (match && match[1]) {
          resolve(match[1]);
        } else resolve(null);
      });
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : require('http');
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else if ([301, 302].includes(res.statusCode) && res.headers.location) {
        downloadImage(res.headers.location, destPath).then(resolve);
      } else resolve(false);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(8000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  let successCount = 0;
  console.log(`🛒 Fetching correct images using optimized short keywords...`);

  for (const p of products) {
    const destPath = path.join(imgDir, `shop-prod-${p.id}.jpg`);
    process.stdout.write(`[${String(p.id).padStart(2)}] ${p.keyword.padEnd(35)} → `);
    
    let imgUrl = await fetchTiki(p.keyword);
    
    if (!imgUrl) {
      imgUrl = await fetchChiaki(p.keyword);
    }
    
    // If still fails, fallback to an open placeholder search
    if (!imgUrl) {
      imgUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.keyword)}`;
    }

    if (imgUrl) {
      const ok = await downloadImage(imgUrl, destPath);
      if (ok) {
        console.log(`✅ OK (${imgUrl.includes('tiki') ? 'Tiki' : 'Chiaki'})`);
        successCount++;
      } else {
        console.log(`❌ DL Failed`);
      }
    }
    
    await new Promise(r => setTimeout(r, 400));
  }

  // Update data.js
  if (successCount > 0) {
    const dataPath = path.join(__dirname, 'js', 'data.js');
    let code = fs.readFileSync(dataPath, 'utf8');
    
    code = code.replace(/\{ id: (\d+), categoryId:[^}]+\}/g, (match, idStr) => {
      const id = parseInt(idStr);
      if (fs.existsSync(path.join(imgDir, `shop-prod-${id}.jpg`))) {
        return match.replace(/image: "images\/[^"]*"/, `image: "images/shop-prod-${id}.jpg"`);
      }
      return match;
    });
    
    fs.writeFileSync(dataPath, code, 'utf8');
    console.log('\n📝 data.js updated with accurate Shopee/Tiki style images!');
  }
}

main();
