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

/* bản đồ đang chiếm giữa màn hình → ẩn cụm nút để không che bản đồ, bảng thông tin và thanh kéo
   bảng thông tin (thanh CTA dưới đáy vẫn còn nút Tư vấn) */
function useMapActive() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const r = document.getElementById('position')?.getBoundingClientRect();
      setOn(Boolean(r && r.top < innerHeight * 0.35 && r.bottom > innerHeight * 0.65));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return on;
}

export default function FloatingButtons() {
  const t = useT();
  const { contact } = useSite();
  const popup = useContactPopup();
  const showTop = useScrolledPast(700);
  const mapActive = useMapActive();

  const toTop = () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <div className={`floating-buttons fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-3 z-40 flex flex-col items-center gap-2.5 transition-opacity duration-500 sm:right-5 lg:bottom-6 lg:gap-3.5 ${mapActive ? 'pointer-events-none opacity-0' : ''}`}>
      {/* ── Lên đầu trang ── */}
      <button
        type="button"
        onClick={toTop}
        title={t('fb.top')}
        aria-label={t('fb.top')}
        tabIndex={showTop ? 0 : -1}
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
