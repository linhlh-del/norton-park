/* ============================================================
   URL CHO CÁC SECTION TRANG CHỦ — KHÔNG DÙNG DẤU "#"
   Trong code vẫn viết liên kết dạng "/#register", "/#position"… — localizePath() (src/i18n) đổi sang URL thật:
   - Section có trang chủ đề riêng (Vị trí, Tiện ích, Căn hộ) → trang đó (/vi-tri, /tien-ich, /mat-bang): giữ trang
     đã lập chỉ mục, không tạo 2 URL cùng nội dung.
   - Section còn lại → đường dẫn riêng (/cau-chuyen, /ban-do, /dang-ky): mở trang chủ và cuộn tới section.
     Các đường dẫn này dùng SEO + canonical của trang chủ, không vào sitemap (Seo.jsx, vercel.json).
   ============================================================ */

/** đường dẫn (tiếng Việt, không /en) → id section trên trang chủ */
export const SECTION_PATHS = {
  '/cau-chuyen': 'design-story',
  '/ban-do': 'position',
  '/dang-ky': 'register',
};

/** id section → trang chủ đề cùng nội dung */
export const PAGE_FOR_SECTION = {
  location: '/vi-tri',
  lifestyle: '/tien-ich',
  residences: '/mat-bang',
};

const PATH_FOR_SECTION = Object.fromEntries(Object.entries(SECTION_PATHS).map(([path, id]) => [id, path]));

/** URL thật của section (không "#"); null nếu section không có URL riêng */
export const urlForSection = (id) => PAGE_FOR_SECTION[id] || PATH_FOR_SECTION[id] || null;

/** "/#register" → "/dang-ky" (giữ nguyên nếu không phải liên kết section có URL riêng) */
export function resolveSectionLink(path) {
  if (typeof path !== 'string' || !path.startsWith('/#')) return path;
  return urlForSection(decodeURIComponent(path.slice(2))) || path;
}

/** id section ứng với đường dẫn (đã bỏ /en) — undefined nếu không phải đường dẫn section */
export const sectionForPath = (path = '/') => SECTION_PATHS[path.replace(/\/+$/, '') || '/'];
