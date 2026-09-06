const fs = require('fs');
const path = require('path');
const file = process.argv[2];
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  const full = path.resolve(file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, Buffer.concat(chunks));
  console.log('Saved:', file);
});