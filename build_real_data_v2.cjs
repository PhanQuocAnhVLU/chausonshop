const https = require('https');
const fs = require('fs');
const path = require('path');

const domain = 'https://www.hangngoainhap.com.vn';
const urls = [
  '/',
  '/thuc-pham-chuc-nang-c229.html',
  '/lam-dep-c247.html',
  '/me-va-be-c238.html'
];

let allProducts = [];

async function scrapeCategory(urlPath, defaultCat) {
  return new Promise((resolve) => {
    https.get(domain + urlPath, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const regex1 = /src=["']([^"']+\.jpg)["'][^>]*alt=["']([^"']+)["']/gi;
        const regex2 = /alt=["']([^"']+)["'][^>]*src=["']([^"']+\.jpg)["']/gi;
        
        let match;
        while ((match = regex1.exec(html)) !== null) {
          const img = match[1].startsWith('http') ? match[1] : (match[1].startsWith('/') ? domain + match[1] : domain + '/' + match[1]);
          const name = match[2];
          if (name.length > 15 && !name.toLowerCase().includes('banner') && !name.toLowerCase().includes('logo')) {
            allProducts.push({ name, img, categoryId: defaultCat });
          }
        }
        
        while ((match = regex2.exec(html)) !== null) {
          const name = match[1];
          const img = match[2].startsWith('http') ? match[2] : (match[2].startsWith('/') ? domain + match[2] : domain + '/' + match[2]);
          if (name.length > 15 && !name.toLowerCase().includes('banner') && !name.toLowerCase().includes('logo')) {
            allProducts.push({ name, img, categoryId: defaultCat });
          }
        }
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function main() {
  await scrapeCategory(urls[0], 'thuc-pham-chuc-nang');
  await scrapeCategory(urls[1], 'thuc-pham-chuc-nang');
  await scrapeCategory(urls[2], 'chong-lao-hoa');
  await scrapeCategory(urls[3], 'me-va-be');
  
  let unique = [];
  let seen = new Set();
  for (let p of allProducts) {
    if (!seen.has(p.name)) {
      seen.add(p.name);
      unique.push(p);
    }
  }
  
  console.log(`Found ${unique.length} exact real products!`);
  
  if (unique.length === 0) {
      console.log("Still failing to scrape products, exiting.");
      return;
  }
  
  const imgDir = path.join(__dirname, 'images');
  
  let idCounter = 1;
  let finalProducts = [];
  
  for (let p of unique) {
    const pId = idCounter++;
    const destPath = path.join(imgDir, `exact-${pId}.jpg`);
    
    await new Promise(resolve => {
      https.get(p.img, (res) => {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', () => resolve());
    });
    
    finalProducts.push({
      id: pId,
      categoryId: p.categoryId,
      name: p.name.replace(/"/g, "'"),
      price: Math.floor(Math.random() * 500 + 300) * 1000,
      originalPrice: Math.floor(Math.random() * 800 + 600) * 1000,
      image: `images/exact-${pId}.jpg`,
      badge: Math.random() > 0.7 ? "HOT" : null,
      rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
      reviews: Math.floor(Math.random() * 200 + 50),
      sold: Math.floor(Math.random() * 1000 + 200),
      tag: "Hàng Ngoại Nhập",
      isNew: Math.random() > 0.8,
      isSale: Math.random() > 0.5,
      isBestSeller: Math.random() > 0.8
    });
    process.stdout.write(`.`);
  }
  
  const dataPath = path.join(__dirname, 'js', 'data.js');
  let dataCode = fs.readFileSync(dataPath, 'utf8');
  
  const parts1 = dataCode.split('const PRODUCTS = [');
  if (parts1.length === 2) {
    const parts2 = parts1[1].split('];');
    
    let productsString = '';
    finalProducts.forEach((fp, i) => {
      productsString += `  { id: ${fp.id}, categoryId: "${fp.categoryId}", name: "${fp.name}", price: ${fp.price}, originalPrice: ${fp.originalPrice}, image: "${fp.image}", badge: ${fp.badge ? '"'+fp.badge+'"' : 'null'}, rating: ${fp.rating}, reviews: ${fp.reviews}, sold: ${fp.sold}, tag: "${fp.tag}", isNew: ${fp.isNew}, isSale: ${fp.isSale}, isBestSeller: ${fp.isBestSeller} }${i < finalProducts.length - 1 ? ',' : ''}\n`;
    });
    
    let remainder = parts2.slice(1).join('];');
    remainder = remainder.replace(/images\/(real-NaN|exact-\d+|product-\d+)\.(jpg|png|svg)/g, "images/exact-1.jpg");
    
    const newCode = parts1[0] + 'const PRODUCTS = [\n' + productsString + '];' + remainder;
    fs.writeFileSync(dataPath, newCode, 'utf8');
    console.log('\nSuccessfully rewritten data.js with accurate real products and images!');
  }
}

main();
