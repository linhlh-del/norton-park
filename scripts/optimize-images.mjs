/**
 * Tối ưu ảnh trong public/images → public/images/_optimized (AVIF + WebP, nhiều bề rộng) và sinh
 * src/generated/image-manifest.json để component <Media> tự dùng <picture srcset>.
 * Chỉ xử lý lại ảnh mới hoặc đã sửa. Chạy: npm run images (tự chạy trước npm run build).
 */
import { readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'public/images');
const outDir = join(srcDir, '_optimized');
const manifestPath = join(root, 'src/generated/image-manifest.json');
const WIDTHS = [480, 768, 1080, 1600, 2400];
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const PASSTHROUGH = new Set(['.svg', '.gif', '.avif']); // không chuyển đổi, chỉ ghi vào bảng tra để biết ảnh có thật

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('! Chưa cài "sharp" — bỏ qua bước tối ưu ảnh (npm i -D sharp).');
  process.exit(0);
}

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  if (p.startsWith(outDir)) return [];
  const ext = extname(p).toLowerCase();
  return statSync(p).isDirectory() ? walk(p) : EXT.has(ext) || PASSTHROUGH.has(ext) ? [p] : [];
});

const files = existsSync(srcDir) ? walk(srcDir) : [];
const manifest = {};
let made = 0;

for (const file of files) {
  const rel = relative(srcDir, file).replace(/\\/g, '/');
  const base = rel.slice(0, -extname(rel).length);
  if (PASSTHROUGH.has(extname(rel).toLowerCase())) { manifest['/images/' + rel] = { variants: [] }; continue; }
  const meta = await sharp(file).metadata();
  const widths = WIDTHS.filter((w) => w < meta.width).concat(meta.width <= WIDTHS.at(-1) ? [meta.width] : [WIDTHS.at(-1)]);
  const variants = [];
  for (const w of [...new Set(widths)]) {
    const v = { w };
    for (const fmt of ['avif', 'webp']) {
      const out = join(outDir, `${base}-${w}.${fmt}`);
      v[fmt] = '/images/_optimized/' + `${base}-${w}.${fmt}`;
      if (existsSync(out) && statSync(out).mtimeMs >= statSync(file).mtimeMs) continue;
      mkdirSync(dirname(out), { recursive: true });
      const img = sharp(file).resize({ width: w, withoutEnlargement: true });
      await (fmt === 'avif' ? img.avif({ quality: 46, effort: 5 }) : img.webp({ quality: 70 })).toFile(out);
      made++;
    }
    variants.push(v);
  }
  manifest['/images/' + rel] = { width: meta.width, height: meta.height, variants };
}

/* ảnh chia sẻ mạng xã hội (Open Graph / Zalo / Facebook): 1200 × 630, JPEG cho tương thích rộng nhất */
const ogSrc = join(srcDir, 'overview_hero-facade-sunset.jpg');
const ogOut = join(outDir, 'norton-park-og.jpg');
if (existsSync(ogSrc) && (!existsSync(ogOut) || statSync(ogOut).mtimeMs < statSync(ogSrc).mtimeMs)) {
  mkdirSync(outDir, { recursive: true });
  await sharp(ogSrc).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 80, mozjpeg: true }).toFile(ogOut);
  made++;
}

mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ ${files.length} ảnh, tạo mới ${made} file → public/images/_optimized`);
