const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

function createSvg(filename, width, height, text, bgColor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  fs.writeFileSync(path.join(imgDir, filename), svg);
}

// Banners
createSvg('banner-1.jpg', 900, 400, 'Banner Khuyến Mãi 1', '#ff9800');
createSvg('banner-2.jpg', 900, 400, 'Banner Khuyến Mãi 2', '#9c27b0');
createSvg('banner-3.jpg', 900, 400, 'Banner Khuyến Mãi 3', '#f44336');

// Products
const colors = ['#2e7d32', '#d32f2f', '#1976d2', '#fbc02d', '#7b1fa2'];
for (let i = 1; i <= 20; i++) {
  createSvg(`product-${i}.jpg`, 400, 400, `Sản phẩm ${i}`, colors[i % colors.length]);
}

// News
createSvg('news-1.jpg', 300, 200, 'Tin tức 1', '#4caf50');
createSvg('news-2.jpg', 300, 200, 'Tin tức 2', '#00bcd4');
createSvg('news-3.jpg', 300, 200, 'Tin tức 3', '#ff5722');
createSvg('news-4.jpg', 300, 200, 'Tin tức 4', '#607d8b');
createSvg('news-5.jpg', 300, 200, 'Tin tức 5', '#795548');

// Now overwrite data.js to use these images instead of picsum.photos
let data = fs.readFileSync(path.join(__dirname, 'js', 'data.js'), 'utf8');

let pId = 1;
data = data.replace(/https:\/\/picsum\.photos[^"']+/g, (m) => {
  if (m.includes('news')) return `images/news-${Math.floor(Math.random() * 5) + 1}.jpg`;
  if (m.includes('banner')) return `images/banner-${Math.floor(Math.random() * 3) + 1}.jpg`;
  return `images/product-${(pId++ % 20) + 1}.jpg`;
});

// Since the previous regex was based on unsplash, wait, did it get changed to picsum? Yes.
// Let's do a more robust replacement if they are unsplash or picsum
data = data.replace(/image:\s*["'](https?:\/\/[^"']+)["']/g, (m, url) => {
    let type = 'product';
    if (data.indexOf(url) < data.indexOf('PRODUCTS')) {
       if (data.indexOf(url) < data.indexOf('BANNERS')) type = 'news';
       else type = 'banner';
    }
    if (type === 'news') return `image: "images/news-${Math.floor(Math.random() * 5) + 1}.jpg"`;
    if (type === 'banner') return `image: "images/banner-${Math.floor(Math.random() * 3) + 1}.jpg"`;
    return `image: "images/product-${Math.floor(Math.random() * 20) + 1}.jpg"`;
});

fs.writeFileSync(path.join(__dirname, 'js', 'data.js'), data);
console.log('Images created and data.js updated');
