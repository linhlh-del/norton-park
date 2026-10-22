/** Họ tên · số điện thoại · email · đồng ý chính sách — dùng chung cho form tư vấn và form báo giá. */
export default function ContactFields() {
  return (
    <>
      <label className="field">Họ và tên<input type="text" name="name" autoComplete="name" required /></label>
      <label className="field">Số điện thoại<input type="tel" name="phone" autoComplete="tel" required /></label>
      <label className="field">Email, không bắt buộc<input type="email" name="email" autoComplete="email" /></label>
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" name="consent" required className="mt-0.5 size-5 accent-bronze-deep" />
        <span>Đồng ý được liên hệ về Norton Park và đồng ý với <a href="#legal">chính sách bảo mật</a>.</span>
      </label>
    </>
  );
}
