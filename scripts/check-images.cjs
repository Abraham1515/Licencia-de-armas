// scripts/check-images.cjs
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const imagesTs = path.join(repoRoot, 'src', 'data', 'images.ts');
if (!fs.existsSync(imagesTs)) {
  console.error('No existe:', imagesTs);
  process.exit(1);
}
const content = fs.readFileSync(imagesTs, 'utf8');
const regex = /'([^']+)'\s*:\s*require\(\s*'([^']+)'\s*\)/g;
let m;
const missing = [];
let total = 0;
while ((m = regex.exec(content))) {
  total++;
  const key = m[1];
  const reqPath = m[2]; // relative path like ../../assets/img/1.1.jpg
  // Resolvemos la ruta relativa desde src/data (images.ts está en src/data)
  const abs = path.resolve(path.join(repoRoot, 'src', reqPath.replace(/\.\.\/\.\.\//, '')));
  if (!fs.existsSync(abs)) {
    missing.push({ key, required: abs });
  }
}

if (missing.length === 0) {
  console.log(`OK — todos los recursos requeridos existen. Total checks: ${total}`);
  process.exit(0);
} else {
  console.error('Faltan archivos para las siguientes entradas:');
  missing.forEach(x => console.error('-', x.key, '->', x.required));
  process.exit(2);
}
