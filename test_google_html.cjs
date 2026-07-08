const https = require('https');

function searchGoogleImagesHTML(keyword) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(keyword + ' shopee')}&tbm=isch`;
  https.get(url, {
    headers: {
      // Use an old browser UA to force Google to serve the non-JS plain HTML version of Google Images
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
    }
  }, (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
      // Find img tags with src
      const regex = /<img[^>]+src="([^">]+)"/g;
      let match;
      const urls = [];
      while ((match = regex.exec(html)) !== null) {
        const src = match[1];
        if (src.startsWith('http') && !src.includes('text/html')) {
          urls.push(src);
        }
      }
      console.log(`Results for ${keyword}:`);
      console.log(urls.slice(0, 3));
    });
  });
}

searchGoogleImagesHTML("Vitamin E 180mg 400IU Kirkland");
searchGoogleImagesHTML("Kem hồng nhũ hoa Nuwhite N1");
