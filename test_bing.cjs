const https = require('https');

function testBingSearch(keyword) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(keyword)}&form=HDRSC2`;
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  }, (res) => {
    let html = '';
    res.on('data', c => html += c);
    res.on('end', () => {
      // Bing uses murl in the JSON payload for the image source
      const match = html.match(/murl&quot;:&quot;(https:\/\/[^&]+(?:jpg|jpeg|png))&quot;/i);
      if (match) {
        console.log("Success:", match[1]);
      } else {
        console.log("Failed to find image.");
      }
    });
  });
}
testBingSearch("Sữa ong chúa Costar Royal Jelly");
