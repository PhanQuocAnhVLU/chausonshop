const https = require('https');

async function fetchBingImage(keyword) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(keyword + " shopee")}&form=HDRSC2`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const regex = /murl&quot;:&quot;(https:\/\/[^&]+(?:jpg|jpeg|png))&quot;/ig;
        let match;
        const urls = [];
        while ((match = regex.exec(html)) !== null) {
          urls.push(match[1]);
        }
        console.log(`\nResults for "${keyword}":`);
        console.log(urls.slice(0, 3));
      });
    }).on('error', () => resolve(null));
  });
}

fetchBingImage("Viên uống vitamin E 180mg 400IU Kirkland");
fetchBingImage("Kem hồng nhũ hoa Nuwhite N1");
fetchBingImage("Schiff Move Free Joint Health Advanced");
