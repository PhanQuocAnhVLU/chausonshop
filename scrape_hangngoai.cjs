const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

// Scrape the category pages of hangngoainhap.com.vn to get product images
const categoryUrls = [
  'https://www.hangngoainhap.com.vn/thuc-pham-chuc-nang-c229.html',
  'https://www.hangngoainhap.com.vn/chong-lao-hoa-c235.html',
  'https://www.hangngoainhap.com.vn/lam-dep-c247.html',
  'https://www.hangngoainhap.com.vn/sam-nhung-cao-c237.html',
  'https://www.hangngoainhap.com.vn/banh-keo-c239.html',
];

let productMap = {}; // name -> imageUrl

async function scrapePage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        // Pattern: <div class="goods-name">Name</div> near <img src="url">
        // Or simpler: find img with alt that has product name
        // hangngoainhap uses: <img src="images/YYYYMM/goods_img/XXX-p2-XXXXXX.jpg" title="Name" alt="Name">
        const regex = /<img[^>]+src=["'](images\/\d{6}\/goods_img\/[^"']+\.jpg)["'][^>]*(?:alt|title)=["']([^"']{15,})["']/gi;
        const regex2 = /(?:alt|title)=["']([^"']{15,})["'][^>]*src=["'](images\/\d{6}\/goods_img\/[^"']+\.jpg)["']/gi;
        let match;
        while ((match = regex.exec(html)) !== null) {
          productMap[match[2].trim()] = 'https://www.hangngoainhap.com.vn/' + match[1];
        }
        while ((match = regex2.exec(html)) !== null) {
          productMap[match[1].trim()] = 'https://www.hangngoainhap.com.vn/' + match[2];
        }
        resolve();
      });
    }).on('error', () => resolve());
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return downloadImage(res.headers.location, destPath).then(resolve);
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const sz = fs.statSync(destPath).size;
          if (sz < 3000) { fs.unlinkSync(destPath); resolve(false); }
          else resolve(true);
        });
      } else resolve(false);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(8000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  console.log('Scraping hangngoainhap.com.vn category pages...');
  for (const url of categoryUrls) {
    await scrapePage(url);
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log(`Found ${Object.keys(productMap).length} products on the site.`);
  
  // Show the first 10
  const keys = Object.keys(productMap);
  keys.slice(0, 10).forEach(k => console.log(' -', k.substring(0, 50), '->', productMap[k].substring(0, 60)));
  
  // Now match to our product list
  const dataPath = path.join(__dirname, 'js', 'data.js');
  const code = fs.readFileSync(dataPath, 'utf8');
  
  // Extract our products
  const productsMatch = code.match(/name: "([^"]+)"/g);
  const names = productsMatch ? productsMatch.map(m => m.replace('name: "','').replace('"','')) : [];
  
  console.log(`\nOur products: ${names.length}`);
  
  // For each of our products, find best match in scraped
  let matchedCount = 0;
  
  function similarity(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const wordsA = a.split(/\s+/);
    const wordsB = b.split(/\s+/);
    const common = wordsA.filter(w => w.length > 3 && wordsB.some(wb => wb.includes(w) || w.includes(wb)));
    return common.length / Math.max(wordsA.length, wordsB.length);
  }
  
  const matches = {};
  for (let i = 0; i < names.length; i++) {
    let bestMatch = null, bestScore = 0;
    for (const scrapedName of keys) {
      const score = similarity(names[i], scrapedName);
      if (score > bestScore && score > 0.2) {
        bestScore = score;
        bestMatch = scrapedName;
      }
    }
    if (bestMatch) {
      matches[i+1] = { name: names[i], matched: bestMatch, url: productMap[bestMatch], score: bestScore };
      matchedCount++;
    }
  }
  
  console.log(`\nMatched ${matchedCount}/${names.length} products to scraped images:`);
  Object.values(matches).forEach(m => {
    console.log(`  [${m.score.toFixed(2)}] ${m.name.substring(0,30)} -> ${m.matched.substring(0,30)}`);
  });
  
  // Download matched images
  let downloaded = 0;
  for (const [idStr, info] of Object.entries(matches)) {
    const id = parseInt(idStr);
    const destPath = path.join(imgDir, `prod-${id}.jpg`);
    if (!fs.existsSync(destPath)) {
      const ok = await downloadImage(info.url, destPath);
      if (ok) downloaded++;
    }
  }
  
  console.log(`Downloaded ${downloaded} new images from hangngoainhap.`);
  
  // Write final URL mapping for manual inspection
  fs.writeFileSync(path.join(__dirname, 'product_image_map.json'), JSON.stringify(matches, null, 2));
  console.log('Saved product_image_map.json for inspection.');
}

main();
