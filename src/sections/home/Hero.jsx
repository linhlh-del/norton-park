import { Link, useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" />
  </svg>
);

/* Hero: ảnh nền tải ưu tiên (LCP) và thu nhẹ khi vào trang; chữ trồi lên lần lượt ngay khi tải, không chờ cuộn.
   Tiêu đề H1 không làm mờ để không làm chậm chỉ số LCP.
   Nút "Khám phá Norton Park" → bản đồ vị trí (#position). */
/* variant (CMS): 'center' (mặc định, chữ giữa màn hình) | 'bottom' (chữ sát đáy ảnh) */
export default function Hero({ variant = 'center' }) {
  const t = useT();
  const { images } = useSite();
  return (
    <section id="hero" aria-label={t('hero.aria')} className={`relative isolate flex min-h-[max(var(--np-screen),30rem)] items-end overflow-hidden bg-hoadau-deep text-on-dark ${variant === 'bottom' ? '' : 'md:items-center'}`}>
      <Media src={images.hero} mobileSrc={images.heroPortrait} alt={t('hero.imageAlt')} label={t('hero.imageLabel')}
        tone="dark" priority className="media-static !absolute inset-0 -z-20" />
      {/* điện thoại: chữ nằm 1/3 dưới, gradient tối đậm ở đáy để chữ không đè lên chi tiết toà nhà */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-hoadau-deep/90 via-hoadau-deep/45 via-45% to-hoadau-deep/10 md:from-hoadau-deep/80 md:via-hoadau-deep/35 md:via-50% md:to-hoadau-deep/30" />

      <div className={`container-site flex flex-col gap-5 pb-[clamp(2rem,7svh,5rem)] pt-10 md:gap-7 ${variant === 'bottom' ? '' : 'md:py-16'}`}>
        <p className="eyebrow hero-in text-balance text-on-dark-soft max-md:tracking-[0.16em]">{t('hero.eyebrow')}</p>
        {/* H1 = từ khoá chính + địa danh hành chính; slogan hiển thị nằm trong <p> */}
        <h1 className="sr-only">{t('hero.h1')}</h1>
        <p aria-hidden="true" className="heading-1 max-w-4xl italic [text-shadow:0_2px_24px_rgb(30_24_20/0.35)]">
          {t('hero.title1')} <br />{t('hero.title2')}
        </p>
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
