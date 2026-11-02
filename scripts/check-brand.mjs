// Fails if source code breaks the Predicterra typography rules:
// no uppercase transforms, no monospaced fonts, no positive tracking.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('../src', import.meta.url).pathname;
const EXT = new Set(['.astro', '.css', '.ts', '.js', '.mjs']);
const rules = [
  { name: 'text-transform: uppercase', re: /text-transform\s*:\s*uppercase/i },
  { name: 'monospaced font', re: /font-family[^;]*\bmono(space)?\b/i },
  { name: 'positive letter-spacing', re: /letter-spacing\s*:\s*(?!0\b|-|var\()[0-9.]+/i },
  { name: 'non-brand font family', re: /font-family\s*:\s*(?!\s)(?!var\(--font-sans\)|inherit|'Archivo)/i },
];

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.has(extname(p))) files.push(p);
  }
})(ROOT);

let failures = 0;
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const r of rules) {
      if (r.re.test(line)) {
        failures++;
        console.error(`${file.replace(ROOT, 'src')}:${i + 1}  ${r.name}\n    ${line.trim()}`);
      }
    }
  });
}

if (failures) {
  console.error(`\n${failures} brand rule violation(s).`);
  process.exit(1);
}
console.log(`Brand check passed (${files.length} files).`);
