import { useEffect, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * true khi phần tử đi vào khung nhìn (mặc định chỉ một lần).
 * Môi trường không có IntersectionObserver (máy cũ, công cụ thu thập dữ liệu) → coi như đã thấy.
 */
export function useInView(ref, { once = true, rootMargin = '0px 0px -10% 0px', threshold = 0.2 } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin, threshold]);
  return inView;
}
