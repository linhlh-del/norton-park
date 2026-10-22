import { Link, useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" />
  </svg>
);

/* Hero: ảnh nền tải ưu tiên (LCP) và thu nhẹ khi vào trang; chữ trồi lên lần lượt ngay khi tải, không chờ cuộn.
   Tiêu đề H1 không làm mờ để không làm chậm chỉ số LCP.
   Nút chữ nhật "NORTON PARK" giữa màn hình và nút "Khám phá" → bản đồ vị trí (#position). */
export default function Hero() {
  const t = useT();
  const { images } = useSite();
  return (
    <section id="hero" aria-label={t('hero.aria')} className="relative isolate flex min-h-[clamp(640px,92svh,880px)] items-end overflow-hidden bg-hoadau-deep text-on-dark">
      <Media src={images.hero} mobileSrc={images.heroPortrait} alt={t('hero.imageAlt')} label={t('hero.imageLabel')}
        tone="dark" priority className="media-static !absolute inset-0 -z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-hoadau-deep/80 via-hoadau-deep/35 to-hoadau-deep/30" />

      <Link to="/#position" aria-label={t('hero.centerAria')} data-track="cta_click" data-track-label="hero_center_norton_park"
        className="btn-cta hero-in absolute left-1/2 top-[30%] z-10 inline-flex min-h-14 -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap border border-on-dark/70 bg-hoadau-deep/35 px-8 font-sub text-sm font-semibold uppercase tracking-[0.42em] text-on-dark no-underline backdrop-blur-sm transition-colors hover:bg-on-dark hover:text-hoadau md:top-[38%] md:min-h-16 md:px-12 md:text-base"
        style={{ '--reveal-i': 3 }}>
        {t('hero.center')}
      </Link>

      <div className="container-site flex flex-col gap-7 pb-24 pt-40">
        <p className="eyebrow hero-in text-on-dark-soft">{t('hero.eyebrow')}</p>
        <h1 className="heading-1 max-w-4xl italic">
          <span className="sr-only">Norton Park — A Gamuda Land Community: </span>
          {t('hero.title1')} <br />{t('hero.title2')}
        </h1>
        <div className="hero-in flex flex-wrap gap-3.5" style={{ '--reveal-i': 2 }}>
          <Link to="/#register" className="btn btn-solid" data-track="cta_click" data-track-label="hero_register">{t('cta.register')}</Link>
          <Link to="/#position" className="btn btn-ghost-light" data-track="cta_click" data-track-label="hero_explore">
            <PinIcon />{t('hero.explore')}
          </Link>
        </div>
      </div>
    </section>
  );
}
