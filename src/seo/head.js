import { SITE, absUrl, notFound, pages } from './site-meta';
import { structuredData } from './structured-data';

/* Mã xác minh Google Search Console (phương thức "Thẻ HTML"): đặt VITE_GSC_VERIFICATION trong .env.production.
   Chỉ chèn khi có giá trị. Có thể xác minh bằng bản ghi DNS thay thế — xem docs/SEO.md. */
const GSC = import.meta.env?.VITE_GSC_VERIFICATION || '';

/**
 * Toàn bộ thẻ <head> SEO cho một route, dạng dữ liệu thuần để dùng cả ở trình duyệt (<Seo>) lẫn lúc prerender.
 * Mỗi thẻ có `key` để cập nhật đúng thẻ cũ khi chuyển trang thay vì chèn thêm.
 */
export function headFor(path) {
  const page = pages[path];
  const p = page || notFound;
  const url = absUrl(path);
  const image = absUrl(SITE.ogImage);

  const meta = [
    ['name', 'description', p.description],
    ['name', 'robots', p.noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'],
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', SITE.name],
    ['property', 'og:locale', SITE.locale],
    ['property', 'og:title', p.title],
    ['property', 'og:description', p.description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:width', '1200'],
    ['property', 'og:image:height', '630'],
    ['property', 'og:image:alt', SITE.ogImageAlt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', p.title],
    ['name', 'twitter:description', p.description],
    ['name', 'twitter:image', image],
    SITE.twitterSite && ['name', 'twitter:site', SITE.twitterSite],
    GSC && ['name', 'google-site-verification', GSC],
  ].filter(Boolean).map(([attr, name, content]) => ({ tag: 'meta', key: name, attrs: { [attr]: name, content } }));

  const links = page ? [
    { tag: 'link', key: 'canonical', attrs: { rel: 'canonical', href: url } },
    { tag: 'link', key: 'alternate-vi', attrs: { rel: 'alternate', hreflang: 'vi', href: url } },
    { tag: 'link', key: 'alternate-x', attrs: { rel: 'alternate', hreflang: 'x-default', href: url } },
  ] : [];

  return { title: p.title, tags: [...meta, ...links], jsonld: page ? structuredData(path) : null };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* JSON trong <script>: chặn "</script>" và ký tự phân dòng U+2028/2029 */
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029), BS = String.fromCharCode(92);
export const safeJson = (o) => JSON.stringify(o).replaceAll('<', BS + 'u003c').replaceAll(LS, BS + 'u2028').replaceAll(PS, BS + 'u2029');

/** Chuỗi HTML cho bước prerender */
export function headHtml(path) {
  const h = headFor(path);
  const tags = h.tags.map((t) => `<${t.tag} data-seo="${esc(t.key)}" ${Object.entries(t.attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')} />`);
  if (h.jsonld) tags.push(`<script type="application/ld+json" data-seo="jsonld">${safeJson(h.jsonld)}</script>`);
  return { title: `<title>${esc(h.title)}</title>`, tags: tags.join('\n    ') };
}
