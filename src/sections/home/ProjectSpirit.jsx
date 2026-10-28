import { useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';
import { useRef } from 'react';
import RailHint from '@/components/ui/RailHint';

/* Ảnh: chiều cao theo màn hình (svh) nhưng tỉ lệ luôn nằm trong khoảng đẹp (cqw = % bề rộng khung chứa) → không bị cắt thành dải mỏng trên màn rộng-thấp, không cao quá trên màn hẹp */
const darkMedia = { '--media-bg': 'var(--color-pine-deep)', '--media-ink': 'rgb(244 240 231 / 0.72)' };

export default function ProjectSpirit() {
  const t = useT();
  const { stations } = useSite();
  const railRef = useRef(null);
  return (
    <section id="story" className="bg-pine py-section text-on-dark">
      <div className="container-site flex flex-col gap-[clamp(1.5rem,5svh,3.5rem)]">
        <SectionHeading
          tone="dark"
          eyebrow={t('spirit.eyebrow')}
          title={t('spirit.title')}
          seo={t('spirit.seo')}
          intro={t('spirit.intro')}
        />
        {/* điện thoại: dải trượt ngang (thẻ kế ló ra mép phải) thay cho 3 thẻ xếp dọc dài 2,5 màn hình */}
        <div ref={railRef} className="m-rail grid gap-6 md:grid-cols-3">
          {stations.map((s, i) => (
            <article key={s.title} data-reveal="up" style={{ '--reveal-i': i }}
              className="@container flex flex-col overflow-hidden rounded-card border border-line-dark bg-on-dark/5">
              <Media src={s.image} alt={s.imageLabel.replace(': ', ' ')} label={s.imageLabel} className="h-[clamp(50cqw,22svh,75cqw)]" style={darkMedia}
                sizes="(min-width: 768px) 28vw, 100vw" />
              <div className="flex flex-col gap-2.5 px-5 pb-6 pt-4 lg:px-6">
                <p className="eyebrow text-on-dark-soft">{t('spirit.station')}</p>
                <h3 className="heading-3 uppercase tracking-[0.06em]">{s.title}</h3>
                <p className="m-0 leading-relaxed text-stone max-md:line-clamp-3 [@media(max-height:47.5rem)]:line-clamp-3">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
        <RailHint railRef={railRef} tone="dark" />
      </div>
    </section>
  );
}
