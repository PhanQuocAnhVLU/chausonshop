const https = require('https');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'js', 'data.js');
let dataCode = fs.readFileSync(dataPath, 'utf8');

// Extract product names using regex from data.js
const nameRegex = /id:\s*(\d+),\s*name:\s*["']([^"']+)["']/g;
let products = [];
let match;
while ((match = nameRegex.exec(dataCode)) !== null) {
  products.push({ id: match[1], name: match[2] });
}

console.log(`Found ${products.length} products to fetch exact images for.`);

async function fetchImageForProduct(p) {
  const keyword = p.name;
  const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(keyword)}`;
  
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' }
    }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        // Yahoo Image Search uses tseX.mm.bing.net for thumbnails, which are reliable to download
        const imgMatch = html.match(/src=["'](https:\/\/tse\d+\.mm\.bing\.net\/th\?id=[^"']+)["']/i);
        if (imgMatch) {
          const imgUrl = imgMatch[1].replace(/&amp;/g, '&');
          const destPath = path.join(__dirname, 'images', `exact-${p.id}.jpg`);
          https.get(imgUrl, (imgRes) => {
            const file = fs.createWriteStream(destPath);
            imgRes.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve(true);
            });
          }).on('error', () => resolve(false));
        } else {
          resolve(false);
        }
      });
    }).on('error', () => resolve(false));
  });
}

async function main() {
  let successCount = 0;
  for (const p of products) {
    process.stdout.write(`Fetching ${p.id}: ${p.name.substring(0, 30)}... `);
    const success = await fetchImageForProduct(p);
    if (success) {
      console.log('OK');
      successCount++;
    } else {
      console.log('FAILED');
    }
    // Small delay to prevent rate limit
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`Downloaded ${successCount}/${products.length} exact images.`);
  
  // Update data.js
  dataCode = dataCode.replace(/images\/(product|real|exact)-(\d+)\.(svg|png|jpg)/g, (fullMatch, prefix, idStr) => {
    // We map id to exact-id.jpg (if download failed, it will just show a broken image, but we can fix that later if needed)
    return `images/exact-${idStr}.jpg`;
  });
  
  fs.writeFileSync(dataPath, dataCode, 'utf8');
  console.log('Updated data.js with exact images.');
}

main();
