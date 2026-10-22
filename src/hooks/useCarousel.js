import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Carousel dựa trên scroll-snap của trình duyệt (vuốt / kéo trackpad / bàn phím đều chạy sẵn).
 * Trả về ref gắn vào track, chỉ số trang hiện tại, tổng số trang và các hàm điều hướng.
 * "Trang" = một khung nhìn của track, nên số chấm tự đổi theo số slide hiển thị cùng lúc.
 */
export default function useCarousel() {
  const trackRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* các điểm dừng: mép trái từng slide còn cuộn tới được, cộng điểm cuối track.
     Đo layout tốn kém (forced reflow) nên chỉ tính lại khi kích thước đổi, còn lúc cuộn dùng bản đã lưu. */
  const cache = useRef(null);
  const computeStops = useCallback(() => {
    const el = trackRef.current;
    if (!el) return [0];
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) return [0];
    const xs = Array.from(el.children).map((c) => c.offsetLeft - el.children[0].offsetLeft).filter((x) => x < max - 2);
    return [...xs, max];
  }, []);
  const stops = useCallback(() => cache.current ?? (cache.current = computeStops()), [computeStops]);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const s = stops();
    const max = s[s.length - 1];
    const x = el.scrollLeft;
    setPages(s.length);
    let idx = 0;
    s.forEach((p, i) => { if (x >= p - 2) idx = i; });
    setPage(idx);
    setAtStart(x <= 1);
    setAtEnd(x >= max - 1);
  }, [stops]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; measure(); });
    };
    const onResize = () => { cache.current = null; onScroll(); };
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', onScroll); ro.disconnect(); cancelAnimationFrame(frame); };
  }, [measure]);

  /* cuộn mượt tự làm bằng requestAnimationFrame: không phụ thuộc scroll-behavior của trình duyệt.
     Tạm tắt scroll-snap trong lúc chạy, nếu không trình duyệt sẽ bắt dính về slide cũ sau mỗi khung hình. */
  const anim = useRef(0);
  const scrollToX = useCallback((target) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const to = Math.max(0, Math.min(max, target));
    cancelAnimationFrame(anim.current);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.scrollLeft = to; measure(); return; }
    const from = el.scrollLeft, t0 = performance.now(), ms = 520;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    el.style.scrollSnapType = 'none';
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      el.scrollLeft = from + (to - from) * ease(t);
      if (t < 1) anim.current = requestAnimationFrame(tick);
      else { el.style.scrollSnapType = ''; measure(); }
    };
    anim.current = requestAnimationFrame(tick);
  }, [measure]);
  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  /* lùi / tiến đúng một điểm dừng (một slide) */
  const step = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const s = stops(), cur = el.scrollLeft;
    const target = dir > 0 ? s.find((x) => x > cur + 2) : [...s].reverse().find((x) => x < cur - 2);
    scrollToX(target ?? (dir > 0 ? s[s.length - 1] : 0));
  }, [stops, scrollToX]);

  const goTo = useCallback((i) => {
    const s = stops();
    scrollToX(s[Math.max(0, Math.min(s.length - 1, i))]);
  }, [stops, scrollToX]);

  return { trackRef, page, pages, atStart, atEnd, prev: () => step(-1), next: () => step(1), goTo };
}
