import { useRef, useState } from 'react';
import { Link, useSite, useT } from '@/i18n';
import FloorPlans from '@/components/ui/FloorPlans';
import SectionHeading from '@/components/ui/SectionHeading';
import { isFilled } from '@/lib/filled';
import { shortTitle } from '@/lib/text';

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);


export default function Residences() {
  const t = useT();
  const { collections, priceTypes } = useSite();
  const [col, setCol] = useState(0);
  const [unitIdx, setUnitIdx] = useState(0);
  const zoomRef = useRef(null);
  const sheetRef = useRef(null);
  const current = collections[col];
  const unit = current.units[unitIdx] || current.units[0];
  /* nút "Xem giá dự kiến" mở bảng tính giá đúng loại căn đang xem */
  const typeIdx = Math.max(0, priceTypes.findIndex((p) => p.name === unit.name));

  /* 4 dòng thông số luôn cố định (thiếu dữ liệu → "—" mờ) để panel không đổi chiều cao khi đổi loại căn;
     diện tích hiển thị tĩnh (không đếm số) */
  const rows = [
    [t('res.rooms'), unit.rooms],
    [t('res.gfa'), unit.gfa],
    [t('res.nsa'), unit.nsa],
    [t('res.view'), unit.view],
  ].map(([k, v]) => [k, isFilled(v) && v !== '—' ? v : null]);

  /* 2 nút hành động — dùng ở panel (máy tính bảng / máy tính) và bottom-sheet (điện thoại) */
  const ctas = (onGo) => (
    <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap lg:flex-nowrap">
      <Link to="/#register" onClick={onGo} className="btn btn-solid max-sm:px-3" data-track="cta_click" data-track-label="residences_register">{t('cta.registerInterest')}</Link>
      <Link to={`/bang-tinh-gia?loai=${typeIdx}`} onClick={onGo} className="btn btn-ghost max-sm:px-3" data-track="cta_click" data-track-label="residences_price">{t('res.price')} →</Link>
    </div>
  );
  const closeSheet = () => sheetRef.current?.close();

  return (
    <section id="residences" className="bg-cream py-section">
      <div className="container-site flex flex-col gap-[clamp(0.75rem,2.6svh,2rem)]">
        <SectionHeading eyebrow={t('res.eyebrow')} title={t('res.title')} seo={t('res.seo')} />

        {/* ≥ 1024px: tab bộ sưu tập (trái) và chip loại căn (phải) chung 1 hàng — tiết kiệm 1 hàng cho khung hình.
            Dưới 1280px tab dùng tên rút gọn ("Toàn cầu" / "Đặc tuyển") để cả hàng vừa bề ngang. */}
        <div className="flex flex-col gap-[clamp(0.75rem,2.6svh,2rem)] lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* điện thoại: 2 tab chia đôi bề ngang — thấy đủ cả hai, không phải kéo ngang */}
        <div data-reveal="up" role="tablist" aria-label={t('res.collections')} className="grid shrink-0 grid-cols-2 gap-x-3 md:flex md:gap-x-6">
          {collections.map((c, i) => (
            <button key={c.key} type="button" role="tab" aria-selected={i === col}
              onClick={() => { setCol(i); setUnitIdx(0); }}
              className={`min-h-11 cursor-pointer border-b-2 px-1 py-2 text-left font-sub text-xs font-semibold uppercase leading-snug tracking-[0.1em] md:whitespace-nowrap md:tracking-[0.14em] xl:tracking-[0.18em] ${i === col ? 'border-bronze-deep text-hoadau' : 'border-transparent text-ink-soft'}`}>
              <span className="xl:hidden">{shortTitle(c.title)}</span>
              <span className="max-xl:hidden">{c.title}</span>
            </button>
          ))}
        </div>

        {/* chip loại căn xuống dòng khi hết chỗ (không ẩn sau mép phải); điện thoại: chip gọn hơn và hàng chip luôn
            giữ chỗ 2 dòng → đổi bộ sưu tập (5 chip ↔ 4 chip dài) không đẩy panel bên dưới */}
        {/* điện thoại: lưới chip — 5 loại căn ngắn = 3 cột, 4 loại căn tên dài = 2 cột → luôn đúng 2 hàng, mọi chip
            nhìn thấy hết (không kéo ngang), không có khoảng trống giữ chỗ, đổi bộ sưu tập không đẩy panel.
            Từ 768px: một hàng chip, từ 1024px không xuống dòng. */}
        <div data-reveal="up" style={{ '--reveal-i': 1 }}
          className={`grid gap-2 ${current.units.length > 4 ? 'grid-cols-3' : 'grid-cols-2'} md:flex md:flex-wrap lg:flex-nowrap lg:justify-end`}>
          {current.units.map((u, i) => (
            <button key={u.name} type="button" className="chip justify-center whitespace-nowrap max-sm:min-h-10 max-sm:px-2 max-sm:text-[0.8125rem]" aria-pressed={i === unitIdx} onClick={() => setUnitIdx(i)}>{u.name}</button>
          ))}
        </div>
        </div>

        <div role="tabpanel" data-reveal="zoom"
          className="grid items-center gap-[clamp(1rem,3svh,2.5rem)] rounded-panel bg-white p-[clamp(1rem,3svh,2.5rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* khung ảnh mặt bằng CỐ ĐỊNH kích thước cho mọi loại căn (ảnh fit=contain bên trong) → bấm đổi layout
              không làm nhảy giao diện */}
          <div className="relative">
            <FloorPlans key={unit.name} plans={unit.plans} name={unit.label}
              mediaClass="h-[clamp(180px,30svh,360px)] md:h-[clamp(200px,30svh,380px)] lg:h-[clamp(180px,34svh,480px)]" />
            <button type="button" onClick={() => zoomRef.current?.showModal()}
              className="absolute bottom-2 right-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-hoadau/85 px-3.5 font-sub text-xs font-semibold uppercase tracking-[0.12em] text-ivory backdrop-blur-sm hover:bg-hoadau">
              <ZoomIcon /><span className="sr-only">{t('res.zoom')}</span>
            </button>
          </div>
          {/* điện thoại: sơ đồ chiếm khung chính; thông số + nút nằm trong bottom-sheet, mở bằng thanh tóm tắt này
              (section gọn ~1 khung hình, không nhảy khi đổi căn — thanh luôn cao 1 dòng) */}
          <button type="button" onClick={() => sheetRef.current?.showModal()} aria-haspopup="dialog"
            className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-card border border-line bg-cream px-4 text-left md:hidden">
            <span className="min-w-0">
              <span className="block truncate font-display text-lg leading-tight text-hoadau">{unit.name}</span>
              <span className="block truncate text-sm text-ink-soft">{rows[1][1] || current.title}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 font-sub text-xs font-semibold uppercase tracking-[0.1em] text-bronze-deep">
              {t('res.specs')}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
            </span>
          </button>
          <div className="flex flex-col gap-[clamp(0.5rem,1.6svh,1.25rem)] max-md:hidden">
            {/* tên bộ sưu tập đã nằm ở tab phía trên → chỉ ghi mã căn tiêu biểu (nếu đã có) */}
            {/* luôn giữ chỗ 1 dòng (kể cả khi chưa có mã căn) để các dòng phía dưới không xê dịch */}
            <p className="eyebrow min-h-[1.45em] text-bronze-deep max-md:hidden">{isFilled(unit.code) ? t('res.typical', { code: unit.code }) : ''}</p>
            {/* điện thoại: tên căn đã hiện ở chip đang chọn → chỉ giữ cho trình đọc màn hình, nhường chỗ cho thông số */}
            <h3 className="heading-3 !text-[clamp(1.6rem,2.8vw,2.6rem)] max-md:sr-only md:truncate">{unit.name}</h3>
            {/* điện thoại: lưới 2×2 (nhãn trên, giá trị dưới) — gọn nửa chiều cao so với 4 dòng ngang */}
            <dl className="m-0 grid grid-cols-2 gap-x-4 md:flex md:flex-col">
              {rows.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 border-t border-line py-2 md:flex-row md:justify-between md:gap-4 md:py-[clamp(0.4rem,1.15svh,0.875rem)] md:last:border-b">
                  <dt className="shrink-0 text-sm text-ink-soft md:whitespace-nowrap md:text-base">{k}</dt>
                  {/* điện thoại: giá trị luôn chiếm đúng 2 dòng (dài thì kẹp, ngắn thì giữ chỗ) */}
                  <dd className={`m-0 min-w-0 font-medium max-md:line-clamp-2 max-md:min-h-[2lh] md:truncate md:text-right ${v ? 'text-hoadau' : 'text-ink-soft/60'}`} title={v || undefined}>{v || '—'}</dd>
                </div>
              ))}
            </dl>
            {ctas()}
          </div>
        </div>
      </div>

      {/* Bottom-sheet thông số (điện thoại): <dialog> gốc — Esc / bấm nền / nút Đóng để đóng, khoá focus */}
      <dialog ref={sheetRef} aria-label={`${t('res.specs')} — ${unit.name}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeSheet(); }}
        className="np-sheet m-0 mt-auto max-h-[85svh] w-full max-w-none overflow-y-auto rounded-t-panel border-0 bg-ivory p-0 pb-[env(safe-area-inset-bottom)] backdrop:bg-hoadau-deep/60 md:hidden">
        <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-line bg-ivory px-5 py-3">
          <div className="min-w-0">
            <p className="m-0 truncate font-display text-2xl text-hoadau">{unit.name}</p>
            <p className="m-0 truncate text-sm text-ink-soft">{current.title}{isFilled(unit.code) ? ` · ${unit.code}` : ''}</p>
          </div>
          <button type="button" onClick={closeSheet} className="btn btn-ghost min-h-11 shrink-0 px-4">{t('res.close')}</button>
        </div>
        <div className="flex flex-col gap-4 px-5 pb-5 pt-2">
          <dl className="m-0 flex flex-col">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line py-3">
                <dt className="shrink-0 text-ink-soft">{k}</dt>
                <dd className={`m-0 text-right font-medium ${v ? 'text-hoadau' : 'text-ink-soft/60'}`}>{v || '—'}</dd>
              </div>
            ))}
          </dl>
          {ctas(closeSheet)}
        </div>
      </dialog>

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
