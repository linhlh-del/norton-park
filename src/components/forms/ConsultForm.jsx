import { useState } from 'react';
import { useSite, useT } from '@/i18n';
import { isVnPhone } from '@/lib/lead';
import useLeadSubmit from '@/hooks/useLeadSubmit';

const errCls = 'min-h-4 text-xs text-[#b3412e]';

/**
 * Form đăng ký 3 trường (Họ tên · Số điện thoại · nút gửi) → gửi lead → trang cảm ơn /cam-on.
 * Khảo sát chi tiết (loại căn, layout) chỉ đặt ở trang /bang-tinh-gia.
 * formId: giá trị cột form_type trên Google Sheet.
 */
export default function ConsultForm({ formId = 'register' }) {
  const t = useT();
  const { contact } = useSite();
  const { send, status, error } = useLeadSubmit(formId);
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const next = {};
    if (!String(fd.name || '').trim()) next.name = t('form.err.name');
    if (!isVnPhone(fd.phone || '')) next.phone = t('form.err.phone');
    setErrors(next);
    if (Object.keys(next).length) {
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    await send({ name: fd.name, phone: fd.phone, website: fd.website });
  };

  const field = (name) => ({ 'aria-invalid': errors[name] ? 'true' : undefined, 'aria-describedby': `err-r-${name}` });

  return (
    <div className="flex flex-col gap-6 rounded-panel bg-ivory p-6 sm:p-12">
      <h2 className="heading-2">{t('form.title')}</h2>
      <p className="m-0 leading-relaxed">{t('form.intro')}</p>

      <form noValidate className="relative flex flex-col gap-3" onSubmit={submit}>
        <label className="field">{t('form.name')}
          <input type="text" name="name" autoComplete="name" maxLength={100} {...field('name')} />
        </label>
        <span id="err-r-name" className={errCls} aria-live="polite">{errors.name}</span>
        <label className="field">{t('form.phone')}
          <input type="tel" name="phone" inputMode="tel" autoComplete="tel" placeholder={t('form.phoneHint')} {...field('phone')} />
        </label>
        <span id="err-r-phone" className={errCls} aria-live="polite">{errors.phone}</span>

        {/* chống spam: ô ẩn với người dùng */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        {status === 'failed' && <p role="alert" className="m-0 text-sm text-[#b3412e]">{error || t('form.err.send')} {t('form.err.orCall', { phone: contact.hotline })}</p>}
        <div>
          <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
            {status === 'sending' ? t('sending') : t('form.getPrice')}
          </button>
        </div>
      </form>

      <p className="m-0 text-[13px] text-ink-soft">{t('form.consentNote')} <a href="#legal">{t('form.policy')}</a>. {t('form.privacy')}</p>
    </div>
  );
}
