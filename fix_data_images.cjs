const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'js', 'data.js');
let content = fs.readFileSync(dataPath, 'utf8');

// Replace all .jpg and .png references for product images with .svg
content = content.replace(/images\/product-(\d+)\.(jpg|png)/g, 'images/product-$1.svg');

// Update banners to also use svg or keep them using banner-X.png
content = content.replace(/images\/banner-(\d+)\.jpg/g, 'images/banner-$1.png'); // Because we have banner-1.png etc. from AI

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Updated data.js to use .svg and .png for images.');
