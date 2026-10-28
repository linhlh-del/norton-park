import { useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';
import { CarouselDots, CarouselNav } from '@/components/ui/CarouselControls';
import useCarousel from '@/hooks/useCarousel';

/* Ảnh: chiều cao theo màn hình (svh) nhưng tỉ lệ luôn nằm trong khoảng đẹp (cqw = % bề rộng khung chứa) → không bị cắt thành dải mỏng trên màn rộng-thấp, không cao quá trên màn hẹp */
const mediaTone = { '--media-bg': 'var(--color-sandstone)', '--media-ink': '#3c3c3c' };

/* Đời sống & tiện ích: carousel, mỗi slide là một ảnh, chú thích nằm TRÊN ảnh (lớp phủ tối dần phía dưới để chữ
   luôn đủ tương phản); slide kế tiếp ló ra ở mép phải trên màn rộng */
export default function Lifestyle() {
  const t = useT();
  const { lifestyle } = useSite();
  const c = useCarousel();
  return (
    <section id="lifestyle" className="bg-cream py-section" aria-roledescription="carousel" aria-label={t('lifestyle.title')}>
      <div className="container-site flex flex-col gap-[clamp(1.25rem,4svh,3rem)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t('lifestyle.eyebrow')} title={t('lifestyle.title')} seo={t('lifestyle.seo')} />
          <CarouselNav {...c} labels={[t('lifestyle.prev'), t('lifestyle.next')]} />
        </div>

        <div ref={c.trackRef} data-reveal="left" className="carousel-track gap-5 lg:gap-8" tabIndex={0} aria-label={t('lifestyle.track')}>
          {lifestyle.map((l, i) => (
            <article key={l.image} className="carousel-slide @container group relative isolate basis-full overflow-hidden rounded-card md:basis-[78%] lg:basis-[68%]"
              aria-roledescription="slide" aria-label={`${i + 1} / ${lifestyle.length}`}>
              <Media src={l.image} label={l.imageLabel} alt={l.imageLabel}
                className="-z-20 h-[clamp(100cqw,50svh,125cqw)] sm:h-[clamp(56.25cqw,56svh,62.5cqw)]"
                style={mediaTone} sizes="(min-width: 1024px) 57vw, (min-width: 768px) 66vw, 100vw" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-hoadau-deep/90 via-hoadau-deep/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 grid gap-x-10 gap-y-3 p-[clamp(1.25rem,3vw,2.5rem)] text-on-dark md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end">
                <div className="flex flex-col gap-3">
                  <p className="eyebrow text-on-dark-soft">{String(i + 1).padStart(2, '0')} · {l.tag}</p>
                  <h3 className="heading-3">{l.title}</h3>
                </div>
                <p className="m-0 text-[15px] leading-relaxed text-stone">{l.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div data-reveal="fade"><CarouselDots {...c} /></div>
      </div>
    </section>
  );
}
