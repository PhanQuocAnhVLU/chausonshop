const fs = require('fs');
const sanpham = fs.readFileSync('san-pham.html', 'utf8');
const tintuc = fs.readFileSync('tin-tuc.html', 'utf8');

const footerMatch = sanpham.match(/<footer class="footer">.*?<\/footer>/s);

if (footerMatch) {
  let updated = tintuc.replace(/<footer class="footer">.*?<\/footer>/s, footerMatch[0]);
  fs.writeFileSync('tin-tuc.html', updated, 'utf8');
  console.log("Footer fixed!");
} else {
  console.log("Could not find footer in san-pham.html");
}
