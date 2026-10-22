import { Link } from 'react-router-dom';
import { collections, facts } from '@/data/site';
import SectionHeading from '@/components/ui/SectionHeading';
import CountUp from '@/components/motion/CountUp';
import { FlowerMark } from '@/components/ui/Icons';

export default function Facts() {
  return (
    <section id="facts" className="bg-ivory py-section">
      <div className="container-site flex flex-col gap-16">
        <div className="flex flex-col items-center gap-4">
          <FlowerMark data-reveal="zoom" className="text-bronze-deep" />
          <SectionHeading align="center" eyebrow="Tổng quan dự án" title="Thông tin và số liệu" />
        </div>

        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,13.75rem),1fr))] border-t border-line">
          {facts.map((f, i) => (
            <div key={f.label} data-reveal="up" style={{ '--reveal-i': i }} className="flex flex-col-reverse gap-2 border-b border-line px-4 py-8 text-center">
              <dt className="eyebrow text-[10px] text-ink-soft">{f.label}</dt>
              <dd className="m-0 font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-hoadau">
                {f.count === false ? f.value : <CountUp value={f.value} />}
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-10 lg:grid-cols-2">
          {collections.map((c, ci) => (
            <div key={c.key} data-reveal={ci === 0 ? 'left' : 'right'} className="flex flex-col">
              <p className="eyebrow border-b border-line-strong pb-3 text-bronze-deep">{c.title}</p>
              {c.units.map((u) => (
                <Link key={u.name} to="/#residences" className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 text-hoadau no-underline hover:text-bronze-deep">
                  <span className="font-display text-2xl">{u.label}</span>
                  <span className="font-sub text-[13px] tracking-[0.06em] text-ink-soft"><CountUp value={u.gfa} duration={1200} /></span>
                </Link>
              ))}
            </div>
          ))}
        </div>
        <p className="m-0 text-[13px] text-ink-soft">*Diện tích sàn căn tiêu biểu</p>
      </div>
    </section>
  );
}
