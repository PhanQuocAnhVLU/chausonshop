const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

const products = [
  { id: 33, keyword: "Viên giặt xả Gel Ball 3D nội địa Nhật Bản 46 viên" },
  { id: 34, keyword: "Bình giữ nhiệt Thermos JNL-504 500ml cao cấp Nhật Bản" },
  { id: 35, keyword: "Nồi chiên không dầu Philips HD9252/90 4.1L Đức" },
  { id: 36, keyword: "Nước tẩy lồng giặt Rocket Nhật Bản chai 550g" }
];

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const sz = fs.statSync(destPath).size;
          if (sz < 5000) { 
            fs.unlinkSync(destPath); resolve(false); 
          } else { resolve(true); }
        });
      } else if ([301, 302].includes(res.statusCode) && res.headers.location) {
        downloadImage(res.headers.location, destPath).then(resolve);
      } else {
        res.resume(); resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(8000, () => { req.destroy(); resolve(false); });
  });
}

async function searchBing(keyword) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(keyword + " shopee vn")}&form=HDRSC2`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const regex = /murl&quot;:&quot;(https:\/\/[^&]+(?:jpg|jpeg|png))&quot;/ig;
        let match;
        const urls = [];
        while ((match = regex.exec(html)) !== null) { urls.push(match[1]); }
        resolve(urls);
      });
    }).on('error', () => resolve([]));
  });
}

async function main() {
  for (const p of products) {
    const destPath = path.join(imgDir, `bing-prod-${p.id}.jpg`);
    console.log(`Fetching ${p.id}: ${p.keyword}`);
    const urls = await searchBing(p.keyword);
    
    for (let i = 0; i < urls.length; i++) {
      const ok = await downloadImage(urls[i], destPath);
      if (ok) {
        console.log(`✅ OK`);
        break;
      }
    }
    await new Promise(r => setTimeout(r, 500));
  }
}
main();
