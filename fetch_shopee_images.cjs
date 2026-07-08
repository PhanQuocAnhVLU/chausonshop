const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

// Our products list with Shopee-friendly search keywords
const products = [
  // THỰC PHẨM CHỨC NĂNG
  { id: 1,  keyword: "Orihiro hàu tươi tỏi nghệ 180 viên" },
  { id: 2,  keyword: "Nattokinase 2000FU Orihiro Nhật Bản" },
  { id: 3,  keyword: "Centrum Silver Ultra Men 50+ 275 viên Mỹ" },
  { id: 4,  keyword: "SR Triple Strength Omega-3 Fish Oil 150 viên" },
  { id: 5,  keyword: "Nature Made Fish Oil 1200mg 200 viên" },
  { id: 6,  keyword: "NOW Foods CoQ10 600mg 60 viên" },
  { id: 7,  keyword: "Culturelle Pro Strength Probiotic 30 viên" },
  { id: 8,  keyword: "GNC Mega Men Sport Multivitamin 180 viên" },
  { id: 9,  keyword: "One A Day Women Petites Multivitamin 160 viên" },
  { id: 10, keyword: "Melatonin 10mg Nature Made 90 viên" },
  { id: 11, keyword: "Spring Valley Zinc 50mg 200 viên" },
  { id: 12, keyword: "Garden of Life Vitamin Code Raw Iron" },
  { id: 13, keyword: "Kirkland Vitamin D3 2000IU 600 viên" },
  // CHỐNG LÃO HÓA
  { id: 14, keyword: "Vitamin E 400IU Kirkland Signature 500 viên Mỹ" },
  { id: 15, keyword: "The Collagen Shiseido nước Nhật Bản 50ml" },
  { id: 16, keyword: "Vitatree Propolis Spray 30ml Úc" },
  { id: 17, keyword: "Biotin 10000mcg Nature Bounty 120 viên" },
  // HỖ TRỢ XƯƠNG KHỚP
  { id: 18, keyword: "Schiff Move Free Joint Health Advanced 200 viên" },
  { id: 19, keyword: "Nature Made Magnesium Glycinate 200mg" },
  // MỸ PHẨM
  { id: 20, keyword: "Medi Peel Naite Thread Neck Cream 100ml" },
  { id: 21, keyword: "Nuwhite N1 Mibiti Prudente kem hồng nhũ hoa" },
  { id: 22, keyword: "Nuskin AP24 Whitening Fluoride Toothpaste" },
  { id: 23, keyword: "Fresa Whitening Sunblock viên uống trắng da" },
  { id: 24, keyword: "Inner Gel Wettrust 30 ống hồng Hàn Quốc" },
  { id: 25, keyword: "Stud 100 Spray Delay For Men xịt" },
  // SÂM, NẤM, CAO
  { id: 26, keyword: "Cao hồng sâm 365 Hàn Quốc 6 năm tuổi 250g" },
  { id: 27, keyword: "Nước nhung hươu hồng sâm 365 Hansusam Hàn Quốc" },
  { id: 28, keyword: "An Cung Ngưu Hoàng Hoàn Kwang Dong Hàn Quốc" },
  // BÁNH KẸO
  { id: 29, keyword: "Anthon Berg Chocolate rượu 64 chai" },
  { id: 30, keyword: "Hershey's Nuggets Assortment 1.47kg socola" },
  { id: 31, keyword: "Haribo Goldbears kẹo dẻo gấu 1kg Đức" },
  { id: 32, keyword: "Oreo Mega Stuf Double 482g bánh quy Mỹ" },
];

function fetchShopeeImage(keyword) {
  const url = `https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(keyword)}&limit=1&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;

  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://shopee.vn/search?keyword=' + encodeURIComponent(keyword),
        'X-API-SOURCE': 'pc',
        'af-ac-enc-dat': '',
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const items = json.items;
          if (items && items.length > 0) {
            const imgHash = items[0].item_basic?.image || items[0].item_basic?.images?.[0];
            if (imgHash) {
              return resolve(`https://cf.shopee.vn/file/${imgHash}`);
            }
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
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://shopee.vn' }
    }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const sz = fs.statSync(destPath).size;
          if (sz < 5000) { fs.unlinkSync(destPath); resolve(false); }
          else resolve(true);
        });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, destPath).then(resolve);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(10000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  let success = 0;
  console.log(`🛒 Fetching ${products.length} product images from Shopee...\n`);

  for (const p of products) {
    process.stdout.write(`[${String(p.id).padStart(2)}] ${p.keyword.substring(0, 40).padEnd(40)} → `);
    const imgUrl = await fetchShopeeImage(p.keyword);
    if (imgUrl) {
      const destPath = path.join(imgDir, `prod-${p.id}.jpg`);
      const ok = await downloadImage(imgUrl, destPath);
      console.log(ok ? '✅ OK' : '❌ Download failed');
      if (ok) success++;
    } else {
      console.log('❌ Not found on Shopee');
    }
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n✅ Downloaded ${success}/${products.length} exact images from Shopee!`);

  if (success > 0) {
    // Update data.js image paths
    const dataPath = path.join(__dirname, 'js', 'data.js');
    let code = fs.readFileSync(dataPath, 'utf8');

    code = code.replace(/\{ id: (\d+), categoryId:[^}]+\}/g, (match, idStr) => {
      const id = parseInt(idStr);
      const destPath = path.join(imgDir, `prod-${id}.jpg`);
      if (fs.existsSync(destPath)) {
        return match.replace(/image: "images\/[^"]*"/, `image: "images/prod-${id}.jpg"`);
      }
      return match;
    });

    fs.writeFileSync(dataPath, code, 'utf8');
    console.log('📝 data.js updated with Shopee images!');
  }
}

main();
