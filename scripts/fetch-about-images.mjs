// One-off: downloads the About page photos from the current predicterra.com
// (Framer CDN) and writes them to public/about as .webp.
// Run once from the project root:  node scripts/fetch-about-images.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const CDN = 'https://framerusercontent.com/images/';
const images = [
  ['sebastian-priolo', 'qi2glsRS45nntmqL9TutVxlY', 600, 600],
  ['fernando-tadakuma', 'pbpQhQ6fJs3oM76bJxeJjyZ3uII', 600, 600],
  ['federico-hasicic', '87pqG6xOwDv2RDjMH465ApQm34', 600, 600],
  ['martin-tanielian', 'KPuprovkmyrR90RXpZ4sjCN4xfQ', 600, 600],
  ['omer-gomez', 'wVyHR717l8mCpjsXusGWZw6dfk', 600, 600],
  ['bilbao-1', 'LBVpM0In5O3SxWIsJZgi4b8faFE', 1200, 800],
  ['bilbao-2', 'YlHdh8k6oHGeCmCg5BqP5rNZv4c', 1600, 896],
];

const out = new URL('../public/about/', import.meta.url);
await mkdir(out, { recursive: true });

for (const [slug, id, w, h] of images) {
  const res = await fetch(`${CDN}${id}.png`);
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const webp = await sharp(buf).resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: 80 }).toBuffer();
  await writeFile(new URL(`${slug}.webp`, out), webp);
  console.log(`✓ public/about/${slug}.webp  ${(webp.length / 1024).toFixed(0)} KB`);
}
console.log('Done.');
