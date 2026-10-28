import { Link, useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';
import KeywordHeading from '@/components/ui/KeywordHeading';

export default function Location() {
  const t = useT();
  const { images } = useSite();
  return (
    <section id="location" className="bg-sand py-section">
      {/* máy tính: chữ cột trái, ảnh phối cảnh cột phải (ảnh giữ trọn tỉ lệ 16:9, không bị cắt thành dải mỏng);
          điện thoại / máy tính bảng: tiêu đề → đoạn dẫn → nút → ảnh */}
      <div className="container-site grid items-center gap-[clamp(1.5rem,4svh,3.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[clamp(2rem,4vw,4.5rem)]">
        <div className="flex flex-col gap-[clamp(1rem,2.6svh,1.5rem)]">
          <div data-reveal="left" className="flex flex-col gap-4">
            <p className="eyebrow text-walnut">{t('location.eyebrow')}</p>
            <KeywordHeading seo={t('location.seo')} className="heading-2">{t('location.title')}</KeywordHeading>
          </div>
          <div data-reveal="left" style={{ '--reveal-i': 1 }} className="flex flex-col gap-4">
            <p className="lead">{t('location.p1')}</p>
            <p className="lead max-md:line-clamp-3">{t('location.p2')}</p>
            <div className="pt-1">
              <Link to="/#position" className="btn btn-solid" data-track="cta_click" data-track-label="location_map">
                {t('location.cta')} <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
        </div>
        {/* ảnh có chữ chú thích: tỉ lệ luôn trong khoảng 2:1 … 16:9 (cqw = % bề rộng cột) — không cắt mất nhãn */}
        <div data-reveal="right" className="@container">
          <Media src={images.masterplan} alt={t('location.imageAlt')} label={t('location.imageLabel')}
            className="h-[clamp(50cqw,60svh,56.25cqw)] rounded-card" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
