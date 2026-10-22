/**
 * Bước cuối của `npm run build` (sau bản build trình duyệt và bản build SSR trong .ssr/):
 *  1. Prerender từng route thành HTML tĩnh có sẵn nội dung + <head> SEO riêng:
 *       dist/index.html · dist/bang-tinh-gia/index.html · dist/tin-tuc/index.html · dist/404.html
 *  2. sitemap.xml, robots.txt, llms.txt, /.well-known/ard.json (Agentic Resource Discovery)
 *  3. Header bảo mật cho Netlify / Cloudflare Pages (dist/_headers) với CSP băm (hash) theo đúng bản build này
 *
 * Biến môi trường (đọc từ .env.production như Vite): VITE_SITE_URL, VITE_GSC_VERIFICATION,
 * ARD_AGENTMAP=1 (thêm dòng "Agentmap:" vào robots.txt — xem docs/SEO.md về ảnh hưởng điểm Lighthouse),
 * CSP_REPORT_URI (endpoint nhận báo cáo vi phạm CSP).
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

process.env.NODE_ENV = 'production'; // React / React Router bản production khi render
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const env = { ...loadEnv('production', root, ''), ...process.env };

const ssr = await import(pathToFileURL(join(root, '.ssr/entry-server.js')).href);
const { render, headHtml, routes, SITE_URL, SITE, sections, pages, absUrl, langUrl } = ssr;

const write = (rel, content) => {
  const file = join(dist, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  console.log('  ✓', rel);
};

/* ---------- 1. HTML ---------- */
let template = readFileSync(join(dist, 'index.html'), 'utf8');

/* Thẻ <script src> của bundle chính → script nạp nội tuyến (inline) để CSP khoá bằng hash/nonce + 'strict-dynamic'.
   Nội dung đã render sẵn nên việc tải JS muộn hơn một nhịp không ảnh hưởng FCP/LCP. */
const entry = template.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
if (!entry) throw new Error('Không tìm thấy <script type="module"> trong dist/index.html');
const loader = `import ${JSON.stringify(entry[1])};`;
const loaderHash = `'sha256-${createHash('sha256').update(loader).digest('base64')}'`;
template = template.replace(entry[0], `<script type="module" nonce="__CSP_NONCE__">${loader}</script>`);

/* CSS chính (~10 KB gzip) nhúng thẳng vào HTML: bỏ một vòng request chặn hiển thị trên mạng di động,
   font được phát hiện sớm hơn. CSS của bản đồ vẫn tải riêng (lazy). */
const cssLink = template.match(/<link rel="stylesheet" crossorigin href="([^"]+?\.css)">/);
if (cssLink) {
  const css = readFileSync(join(dist, cssLink[1]), 'utf8').replaceAll('</style', '<\\/style');
  template = template.replace(cssLink[0], () => `<style>${css}</style>`);
}

