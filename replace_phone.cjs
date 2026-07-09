const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content
    .replace(/0935\.033\.039/g, '0987.153.876')
    .replace(/0935033039/g, '0987153876');
    
  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
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
      if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir(__dirname);
console.log('Phone number replacement complete.');
