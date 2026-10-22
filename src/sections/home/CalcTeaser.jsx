import { Link, useSite, useT } from '@/i18n';
import SectionHeading from '@/components/ui/SectionHeading';
import CountUp from '@/components/motion/CountUp';

export default function CalcTeaser() {
  const t = useT();
  const { priceTypes } = useSite();
  return (
    <section id="calc" className="bg-cream py-section">
      <div className="container-site flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t('calc.eyebrow')} title={t('calc.title')} intro={t('calc.intro')} />
          <Link to="/bang-tinh-gia" data-reveal="fade" className="btn btn-solid" data-track="cta_click" data-track-label="calc_open">{t('calc.open')}</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13.75rem),1fr))] gap-4">
          {priceTypes.map((p, i) => (
            <Link key={p.name} to={`/bang-tinh-gia?loai=${i}`} data-reveal="up" style={{ '--reveal-i': i }}
              className="flex flex-col gap-2.5 rounded-card border border-line bg-ivory p-6 text-hoadau no-underline transition-colors hover:border-bronze hover:text-hoadau">
              <span className="font-display text-[28px]">{p.name}</span>
              <span className="text-[15px] text-ink-soft">{p.gfa.includes('–') ? t('calc.from') : ''}<CountUp value={`${p.gfa.split('–')[0].trim()} m²`} duration={1800} /></span>
              <span className="eyebrow text-[10px] text-bronze-deep"><CountUp value={t('calc.layouts', { n: p.count })} duration={1300} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
