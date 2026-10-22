import { Link, useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import QuachoMark from '@/components/ui/QuachoMark';
import { CarouselDots, CarouselNav } from '@/components/ui/CarouselControls';
import useCarousel from '@/hooks/useCarousel';

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const darkMedia = { '--media-bg': 'var(--color-pine-deep)', '--media-ink': 'rgb(244 240 231 / 0.72)' };

/* Tin tức trang chủ: carousel thẻ bài báo (1 thẻ trên điện thoại, 2 trên máy tính bảng, 3 trên máy tính) */
export default function NewsPreview() {
  const t = useT();
  const { homeNews } = useSite();
  const c = useCarousel();
  return (
    <section id="news" className="bg-pine py-section text-on-dark" aria-roledescription="carousel" aria-label={t('news.aria')}>
      <div className="container-site flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-3xl flex-col gap-4">
            <QuachoMark tone="dark" data-reveal="zoom" />
            <p data-reveal="up" style={{ '--reveal-i': 1 }} className="eyebrow text-on-dark-soft">{t('news.eyebrow')}</p>
            <h2 data-reveal="up" style={{ '--reveal-i': 2 }} className="heading-2">{t('news.title')}</h2>
          </div>
          <div data-reveal="fade" className="flex flex-wrap items-center gap-4">
            <Link to="/tin-tuc" className="inline-flex min-h-11 items-center gap-2 font-sub text-xs font-semibold uppercase tracking-button text-on-dark no-underline hover:text-on-dark-soft">
              {t('news.all')} <Arrow />
            </Link>
            <CarouselNav {...c} tone="dark" labels={[t('news.prev'), t('news.next')]} />
          </div>
        </div>

        <div ref={c.trackRef} className="carousel-track gap-6" tabIndex={0} aria-label={t('news.track')}>
          {homeNews.map((n, i) => (
            <a key={n.id} href={n.url} target="_blank" rel="noopener" data-news={n.id}
              aria-roledescription="slide" aria-label={`${i + 1} / ${homeNews.length}: ${n.title}`}
              data-reveal="up" style={{ '--reveal-i': i }}
              className="carousel-slide group flex basis-full flex-col gap-4 border-t border-on-dark/30 pt-6 text-on-dark no-underline hover:text-on-dark md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]">
              <Media src={n.image} alt={n.alt} label={t('news.image')} className="aspect-[3/2] rounded-lg" style={darkMedia}
                sizes="(min-width: 1024px) 27vw, (min-width: 768px) 41vw, 100vw" />
              <div className="flex gap-4">
                <span className="eyebrow text-on-dark-soft">{n.cat}</span>
                <span className="eyebrow">{n.src}</span>
              </div>
              <h3 className="heading-3">{n.title}</h3>
              <p className="m-0 leading-relaxed text-stone">{n.excerpt}</p>
              <span className="mt-auto inline-flex items-center gap-2 font-sub text-xs font-semibold uppercase tracking-button group-hover:underline">
                {t('news.read')} <Arrow /><span className="sr-only"> {t('news.newTab', { src: n.src })}</span>
              </span>
            </a>
          ))}
        </div>

        <CarouselDots {...c} tone="dark" />
      </div>
    </section>
  );
}
