// generateImageMap.js
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'assets', 'img');
const outFile = path.join(__dirname, 'src', 'data', 'images.ts');

const files = fs.readdirSync(imgDir)
  .filter(f => /\.(jpe?g|png|gif)$/.test(f));

const lines = [
  `// ESTE ARCHIVO SE GENERA AUTOMÁTICAMENTE`,
  ``,
  `export const imageMap: Record<string, number> = {`,
];

files.forEach(filename => {
  const key = `img/${filename}`;
  const relPath = `../../assets/img/${filename}`;
  lines.push(`  '${key}': require('${relPath}'),`);
});

lines.push(`};`, ``);

fs.writeFileSync(outFile, lines.join('\n'));
console.log(`✅ imageMap generado con ${files.length} entradas en ${outFile}`);
