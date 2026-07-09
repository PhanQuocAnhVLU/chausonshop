const https = require('https');
const fs = require('fs');
const path = require('path');

const domain = 'https://www.hangngoainhap.com.vn';
const imgDir = path.join(__dirname, 'images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir);
}

// 1. Fetch homepage to extract image URLs
https.get(domain, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // Extract .jpg URLs
    const matches = [...html.matchAll(/src=["']([^"']+\.jpg)["']/gi)].map(m => m[1]);
    const uniqueUrls = [...new Set(matches)]
      .filter(u => u.includes('/upload/') || u.includes('/img/')) // Filter for likely product/banner images
      .map(u => u.startsWith('http') ? u : (u.startsWith('/') ? domain + u : domain + '/' + u));

    console.log(`Found ${uniqueUrls.length} unique JPG images.`);

    // 2. Download the images
    let downloadPromises = [];
    let count = 1;

    // Use up to 45 images
    const targetUrls = uniqueUrls.slice(0, 45);

    targetUrls.forEach((url, i) => {
      const idx = i + 1;
      const destPath = path.join(imgDir, `real-${idx}.jpg`);
      
      const p = new Promise((resolve) => {
        https.get(url, (imgRes) => {
          const file = fs.createWriteStream(destPath);
          imgRes.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', () => resolve()); // Ignore errors
      });
      downloadPromises.push(p);
    });

    // 3. Update data.js once downloads are initiated/finished
    Promise.all(downloadPromises).then(() => {
      console.log('Finished downloading images.');
      
      const dataJsPath = path.join(__dirname, 'js', 'data.js');
      let dataCode = fs.readFileSync(dataJsPath, 'utf8');

      // Replace product-X.svg with real-X.jpg
      // Since we might not have exactly 41 unique real images, we modulo if needed
      const totalDownloaded = targetUrls.length;
      
      dataCode = dataCode.replace(/images\/product-(\d+)\.(svg|png|jpg)/g, (match, p1) => {
        let imgNum = parseInt(p1);
        if (imgNum > totalDownloaded) {
          imgNum = (imgNum % totalDownloaded) + 1;
        }
        return `images/real-${imgNum}.jpg`;
      });

      fs.writeFileSync(dataJsPath, dataCode, 'utf8');
      console.log('Updated data.js with real images.');
    });
  });
}).on('error', (err) => {
  console.error('Error fetching domain:', err.message);
});
