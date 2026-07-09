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

console.log(`Found ${PRODUCTS.length} products to fetch exact images for.`);

async function fetchImageForProduct(p) {
  const keyword = p.name + " chính hãng";
  const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(keyword)}`;
  
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' }
    }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        // Find the Bing thumbnail which Yahoo Image Search uses
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
  for (const p of PRODUCTS) {
    process.stdout.write(`Fetching ${p.id}: ${p.name.substring(0, 40)}... `);
    const success = await fetchImageForProduct(p);
    if (success) {
      console.log('OK');
      successCount++;
    } else {
      console.log('FAILED');
    }
    // Small delay
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`Downloaded ${successCount}/${PRODUCTS.length} exact images.`);
  
  // Now replace image strings inside data.js securely
  let newDataCode = dataCode;
  
  // Use regex to replace image path specifically for each block identified by id: X
  newDataCode = newDataCode.replace(/id:\s*(\d+),[\s\S]*?image:\s*["']([^"']+)["']/g, (match, idStr) => {
    return match.replace(/image:\s*["'][^"']+["']/, `image: "images/exact-${idStr}.jpg"`);
  });
  
  // Fix any leftover real-NaN.jpg for NEWS and BANNERS
  newDataCode = newDataCode.replace(/images\/real-NaN\.jpg/g, "images/exact-1.jpg");
  
  fs.writeFileSync(dataPath, newDataCode, 'utf8');
  console.log('Updated data.js successfully!');
}

main();
