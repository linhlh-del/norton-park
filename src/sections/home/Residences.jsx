import { useState } from 'react';
import { Link, useSite, useT } from '@/i18n';
import FloorPlans from '@/components/ui/FloorPlans';
import SectionHeading from '@/components/ui/SectionHeading';
import CountUp from '@/components/motion/CountUp';

export default function Residences() {
  const t = useT();
  const { collections, priceTypes } = useSite();
  const [col, setCol] = useState(0);
  const [unitIdx, setUnitIdx] = useState(0);
  const current = collections[col];
  const unit = current.units[unitIdx] || current.units[0];
  /* nút "Xem giá dự kiến" mở bảng tính giá đúng loại căn đang xem */
  const typeIdx = Math.max(0, priceTypes.findIndex((p) => p.name === unit.name));

  const rows = [
    [t('res.rooms'), unit.rooms],
    [t('res.gfa'), <CountUp value={unit.gfa} duration={1300} />],
    [t('res.nsa'), <CountUp value={unit.nsa} duration={1300} />],
    [t('res.view'), unit.view],
  ];

  return (
    <section id="residences" className="bg-cream py-section">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading eyebrow={t('res.eyebrow')} title={t('res.title')} />

        <div data-reveal="up" role="tablist" aria-label={t('res.collections')} className="flex flex-wrap gap-x-6">
          {collections.map((c, i) => (
            <button key={c.key} type="button" role="tab" aria-selected={i === col}
              onClick={() => { setCol(i); setUnitIdx(0); }}
              className={`min-h-11 cursor-pointer border-b-2 px-1 font-sub text-xs font-semibold uppercase tracking-[0.2em] ${i === col ? 'border-bronze-deep text-hoadau' : 'border-transparent text-ink-soft'}`}>
              {c.title}
            </button>
          ))}
        </div>

        <div data-reveal="up" style={{ '--reveal-i': 1 }} className="flex flex-wrap gap-2">
          {current.units.map((u, i) => (
            <button key={u.name} type="button" className="chip" aria-pressed={i === unitIdx} onClick={() => setUnitIdx(i)}>{u.name}</button>
          ))}
        </div>

        <div role="tabpanel" data-reveal="zoom" className="grid gap-10 rounded-panel bg-white p-[clamp(1.25rem,4vw,3rem)] lg:grid-cols-2">
          <FloorPlans key={unit.name} plans={unit.plans} name={unit.label} />
          <div className="flex flex-col justify-center gap-5">
            <p className="eyebrow text-bronze-deep">{current.title}</p>
            <p className="eyebrow text-ink-soft">{t('res.typical', { code: unit.code })}</p>
            <h3 className="heading-2">{unit.name}</h3>
            <dl className="m-0 flex flex-col">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-t border-line py-3.5 last:border-b">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="m-0 text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3">
              <Link to="/#register" className="btn btn-solid" data-track="cta_click" data-track-label="residences_register">{t('cta.registerInterest')}</Link>
              <Link to={`/bang-tinh-gia?loai=${typeIdx}`} className="btn btn-ghost" data-track="cta_click" data-track-label="residences_price">{t('res.price')} →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
