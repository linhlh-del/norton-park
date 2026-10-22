import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useInView } from '@/lib/motion';
import { LOCALE, useLang } from '@/i18n';

/* Định dạng số theo ngôn ngữ:
   vi: "1.286" (chấm phân nghìn), "7,9" / "42,12" (phẩy thập phân)
   en: "1,286" (phẩy phân nghìn), "7.9" / "42.12" (chấm thập phân) */
const SEP = {
  vi: { re: /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g, group: '.', dec: ',' },
  en: { re: /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g, group: ',', dec: '.' },
};

function parse(text, lang) {
  const { re, group, dec: decSep } = SEP[lang] || SEP.vi;
  const parts = [];
  let last = 0;
  String(text).replace(re, (m, i) => {
    if (i > last) parts.push({ s: String(text).slice(last, i) });
    const [int, dec = ''] = m.split(decSep);
    parts.push({ n: Number(int.split(group).join('') + (dec ? '.' + dec : '')), dec: dec.length, group: int.includes(group) || int.length > 4 });
    last = i + m.length;
    return m;
  });
  if (last < String(text).length) parts.push({ s: String(text).slice(last) });
  return parts;
}

const fmtCache = new Map();
function fmt(n, dec, group, lang) {
  const key = lang + '|' + dec + '|' + group;
  if (!fmtCache.has(key)) {
    fmtCache.set(key, new Intl.NumberFormat(LOCALE[lang] || 'vi-VN', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: group }));
  }
  return fmtCache.get(key).format(n);
}

const render = (parts, k, from, lang) =>
  parts.map((p, i) => {
    if (p.s !== undefined) return p.s;
    const start = from?.[i]?.n ?? 0;
    return fmt(start + (p.n - start) * k, p.dec, p.group, lang);
  }).join('');

/**
 * Đếm số từ thấp lên giá trị hiện tại khi phần tử đi vào khung nhìn. Nhận cả chuỗi có chữ:
 *   <CountUp value="7,9 ha" />   <CountUp value="Từ 42,12 m²" />   <CountUp value="2.779.920.000 ₫" />
 * Mọi con số trong chuỗi cùng chạy; phần chữ giữ nguyên. Khi value đổi (vd. chọn căn khác) số chạy từ giá trị cũ
 * sang giá trị mới.
 * Không gây xê dịch bố cục: một bản sao vô hình của giá trị cuối giữ sẵn bề rộng. Trình đọc màn hình và máy tìm
 * kiếm luôn đọc giá trị cuối.
 */
export default function CountUp({ value, duration = 2400, className = '' }) {
  const ref = useRef(null);
  const lang = useLang();
  const inView = useInView(ref, { threshold: 0.4 });
  const parts = parse(value, lang);
  const prev = useRef(null);
  /* HTML prerender và lần render đầu hiển thị giá trị thật (máy tìm kiếm, không JS, hydrate khớp);
     sau khi gắn, số nào còn ngoài màn hình được đưa về 0 để chờ chạy khi cuộn tới. */
  const [shown, setShown] = useState(() => String(value));
  useEffect(() => {
    if (!inView && !prefersReducedMotion()) setShown(render(parts, 0, null, lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView) return undefined;
    const target = parse(value, lang);
    const from = prev.current && prev.current.length === target.length ? prev.current : null;
    prev.current = target;
    if (prefersReducedMotion()) { setShown(String(value)); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const ms = from ? Math.min(1200, duration) : duration;
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - t0) / ms));
      const k = 1 - Math.pow(1 - t, 3);
      setShown(t < 1 ? render(target, k, from, lang) : String(value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, lang]);

  /* ::before (nội dung lấy từ data-final, không nằm trong văn bản trang) giữ bề rộng của giá trị cuối */
  return (
    <span ref={ref} data-final={value} className={`count-up tabular-nums ${className}`}>
      {/* data-nosnippet: Google lấy đoạn trích từ bản sr-only (luôn là giá trị cuối), không lấy số đang chạy */}
      <span className="[grid-area:1/1]" aria-hidden="true" data-nosnippet="">{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
