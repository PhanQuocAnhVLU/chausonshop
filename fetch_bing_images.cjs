const https = require('https');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'js', 'data.js');
let dataCode = fs.readFileSync(dataPath, 'utf8');

let PRODUCTS = [];
try {
  const evalCode = dataCode + "\nmodule.exports = { PRODUCTS, NEWS, BANNERS };";
  const tmpPath = path.join(__dirname, 'js', 'tmp_data.js');
  fs.writeFileSync(tmpPath, evalCode);
  const dataModule = require('./js/tmp_data.js');
  PRODUCTS = dataModule.PRODUCTS;
  fs.unlinkSync(tmpPath);
} catch(e) {
  console.error("Error parsing data.js:", e);
  process.exit(1);
}

console.log(`Found ${PRODUCTS.length} products to fetch exact images for using Bing...`);

async function fetchImageForProduct(p) {
  const keyword = p.name + " chính hãng";
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(keyword)}&form=HDRSC2`;
  
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        // Bing image search JSON data extraction
        const match = html.match(/murl&quot;:&quot;(https:\/\/[^&]+(?:jpg|jpeg|png))&quot;/i);
        if (match) {
          const imgUrl = match[1];
          const destPath = path.join(__dirname, 'images', `exact-${p.id}.jpg`);
          // Note: some images might be on http or fail, but we'll try our best
          const client = imgUrl.startsWith('https') ? https : require('http');
          client.get(imgUrl, (imgRes) => {
            if (imgRes.statusCode === 200 || imgRes.statusCode === 302 || imgRes.statusCode === 301) {
              const file = fs.createWriteStream(destPath);
              imgRes.pipe(file);
              file.on('finish', () => {
                file.close();
                resolve(true);
              });
            } else {
              resolve(false);
            }
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
  for (const p of PRODUCTS) {
    process.stdout.write(`Fetching ${p.id}: ${p.name.substring(0, 40)}... `);
    const success = await fetchImageForProduct(p);
    if (success) {
      console.log('OK');
      successCount++;
    } else {
      console.log('FAILED');
    }
    // Rate limiting
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`Downloaded ${successCount}/${PRODUCTS.length} exact images.`);
  
  // Replace images in data.js
  let newDataCode = dataCode;
  
  newDataCode = newDataCode.replace(/id:\s*(\d+),[\s\S]*?image:\s*["']([^"']+)["']/g, (match, idStr) => {
    return match.replace(/image:\s*["'][^"']+["']/, `image: "images/exact-${idStr}.jpg"`);
  });
  
  fs.writeFileSync(dataPath, newDataCode, 'utf8');
  console.log('Updated data.js with exact real images.');
}

main();
