import { useEffect, useRef } from 'react';
import markup from './generated/markup.html?raw';
import data from './generated/data.json';
import logoUrl from './assets/location-map-logo.png';
import { createLocationMap } from './createLocationMap';
import { useT } from '@/i18n';
import './location-map.css';

/**
 * Section bản đồ vị trí — nội dung, layout và chuyển động lấy nguyên từ trang bản đồ độc lập
 * (markup/data sinh bởi `npm run extract:map`). React chỉ cấp khung; script bản đồ dựng và điều khiển
 * phần bên trong, được khởi tạo và huỷ theo vòng đời component.
 *
 * JSON-LD của trang bản đồ độc lập (generated/schema.json) KHÔNG chèn ở đây: trang chủ đã có một @graph chung
 * (src/seo/structured-data.js) — chèn thêm sẽ thành hai FAQPage / hai Organization trùng @id.
 *
 * onTrack(ev, label): tuỳ chọn, nhận sự kiện tương tác (bấm điểm, mốc thời gian, bộ lọc…) để gửi analytics.
 */
export default function LocationMap({ onTrack }) {
  const t = useT();
  const host = useRef(null);

  useEffect(() => {
    const destroy = createLocationMap(host.current, { markup, data, logoUrl });
    return destroy;
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el || !onTrack) return undefined;
    const fn = (e) => onTrack(e.detail.ev, e.detail.label);
    el.addEventListener('locmap:track', fn);
    return () => el.removeEventListener('locmap:track', fn);
  }, [onTrack]);

  return (
    <section id="position" aria-label={t('map.aria')} className="np-locmap">
      <div ref={host} className="h-full" />
    </section>
  );
}
