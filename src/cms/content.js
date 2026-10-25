/* ============================================================
   NỘI DUNG TỪ CMS (bản đã đăng) — đè lên nội dung mặc định trong code.
   src/generated/cms-content.json do scripts/fetch-cms.mjs tải từ Supabase lúc build (không có file → dùng mặc định).
   Quy ước khoá (khớp src/cms/schema.js và CMS):
   - texts["hero.title1"]            → chữ giao diện (src/i18n/ui.js)
   - texts["site.stations.0.body"]   → nội dung src/data/site.js theo đường dẫn
   - images["site.images.hero"]      → { src } ảnh theo đường dẫn trong site.js (ảnh đã tải về public/images/cms/)
   - settings["site.contact.hotline"]→ thông tin chung
   - giá trị chữ: "chuỗi" (chỉ tiếng Việt) hoặc { vi, en }
   ============================================================ */
const files = import.meta.glob('../generated/cms-content.json', { eager: true, import: 'default' });
export const cms = Object.values(files)[0] || {};

const pick = (v, lang) => (v == null ? undefined : typeof v === 'string' ? (lang === 'vi' ? v : undefined) : v[lang] || undefined);

/** Chữ giao diện từ CMS (undefined = dùng mặc định) */
export const cmsText = (key, lang) => pick(cms.texts?.[key], lang);

/* gán giá trị theo đường dẫn "a.0.b", sao chép nông từng tầng để không sửa dữ liệu gốc */
function setPath(root, path, value) {
  const keys = path.split('.');
  const out = Array.isArray(root) ? [...root] : { ...root };
  let cur = out;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i];
    const next = cur[k];
    if (next == null || typeof next !== 'object') return out; // đường dẫn không tồn tại → bỏ qua
    cur[k] = Array.isArray(next) ? [...next] : { ...next };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return out;
}

/** Áp nội dung CMS vào object site (src/data/site.js đã gộp bản dịch) */
export function applySiteOverrides(site, lang) {
  let s = site;
  for (const [key, v] of Object.entries(cms.texts || {})) {
    const val = pick(v, lang);
    if (key.startsWith('site.') && val !== undefined) s = setPath(s, key.slice(5), val);
  }
  for (const [key, v] of Object.entries(cms.settings || {})) {
    if (key.startsWith('site.') && v) s = setPath(s, key.slice(5), v);
  }
  for (const [key, v] of Object.entries(cms.images || {})) {
    if (key.startsWith('site.') && v?.src) s = setPath(s, key.slice(5), v.src);
  }
  return s;
}

/** Bố cục trang chủ: thứ tự, section ẩn, biến thể */
export const cmsLayout = {
  order: cms.layout?.order || [],
  hidden: new Set(cms.layout?.hidden || []),
  variants: cms.layout?.variants || {},
};

/** SEO 1 trang: { title, description, ogImage } — mọi trường đều tuỳ chọn */
export function cmsSeo(path, lang) {
  const p = cms.seo?.[path];
  if (!p) return {};
  const byLang = p[lang] && typeof p[lang] === 'object' ? p[lang] : lang === 'vi' ? p : {};
  return { title: byLang.title, description: byLang.description, ogImage: p.ogImage?.src };
}

export const cmsHead = cms.head || {};
