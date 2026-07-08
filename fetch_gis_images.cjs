const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const gis = require('g-i-s');

const dataPath = path.join(__dirname, 'js', 'data.js');
let dataCode = fs.readFileSync(dataPath, 'utf8');

let PRODUCTS = [];
try {
  const evalCode = dataCode + "\nmodule.exports = { PRODUCTS };";
  const tmpPath = path.join(__dirname, 'js', 'tmp_data2.js');
  fs.writeFileSync(tmpPath, evalCode);
  const dataModule = require('./js/tmp_data2.js');
  PRODUCTS = dataModule.PRODUCTS;
  fs.unlinkSync(tmpPath);
} catch(e) {
  console.error("Error parsing data.js:", e);
  process.exit(1);
}

const imgDir = path.join(__dirname, 'images');

async function searchImage(keyword) {
  return new Promise((resolve) => {
    // Adding "sản phẩm" to get better e-commerce product photos instead of random graphs
    gis(keyword + ' sản phẩm hộp chính hãng', (error, results) => {
      if (error) {
        resolve(null);
      } else {
        // filter out overly long URLs or base64
        const valid = results.filter(r => r.url && r.url.startsWith('http') && r.url.length < 500);
        resolve(valid.length > 0 ? valid[0].url : null);
      }
    });
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else {
        // If 403 or something, try next image maybe? We'll just fail gracefully.
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function main() {
  let successCount = 0;
  console.log(`Starting true Google Image download for ${PRODUCTS.length} products...`);
  
  for (const p of PRODUCTS) {
    process.stdout.write(`[${p.id}] Searching for: ${p.name.substring(0, 30)}... `);
    
    // Search
    let imgUrl = await searchImage(p.name);
    
    if (imgUrl) {
      // Download
      const destPath = path.join(imgDir, `exact-${p.id}.jpg`);
      const success = await downloadImage(imgUrl, destPath);
      
      if (success) {
        console.log(`OK!`);
        successCount++;
      } else {
        console.log(`DOWNLOAD FAILED.`);
      }
    } else {
      console.log(`NO RESULTS.`);
    }
    
    // Slight delay to respect rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`\n🎉 Downloaded ${successCount}/${PRODUCTS.length} TRUE exact images!`);
  console.log(`The data.js file already points to images/exact-X.jpg, so no need to update it again.`);
}

main();
