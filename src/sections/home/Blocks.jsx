import { useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';
import { useContactPopup } from '@/components/popup/ContactPopup';

/* Ảnh: chiều cao theo màn hình (svh) nhưng tỉ lệ luôn nằm trong khoảng đẹp (cqw = % bề rộng khung chứa) → không bị cắt thành dải mỏng trên màn rộng-thấp, không cao quá trên màn hẹp */
const blockMedia = 'h-[clamp(50cqw,26svh,66.7cqw)] rounded-card'; /* 2:1 … 3:2 */

/* Hai phân khu trượt vào từ hai bên rồi gặp nhau ở giữa: B từ trái, C từ phải. */
export default function Blocks() {
  const t = useT();
  const { images } = useSite();
  const popup = useContactPopup();
  const zoneB = [t('blocks.b1'), t('blocks.b2'), t('blocks.b3')];
  return (
    <section id="blocks" className="overflow-hidden bg-ivory py-section">
      <div className="container-site flex flex-col gap-[clamp(1.5rem,4.5svh,3.5rem)]">
        <SectionHeading align="center" eyebrow={t('blocks.eyebrow')} title={t('blocks.title')} seo={t('blocks.seo')} />
        {/* điện thoại: 2 phân khu trượt ngang · từ 768px: 2 cột cạnh nhau */}
        <div className="m-rail grid gap-8 md:grid-cols-2">
          <article data-reveal="left" className="@container flex flex-col gap-[clamp(0.75rem,2.2svh,1.5rem)]">
            <Media src={images.blockB} alt={t('blocks.bAlt')} label={t('blocks.bAlt')} className={blockMedia}
              style={{ '--media-bg': 'var(--color-taupe)', '--media-ink': '#3c3c3c' }} sizes="(min-width: 1024px) 42vw, 100vw" />
            <h3 className="heading-3 !text-[clamp(1.6rem,2.6vw,2.4rem)]">{t('blocks.b')}</h3>
            <p className="m-0 leading-relaxed max-md:line-clamp-3">{t('blocks.bBody')}</p>
            <ul className="m-0 flex list-none flex-col p-0">
              {zoneB.map((x) => (
                <li key={x} className="flex items-center gap-3 border-t border-line py-[clamp(0.4rem,1.3svh,0.875rem)] last:border-b">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-bronze-deep" />
                  {x}
                </li>
              ))}
            </ul>
          </article>
          <article data-reveal="right" className="@container flex flex-col gap-[clamp(0.75rem,2.2svh,1.5rem)]">
            <div className="relative">
              <Media src={images.blockC} alt={t('blocks.cAlt')} label={t('blocks.cAlt')} className={blockMedia}
                style={{ '--media-bg': 'var(--color-sage)', '--media-ink': 'var(--color-ivory)' }} sizes="(min-width: 1024px) 42vw, 100vw" />
              <span className="absolute left-4 top-4 rounded-full bg-hoadau px-4 py-2 font-sub text-xs font-semibold tracking-[0.2em] text-on-dark">{t('blocks.soon')}</span>
            </div>
            <h3 className="heading-3 !text-[clamp(1.6rem,2.6vw,2.4rem)]">{t('blocks.c')}</h3>
            <p className="m-0 leading-relaxed text-ink-soft">{t('blocks.cBody')}</p>
            {/* "Sắp ra mắt" đi kèm lối đăng ký riêng — lấp khoảng trống và giữ lead quan tâm sớm */}
            <div className="flex flex-col items-start gap-4 rounded-card border border-line bg-cream/60 p-[clamp(1rem,2.6svh,1.5rem)] xl:flex-row xl:items-center">
              <p className="m-0 leading-relaxed text-hoadau">{t('blocks.cTeaser')}</p>
              <button type="button" className="btn btn-solid shrink-0" onClick={() => popup.open('block_c')}
                data-track="cta_click" data-track-label="block_c_register">
                {t('blocks.cCta')}
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
