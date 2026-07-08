const fs = require('fs');
const file = 'd:/chausonstore/chausonshop/lien-he.html';
let html = fs.readFileSync(file, 'utf8');

// The new encoded URLs
const dnUrl = "https://maps.google.com/maps?q=194%20L%C3%AA%20%E1%BA%A4m%2C%20Ho%C3%A0%20Xu%C3%A2n%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng&t=&z=15&ie=UTF8&iwloc=&output=embed";
const hcmUrl = "https://maps.google.com/maps?q=126A%20T%C3%A2y%20S%C6%A1n%2C%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20Th%E1%BB%8D%20Ho%C3%A0%2C%20Qu%E1%BA%ADn%20T%C3%A2n%20Ph%C3%BA&t=&z=15&ie=UTF8&iwloc=&output=embed";

// Replace first iframe (Da Nang)
html = html.replace(/<iframe[^>]*src="https:\/\/maps\.google\.com\/maps\?q=194[^>]*><\/iframe>/, `<iframe src="${dnUrl}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);

// Replace second iframe (HCM)
html = html.replace(/<iframe[^>]*src="https:\/\/maps\.google\.com\/maps\?q=126A[^>]*><\/iframe>/, `<iframe src="${hcmUrl}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);

fs.writeFileSync(file, html, 'utf8');
console.log("Iframes updated!");
