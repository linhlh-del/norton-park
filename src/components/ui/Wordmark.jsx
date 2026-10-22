import { Link, useT } from '@/i18n';

/* Logo chính thức (SVG): bản màu be cho nền tối (header, footer), bản màu gốc cho nền sáng. Tỉ lệ 688.8 × 114.72.
   Điện thoại: thu nhỏ để header còn chỗ cho nút Tư vấn + menu. */
const LOGO = {
  dark: '/images/imgi_1_norton-park-logo-primary-beige.svg',
  light: '/images/imgi_2_norton-park-logo-primary.svg',
};

export default function Wordmark({ size = 'md', tone = 'dark', className = '' }) {
  const t = useT();
  const w = size === 'lg' ? 240 : 190;
  return (
    <Link to="/" className={`inline-flex shrink-0 no-underline ${className}`}>
      <img src={LOGO[tone]} alt="Norton Park — A Gamuda Land Community" width={w} height={Math.round(w * 114.72 / 688.8)}
        className={`block h-auto ${size === 'lg' ? 'w-[240px]' : 'w-[140px] sm:w-[190px]'}`} decoding="async" />
      <span className="sr-only"> {t('logo.home')}</span>
    </Link>
  );
}
