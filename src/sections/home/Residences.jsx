import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collections } from '@/data/site';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';
import CountUp from '@/components/motion/CountUp';

export default function Residences() {
  const [col, setCol] = useState(0);
  const [unitIdx, setUnitIdx] = useState(0);
  const current = collections[col];
  const unit = current.units[unitIdx] || current.units[0];

  const rows = [
    ['Phòng', unit.rooms],
    ['Diện tích sàn', <CountUp value={unit.gfa} duration={900} />],
    ['Diện tích sử dụng', <CountUp value={unit.nsa} duration={900} />],
    ['Cảnh quan', unit.view],
  ];

  return (
    <section id="residences" className="bg-cream py-section">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading eyebrow="Mặt bằng căn hộ" title="Những căn nhà cho nhịp sống hiện đại" />

        <div data-reveal="up" role="tablist" aria-label="Bộ sưu tập" className="flex flex-wrap gap-x-6">
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

        <div role="tabpanel" data-reveal="zoom" className="grid gap-10 rounded-panel bg-ivory p-[clamp(1.25rem,4vw,3rem)] lg:grid-cols-2">
          <Media key={unit.name} src={unit.code.startsWith('[') ? undefined : `/images/plan-${unit.code.toLowerCase()}.jpg`} label={`Mặt bằng minh hoạ: ${unit.name}`}
            className="aspect-square rounded-lg border border-line" sizes="(min-width: 1024px) 38vw, 100vw" />
          <div className="flex flex-col justify-center gap-5">
            <p className="eyebrow text-bronze-deep">{current.title}</p>
            <p className="eyebrow text-ink-soft">Căn tiêu biểu {unit.code}</p>
            <h3 className="heading-2">{unit.name}</h3>
            <dl className="m-0 flex flex-col">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-t border-line py-3.5 last:border-b">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="m-0 text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div><Link to="/#register" className="btn btn-solid">Đăng ký quan tâm</Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}
