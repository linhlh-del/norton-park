/* ============================================================
   SCHEMA CHO CMS — website tự mô tả: section nào, trường chữ / ảnh nào sửa được, giá trị mặc định, biến thể layout.
   Prerender ghi ra dist/cms-schema.json; CMS (norton-park-cms) đọc file này nên không cần chép nội dung sang CMS.
   Giá trị mặc định lấy THẲNG từ code (ui.js, data/site.js, site.en.js) — không qua lớp đè CMS.
   ============================================================ */
import ui from '@/i18n/ui';
import * as vi from '@/data/site';
import en from '@/data/site.en';
import { pageDefaults as pages, SITE } from '@/seo/site-meta';

/* Section trang chủ theo thứ tự mặc định. locked: luôn hiển thị, giữ vị trí. variants: phần tử đầu là mặc định. */
export const HOME_SECTIONS = [
  { id: 'hero', label: 'Hero (màn hình đầu)', locked: true, ui: ['hero'], images: [['site.images.hero', 'Ảnh nền (máy tính)', 'hero.imageAlt', '16/9'], ['site.images.heroPortrait', 'Ảnh nền (điện thoại dọc)', null, '9/16']],
    variants: [['center', 'Chữ giữa màn hình'], ['bottom', 'Chữ sát đáy ảnh']] },
  { id: 'design-story', label: 'Câu chuyện kiến trúc', ui: ['design'], images: [['site.images.designStory', 'Ảnh nền', 'design.imageAlt', '16/9']],
    variants: [['left', 'Chữ bên trái'], ['right', 'Chữ bên phải']] },
  { id: 'landscape-story', label: 'Câu chuyện cảnh quan', ui: ['landscape'], images: [['site.images.landscapeStory', 'Ảnh nền', 'landscape.imageAlt', '16/9']],
    variants: [['right', 'Chữ bên phải'], ['left', 'Chữ bên trái']] },
  { id: 'story', label: 'Tinh thần dự án — 3 trạm sạc', ui: ['spirit'], lists: [['stations', 'Trạm', ['title', 'body'], 'image', 'imageLabel']] },
  { id: 'facts', label: 'Thông tin & số liệu', ui: ['facts'], lists: [['facts', 'Số liệu', ['value', 'label']]] },
  { id: 'location', label: 'Vị trí', ui: ['location'], images: [['site.images.masterplan', 'Ảnh phối cảnh tổng thể', 'location.imageAlt', '16/9']] },
  { id: 'position', label: 'Bản đồ vị trí tương tác', ui: [] },
  { id: 'lifestyle', label: 'Tiện ích (carousel)', ui: ['lifestyle'], lists: [['lifestyle', 'Tiện ích', ['tag', 'title', 'body'], 'image', 'imageLabel']] },
  { id: 'blocks', label: 'Phân khu B & C', ui: ['blocks'], images: [['site.images.blockB', 'Ảnh phân khu B', 'blocks.bAlt', '4/3'], ['site.images.blockC', 'Ảnh phân khu C', 'blocks.cAlt', '4/3']] },
  { id: 'residences', label: 'Mặt bằng căn hộ', ui: ['res'] },
  { id: 'news', label: 'Tin tức (carousel)', ui: ['news'], lists: [['homeNews', 'Bài', ['title', 'excerpt', 'src', 'url'], 'image', 'alt']] },
  { id: 'register', label: 'Form đăng ký', locked: true, ui: ['form', 'contact'], images: [['site.images.register', 'Ảnh nền section', null, '16/9']] },
  { id: 'developer', label: 'Chủ đầu tư', ui: ['dev'] },
  { id: 'calc', label: 'Giới thiệu bảng tính giá', ui: ['calc'] },
  { id: 'faq', label: 'Câu hỏi thường gặp', ui: ['faq'], lists: [['faq', 'Câu hỏi', ['q', 'a']]] },
];

/* Các trang / khối khác sửa được chữ (không nằm trong bố cục trang chủ) */
const OTHER_SECTIONS = [
  { id: 'popup', label: 'Popup đăng ký', ui: ['popup'] },
  { id: 'sticky', label: 'Thanh liên hệ nhanh & nút nổi', ui: ['values', 'fb', 'cta'] },
  { id: 'price-page', label: 'Trang Bảng tính giá', ui: ['pc'] },
  { id: 'news-page', label: 'Trang Tin tức', ui: ['np'] },
  { id: 'thank-you', label: 'Trang Cảm ơn', ui: ['ty'] },
];

