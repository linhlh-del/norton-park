import { Link, useT } from '@/i18n';

/* 404: Seo đặt robots "noindex"; prerender ghi dist/404.html để server trả kèm mã 404 */
export default function NotFound() {
  const t = useT();
  return (
    <section className="bg-cream py-section">
      <div className="container-site flex flex-col items-start gap-6">
        <p className="eyebrow text-bronze-deep">{t('nf.eyebrow')}</p>
        <h1 className="heading-1">{t('nf.title')}</h1>
        <p className="lead max-w-2xl">{t('nf.body')}</p>
        <div className="flex flex-wrap gap-3.5">
          <Link to="/" className="btn btn-solid">{t('home')}</Link>
          <Link to="/bang-tinh-gia" className="btn btn-ghost">{t('nf.price')}</Link>
        </div>
      </div>
    </section>
  );
}
