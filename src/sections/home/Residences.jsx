import { useRef, useState } from 'react';
import { Link, useSite, useT } from '@/i18n';
import FloorPlans from '@/components/ui/FloorPlans';
import SectionHeading from '@/components/ui/SectionHeading';
import { isFilled } from '@/lib/filled';

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

/* tên bộ sưu tập rút gọn cho điện thoại: "Bộ sưu tập chuẩn sống toàn cầu" → "Chuẩn sống toàn cầu" */
const shortTitle = (s) => {
  const v = s.replace(/^bộ sưu tập\s+/i, '').replace(/\s+collection$/i, '');
  return v.charAt(0).toUpperCase() + v.slice(1);
};

export default function Residences() {
  const t = useT();
  const { collections, priceTypes } = useSite();
  const [col, setCol] = useState(0);
  const [unitIdx, setUnitIdx] = useState(0);
  const zoomRef = useRef(null);
  const current = collections[col];
  const unit = current.units[unitIdx] || current.units[0];
  /* nút "Xem giá dự kiến" mở bảng tính giá đúng loại căn đang xem */
  const typeIdx = Math.max(0, priceTypes.findIndex((p) => p.name === unit.name));

  /* diện tích hiển thị tĩnh (không đếm số); dòng chưa có dữ liệu ("[Đang cập nhật]") được ẩn */
  const rows = [
    [t('res.rooms'), unit.rooms],
    [t('res.gfa'), unit.gfa],
    [t('res.nsa'), unit.nsa],
    [t('res.view'), unit.view],
  ].filter(([, v]) => isFilled(v) && v !== '—');

  return (
    <section id="residences" className="bg-cream py-section">
      <div className="container-site flex flex-col gap-[clamp(0.75rem,2.6svh,2rem)]">
        <SectionHeading eyebrow={t('res.eyebrow')} title={t('res.title')} seo={t('res.seo')} />

        {/* máy tính: tab bộ sưu tập (trái) và chip loại căn (phải) chung 1 hàng — tiết kiệm 1 hàng cho khung hình */}
        <div className="flex flex-col gap-[clamp(0.75rem,2.6svh,2rem)] lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* điện thoại: 2 tab chia đôi bề ngang — thấy đủ cả hai, không phải kéo ngang */}
        <div data-reveal="up" role="tablist" aria-label={t('res.collections')} className="grid grid-cols-2 gap-x-3 md:flex md:gap-x-6">
          {collections.map((c, i) => (
            <button key={c.key} type="button" role="tab" aria-selected={i === col}
              onClick={() => { setCol(i); setUnitIdx(0); }}
              className={`min-h-11 cursor-pointer border-b-2 px-1 py-2 text-left font-sub text-xs font-semibold uppercase leading-snug tracking-[0.1em] md:whitespace-nowrap md:tracking-[0.14em] xl:tracking-[0.18em] ${i === col ? 'border-bronze-deep text-hoadau' : 'border-transparent text-ink-soft'}`}>
              <span className="md:hidden">{shortTitle(c.title)}</span>
              <span className="max-md:hidden">{c.title}</span>
            </button>
          ))}
        </div>

        {/* chip loại căn xuống dòng khi hết chỗ (không ẩn sau mép phải); điện thoại: chip gọn hơn */}
        <div data-reveal="up" style={{ '--reveal-i': 1 }} className="flex flex-wrap gap-2 lg:justify-end">
          {current.units.map((u, i) => (
            <button key={u.name} type="button" className="chip whitespace-nowrap max-sm:min-h-10 max-sm:px-3.5 max-sm:text-[0.8125rem]" aria-pressed={i === unitIdx} onClick={() => setUnitIdx(i)}>{u.name}</button>
          ))}
        </div>
        </div>

        <div role="tabpanel" data-reveal="zoom"
          className="grid items-center gap-[clamp(1rem,3svh,2.5rem)] rounded-panel bg-white p-[clamp(1rem,3svh,2.5rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="relative">
            <FloorPlans key={unit.name} plans={unit.plans} name={unit.label}
              mediaClass="h-[clamp(160px,23svh,300px)] md:h-[clamp(220px,34svh,380px)] lg:h-[clamp(200px,42svh,480px)]" />
            <button type="button" onClick={() => zoomRef.current?.showModal()}
              className="absolute bottom-2 right-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-hoadau/85 px-3.5 font-sub text-xs font-semibold uppercase tracking-[0.12em] text-ivory backdrop-blur-sm hover:bg-hoadau">
              <ZoomIcon /><span className="sr-only">{t('res.zoom')}</span>
            </button>
          </div>
          <div className="flex flex-col gap-[clamp(0.5rem,1.6svh,1.25rem)]">
            {/* tên bộ sưu tập đã nằm ở tab phía trên → chỉ ghi mã căn tiêu biểu (nếu đã có) */}
            {isFilled(unit.code) && <p className="eyebrow text-bronze-deep">{t('res.typical', { code: unit.code })}</p>}
            {/* điện thoại: tên căn đã hiện ở chip đang chọn → chỉ giữ cho trình đọc màn hình, nhường chỗ cho thông số */}
            <h3 className="heading-3 !text-[clamp(1.6rem,2.8vw,2.6rem)] max-md:sr-only">{unit.name}</h3>
            {/* điện thoại: lưới 2×2 (nhãn trên, giá trị dưới) — gọn nửa chiều cao so với 4 dòng ngang */}
            <dl className="m-0 grid grid-cols-2 gap-x-4 md:flex md:flex-col">
              {rows.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 border-t border-line py-2 md:flex-row md:justify-between md:gap-4 md:py-[clamp(0.4rem,1.15svh,0.875rem)] md:last:border-b">
                  <dt className="text-sm text-ink-soft md:text-base">{k}</dt>
                  <dd className="m-0 font-medium text-hoadau md:text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3 max-sm:grid max-sm:grid-cols-2">
              <Link to="/#register" className="btn btn-solid max-sm:px-3" data-track="cta_click" data-track-label="residences_register">{t('cta.registerInterest')}</Link>
              <Link to={`/bang-tinh-gia?loai=${typeIdx}`} className="btn btn-ghost max-sm:px-3" data-track="cta_click" data-track-label="residences_price">{t('res.price')} →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Phóng to mặt bằng: <dialog> gốc của trình duyệt (Esc để đóng, khoá focus, trả focus về nút) */}
      <dialog ref={zoomRef} aria-label={`${t('res.zoom')} — ${unit.label}`}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
        className="m-auto w-[min(96vw,1100px)] max-w-none rounded-panel border-0 bg-white p-0 backdrop:bg-hoadau-deep/80">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <p className="m-0 font-display text-xl text-hoadau">{unit.name}</p>
          <button type="button" onClick={() => zoomRef.current?.close()} className="btn btn-ghost min-h-11 px-4">{t('res.close')}</button>
        </div>
        <div className="p-4">
          <FloorPlans plans={unit.plans} name={unit.label} sizes="96vw" mediaClass="h-[min(78svh,820px)]" />
        </div>
      </dialog>
    </section>
  );
}
