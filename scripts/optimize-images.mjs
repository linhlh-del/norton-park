/**
 * Tối ưu ảnh trong public/images → public/images/_optimized (AVIF + WebP, nhiều bề rộng) và sinh
 * src/generated/image-manifest.json để component <Media> tự dùng <picture srcset>.
 * Chạy: npm run images (tự chạy trước npm run dev / npm run build).
 *
 * Nhanh khi deploy (Vercel / CI):
 *  - Mỗi bản nén được lưu trong node_modules/.cache/np-images, đặt tên theo HASH NỘI DUNG ảnh gốc + thông số nén.
 *    Vercel giữ node_modules giữa các lần build → ảnh không đổi chỉ cần copy, không phải nén lại.
 *    (Không dựa vào giờ sửa file: khi clone git, mọi file đều mang giờ mới.)
 *  - Ảnh trong thư mục vendor/ (logo đối tác, nhỏ) không tạo nhiều kích thước.
 *  - Nén song song theo số nhân CPU.
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'public/images');
const outDir = join(srcDir, '_optimized');
const cacheDir = join(root, 'node_modules/.cache/np-images');
const manifestPath = join(root, 'src/generated/image-manifest.json');
const WIDTHS = [480, 768, 1080, 1600, 2400];
const AVIF = { quality: 46, effort: 4 };
const WEBP = { quality: 70 };
const SETTINGS = JSON.stringify({ WIDTHS, AVIF, WEBP, v: 2 }); // đổi thông số → hash đổi → nén lại
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const PASSTHROUGH = new Set(['.svg', '.gif', '.avif']); // không chuyển đổi, chỉ ghi vào bảng tra để biết ảnh có thật
const NO_VARIANTS = ['vendor/']; // thư mục chỉ dùng ảnh gốc

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
let reused = 0;
mkdirSync(cacheDir, { recursive: true });

/** Lấy file đã nén từ cache, hoặc nén mới rồi lưu cache; sau đó copy vào public/images/_optimized */
async function produce(cacheName, out, make) {
  const cached = join(cacheDir, cacheName);
  if (existsSync(cached)) reused++;
  else { await make(cached); made++; }
  mkdirSync(dirname(out), { recursive: true });
  copyFileSync(cached, out);
}

async function processFile(file) {
  const rel = relative(srcDir, file).replace(/\\/g, '/');
  const key = '/images/' + rel;
  if (PASSTHROUGH.has(extname(rel).toLowerCase()) || NO_VARIANTS.some((d) => rel.startsWith(d))) {
    manifest[key] = { variants: [] };
    return;
  }
  const buf = readFileSync(file);
  const hash = createHash('sha1').update(buf).update(SETTINGS).digest('hex').slice(0, 16);
  const meta = await sharp(buf).metadata();
  const base = rel.slice(0, -extname(rel).length);
  const widths = [...new Set(WIDTHS.filter((w) => w < meta.width).concat(Math.min(meta.width, WIDTHS.at(-1))))];
  const variants = [];
  for (const w of widths) {
    const v = { w };
    for (const fmt of ['avif', 'webp']) {
      v[fmt] = `/images/_optimized/${base}-${w}.${fmt}`;
      await produce(`${hash}-${w}.${fmt}`, join(outDir, `${base}-${w}.${fmt}`), (to) => {
        const img = sharp(buf).resize({ width: w, withoutEnlargement: true });
        return (fmt === 'avif' ? img.avif(AVIF) : img.webp(WEBP)).toFile(to);
      });
    }
    variants.push(v);
  }
  manifest[key] = { width: meta.width, height: meta.height, variants };
}

/* nén song song, giới hạn theo số nhân */
const queue = [...files];
const workers = Array.from({ length: Math.max(1, Math.min(4, availableParallelism())) }, async () => {
  while (queue.length) await processFile(queue.shift());
});
await Promise.all(workers);

/* Ảnh chia sẻ mạng xã hội (Open Graph / Zalo / Facebook): dùng nguyên file public/images/thumbnail.jpg
   (khai báo SITE.ogImage trong src/seo/site-meta.js) — không cần sinh thêm. */

/* thứ tự khoá ổn định (các worker chạy song song) để manifest không đổi vô cớ giữa các lần build */
const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + '\n');
console.log(`✓ ${files.length} ảnh — nén mới ${made}, dùng lại từ cache ${reused} → public/images/_optimized`);
