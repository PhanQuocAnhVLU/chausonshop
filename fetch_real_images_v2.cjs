const https = require('https');
const fs = require('fs');
const path = require('path');

const domain = 'https://www.hangngoainhap.com.vn';
const imgDir = path.join(__dirname, 'images');

const options = {
  hostname: 'www.hangngoainhap.com.vn',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  }
};

https.get(options, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // Regex to match src, data-src, etc. with image extensions
    const regex = /(?:src|data-src|data-original)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
    const matches = [...html.matchAll(regex)].map(m => m[1]);
    
    // Convert to absolute URLs
    let uniqueUrls = [...new Set(matches)].map(u => {
      if (u.startsWith('http')) return u;
      if (u.startsWith('//')) return 'https:' + u;
      if (u.startsWith('/')) return domain + u;
      return domain + '/' + u;
    });

    // Filter to get mostly product images (usually containing 'upload' or similar on this site)
    uniqueUrls = uniqueUrls.filter(u => u.includes('upload') || u.includes('san-pham') || u.includes('product'));
    
    // If not enough, just take any images
    if (uniqueUrls.length < 10) {
       uniqueUrls = [...new Set(matches)].map(u => {
         if (u.startsWith('http')) return u;
         if (u.startsWith('//')) return 'https:' + u;
         if (u.startsWith('/')) return domain + u;
         return domain + '/' + u;
       });
    }

    console.log(`Found ${uniqueUrls.length} image URLs.`);
    
    const targetUrls = uniqueUrls.slice(0, 45);
    
    if(targetUrls.length === 0) {
        console.log("Still no images found, HTML might be rendered client-side or blocked.");
        return;
    }

    let downloadPromises = targetUrls.map((url, i) => {
      return new Promise((resolve) => {
        const destPath = path.join(imgDir, `real-${i + 1}.jpg`);
        https.get(url, (imgRes) => {
          if (imgRes.statusCode === 200) {
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
      });
    });

    Promise.all(downloadPromises).then((results) => {
      const successCount = results.filter(r => r).length;
      console.log(`Successfully downloaded ${successCount} images.`);
      
      if (successCount > 0) {
          const dataJsPath = path.join(__dirname, 'js', 'data.js');
          let dataCode = fs.readFileSync(dataJsPath, 'utf8');
          
          dataCode = dataCode.replace(/images\/(product|real)-(\d+)\.(svg|png|jpg)/g, (match, type, p1) => {
            let imgNum = parseInt(p1);
            if (imgNum > targetUrls.length) {
              imgNum = (imgNum % targetUrls.length) + 1;
            }
            // Ensure 1-based index isn't 0
            if (imgNum === 0) imgNum = 1;
            return `images/real-${imgNum}.jpg`;
          });
          
          fs.writeFileSync(dataJsPath, dataCode, 'utf8');
          console.log('Updated data.js with downloaded real images.');
      }
    });
  });
});
