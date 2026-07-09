const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

// Map: product id -> { name, searchKeyword, tikiKeyword }
// We use very specific English/brand keywords so Tiki finds exact products
const products = [
  // THỰC PHẨM CHỨC NĂNG
  { id: 1, keyword: "Orihiro hàu tươi tỏi nghệ 180 viên" },
  { id: 2, keyword: "Nattokinase 2000FU Orihiro" },
  { id: 3, keyword: "Centrum Silver Men 50+ 275 vien" },
  { id: 4, keyword: "Omega-3 Fish Oil Triple Strength SR" },
  { id: 5, keyword: "Nature Made Fish Oil 1200mg 200 vien" },
  { id: 6, keyword: "NOW Foods CoQ10 600mg" },
  { id: 7, keyword: "Culturelle Pro Strength Daily Probiotic" },
  { id: 8, keyword: "GNC Mega Men Sport Multivitamin" },
  { id: 9, keyword: "One A Day Women Petites Multivitamin" },
  { id: 10, keyword: "Melatonin 10mg Nature Made 90 vien" },
  { id: 11, keyword: "Spring Valley Zinc 50mg 200 vien" },
  { id: 12, keyword: "Garden of Life Vitamin Code Raw Iron" },
  { id: 13, keyword: "Kirkland Vitamin D3 2000IU 600 vien" },
  // CHỐNG LÃO HÓA
  { id: 14, keyword: "Vitamin E 400IU Kirkland 500 vien" },
  { id: 15, keyword: "The Collagen Shiseido nuoc Nhat 50ml" },
  { id: 16, keyword: "Vitatree Propolis Spray 30ml" },
  { id: 17, keyword: "Biotin 10000mcg Nature Bounty 120 vien" },
  // HỖ TRỢ XƯƠNG KHỚP
  { id: 18, keyword: "Schiff Move Free Joint Health 200 vien" },
  { id: 19, keyword: "Nature Made Magnesium Glycinate 200mg" },
  // MỸ PHẨM
  { id: 20, keyword: "Medi Peel Naite Thread Neck Cream 100ml" },
  { id: 21, keyword: "Kem hong nhu hoa Nuwhite N1 Mibiti" },
  { id: 22, keyword: "Nuskin AP24 Whitening Fluoride Toothpaste" },
  { id: 23, keyword: "Fresa Whitening Sunblock vien uong trang da" },
  { id: 24, keyword: "Inner Gel Wettrust 30 ong hong Han Quoc" },
  { id: 25, keyword: "Stud 100 Spray Delay For Men" },
  // SÂM, NẤM, CAO
  { id: 26, keyword: "Cao hong sam 365 Han Quoc 250g" },
  { id: 27, keyword: "Nuoc nhung huou hong sam 365 Hansusam" },
  { id: 28, keyword: "An Cung Nguu Hoang Hoan Kwang Dong" },
  // BÁNH KẸO
  { id: 29, keyword: "Anthon Berg Chocolate 64 chai ruou" },
  { id: 30, keyword: "Hershey's Nuggets Assortment 1.47kg" },
  { id: 31, keyword: "Haribo Goldbears 1kg keo deo gau" },
  { id: 32, keyword: "Oreo Mega Stuf Double 482g" },
];

function fetchTikiImage(keyword) {
  const encodedQ = encodeURIComponent(keyword);
  const url = `https://tiki.vn/api/v2/products?limit=1&q=${encodedQ}`;
  
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Referer': 'https://tiki.vn'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const items = json.data;
          if (items && items.length > 0) {
            const imgUrl = items[0].thumbnail_url || items[0].image_url;
            if (imgUrl) return resolve(imgUrl);
          }
          resolve(null);
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : require('http');
    const req = client.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) downloadImage(loc, destPath).then(resolve);
        else resolve(false);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(8000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  let success = 0;
  console.log(`Fetching ${products.length} product images from Tiki API...`);
  
  for (const p of products) {
    process.stdout.write(`[${p.id}] ${p.keyword.substring(0, 35)}... `);
    const imgUrl = await fetchTikiImage(p.keyword);
    if (imgUrl) {
      const destPath = path.join(imgDir, `prod-${p.id}.jpg`);
      const ok = await downloadImage(imgUrl, destPath);
      console.log(ok ? `OK (${imgUrl.substring(0, 50)})` : 'DL FAILED');
      if (ok) success++;
    } else {
      console.log('NOT FOUND on Tiki');
    }
    await new Promise(r => setTimeout(r, 400));
  }
  
  console.log(`\nDownloaded ${success}/${products.length} images from Tiki.`);
  
  // Update data.js image paths
  if (success > 0) {
    const dataPath = path.join(__dirname, 'js', 'data.js');
    let code = fs.readFileSync(dataPath, 'utf8');
    
    // Replace each image path based on id
    code = code.replace(/{ id: (\d+), categoryId:[^}]+}/g, (match, idStr) => {
      const id = parseInt(idStr);
      const destPath = path.join(imgDir, `prod-${id}.jpg`);
      if (fs.existsSync(destPath)) {
        return match.replace(/image: "images\/[^"]*"/, `image: "images/prod-${id}.jpg"`);
      }
      return match;
    });
    
    fs.writeFileSync(dataPath, code, 'utf8');
    console.log('✅ data.js updated with Tiki images!');
  }
}

main();
