import { useSite } from '@/i18n';
import Media from '@/components/ui/Media';
import ConsultForm from '@/components/forms/ConsultForm';
import ContactPanel from '@/components/ContactPanel';

/* Đăng ký tư vấn: ảnh nền toàn section (toà tháp lúc hoàng hôn) + lớp phủ tối; form nền sáng nổi phía trên */
export default function Register() {
  const { images } = useSite();
  return (
    <section id="register" className="relative isolate overflow-hidden bg-hoadau py-section">
      <Media src={images.register} alt="" tone="dark" className="media-backdrop !absolute inset-0 -z-20" sizes="100vw" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hoadau-deep/60" />
      {/* điện thoại: chỉ form (thông tin liên hệ đã có ở thanh dưới đáy + footer) để form gọn 1 màn hình */}
      <div className="container-site grid items-start gap-[clamp(1rem,3svh,2rem)] md:grid-cols-2">
        <div data-reveal="left" className="shadow-float rounded-panel"><ConsultForm formId="register" /></div>
        <div data-reveal="right" style={{ '--reveal-i': 1 }} className="max-md:hidden"><ContactPanel /></div>
      </div>
    </section>
  );
}
