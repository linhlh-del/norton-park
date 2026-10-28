import { useEffect, useState } from 'react';
import { useSite, useT } from '@/i18n';
import { useContactPopup } from '@/components/popup/ContactPopup';

/* Nút nổi góc phải (chỉ biểu tượng, nhãn nằm ở aria-label/title): ↑ Lên đầu trang · Gọi · Zalo · Bảng giá.
   Trên điện thoại / máy tính bảng chỉ còn nút ↑ — Gọi · Zalo · Bảng giá nằm ở thanh sticky dưới đáy (ValueNav).
   Chuyển động: src/styles/floating-buttons.css */

/* ── Icon (Tabler icons, inline SVG để co giãn theo nút) ── */
function PhoneIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
    </svg>
  );
}

function PdfIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
      <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
      <path d="M17 18h2" />
      <path d="M20 15h-3v6" />
      <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1" />
    </svg>
  );
}

const ArrowUp = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

/* hiện nút ↑ sau khi cuộn quá ~1 màn hình */
function useScrolledPast(px) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => { frame = 0; setPast(window.scrollY > px); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [px]);
  return past;
}

/* Ẩn cả cụm khi bản đồ (#position — panel thông tin nằm sát mép phải), form đăng ký (#register) hoặc footer chiếm
   nửa dưới màn hình — đúng vùng cụm nút đang đứng — để nút không đè lên chữ, bộ lọc, nút gửi. Thanh liên hệ dưới đáy
   (< 1024px) và nút Tư vấn trên header vẫn luôn có. */
function useAvoidOverlap() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setHidden(visible.size > 0);
    }, { rootMargin: '-50% 0px 0px 0px' });
    /* bản đồ được gắn trễ (thay phần tử giữ chỗ cùng id) → theo dõi lại khi DOM của <main> đổi */
    const observe = () => {
      io.disconnect();
      visible.clear();
      ['position', 'register'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
      const footer = document.querySelector('footer');
      if (footer) io.observe(footer);
    };
    observe();
    const mo = new MutationObserver(observe);
    const main = document.getElementById('main');
    if (main) mo.observe(main, { childList: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return hidden;
}

export default function FloatingButtons() {
  const t = useT();
  const { contact } = useSite();
  const popup = useContactPopup();
  /* nút ↑ chỉ hiện sau khi đã qua ~2 section */
  const showTop = useScrolledPast(typeof window === 'undefined' ? 1400 : window.innerHeight * 1.8);
  const hidden = useAvoidOverlap();

  const toTop = () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    /* chỉ trên máy tính (≥ 1024px): điện thoại / máy tính bảng đã có thanh liên hệ dưới đáy — không để nút nào nổi
       đè lên chữ (kể cả nút ↑) */
    <div aria-hidden={hidden || undefined}
      className={`floating-buttons fixed bottom-6 right-5 z-40 hidden flex-col items-center gap-3.5 transition-[opacity,transform] duration-500 lg:flex ${hidden ? 'pointer-events-none translate-x-3 opacity-0' : ''}`}>
      {/* ── Lên đầu trang ── */}
      <button
        type="button"
        onClick={toTop}
        title={t('fb.top')}
        aria-label={t('fb.top')}
        tabIndex={showTop && !hidden ? 0 : -1}
        aria-hidden={showTop ? undefined : 'true'}
        className={`btn-cta grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-on-dark/40 bg-hoadau text-on-dark shadow-float transition-all duration-500 hover:-translate-y-0.5 hover:bg-hoadau-deep lg:h-12 lg:w-12 ${showTop ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* ── Gọi điện ── */}
      <a
        href={contact.hotlineHref}
        title={t('fb.call', { phone: contact.hotline })}
        aria-label={t('fb.call', { phone: contact.hotline })}
        className="group relative flex h-12 w-12 items-center max-lg:hidden justify-center rounded-full bg-[#0068FF] text-white no-underline shadow-[0_4px_20px_rgba(0,104,255,0.5)] transition-transform duration-200 hover:scale-[1.12] hover:text-white hover:[animation-play-state:paused] hover:shadow-[0_6px_28px_rgba(0,104,255,0.65)] lg:h-14 lg:w-14"
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-[#0068FF]/55 animate-fb-ring-1" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-[#0068FF]/35 animate-fb-ring-2" />
        <span className="relative z-[2] flex h-full w-full animate-fb-phone-wobble items-center justify-center rounded-full group-hover:[animation-play-state:paused]">
          <PhoneIcon className="h-1/2 w-1/2 shrink-0" aria-hidden="true" />
        </span>
      </a>

      {/* ── Zalo ── */}
      <a
        href={contact.zaloUrl}
        target="_blank"
        rel="noopener"
        title="Zalo"
        aria-label={t('fb.zalo')}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full max-lg:hidden transition-transform duration-200 [filter:drop-shadow(0_3px_10px_rgba(0,104,255,0.4))] hover:scale-[1.08] hover:[filter:drop-shadow(0_5px_16px_rgba(0,104,255,0.65))] lg:h-[50px] lg:w-[50px]"
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[#0068FF]/25 animate-fb-zalo-ring-1 group-hover:[animation-play-state:paused]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[#0068FF]/15 animate-fb-zalo-ring-2 group-hover:[animation-play-state:paused]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[#0068FF]/10 animate-fb-zalo-ring-3 group-hover:[animation-play-state:paused]" />
        <span className="relative z-[2] flex h-full w-full animate-fb-zalo-shake items-center justify-center rounded-full group-hover:[animation-play-state:paused]">
          <img src="/images/logo-zalo.webp" alt="" width="50" height="50" className="h-[85%] w-[85%] object-contain" />
        </span>
      </a>

      {/* ── Bảng giá: để lại thông tin qua popup ── */}
      <button
        type="button"
        onClick={() => popup.open('floating_price')}
        title={t('fb.price')}
        aria-label={t('fb.price')}
        className="group relative flex h-11 w-11 max-lg:hidden cursor-pointer items-center justify-center rounded-full border-0 bg-[#0068FF] p-0 text-white shadow-[0_4px_20px_rgba(0,104,255,0.5)] transition-transform duration-200 hover:scale-[1.12] hover:[animation-play-state:paused] hover:shadow-[0_6px_28px_rgba(0,104,255,0.65)] lg:h-[52px] lg:w-[52px]"
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-[#0068FF]/50 animate-fb-price-ring-1" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-[#0068FF]/30 animate-fb-price-ring-2" />
        <span className="relative z-[2] flex h-full w-full animate-fb-price-wobble items-center justify-center rounded-full group-hover:[animation-play-state:paused]">
          <PdfIcon className="h-1/2 w-1/2 shrink-0" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
