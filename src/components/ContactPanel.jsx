import { contact, disclaimer } from '@/data/site';

const Row = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <p className="eyebrow text-[10px] text-on-dark-soft">{label}</p>
    <p className="m-0 leading-relaxed">{children}</p>
  </div>
);

/** Khối thông tin liên hệ nền tối, dùng cạnh form đăng ký / nhận báo giá. */
export default function ContactPanel() {
  return (
    <aside className="flex flex-col gap-6 rounded-panel bg-hoadau p-6 text-on-dark sm:p-12">
      <h2 className="heading-3 text-[2rem]">Thông tin liên hệ</h2>
      <Row label="Địa chỉ dự án">{contact.address}</Row>
      <Row label="Hotline"><span className="text-xl">{contact.hotline}</span></Row>
      <Row label="Email">{contact.email}</Row>
      <Row label="Fanpage">{contact.fanpage}</Row>
      <p className="m-0 border-t border-line-dark pt-5 text-[13px] leading-relaxed text-on-dark-soft">{disclaimer}</p>
    </aside>
  );
}
