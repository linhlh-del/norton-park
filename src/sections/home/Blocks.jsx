import { useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';

/* Hai phân khu trượt vào từ hai bên rồi gặp nhau ở giữa: B từ trái, C từ phải. */
export default function Blocks() {
  const t = useT();
  const { images } = useSite();
  const zoneB = [t('blocks.b1'), t('blocks.b2'), t('blocks.b3')];
  return (
    <section id="blocks" className="overflow-hidden bg-ivory py-section">
      <div className="container-site flex flex-col gap-14">
        <SectionHeading align="center" eyebrow={t('blocks.eyebrow')} title={t('blocks.title')} seo={t('blocks.seo')} />
        <div className="grid gap-8 lg:grid-cols-2">
          <article data-reveal="left" className="flex flex-col gap-6">
            <Media src={images.blockB} alt={t('blocks.bAlt')} label={t('blocks.bAlt')} className="aspect-[4/3] rounded-card"
              style={{ '--media-bg': 'var(--color-taupe)', '--media-ink': '#3c3c3c' }} sizes="(min-width: 1024px) 42vw, 100vw" />
            <h3 className="heading-2">{t('blocks.b')}</h3>
            <p className="lead">{t('blocks.bBody')}</p>
            <ul className="m-0 flex list-none flex-col p-0">
              {zoneB.map((x) => (
                <li key={x} className="flex items-center gap-3 border-t border-line py-3.5 last:border-b">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-bronze-deep" />
                  {x}
                </li>
              ))}
            </ul>
          </article>
          <article data-reveal="right" className="flex flex-col gap-6">
            <div className="relative">
              <Media src={images.blockC} alt={t('blocks.cAlt')} label={t('blocks.cAlt')} className="aspect-[4/3] rounded-card"
                style={{ '--media-bg': 'var(--color-sage)', '--media-ink': 'var(--color-ivory)' }} sizes="(min-width: 1024px) 42vw, 100vw" />
              <span className="absolute left-5 top-5 rounded-full bg-hoadau px-4 py-2 font-sub text-[11px] font-semibold tracking-[0.2em] text-on-dark">{t('blocks.soon')}</span>
            </div>
            <h3 className="heading-2">{t('blocks.c')}</h3>
            <p className="lead text-ink-soft">{t('blocks.cBody')}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
