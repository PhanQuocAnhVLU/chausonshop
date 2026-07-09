const https = require('https');

const url = 'https://www.hangngoainhap.com.vn/';

https.get(url, {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    // Look for product blocks.
    // Example: <img src="images/202409/goods_img/40-p2-1726628935.jpg" alt="Centrum Silver Ultra Mens 50+ 275 Viên Của Mỹ">
    // We can use a regex to capture <img src="[url]" alt="[name]">
    // The exact HTML structure on hangngoainhap might vary. Let's try matching `src="([^"]+\.jpg)"\s+(?:title|alt)="([^"]+)"`
    
    const regex = /src=["']([^"']+\.jpg)["'][^>]*alt=["']([^"']+)["']/gi;
    let matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      matches.push({ img: match[1], name: match[2] });
    }
    
    // Also try alt first then src
    const regex2 = /alt=["']([^"']+)["'][^>]*src=["']([^"']+\.jpg)["']/gi;
    while ((match = regex2.exec(html)) !== null) {
      matches.push({ name: match[1], img: match[2] });
    }
    
    console.log(`Found ${matches.length} matches.`);
    
    // Filter out generic stuff
    const products = matches.filter(m => m.name.length > 10 && !m.name.includes('Banner') && !m.name.includes('banner') && !m.name.includes('Logo'));
    
    // De-duplicate by name
    const unique = [];
    const seen = new Set();
    for (const p of products) {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        unique.push(p);
      }
    }
    
    console.log(`Found ${unique.length} unique products.`);
    console.log(unique.slice(0, 5));
  });
});
