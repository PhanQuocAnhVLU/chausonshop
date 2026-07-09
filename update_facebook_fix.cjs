const fs = require('fs');
const path = require('path');

const FACEBOOK_URL = 'https://www.facebook.com/chuyenbanhangxachtay2025';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Add floating button before scroll-top button if not exists
  if (!content.includes('float-btn facebook')) {
    const fbFloatBtn = `  <a href="${FACEBOOK_URL}" target="_blank" class="float-btn facebook" title="Facebook">\n    <i class="fab fa-facebook-f"></i>\n  </a>\n`;
    content = content.replace(
      /(<button class="float-btn scroll-top")/i,
      `${fbFloatBtn}$1`
    );
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated missing fb btn in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'images') {
        walkDir(fullPath);
      }
    } else {
      if (fullPath.endsWith('.html')) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir(__dirname);
console.log('Patch complete.');
