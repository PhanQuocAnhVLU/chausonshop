const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'js', 'data.js');
let dataCode = fs.readFileSync(dataPath, 'utf8');

const cats = ['thuc-pham-chuc-nang', 'chong-lao-hoa', 'ho-tro-xuong-khop', 'me-va-be'];

// Replace categoryId: "thuc-pham-chuc-nang" with random categories
let counter = 0;
dataCode = dataCode.replace(/categoryId:\s*"thuc-pham-chuc-nang"/g, () => {
  const cat = cats[counter % cats.length];
  counter++;
  return `categoryId: "${cat}"`;
});

fs.writeFileSync(dataPath, dataCode, 'utf8');
console.log("Categories redistributed.");
