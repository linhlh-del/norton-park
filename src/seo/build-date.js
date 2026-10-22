/* Ngày build (vite.config.js → __BUILD_DATE__) = ngày cập nhật nội dung: dateModified, article:modified_time, sitemap */
// eslint-disable-next-line no-undef
export const MODIFIED = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10);
