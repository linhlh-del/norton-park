/**
 * Nhiều domain, mỗi domain một bản build riêng (cùng mã nguồn).
 *
 *   sites/<domain>/site.env   cấu hình riêng của domain:
 *     VITE_SITE_URL   bắt buộc — canonical, sitemap, robots, llms.txt, JSON-LD của domain
 *     SITE_TEMPLATE   giao diện dùng cho domain (mặc định "park" — giao diện hiện tại)
 *     (thêm được VITE_GTM_ID, VITE_GSC_VERIFICATION… riêng cho từng domain)
 *
 * Các biến trong site.env được gán vào process.env nên ghi đè .env.production
 * (Vite và prerender-seo đều ưu tiên process.env hơn file .env).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/** Giao diện có sẵn. Làm xong giao diện mới thì thêm tên vào đây rồi đổi SITE_TEMPLATE trong site.env của domain. */
export const TEMPLATES = ['park'];

export const sitesDir = (root) => join(root, 'sites');

/** Danh sách domain có file sites/<domain>/site.env, sắp theo tên. */
export function listSites(root) {
  const dir = sitesDir(root);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, 'site.env')))
    .map((d) => d.name)
    .sort();
}

/** Đọc sites/<domain>/site.env (KEY=VALUE, bỏ dòng trống và dòng #). */
export function readSiteEnv(root, site) {
  if (!/^[a-z0-9.-]+$/i.test(site)) throw new Error(`Tên site không hợp lệ: ${site}`);
  const file = join(sitesDir(root), site, 'site.env');
  if (!existsSync(file)) throw new Error(`Không có ${file}`);
  const env = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  if (!env.VITE_SITE_URL) throw new Error(`${file}: thiếu VITE_SITE_URL`);
  env.VITE_SITE_URL = env.VITE_SITE_URL.replace(/\/+$/, '');
  env.SITE_TEMPLATE = env.SITE_TEMPLATE || 'park';
  if (!TEMPLATES.includes(env.SITE_TEMPLATE)) {
    throw new Error(`${file}: SITE_TEMPLATE="${env.SITE_TEMPLATE}" chưa có (đang có: ${TEMPLATES.join(', ')})`);
  }
  return env;
}

/** Nạp .env.production (mọi biến, không chỉ VITE_) vào process.env; biến đã có trong môi trường được giữ nguyên. */
export function loadProductionEnv(root) {
  const file = join(root, '.env.production');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

/** Bước chung cho mọi domain, chạy MỘT lần trước khi build: nội dung CMS, font, ảnh tối ưu. */
export function prepare(root, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv };
  for (const script of ['fetch-cms.mjs', 'build-fonts.mjs', 'optimize-images.mjs']) {
    const r = spawnSync(process.execPath, [join(root, 'scripts', script)], { cwd: root, stdio: 'inherit', env });
    if (r.status !== 0) throw new Error(`${script} → exit ${r.status}`);
  }
}

/**
 * Build một domain vào thư mục `out`: vite build (trình duyệt) → vite build --ssr → prerender-seo
 * (HTML tĩnh cho mọi route vi/en + sitemap, robots, llms.txt theo domain). Không cần Chrome.
 * Lỗi ở bước nào thì ném lỗi; người gọi quyết định giữ bản đang chạy.
 */
export function buildSite(root, site, out, extraEnv = {}) {
  const ssr = join(root, `.ssr-${site}`);
  const env = { ...process.env, ...extraEnv, ...readSiteEnv(root, site), DIST_DIR: out, SSR_DIR: ssr };
  const vite = join(root, 'node_modules/vite/bin/vite.js');
  const steps = [
    [vite, 'build', '--outDir', out, '--emptyOutDir'],
    [vite, 'build', '--ssr', 'src/entry-server.jsx', '--outDir', ssr, '--emptyOutDir'],
    [join(root, 'scripts/prerender-seo.mjs')],
  ];
  try {
    for (const args of steps) {
      const r = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', env });
      if (r.status !== 0) throw new Error(`${args[0].split(/[\\/]/).pop()} ${args.slice(1).join(' ')} → exit ${r.status}`);
    }
  } finally {
    rmSync(ssr, { recursive: true, force: true });
  }
}
