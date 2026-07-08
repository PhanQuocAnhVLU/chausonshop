const https = require('https');

function searchHangNgoaiNhap(keyword) {
  const url = `https://www.hangngoainhap.com.vn/tim-kiem.html?k=${encodeURIComponent(keyword)}`;
  
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }, (res) => {
    let html = '';
    res.on('data', c => html += c);
    res.on('end', () => {
      console.log("Status:", res.statusCode);
      // Try to find product images in search results
      const matches = [...html.matchAll(/src=["']([^"']*(?:\/upload\/|\/san-pham\/)[^"']+\.jpg)["']/gi)].map(m => m[1]);
      console.log("Matches for", keyword, ":", matches.slice(0, 3));
    });
  });
}

searchHangNgoaiNhap("Sữa ong chúa Costar Royal Jelly");
