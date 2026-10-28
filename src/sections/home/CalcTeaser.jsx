import { Link, useSite, useT } from '@/i18n';
import SectionHeading from '@/components/ui/SectionHeading';

export default function CalcTeaser() {
  const t = useT();
  const { priceTypes } = useSite();
  return (
    <section id="calc" className="bg-cream py-section">
      <div className="container-site flex flex-col gap-[clamp(1.25rem,4svh,3rem)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t('calc.eyebrow')} title={t('calc.title')} seo={t('calc.seo')} intro={t('calc.intro')} />
          <Link to="/bang-tinh-gia" data-reveal="fade" className="btn btn-solid" data-track="cta_click" data-track-label="calc_open">{t('calc.open')}</Link>
        </div>
        {/* 9 loại căn: 5 + 4 trên máy tính (không còn 1 thẻ lẻ hàng cuối) · 3 cột máy tính bảng · trượt ngang điện thoại */}
        <div className="m-rail grid grid-cols-3 gap-3 [--rail-item:44%] lg:grid-cols-5 lg:gap-4">
          {priceTypes.map((p, i) => (
            <Link key={p.name} to={`/bang-tinh-gia?loai=${i}`} data-reveal="up" style={{ '--reveal-i': i }}
              /* subgrid 3 dòng (tên · diện tích · số layout): tên căn xuống dòng thì các dòng dưới của cả hàng vẫn thẳng nhau */
              className="row-span-3 grid grid-rows-subgrid gap-y-2 rounded-card border border-line bg-ivory p-[clamp(0.875rem,2.4svh,1.5rem)] text-hoadau no-underline transition-colors hover:border-bronze hover:text-hoadau">
              <span className="self-start font-display text-[clamp(1.35rem,2vw,1.75rem)] leading-tight">{p.name}</span>
              {/* diện tích tĩnh — không đếm số */}
              <span className="text-[15px] text-ink-soft">{p.gfa.includes('–') ? t('calc.from') : ''}{p.gfa.split('–')[0].trim()} m²</span>
              <span className="eyebrow text-bronze-deep">{t('calc.layouts', { n: p.count })}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
