import { lifestyle } from '@/data/site';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';
import { CarouselDots, CarouselNav } from '@/components/ui/CarouselControls';
import useCarousel from '@/hooks/useCarousel';

const mediaTone = { '--media-bg': 'var(--color-sandstone)', '--media-ink': '#3c3c3c' };

/* Đời sống & tiện ích: carousel, mỗi slide là một ảnh kèm chú thích; slide kế tiếp ló ra ở mép phải trên màn rộng */
export default function Lifestyle() {
  const c = useCarousel();
  return (
    <section id="lifestyle" className="bg-cream py-section" aria-roledescription="carousel" aria-label="Những trạm sạc giữa nhịp sống">
      <div className="container-site flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Đời sống và tiện ích" title="Những trạm sạc giữa nhịp sống" />
          <CarouselNav {...c} labels={['Ảnh trước', 'Ảnh sau']} />
        </div>

        <div ref={c.trackRef} data-reveal="left" className="carousel-track gap-5 lg:gap-8" tabIndex={0} aria-label="Danh sách tiện ích, cuộn ngang">
          {lifestyle.map((l, i) => (
            <article key={l.tag} className="carousel-slide flex basis-full flex-col gap-5 md:basis-[78%] lg:basis-[68%]"
              aria-roledescription="slide" aria-label={`${i + 1} / ${lifestyle.length}`}>
              <Media src={l.image} label={l.imageLabel} alt={l.imageLabel} className="aspect-[16/10] rounded-card" style={mediaTone}
                sizes="(min-width: 1024px) 57vw, (min-width: 768px) 66vw, 100vw" />
              <div className="grid gap-x-10 gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <div className="flex flex-col gap-3">
                  <p className="eyebrow text-bronze-deep">{String(i + 1).padStart(2, '0')} · {l.tag}</p>
                  <h3 className="heading-3">{l.title}</h3>
                </div>
                <p className="m-0 self-end text-[15px] leading-relaxed">{l.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div data-reveal="fade"><CarouselDots {...c} /></div>
      </div>
    </section>
  );
}
