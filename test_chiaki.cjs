const https = require('https');

function testChiaki(keyword) {
  const url = `https://chiaki.vn/search?q=${encodeURIComponent(keyword)}`;
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let html = '';
    res.on('data', c => html += c);
    res.on('end', () => {
      // Find first product image
      const match = html.match(/<img[^>]+src=["'](https:\/\/cdn\.chiaki\.vn\/[^"']+\.jpg)["']/i);
      if (match) {
        console.log("Success:", match[1]);
      } else {
        console.log("Failed to find image on Chiaki.");
      }
    });
  });
}
testChiaki("Centrum Silver Ultra Mens 50+");
