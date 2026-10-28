import { useT } from '@/i18n';
import Media from './Media';

/**
 * Mặt bằng minh hoạ của một loại căn. Căn hai tầng (Duplex, Duplex sân vườn, Podium Shop) có 2 ảnh → xếp ngang
 * hai cột, mỗi ảnh kèm nhãn tầng; căn một tầng chiếm trọn khung.
 * plans: [{ src, label? }] — khai báo trong collections (src/data/site.js).
 */
/* mediaClass: kích thước khung ảnh CỐ ĐỊNH (vd. chiều cao theo svh). Khi có mediaClass, nhãn tầng nằm đè trong khung
   (không cộng thêm chiều cao) → căn 1 tầng hay 2 tầng, ảnh dọc hay ngang đều chiếm đúng cùng một khung, giao diện
   không nhảy khi đổi loại căn. Không có mediaClass: khung theo tỉ lệ, nhãn nằm dưới ảnh. */
export default function FloorPlans({ plans = [], name, sizes = '(min-width: 1024px) 38vw, 100vw', mediaClass }) {
  const t = useT();
  const list = plans.length ? plans : [{}];
  const two = list.length > 1;
  return (
    <div className={`grid gap-3 ${two ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {list.map((p, i) => (
        <figure key={p.src || i} className={`m-0 flex min-w-0 flex-col gap-2 ${mediaClass ? 'relative' : ''}`}>
          <Media src={p.src} fit="contain" style={{ '--media-bg': '#fff' }}
            alt={t('plan.alt', { name: `${name}${p.label ? ` — ${p.label.toLowerCase()}` : ''}` })}
            label={t('plan.label', { name: `${name}${p.label ? ` · ${p.label}` : ''}` })}
            className={`${mediaClass || (two ? 'aspect-[3/4]' : 'aspect-square')} rounded-lg`}
            sizes={two ? sizes.replace(/(\d+)vw/g, (_, n) => `${Math.round(n / 2)}vw`) : sizes} />
          {p.label && (
            <figcaption className={mediaClass
              ? 'eyebrow absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-ink-soft shadow-sm'
              : 'eyebrow text-center text-ink-soft'}>
              {p.label}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
