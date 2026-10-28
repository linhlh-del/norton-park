import { useT } from '@/i18n';

const Arrow = ({ dir }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
);

/**
 * Nút trước / sau của carousel. tone: "light" (nền sáng) | "dark" (nền tối).
 */
export function CarouselNav({ prev, next, atStart, atEnd, tone = 'light', labels }) {
  const t = useT();
  const [lPrev, lNext] = labels || [t('carousel.prev'), t('carousel.next')];
  const cls = tone === 'dark'
    ? 'border-on-dark/40 text-on-dark hover:bg-on-dark/10'
    : 'border-line-strong text-hoadau hover:bg-hoadau/5';
  const btn = `grid size-12 cursor-pointer place-items-center rounded-full border bg-transparent transition-[opacity,background-color] disabled:pointer-events-none disabled:opacity-0 ${cls}`;
  return (
    <div className="flex gap-2">
      <button type="button" className={btn} onClick={prev} disabled={atStart} aria-label={lPrev}><Arrow dir={-1} /></button>
      <button type="button" className={btn} onClick={next} disabled={atEnd} aria-label={lNext}><Arrow dir={1} /></button>
    </div>
  );
}

/** Chấm phân trang; ẩn khi chỉ có một trang. */
export function CarouselDots({ page, pages, goTo, tone = 'light' }) {
  const t = useT();
  if (pages <= 1) return null;
  const on = tone === 'dark' ? 'bg-on-dark' : 'bg-hoadau';
  const off = tone === 'dark' ? 'bg-on-dark/30' : 'bg-hoadau/25';
  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} type="button" onClick={() => goTo(i)} aria-label={t('carousel.page', { n: i + 1 })} aria-current={i === page ? 'true' : undefined}
          className="grid h-8 w-8 cursor-pointer place-items-center border-0 bg-transparent p-0">
          <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === page ? `w-6 ${on}` : `w-1.5 ${off}`}`} />
        </button>
      ))}
    </div>
  );
}
