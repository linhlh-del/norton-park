import { useCallback, useState } from 'react';
import { hasImage, pictureSources } from '@/lib/images';

/**
 * Ô ảnh: hiển thị ảnh nếu file tồn tại, nếu không hiện khung màu với nhãn mô tả (dùng khi chưa có ảnh).
 * - Ảnh hiện dần khi tải xong; trong lúc tải ô ảnh "thở" nhẹ.
 * - Nếu ảnh đã được tối ưu (npm run images) → tự dùng <picture> AVIF/WebP nhiều kích thước.
 * - priority: ảnh nằm trong màn hình đầu (hero) → tải ngay, fetchpriority="high", không làm mờ (giữ LCP nhanh).
 * - sizes: gợi ý bề rộng hiển thị cho trình duyệt chọn file phù hợp.
 * tone="dark" cho ô nằm trên nền tối.
 */
export default function Media({ src, alt = '', label, className = '', tone = 'light', style, priority = false, sizes = '100vw' }) {
  /* ảnh chưa có trong public/images → hiện khung chờ ngay, không phát sinh request 404 */
  const [failed, setFailed] = useState(!hasImage(src));
  const [loaded, setLoaded] = useState(false);

  /* ảnh có sẵn trong cache có thể xong trước khi React gắn onLoad */
  const imgRef = useCallback((img) => {
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  const toneStyle = tone === 'dark'
    ? { '--media-bg': 'var(--color-hoadau-soft)', '--media-ink': 'rgb(244 240 231 / 0.72)' }
    : {};
  const sources = !failed && src ? pictureSources(src) : null;

  const img = !failed && (
    <img
      ref={imgRef}
      src={sources?.fallback || src}
      srcSet={sources?.fallbackSrcSet}
      sizes={sources ? sizes : undefined}
      width={sources?.width}
      height={sources?.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding={priority ? undefined : 'async'}
      className="media-img absolute inset-0 h-full w-full object-cover"
      data-state={priority ? undefined : loaded ? 'loaded' : 'loading'}
      data-priority={priority ? '' : undefined}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );

  return (
    <div className={`media ${className}`} style={{ ...toneStyle, ...style }} data-loading={!failed && !loaded && !priority ? 'true' : undefined}>
      {img && sources ? (
        <picture>
          {sources.avif && <source type="image/avif" srcSet={sources.avif} sizes={sizes} />}
          {sources.webp && <source type="image/webp" srcSet={sources.webp} sizes={sizes} />}
          {img}
        </picture>
      ) : img}
      {failed && label && <span className="media-label">{label}</span>}
    </div>
  );
}
