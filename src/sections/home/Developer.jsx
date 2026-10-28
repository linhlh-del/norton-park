import { useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import KeywordHeading from '@/components/ui/KeywordHeading';
import CountUp from '@/components/motion/CountUp';
import { isFilled } from '@/lib/filled';

export default function Developer() {
  const t = useT();
  const { team } = useSite();
  return (
    <section id="developer" className="bg-ivory py-section">
      <div className="container-site flex flex-col gap-[clamp(1.5rem,5svh,4rem)]">
        <div className="grid items-start gap-[clamp(1.25rem,5vw,6rem)] lg:grid-cols-2">
          <div data-reveal="left" className="flex flex-col gap-5">
            <p className="eyebrow text-bronze-deep">{t('dev.eyebrow')}</p>
            <KeywordHeading seo={t('dev.seo')} className="heading-2">{t('dev.title')}</KeywordHeading>
            <Media src="/images/vendor/gamuda.webp" alt="Gamuda Land" label={t('dev.logo')} fit="contain"
              className="media-static h-20 w-60 rounded-md" style={{ '--media-bg': 'transparent' }} sizes="240px" />
          </div>
          <p data-reveal="right" className="lead max-md:line-clamp-6">
            {t('dev.body1')} <CountUp value="30" /> {t('dev.body2')} <CountUp value="11" /> {t('dev.body3')}
          </p>
        </div>
        <div className="flex flex-col gap-[clamp(0.75rem,2.5svh,1.5rem)]">
          <p data-reveal="up" className="eyebrow text-bronze-deep">{t('dev.team')}</p>
          {/* đơn vị chưa công bố ("[Đang cập nhật]") không hiện; điện thoại: trượt ngang 2 thẻ / màn */}
          <ul className="m-rail m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,12.5rem),1fr))] gap-4 p-0 [--rail-item:46%]">
            {team.filter((m) => isFilled(m.name)).map((m, i) => (
              <li key={m.role} data-reveal="up" style={{ '--reveal-i': i }} className="flex min-h-[clamp(7rem,16svh,10rem)] flex-col justify-between gap-3 rounded-card border border-line p-[clamp(1rem,2.6svh,1.5rem)]">
                <p className="eyebrow text-xs leading-relaxed text-ink-soft">{m.role}</p>
                <p className="m-0 font-display text-[clamp(1.25rem,2vw,1.625rem)]">{m.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