/* path: đường dẫn tiếng Việt của trang; lang: "vi" | "en". URL thật của bản en = "/en" + path */
const urlOf = (path, lang) => (lang === 'en' ? '/en' + (path === '/' ? '' : path) : path);
const page = (path, lang = 'vi') => {
  const url = urlOf(path, lang);
  const head = headHtml(path, lang);
  return template
    /* <html lang> theo ngôn ngữ; trang chủ bật sẵn cuộn theo section (khỏi giật khi JS gắn class) */
    .replace('<html lang="vi">', `<html lang="${lang}"${path === '/' ? ' class="snap-y"' : ''}>`)
    .replace(/<title>[\s\S]*?<\/title>/, head.title)
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${head.tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-route="${url}">${render(url)}</div>`);
};
const fileOf = (url) => (url === '/' ? 'index.html' : `${url.slice(1)}/index.html`);

console.log('Prerender:');
for (const lang of ['vi', 'en']) {
  for (const r of routes) write(fileOf(urlOf(r, lang)), page(r, lang));
  for (const r of Object.keys(ssr.hiddenPages)) write(fileOf(urlOf(r, lang)), page(r, lang)); // noindex, không vào sitemap
}
write('404.html', page('/404'));
write('en/404.html', page('/404', 'en'));

/* ---------- 2. sitemap / robots / llms / ARD ---------- */
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['vi', 'en'].flatMap((lang) => routes.map((r) => `  <url>
    <loc>${langUrl(r, lang)}</loc>
    <xhtml:link rel="alternate" hreflang="vi" href="${langUrl(r, 'vi')}" />
    <xhtml:link rel="alternate" hreflang="en" href="${langUrl(r, 'en')}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${langUrl(r, 'vi')}" />
    <lastmod>${today}</lastmod>
    <changefreq>${pages[r].changefreq}</changefreq>
    <priority>${(lang === 'en' ? pages[r].priority * 0.8 : pages[r].priority).toFixed(1)}</priority>${pages[r].image ? `
    <image:image><image:loc>${absUrl(pages[r].image)}</image:loc></image:image>` : ''}
  </url>`)).join('\n')}
</urlset>
`);

const ardUrl = `${SITE_URL}/.well-known/ard.json`;
write('robots.txt', `# Norton Park — ${SITE_URL}
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
${env.ARD_AGENTMAP === '1' ? `Agentmap: ${ardUrl}\n` : `# Agentic Resource Discovery: ${ardUrl}\n`}`);

const faq = ssr.faq ?? [];
write('llms.txt', `# ${SITE.alternateName}

> ${pages['/'].description}

Chủ đầu tư: ${SITE.developer}. Địa chỉ: Số 5 Đại lộ Bình Dương (Quốc lộ 13), Phường Thuận Giao, TP.HCM. Hotline: 093 860 90 23.

## Trang
${routes.map((r) => `- [${pages[r].breadcrumb}](${absUrl(r)}): ${pages[r].description}`).join('\n')}

## Nội dung trang chủ
${sections.map((s) => `- [${s.subtitle}](${absUrl('/')}#${s.id}): ${s.summary}`).join('\n')}

## Câu hỏi thường gặp
${faq.map((f) => `- **${f.q}** ${f.a}`).join('\n')}

## English
${routes.map((r) => `- [${ssr.pageMeta(pages[r], 'en').breadcrumb}](${langUrl(r, 'en')}): ${ssr.pageMeta(pages[r], 'en').description}`).join('\n')}

## Cho AI agent
- [Danh mục tài nguyên agent (ARD)](${ardUrl})
- [Kỹ năng: đăng ký tư vấn](${SITE_URL}/skills/request-consultation.md)
- [Kỹ năng: tra cứu giá dự kiến](${SITE_URL}/skills/estimate-price.md)
`);

/* ARD: mảng ARD Entry (JSON-LD). URN neo theo tên miền và PHẢI trùng trustManifest.identity. */
const domain = new URL(SITE_URL).hostname.replace(/^www\./, '');
const ardEntry = (kind, name, extra) => ({
  '@context': 'https://agenticresourcediscovery.org/context/v1',
  identifier: `urn:air:${domain}:${kind}:${name}`,
  trustManifest: { identity: domain },
  ...extra,
});
write('.well-known/ard.json', JSON.stringify([
  ardEntry('skill', 'request-consultation', {
    displayName: 'Norton Park — Đăng ký tư vấn',
    type: 'application/agent-skills+md',
    url: `${SITE_URL}/skills/request-consultation.md`,
    description: 'Hướng dẫn agent giúp người dùng để lại thông tin nhận tư vấn, bảng giá và lịch tham quan Norton Park.',
    representativeQueries: [
      'đăng ký tư vấn căn hộ Norton Park',
      'nhận bảng giá Norton Park Bình Dương',
      'đặt lịch tham quan nhà mẫu Norton Park Gamuda Land',
    ],
  }),
  ardEntry('skill', 'estimate-price', {
    displayName: 'Norton Park — Tra cứu giá dự kiến',
    type: 'application/agent-skills+md',
    url: `${SITE_URL}/skills/estimate-price.md`,
    description: 'Cách tra diện tích GFA/NSA và giá dự kiến theo loại căn, layout trên bảng tính giá Norton Park.',
    representativeQueries: [
      'giá căn hộ 2 phòng ngủ Norton Park bao nhiêu',
      'diện tích studio Norton Park',
      'bảng tính giá Norton Park theo layout',
    ],
  }),
], null, 2) + '\n');

/* ---------- 3. Header cho Netlify / Cloudflare Pages ---------- */
const report = env.CSP_REPORT_URI ? `; report-uri ${env.CSP_REPORT_URI}` : '';
const csp = [
  `script-src ${loaderHash} 'strict-dynamic' 'unsafe-inline' https:`,
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'self'",
  "require-trusted-types-for 'script'",
  "trusted-types np default goog#html 'allow-duplicates'",
].join('; ') + report;
write('_headers', `# Sinh tự động bởi scripts/prerender-seo.mjs — hash CSP khớp đúng bản build này.
/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=3600; includeSubDomains
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
/images/_optimized/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=86400
/images/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
/*.html
  Cache-Control: public, max-age=0, must-revalidate
/
  Cache-Control: public, max-age=0, must-revalidate
`);
write('csp-hash.txt', loaderHash + '\n');

rmSync(join(root, '.ssr'), { recursive: true, force: true });
console.log(`Xong — SITE_URL = ${SITE_URL}`);
