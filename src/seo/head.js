import { LANG_META, SITE, absUrl, hiddenPages, langUrl, notFound, pageMeta, pages } from './site-meta';
import { structuredData } from './structured-data';
import { MODIFIED } from './build-date';

/* Mã xác minh Google Search Console (phương thức "Thẻ HTML"): đặt VITE_GSC_VERIFICATION trong .env.production.
   Chỉ chèn khi có giá trị. Có thể xác minh bằng bản ghi DNS thay thế — xem docs/SEO.md. */
const GSC = import.meta.env?.VITE_GSC_VERIFICATION || '';

/**
 * Toàn bộ thẻ <head> SEO cho một route, dạng dữ liệu thuần để dùng cả ở trình duyệt (<Seo>) lẫn lúc prerender.
 * Mỗi thẻ có `key` để cập nhật đúng thẻ cũ khi chuyển trang thay vì chèn thêm.
 * path: đường dẫn tiếng Việt ("/tin-tuc"); lang: "vi" | "en" (bản en nằm ở "/en/tin-tuc").
 */
export function headFor(path, lang = 'vi') {
  const page = pages[path];
  const p = pageMeta(page || hiddenPages[path] || notFound, lang);
  const url = langUrl(path, lang);
  const other = lang === 'en' ? 'vi' : 'en';
  /* ảnh chia sẻ riêng của trang (chọn trong CMS) hoặc ảnh mặc định 1200×630 */
  const custom = page?.ogImage;
  const image = absUrl(custom || SITE.ogImage);

  const meta = [
    ['name', 'description', p.description],
    ['name', 'robots', p.noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'],
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', SITE.name],
    ['property', 'og:locale', LANG_META[lang].locale],
    page && ['property', 'og:locale:alternate', LANG_META[other].locale],
    ['property', 'og:title', p.ogTitle || p.title],
    ['property', 'og:description', p.ogDescription || p.description],
    page && ['property', 'article:modified_time', `${MODIFIED}T00:00:00+07:00`],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:secure_url', image],
    !custom && ['property', 'og:image:type', SITE.ogImageType],
    !custom && ['property', 'og:image:width', String(SITE.ogImageWidth)],
    !custom && ['property', 'og:image:height', String(SITE.ogImageHeight)],
    ['property', 'og:image:alt', SITE.ogImageAlt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', p.ogTitle || p.title],
    ['name', 'twitter:description', p.ogDescription || p.description],
    ['name', 'twitter:image', image],
    SITE.twitterSite && ['name', 'twitter:site', SITE.twitterSite],
    GSC && ['name', 'google-site-verification', GSC],
  ].filter(Boolean).map(([attr, name, content]) => ({ tag: 'meta', key: name, attrs: { [attr]: name, content } }));

  const links = page ? [
    { tag: 'link', key: 'canonical', attrs: { rel: 'canonical', href: url } },
    /* hreflang: mỗi bản trỏ tới cả hai bản (kể cả chính nó); x-default = tiếng Việt */
    { tag: 'link', key: 'alternate-vi', attrs: { rel: 'alternate', hreflang: 'vi', href: langUrl(path, 'vi') } },
    { tag: 'link', key: 'alternate-en', attrs: { rel: 'alternate', hreflang: 'en', href: langUrl(path, 'en') } },
    { tag: 'link', key: 'alternate-x', attrs: { rel: 'alternate', hreflang: 'x-default', href: langUrl(path, 'vi') } },
  ] : [];

  return { title: p.title, lang, tags: [...meta, ...links], jsonld: page ? structuredData(path, lang) : null };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* JSON trong <script>: chặn "</script>" và ký tự phân dòng U+2028/2029 */
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029), BS = String.fromCharCode(92);
export const safeJson = (o) => JSON.stringify(o).replaceAll('<', BS + 'u003c').replaceAll(LS, BS + 'u2028').replaceAll(PS, BS + 'u2029');

/** Chuỗi HTML cho bước prerender */
export function headHtml(path, lang = 'vi') {
  const h = headFor(path, lang);
  const tags = h.tags.map((t) => `<${t.tag} data-seo="${esc(t.key)}" ${Object.entries(t.attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')} />`);
  if (h.jsonld) tags.push(`<script type="application/ld+json" data-seo="jsonld">${safeJson(h.jsonld)}</script>`);
  return { title: `<title>${esc(h.title)}</title>`, tags: tags.join('\n    ') };
}
