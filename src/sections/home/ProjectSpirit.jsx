import { useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';

const darkMedia = { '--media-bg': 'var(--color-pine-deep)', '--media-ink': 'rgb(244 240 231 / 0.72)' };

export default function ProjectSpirit() {
  const t = useT();
  const { stations } = useSite();
  return (
    <section id="story" className="bg-pine py-section text-on-dark">
      <div className="container-site flex flex-col gap-14">
        <SectionHeading
          tone="dark"
          eyebrow={t('spirit.eyebrow')}
          title={t('spirit.title')}
          intro={t('spirit.intro')}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {stations.map((s, i) => (
            <article key={s.title} data-reveal="up" style={{ '--reveal-i': i }}
              className="flex flex-col overflow-hidden rounded-card border border-line-dark bg-on-dark/5">
              <Media src={s.image} alt={s.imageLabel.replace(': ', ' ')} label={s.imageLabel} className="aspect-[4/3]" style={darkMedia}
                sizes="(min-width: 768px) 28vw, 100vw" />
              <div className="flex flex-col gap-3 px-6 pb-7 pt-5">
                <p className="eyebrow text-on-dark-soft">{t('spirit.station')}</p>
                <h3 className="heading-3 uppercase tracking-[0.06em]">{s.title}</h3>
                <p className="m-0 leading-relaxed text-stone">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
