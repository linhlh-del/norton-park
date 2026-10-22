import { Link } from 'react-router-dom';

/* 404: Seo đặt robots "noindex"; prerender ghi dist/404.html để server trả kèm mã 404 */
export default function NotFound() {
  return (
    <section className="bg-cream py-section">
      <div className="container-site flex flex-col items-start gap-6">
        <p className="eyebrow text-bronze-deep">Lỗi 404</p>
        <h1 className="heading-1">Không tìm thấy trang</h1>
        <p className="lead max-w-2xl">Trang bạn tìm không tồn tại hoặc đã được chuyển. Hãy quay về trang chủ hoặc xem bảng tính giá.</p>
        <div className="flex flex-wrap gap-3.5">
          <Link to="/" className="btn btn-solid">Về trang chủ</Link>
          <Link to="/bang-tinh-gia" className="btn btn-ghost">Bảng tính giá</Link>
        </div>
      </div>
    </section>
  );
}
