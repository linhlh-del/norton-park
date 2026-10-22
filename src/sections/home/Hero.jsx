import { Link } from 'react-router-dom';
import { images } from '@/data/site';
import Media from '@/components/ui/Media';

/* Hero: ảnh nền tải ưu tiên (LCP) và thu nhẹ khi vào trang; chữ trồi lên lần lượt ngay khi tải, không chờ cuộn.
   Tiêu đề H1 không làm mờ để không làm chậm chỉ số LCP. */
export default function Hero() {
  return (
    <section aria-label="Giới thiệu Norton Park" className="relative isolate flex min-h-[clamp(640px,92svh,880px)] items-end overflow-hidden bg-hoadau-deep text-on-dark">
      <Media src={images.hero} alt="Phối cảnh mặt tiền dự án Norton Park lúc hoàng hôn" label="Ảnh: phối cảnh mặt tiền lúc hoàng hôn"
        tone="dark" priority className="!absolute inset-0 -z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hoadau-deep/45" />
      <div className="container-site flex flex-col gap-7 pb-24 pt-40">
        <p className="eyebrow hero-in text-on-dark-soft">Biểu tượng của chuẩn sống toàn cầu</p>
        <h1 className="heading-1 max-w-4xl italic">
          <span className="sr-only">Norton Park — A Gamuda Land Community: </span>
          Tinh chọn chuẩn <br />chuyên gia
        </h1>
        <div className="hero-in flex flex-wrap gap-3.5" style={{ '--reveal-i': 2 }}>
          <Link to="/#register" className="btn btn-solid">Đăng ký tư vấn</Link>
          <Link to="/#design-story" className="btn btn-ghost-light">Khám phá Norton Park</Link>
        </div>
      </div>
    </section>
  );
}