/* khoá kỹ thuật / nhãn trợ năng — không đưa lên CMS */
const SKIP = /\.(aria|imageLabel|imageAlt|track|prev|next|newTab|bAlt|cAlt)$|^form\.(err\.|step)/;

const LABELS = {
  eyebrow: 'Dòng nhỏ phía trên tiêu đề', title: 'Tiêu đề hiển thị (slogan)', title1: 'Tiêu đề dòng 1', title2: 'Tiêu đề dòng 2',
  seo: 'Tiêu đề SEO (thẻ heading chứa từ khoá)', h1: 'H1 trang chủ (từ khoá + địa danh)', intro: 'Đoạn dẫn', p1: 'Đoạn 1', p2: 'Đoạn 2',
  cta: 'Chữ trên nút', explore: 'Nút khám phá', body1: 'Đoạn 1', body2: 'Đoạn 2', body3: 'Đoạn 3', note: 'Ghi chú',
};

const enUi = ui.en || {};
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const both = (viV, enV) => ({ vi: viV ?? '', en: enV ?? viV ?? '' });

function field(key, label, def) {
  const longest = Math.max(String(def.vi).length, String(def.en).length);
  return { key, label, default: def, type: longest > 90 ? 'textarea' : 'text', rows: longest > 260 ? 6 : 3 };
}

function build(s) {
  const fields = [];
  const images = [];
  for (const prefix of s.ui || []) {
    for (const key of Object.keys(ui.vi).filter((k) => k.startsWith(`${prefix}.`) && !SKIP.test(k))) {
      const suffix = key.slice(prefix.length + 1);
      fields.push(field(key, `${LABELS[suffix] || suffix}  ·  ${key}`, both(ui.vi[key], enUi[key])));
    }
  }
  for (const [key, label, altKey, ratio] of s.images || []) {
    images.push({ key, label, default: get(vi, key.slice(5)), altKey, altDefault: altKey ? ui.vi[altKey] : undefined, ratio });
  }
  for (const [path, itemLabel, keys, imageKey, altKey] of s.lists || []) {
    (vi[path] || []).forEach((item, i) => {
      for (const k of keys) {
        const p = `${path}.${i}.${k}`;
        fields.push(field(`site.${p}`, `${itemLabel} ${i + 1} — ${k}`, both(item[k], get(en, p))));
      }
      if (imageKey) {
        images.push({ key: `site.${path}.${i}.${imageKey}`, label: `${itemLabel} ${i + 1} — ảnh`, default: item[imageKey],
          altKey: altKey && `site.${path}.${i}.${altKey}`, altDefault: altKey && item[altKey], ratio: '4/3' });
      }
    });
  }
  return {
    id: s.id, label: s.label, locked: Boolean(s.locked), inLayout: s.inLayout !== false,
    variants: s.variants?.map(([id, label]) => ({ id, label })), fields, images,
  };
}

/* thông tin chung → settings["site.contact.*"] */
const SETTINGS = [
  ['hotline', 'Hotline hiển thị', 'vd. 093 448 3138'],
  ['hotlineHref', 'Link gọi (tel:)', 'vd. tel:+84934483138'],
  ['zaloUrl', 'Link Zalo OA'],
  ['email', 'Email'],
  ['address', 'Địa chỉ dự án (đơn vị hành chính hiện hành)'],
  ['mapUrl', 'Link Google Maps'],
  ['fanpageUrl', 'Link Fanpage Facebook'],
  ['tour360Url', 'Link tour 360°'],
  ['legalName', 'Tên pháp nhân (chân trang)'],
  ['legalAddress', 'Địa chỉ pháp nhân (chân trang)'],
];

/** Toàn bộ schema cho CMS */
export function buildCmsSchema() {
  return {
    version: 1,
    project: 'norton-park',
    langs: ['vi', 'en'],
    sections: [...HOME_SECTIONS.map(build), ...OTHER_SECTIONS.map((s) => ({ ...build(s), inLayout: false }))],
    seo: Object.entries(pages).map(([path, p]) => ({
      path,
      label: p.breadcrumb,
      default: { vi: { title: p.title, description: p.description }, en: { title: p.en?.title, description: p.en?.description } },
      defaultOgImage: SITE.ogImage,
    })),
    settings: SETTINGS.map(([k, label, hint]) => ({ key: `site.contact.${k}`, label, hint, default: vi.contact[k] })),
    lead: { defaultEndpoint: import.meta.env?.VITE_LEAD_ENDPOINT || '' },
  };
}
