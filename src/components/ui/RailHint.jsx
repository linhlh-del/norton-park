import { useEffect, useState } from 'react';
import { useT } from '@/i18n';

/**
 * Gợi ý "Vuốt ngang để xem thêm" dưới một dải trượt ngang .m-rail (chỉ điện thoại).
 * - Mép phải của dải mờ dần (CSS: .m-rail:not([data-at-end])) để báo còn nội dung phía sau.
 * - Mũi tên nhích nhẹ; tự ẩn khi người dùng đã vuốt, mờ mép tắt khi tới cuối dải.
 * railRef: ref tới phần tử .m-rail.
 */
export default function RailHint({ railRef, tone = 'light' }) {
  const t = useT();
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    const el = railRef.current;
    if (!el) return undefined;
    const check = () => {
      if (el.scrollLeft > 8) setMoved(true);
      el.toggleAttribute('data-at-end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    return () => el.removeEventListener('scroll', check);
  }, [railRef]);
  return (
    <p aria-hidden="true"
      className={`m-0 -mt-2 flex items-center justify-end gap-2 font-sub text-xs font-semibold uppercase tracking-[0.12em] transition-opacity duration-500 md:hidden ${moved ? 'opacity-0' : 'opacity-100'} ${tone === 'dark' ? 'text-on-dark-soft' : 'text-ink-soft'}`}>
      {t('rail.hint')}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        className="motion-safe:animate-[np-nudge_1.6s_ease-in-out_infinite]"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </p>
  );
}
