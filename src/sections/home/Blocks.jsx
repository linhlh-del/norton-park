import { images } from '@/data/site';
import Media from '@/components/ui/Media';
import SectionHeading from '@/components/ui/SectionHeading';

const zoneB = ['Liền kề AEON Mall Thuận Giao', 'Kế cận Khu công nghiệp VSIP 1', 'Thương mại khối đế trong tầm đi bộ'];

/* Hai phân khu trượt vào từ hai bên rồi gặp nhau ở giữa: B từ trái, C từ phải. */
export default function Blocks() {
  return (
    <section id="blocks" className="overflow-hidden bg-ivory py-section">
      <div className="container-site flex flex-col gap-14">
        <SectionHeading align="center" eyebrow="Hai phân khu căn hộ" title="Hai tính cách trong cùng một tổng thể" />
        <div className="grid gap-8 lg:grid-cols-2">
          <article data-reveal="left" className="flex flex-col gap-6">
            <Media src={images.blockB} alt="Phối cảnh phân khu B Norton Park" label="Phối cảnh: Phân khu B" className="aspect-[4/3] rounded-card"
              style={{ '--media-bg': 'var(--color-taupe)', '--media-ink': '#3c3c3c' }} sizes="(min-width: 1024px) 42vw, 100vw" />
            <h3 className="heading-2">Phân khu B</h3>
            <p className="lead">Sát AEON Mall Thuận Giao và gần KCN VSIP 1 — mua sắm, ăn uống và nơi làm việc đều trong quãng đường di chuyển hằng ngày.</p>
            <ul className="m-0 flex list-none flex-col p-0">
              {zoneB.map((t) => (
                <li key={t} className="flex items-center gap-3 border-t border-line py-3.5 last:border-b">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-bronze-deep" />
                  {t}
                </li>
              ))}
            </ul>
          </article>
          <article data-reveal="right" className="flex flex-col gap-6">
            <div className="relative">
              <Media src={images.blockC} alt="Mặt bằng phân khu C Norton Park" label="Mặt bằng: Phân khu C" className="aspect-[4/3] rounded-card"
                style={{ '--media-bg': 'var(--color-sage)', '--media-ink': 'var(--color-ivory)' }} sizes="(min-width: 1024px) 42vw, 100vw" />
              <span className="absolute left-5 top-5 rounded-full bg-hoadau px-4 py-2 font-sub text-[11px] font-semibold tracking-[0.2em] text-on-dark">SẮP RA MẮT</span>
            </div>
            <h3 className="heading-2">Phân khu C</h3>
            <p className="lead text-ink-soft">Thông tin phân khu sẽ được công bố trong thời gian tới.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
