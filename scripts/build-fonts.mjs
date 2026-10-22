/**
 * Font thương hiệu: public/font/*.ttf → public/fonts/*.woff2 (nén Brotli, nhẹ hơn TTF ~50–60%).
 * Chỉ chuyển font chưa có bản .woff2 (giờ sửa file không đáng tin sau khi clone git / trên Vercel).
 * Thay file .ttf → chạy lại với --force: npm run fonts -- --force
 * Trình duyệt nạp .woff2; TTF gốc giữ làm dự phòng trong @font-face (src/styles/fonts.css).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public/font');
const out = join(root, 'public/fonts');
const FORCE = process.argv.includes('--force');

let ttf2woff2;
try {
  ttf2woff2 = (await import('ttf2woff2')).default;
} catch {
  console.warn('! Chưa cài "ttf2woff2" — bỏ qua chuyển font (npm i -D ttf2woff2).');
  process.exit(0);
}

mkdirSync(out, { recursive: true });
let made = 0;
for (const name of existsSync(src) ? readdirSync(src) : []) {
  if (!name.toLowerCase().endsWith('.ttf')) continue;
  const from = join(src, name);
  const to = join(out, name.replace(/\.ttf$/i, '.woff2'));
  if (existsSync(to) && !FORCE) continue;
  writeFileSync(to, ttf2woff2(readFileSync(from)));
  made++;
}
console.log(`✓ font: tạo mới ${made} file → public/fonts`);
