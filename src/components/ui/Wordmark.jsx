import { Link } from 'react-router-dom';

/** Chữ thương hiệu tạm thời — thay bằng file logo SVG chính thức khi có. */
export default function Wordmark({ size = 'md', className = '' }) {
  const big = size === 'lg';
  return (
    <Link to="/" className={`flex flex-col gap-0.5 text-on-dark no-underline hover:text-on-dark ${className}`}>
      <span className={`font-display leading-none tracking-logo ${big ? 'text-[28px]' : 'text-[26px]'}`}>NORTON PARK</span>
      <span className="font-sub text-[8px] tracking-eyebrow text-on-dark-soft">A GAMUDA LAND COMMUNITY</span>
      <span className="sr-only"> — Trang chủ</span>
    </Link>
  );
}
