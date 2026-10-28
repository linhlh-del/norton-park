import { Link, useSite, useT } from '@/i18n';
import SectionHeading from '@/components/ui/SectionHeading';
import CountUp from '@/components/motion/CountUp';
import QuachoMark from '@/components/ui/QuachoMark';

export default function Facts() {
  const t = useT();
  const { collections, facts } = useSite();
  return (
    <section id="facts" className="bg-ivory py-section">
      <div className="container-site flex flex-col gap-[clamp(1.5rem,4.5svh,3.5rem)]">
        <div className="flex flex-col items-center gap-4">
          {/* dấu trang trí: chỉ hiện khi màn hình đủ cao, nhường chỗ cho số liệu ở màn thấp */}
          <QuachoMark tone="light" data-reveal="zoom" className="[@media(max-height:56rem)]:hidden" />
          <SectionHeading align="center" eyebrow={t('facts.eyebrow')} title={t('facts.title')} seo={t('facts.seo')} />
        </div>

        {/* subgrid: mọi ô trong cùng hàng chia chung 2 dòng lưới → số liệu ngang hàng số liệu, nhãn ngang hàng nhãn,
            nhãn xuống dòng vẫn chung mép trên (số hiển thị trên, nhãn dưới; DOM giữ thứ tự dt → dd đúng chuẩn) */}
        {/* 7 chỉ số: 1 hàng trên máy tính · 4 cột trên máy tính bảng · dải trượt ngang (3 ô/màn) trên điện thoại */}
        <dl className="m-rail m-0 grid grid-cols-4 border-t border-line [--rail-item:31%] lg:grid-cols-7">
          {facts.map((f, i) => (
            <div key={f.label} data-reveal="up" style={{ '--reveal-i': i }} className="row-span-2 grid grid-rows-subgrid gap-y-2 border-b border-line px-3 py-[clamp(0.6rem,2.2svh,1.75rem)] text-center">
              <dt className="eyebrow row-start-2 self-start text-ink-soft max-lg:tracking-[0.14em]">{f.label}</dt>
              <dd className="row-start-1 m-0 self-end whitespace-nowrap font-display text-[clamp(1.75rem,2.6vw,3rem)] leading-none text-hoadau [@media(max-height:47.5rem)]:text-[clamp(1.6rem,5svh,2.4rem)]">
                {f.count === false ? f.value : <CountUp value={f.value} />}
              </dd>
            </div>
          ))}
        </dl>

        <div className="m-rail grid gap-x-10 gap-y-6 md:grid-cols-2">
          {collections.map((c, ci) => (
            <div key={c.key} data-reveal={ci === 0 ? 'left' : 'right'} className="flex flex-col">
              <p className="eyebrow border-b border-line-strong pb-3 text-bronze-deep">{c.title}</p>
              {c.units.map((u) => (
                <Link key={u.name} to="/#residences" className="flex items-baseline justify-between gap-4 border-b border-line py-[clamp(0.35rem,1.15svh,0.875rem)] text-hoadau no-underline hover:text-bronze-deep">
                  <span className="font-display text-[clamp(1.15rem,1.7vw,1.5rem)] [@media(max-height:47.5rem)]:text-[1.2rem]">{u.label}</span>
                  {/* diện tích hiển thị tĩnh: số đang đếm (42,11 → 42,12) dễ bị đọc / chụp màn hình sai */}
                  <span className="whitespace-nowrap font-sub text-sm tracking-[0.04em] text-ink-soft">{u.gfa}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
        <p className="m-0 text-sm text-ink-soft">{t('facts.note')}</p>
      </div>
    </section>
  );
}
