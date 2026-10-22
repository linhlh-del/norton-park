import { useT } from '@/i18n';

/** Họ tên · số điện thoại · email · đồng ý chính sách — dùng chung cho form tư vấn và form báo giá.
    Ô "website" ẩn là honeypot chống bot: người thật không thấy nên để trống, Worker bỏ qua lead có ô này. */
export default function ContactFields() {
  const t = useT();
  return (
    <>
      <label className="field">{t('form.name')}<input type="text" name="name" autoComplete="name" required maxLength={100} /></label>
      <label className="field">{t('form.phone')}<input type="tel" name="phone" inputMode="tel" autoComplete="tel" required pattern="^(\+?84|0)[\d\s.\-]{8,13}$" title={t('form.phoneHint')} /></label>
      <label className="field">{t('form.email')}<input type="email" name="email" autoComplete="email" maxLength={120} /></label>
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" name="consent" required className="mt-0.5 size-5 accent-bronze-deep" />
        <span>{t('form.consent')} <a href="#legal">{t('form.policy')}</a>.</span>
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
    </>
  );
}
