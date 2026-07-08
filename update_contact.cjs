const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // CSKH number
  content = content
    .replace(/0843\.323\.550/g, '0987.153.876')
    .replace(/0843323550/g, '0987153876')
    // Email
    .replace(/chausonshop@gmail\.com/g, 'nhutu5556@gmail.com')
    // Đà Nẵng address
    .replace(/01 Nguyễn Hữu Thọ,\s*Hòa Thuận Nam,\s*Hải Châu/gi, '194 Lê Ấm, Hoà Xuân')
    .replace(/TP\.HCM: Sky Garden 1, Đại Lộ Nguyễn Văn Linh, Q\.7/gi, 'TP.HCM: 126A Tây Sơn, Phường Phú Thọ Hoà, Quận Tân Phú')
    // Also catch shorter variants
    .replace(/Sky Garden 1,\s*Đại Lộ Nguyễn Văn Linh,\s*Q\.7/gi, '126A Tây Sơn, Phường Phú Thọ Hoà, Quận Tân Phú')
    .replace(/Sky Garden 1[^<]*/gi, '126A Tây Sơn, Phường Phú Thọ Hoà, Quận Tân Phú');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'images'].includes(file)) walkDir(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(__dirname);
console.log('Contact info update complete.');
