const fs = require('fs');
const path = require('path');

const FACEBOOK_URL = 'https://www.facebook.com/chuyenbanhangxachtay2025';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Add floating button (insert before Zalo or scroll-top if Zalo not found)
  if (!content.includes('float-btn facebook')) {
    const fbFloatBtn = `  <a href="${FACEBOOK_URL}" target="_blank" class="float-btn facebook" title="Facebook">\n    <i class="fab fa-facebook-f"></i>\n  </a>\n`;
    content = content.replace(
      /(<a href="https:\/\/zalo\.me[^>]*class="float-btn zalo"[^>]*>[\s\S]*?<\/a>)/i,
      `${fbFloatBtn}$1`
    );
  }

  // Update Top Bar Facebook links (e.g. <a href="#"><i class="fab fa-facebook"></i> Facebook</a>)
  content = content.replace(
    /<a href="[^"]*"(>[^<]*<i class="fab fa-facebook"><\/i> Facebook<\/a>)/gi,
    `<a href="${FACEBOOK_URL}" target="_blank"$1`
  );

  // Update Footer Social Links (e.g. <a href="#" class="social-link fb">)
  content = content.replace(
    /<a href="[^"]*" class="social-link fb">/gi,
    `<a href="${FACEBOOK_URL}" target="_blank" class="social-link fb">`
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
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

// Update style.css
const stylePath = path.join(__dirname, 'css', 'style.css');
let cssContent = fs.readFileSync(stylePath, 'utf8');
if (!cssContent.includes('.float-btn.facebook')) {
  cssContent += `\n.float-btn.facebook { background: #0866ff; }\n.float-btn.facebook:hover { background: #0056d6; }\n`;
  fs.writeFileSync(stylePath, cssContent, 'utf8');
  console.log('Updated style.css with Facebook button colors.');
}

console.log('Facebook link update complete.');
