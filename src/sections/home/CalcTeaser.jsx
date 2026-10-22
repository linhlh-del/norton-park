import { Link } from 'react-router-dom';
import { priceTypes } from '@/data/site';
import SectionHeading from '@/components/ui/SectionHeading';
import CountUp from '@/components/motion/CountUp';

export default function CalcTeaser() {
  return (
    <section id="calc" className="bg-cream py-section">
      <div className="container-site flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Bảng tính giá" title="Ước tính giá trị tổ ấm của bạn"
            intro="Chọn loại căn và layout để xem mặt bằng minh hoạ, diện tích và giá dự kiến của từng căn." />
          <Link to="/bang-tinh-gia" data-reveal="fade" className="btn btn-solid">Mở bảng tính giá</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13.75rem),1fr))] gap-4">
          {priceTypes.map((t, i) => (
            <Link key={t.name} to={`/bang-tinh-gia?loai=${i}`} data-reveal="up" style={{ '--reveal-i': i }}
              className="flex flex-col gap-2.5 rounded-card border border-line bg-ivory p-6 text-hoadau no-underline hover:border-bronze hover:text-hoadau">
              <span className="font-display text-[28px]">{t.name}</span>
              <span className="text-[15px] text-ink-soft">{t.gfa.includes('–') ? 'Từ ' : ''}<CountUp value={`${t.gfa.split('–')[0].trim()} m²`} duration={1200} /></span>
              <span className="eyebrow text-[10px] text-bronze-deep"><CountUp value={`${t.count} layout`} duration={900} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
