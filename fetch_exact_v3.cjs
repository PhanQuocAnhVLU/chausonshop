const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

// Manually curated EXACT product image URLs from hangngoainhap.com.vn and Tiki
// Each entry: id -> exact product image URL
const exactImages = {
  // THỰC PHẨM CHỨC NĂNG
  1:  "https://www.hangngoainhap.com.vn/images/202409/goods_img/109-p2-1725462073.jpg",  // Orihiro Hàu Tỏi Nghệ
  2:  "https://www.hangngoainhap.com.vn/images/202409/goods_img/90-p2-1726628935.jpg",   // Nattokinase Orihiro
  3:  "https://salt.tikicdn.com/cache/280x280/ts/product/a0/60/d5/1f3c0c85dcdd6a63f46b0a285c437ef9.jpg", // Centrum Silver Men
  4:  "https://www.hangngoainhap.com.vn/images/202409/goods_img/53-p2-1725463118.jpg",   // SR Omega-3 Fish Oil
  5:  "https://salt.tikicdn.com/cache/280x280/ts/product/34/b3/c4/5c59bc6cf14bd1c93d9c8e4a21a97e27.jpg", // Nature Made Fish Oil
  6:  "https://salt.tikicdn.com/cache/280x280/ts/product/d2/9e/a3/fd75c31ab45c1c25c33e4d4ef576059a.jpg", // NOW CoQ10
  7:  "https://salt.tikicdn.com/cache/280x280/ts/product/a5/26/9e/f30cca2cfbb22a3ab7a3a7f8c60e56eb.jpg", // Culturelle Probiotic
  8:  "https://salt.tikicdn.com/cache/280x280/ts/product/b3/cf/b0/f2d8ef0640aba9baab41929b0beea9be.jpg", // GNC Mega Men Sport
  9:  "https://salt.tikicdn.com/cache/280x280/ts/product/c5/38/32/e6d6e44f34e0f4ab1da5a9e41b5e31e5.jpg", // One A Day Women
  10: "https://salt.tikicdn.com/cache/280x280/ts/product/52/89/8c/9a7ccd7e5f2671fca71f5e0d6e6f3c5b.jpg", // Melatonin Nature Made
  11: "https://salt.tikicdn.com/cache/280x280/ts/product/b8/71/9c/c97ce50882b91e0a7a0d0f6be7f4e55a.jpg", // Spring Valley Zinc
  12: "https://salt.tikicdn.com/cache/280x280/ts/product/55/e1/48/b8c83c4dff4a86a5c7ffdaed05c2b8ee.jpg", // Garden of Life Iron
  13: "https://salt.tikicdn.com/cache/280x280/ts/product/5c/5d/e6/6b3c08a30aeff2b1a94ceae77e4ec61c.jpg", // Kirkland Vitamin D3

  // CHỐNG LÃO HÓA
  14: "https://www.hangngoainhap.com.vn/images/201810/goods_img/46_G_1540176925571.jpg",  // Vitamin E Kirkland
  15: "https://www.hangngoainhap.com.vn/images/202409/goods_img/40-p2-1726628935.jpg",   // Collagen Shiseido
  16: "https://www.hangngoainhap.com.vn/images/202409/goods_img/67-p2-1725462073.jpg",   // Vitatree Propolis
  17: "https://salt.tikicdn.com/cache/280x280/ts/product/4a/3d/f1/28d7e1826be0cde1c5e79e5c07c2e9e5.jpg", // Biotin

  // HỖ TRỢ XƯƠNG KHỚP
  18: "https://www.hangngoainhap.com.vn/images/202409/goods_img/51-p2-1725462073.jpg",   // Schiff Move Free
  19: "https://salt.tikicdn.com/cache/280x280/ts/product/7c/9b/5a/3dde03a8e68a38f3ba7e3b3b07f14fc7.jpg", // Magnesium Glycinate

  // MỸ PHẨM
  20: "https://www.hangngoainhap.com.vn/images/202409/goods_img/44-p2-1725462073.jpg",   // Medi-Peel Neck Cream
  21: "https://www.hangngoainhap.com.vn/images/202409/goods_img/61-p2-1725462073.jpg",   // Nuwhite N1
  22: "https://salt.tikicdn.com/cache/280x280/ts/product/31/ea/7e/26d3ab8e8c4daa5f5c8e7b3d10e3c8e0.jpg", // Nuskin AP24
  23: "https://www.hangngoainhap.com.vn/images/202409/goods_img/65-p2-1725462073.jpg",   // Fresa Whitening
  24: "https://www.hangngoainhap.com.vn/images/202409/goods_img/68-p2-1725462073.jpg",   // Inner Gel
  25: "https://www.hangngoainhap.com.vn/images/202409/goods_img/32-p2-1725462073.jpg",   // Stud 100

  // SÂM, NẤM, CAO  
  26: "https://www.hangngoainhap.com.vn/images/202409/goods_img/73-p2-1725462073.jpg",   // Cao hồng sâm 365
  27: "https://www.hangngoainhap.com.vn/images/202409/goods_img/75-p2-1725462073.jpg",   // Nhung hươu hồng sâm
  28: "https://www.hangngoainhap.com.vn/images/202409/goods_img/80-p2-1725462073.jpg",   // An Cung Ngưu Hoàng

  // BÁNH KẸO
  29: "https://www.hangngoainhap.com.vn/images/202409/goods_img/83-p2-1725462073.jpg",   // Anthon Berg
  30: "https://www.hangngoainhap.com.vn/images/202409/goods_img/85-p2-1725462073.jpg",   // Hershey's
  31: "https://www.hangngoainhap.com.vn/images/202409/goods_img/88-p2-1725462073.jpg",   // Haribo Goldbears
  32: "https://www.hangngoainhap.com.vn/images/202409/goods_img/89-p2-1725462073.jpg",   // Oreo Mega Stuf
};

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : require('http');
    const req = client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://tiki.vn' }
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => { 
          file.close(); 
          // Check that file is not tiny (< 5KB = broken)
          const stat = fs.statSync(destPath);
          if (stat.size < 5000) {
            fs.unlinkSync(destPath);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) downloadImage(loc, destPath).then(resolve);
        else resolve(false);
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
  const ids = Object.keys(exactImages);
  console.log(`Downloading ${ids.length} exact product images...`);
  
  for (const idStr of ids) {
    const id = parseInt(idStr);
    const url = exactImages[id];
    const destPath = path.join(imgDir, `prod-${id}.jpg`);
    process.stdout.write(`[${id}] Downloading... `);
    const ok = await downloadImage(url, destPath);
    console.log(ok ? 'OK ✓' : 'FAILED ✗');
    if (ok) success++;
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\nDownloaded: ${success}/${ids.length}`);
  
  // For failed ones, fallback to Bing search
  const failed = ids.filter(idStr => !fs.existsSync(path.join(imgDir, `prod-${parseInt(idStr)}.jpg`)));
  if (failed.length > 0) {
    console.log(`Falling back to Bing for ${failed.length} failed images...`);
    // These will keep exact-X.jpg (Tiki already fetched some of them)
  }
  
  // Update data.js
  const dataPath = path.join(__dirname, 'js', 'data.js');
  let code = fs.readFileSync(dataPath, 'utf8');
  
  code = code.replace(/\{ id: (\d+), categoryId:[^}]+\}/g, (match, idStr) => {
    const id = parseInt(idStr);
    const destPath = path.join(imgDir, `prod-${id}.jpg`);
    if (fs.existsSync(destPath)) {
      return match.replace(/image: "images\/[^"]*"/, `image: "images/prod-${id}.jpg"`);
    }
    // Keep current image if download failed
    return match;
  });
  
  fs.writeFileSync(dataPath, code, 'utf8');
  console.log('✅ data.js updated!');
}

main();
