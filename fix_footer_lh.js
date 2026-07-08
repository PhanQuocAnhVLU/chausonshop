const fs = require('fs');
const sanpham = fs.readFileSync('san-pham.html', 'utf8');
const lienhe = fs.readFileSync('lien-he.html', 'utf8');

const footerMatch = sanpham.match(/<footer class="footer">.*?<\/footer>/s);

if (footerMatch) {
  let updated = lienhe.replace(/<footer class="footer">.*?<\/footer>/s, footerMatch[0]);
  fs.writeFileSync('lien-he.html', updated, 'utf8');
  console.log("Footer fixed in lien-he.html!");
}
