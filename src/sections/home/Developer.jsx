import { useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import KeywordHeading from '@/components/ui/KeywordHeading';
import CountUp from '@/components/motion/CountUp';

export default function Developer() {
  const t = useT();
  const { team } = useSite();
  return (
    <section id="developer" className="bg-ivory py-section">
      <div className="container-site flex flex-col gap-16">
        <div className="grid items-start gap-[clamp(2rem,6vw,6rem)] lg:grid-cols-2">
          <div data-reveal="left" className="flex flex-col gap-5">
            <p className="eyebrow text-bronze-deep">{t('dev.eyebrow')}</p>
            <KeywordHeading seo={t('dev.seo')} className="heading-2">{t('dev.title')}</KeywordHeading>
            <Media src="/images/vendor/gamuda.webp" alt="Gamuda Land" label={t('dev.logo')} fit="contain"
              className="media-static h-20 w-60 rounded-md" style={{ '--media-bg': 'transparent' }} sizes="240px" />
          </div>
          <p data-reveal="right" className="lead">
            {t('dev.body1')} <CountUp value="30" /> {t('dev.body2')} <CountUp value="11" /> {t('dev.body3')}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <p data-reveal="up" className="eyebrow text-bronze-deep">{t('dev.team')}</p>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,12.5rem),1fr))] gap-4 p-0">
            {team.map((m, i) => (
              <li key={m.role} data-reveal="up" style={{ '--reveal-i': i }} className="flex min-h-40 flex-col justify-between gap-4 rounded-card border border-line p-6">
                <p className="eyebrow text-[10px] leading-relaxed text-ink-soft">{m.role}</p>
                <p className="m-0 font-display text-[26px]">{m.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
