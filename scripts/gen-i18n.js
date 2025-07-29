// scripts/gen-i18n.js
const fs   = require('fs');
const path = require('path');

// 1) Ruta a src/data
const dataDir = path.join(__dirname, '..', 'src', 'data');
console.error('▶ dataDir =', dataDir);

// 2) Filtramos sólo testN.json
let files = [];
if (fs.existsSync(dataDir)) {
  files = fs.readdirSync(dataDir).filter(f => f.match(/^test\d+\.json$/));
}
console.error('▶ archivos encontrados =', files);

const es = {}, en = {};

files.forEach((file, idx) => {
  const raw  = fs.readFileSync(path.join(dataDir, file), 'utf-8');
  const test = JSON.parse(raw);

  const testKey = `tests.test${idx+1}`;
  es[testKey] = test.titulo;
  en[testKey] = '';

  (test.preguntas || []).forEach((p, pi) => {
    const pKey = `${testKey}.p${pi+1}`;
    es[`${pKey}.enunciado`] = p.enunciado;
    en[`${pKey}.enunciado`] = '';

    if (Array.isArray(p.opciones)) {
      p.opciones.forEach((opt, oi) => {
        es[`${pKey}.opciones.${oi+1}`] = opt;
        en[`${pKey}.opciones.${oi+1}`] = '';
      });
    }
  });
});

// 4) Volcamos resultado a stdout
console.log(JSON.stringify({ es, en }, null, 2));
