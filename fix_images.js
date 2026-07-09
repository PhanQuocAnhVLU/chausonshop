const fs = require('fs');

['js/data.js', 'tin-tuc.html'].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let id = 1;
    const prefix = file.replace(/[^a-z]/g, '');
    content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[^?]+\?w=(\d+)&h=(\d+)&fit=crop/g, (m, w, h) => {
      return `https://picsum.photos/seed/${prefix}img${id++}/${w}/${h}`;
    });
    fs.writeFileSync(file, content);
  }
});
console.log('Done!');
