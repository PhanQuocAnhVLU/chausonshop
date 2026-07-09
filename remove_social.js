const fs = require('fs');
const path = require('path');

const dir = 'd:/chausonstore/chausonshop';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove Youtube link
  content = content.replace(/<a[^>]*class="[^"]*social-link yt[^"]*"[^>]*>.*?<\/a>\s*/g, '');
  
  // Remove Instagram link
  content = content.replace(/<a[^>]*class="[^"]*social-link ig[^"]*"[^>]*>.*?<\/a>\s*/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned ${file}`);
});
