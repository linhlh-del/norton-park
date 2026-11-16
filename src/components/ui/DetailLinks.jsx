import { useLocation } from 'react-router-dom';
import { Link, stripLang, useT } from '@/i18n';

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const tones = {
  light: 'text-hoadau hover:text-bronze-deep decoration-bronze/50',
  dark: 'text-on-dark hover:text-on-dark-soft decoration-on-dark-soft/60',
};

/**
 * CTA từ section trang chủ sang trang chi tiết: links = [[đường dẫn, khoá chữ trong ui.js], …].
 * Section cũng dùng lại trên trang chi tiết → bỏ link trỏ về chính trang đang xem.
 */
export default function DetailLinks({ links, tone = 'light', align = 'start', className = '' }) {
  const t = useT();
  const here = stripLang(useLocation().pathname).replace(/\/+$/, '') || '/';
  const shown = links.filter(([to]) => to !== here);
  if (!shown.length) return null;
  return (
    <div data-reveal="fade" className={`flex flex-wrap gap-x-8 gap-y-1 ${align === 'center' ? 'justify-center' : ''} ${className}`}>
      {shown.map(([to, key]) => (
        <Link key={to} to={to} data-track="cta_click" data-track-label={`detail${to.replace(/\//g, '_')}`}
          className={`inline-flex min-h-11 items-center gap-2 font-sub text-xs font-semibold uppercase tracking-button underline underline-offset-[6px] ${tones[tone]}`}>
          {t(key)} <Arrow />
        </Link>
      ))}
    </div>
  );
}
