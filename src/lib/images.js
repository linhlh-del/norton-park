import manifest from '@/generated/image-manifest.json';

/**
 * Tra bảng ảnh đã tối ưu (sinh bởi `npm run images`, chạy tự động trước `npm run build`).
 * Trả về srcset AVIF/WebP + kích thước gốc cho <picture>; null nếu ảnh chưa được tối ưu.
 */
/** Ảnh nội bộ (/images/…) có thật trong public/images không — bảng tra sinh lúc build nên không cần gửi request thử.
    Ảnh ngoài (http…) hoặc chưa có bảng tra (chưa chạy npm run images) → coi như có. */
export function hasImage(src) {
  if (!src) return false;
  if (!src.startsWith('/images/') || !Object.keys(manifest).length) return true;
  return src in manifest;
}

export function pictureSources(src) {
  const e = manifest[src];
  if (!e || !e.variants.length) return null;
  const set = (fmt) => e.variants.map((v) => `${v[fmt]} ${v.w}w`).join(', ');
  return {
    width: e.width,
    height: e.height,
    avif: set('avif'),
    webp: set('webp'),
    fallback: src,
  };
}
