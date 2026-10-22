import { useSite, useT } from '@/i18n';

const Row = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <p className="eyebrow text-[10px] text-on-dark-soft">{label}</p>
    <p className="m-0 leading-relaxed">{children}</p>
  </div>
);

/** Khối thông tin liên hệ nền tối, dùng cạnh form đăng ký / nhận báo giá. */
export default function ContactPanel() {
  const t = useT();
  const { contact, disclaimer } = useSite();
  return (
    <aside className="flex flex-col gap-6 rounded-panel bg-hoadau p-6 text-on-dark sm:p-12">
      <h2 className="heading-3 text-[2rem]">{t('contact.title')}</h2>
      <Row label={t('contact.address')}>{contact.address}</Row>
      <Row label="Hotline"><a href={contact.hotlineHref} className="text-xl text-on-dark no-underline hover:underline">{contact.hotline}</a></Row>
      <Row label="Email"><a href={`mailto:${contact.email}`} className="text-on-dark no-underline hover:underline">{contact.email}</a></Row>
      <Row label="Fanpage"><a href={contact.fanpageUrl} target="_blank" rel="noopener" className="text-on-dark no-underline hover:underline">{contact.fanpage}</a></Row>
      <p className="m-0 border-t border-line-dark pt-5 text-[13px] leading-relaxed text-on-dark-soft">{disclaimer}</p>
    </aside>
  );
}
