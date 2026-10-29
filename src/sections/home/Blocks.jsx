import { useState } from 'react';
import { useSite, useT } from '@/i18n';
import MobileTabs, { panelClass, useTabsId } from '@/components/ui/MobileTabs';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';
import { useContactPopup } from '@/components/popup/ContactPopup';

/* Chiều cao ảnh: .np-img-* trong styles/index.css (tỉ lệ đẹp trên màn cao · vừa khung trên màn thấp) */
const blockMedia = 'np-img-block rounded-card'; /* chiều cao: index.css (.np-img-*) */
/* fit="contain": ảnh phân khu là bản vẽ/phối cảnh toàn khối — cắt theo object-cover sẽ mất nội dung quan trọng
   (nhà, tên toà…) ở rìa; giữ trọn ảnh quan trọng hơn lấp kín khung, nhất là trên điện thoại (khung thấp). */

/* Hai phân khu trượt vào từ hai bên rồi gặp nhau ở giữa: B từ trái, C từ phải. */
export default function Blocks() {
  const t = useT();
  const { images } = useSite();
  const popup = useContactPopup();
  const [zone, setZone] = useState(0);
  const tabsId = useTabsId();
  const zoneB = [t('blocks.b1'), t('blocks.b2'), t('blocks.b3')];
  return (
    <section id="blocks" className="overflow-hidden bg-ivory py-section">
      <div className="container-site flex flex-col gap-[clamp(1.5rem,4.5svh,3.5rem)]">
        <SectionHeading align="center" eyebrow={t('blocks.eyebrow')} title={t('blocks.title')} seo={t('blocks.seo')} />
        {/* điện thoại: tab Phân khu B / C (không còn thẻ bị che ở mép phải) · từ 768px: 2 cột cạnh nhau */}
        {/* hiện dần ở khối bao (không ở panel tab đang ẩn — xem Facts.jsx) */}
        <div data-reveal="up" className="flex flex-col gap-4">
        <MobileTabs label={t('blocks.eyebrow')} tabs={[t('blocks.b'), t('blocks.c')]} active={zone} onChange={setZone} idPrefix={tabsId} />
        <div className="grid gap-8 md:grid-cols-2">
          <article id={`${tabsId}-0`} role="tabpanel" className={`@container flex flex-col ${panelClass(0, zone)} gap-[clamp(0.75rem,2.2svh,1.5rem)]`}>
            <Media src={images.blockB} alt={t('blocks.bAlt')} label={t('blocks.bAlt')} className={blockMedia} fit="contain"
              style={{ '--media-bg': 'var(--color-taupe)', '--media-ink': '#3c3c3c' }} sizes="(min-width: 1024px) 42vw, 100vw" />
            <h3 className="heading-3 !text-[clamp(1.6rem,2.6vw,2.4rem)]">{t('blocks.b')}</h3>
            <p className="m-0 leading-relaxed max-md:line-clamp-3">{t('blocks.bBody')}</p>
            <ul className="m-0 flex list-none flex-col p-0">
              {zoneB.map((x) => (
                <li key={x} className="flex items-center gap-3 border-t border-line py-2 last:border-b md:py-[clamp(0.4rem,1.3svh,0.875rem)]">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-bronze-deep" />
                  {x}
                </li>
              ))}
            </ul>
          </article>
          <article id={`${tabsId}-1`} role="tabpanel" className={`@container flex flex-col ${panelClass(1, zone)} gap-[clamp(0.75rem,2.2svh,1.5rem)]`}>
            <div className="relative">
              <Media src={images.blockC} alt={t('blocks.cAlt')} label={t('blocks.cAlt')} className={blockMedia} fit="contain"
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
      </div>
    </section>
  );
}
