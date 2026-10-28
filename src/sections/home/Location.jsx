import { Link, useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import KeywordHeading from '@/components/ui/KeywordHeading';

export default function Location() {
  const t = useT();
  const { images } = useSite();
  return (
    <section id="location" className="bg-sand py-section">
      <div className="container-site flex flex-col gap-[clamp(1.5rem,4svh,3.5rem)]">
        <div className="grid items-start gap-[clamp(1.25rem,5vw,6rem)] lg:grid-cols-2">
          <div data-reveal="left" className="flex flex-col gap-5">
            <p className="eyebrow text-walnut">{t('location.eyebrow')}</p>
            <KeywordHeading seo={t('location.seo')} className="heading-2">{t('location.title')}</KeywordHeading>
          </div>
          <div data-reveal="right" style={{ '--reveal-i': 1 }} className="flex flex-col gap-4">
            <p className="lead">{t('location.p1')}</p>
            <p className="lead max-md:line-clamp-3">{t('location.p2')}</p>
            <div className="pt-2">
              <Link to="/#position" className="btn btn-solid" data-track="cta_click" data-track-label="location_map">
                {t('location.cta')} <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
        </div>
        <div data-reveal="zoom">
          <Media src={images.masterplan} alt={t('location.imageAlt')} label={t('location.imageLabel')} className="h-[clamp(160px,24svh,300px)] rounded-card md:h-[clamp(220px,38svh,420px)] lg:h-[clamp(220px,40svh,540px)]" sizes="84vw" />
        </div>
      </div>
    </section>
  );
}
