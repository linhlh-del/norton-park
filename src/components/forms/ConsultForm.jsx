import { useState } from 'react';
import { useSite, useT } from '@/i18n';
import ContactFields from './ContactFields';
import useLeadSubmit from '@/hooks/useLeadSubmit';

/**
 * Form đăng ký tư vấn 2 bước: chọn loại căn → thông tin liên hệ → gửi lead → trang cảm ơn /cam-on.
 * formId: giá trị cột form_type trên Google Sheet.
 */
export default function ConsultForm({ formId = 'register' }) {
  const t = useT();
  const { registerTypes } = useSite();
  const { send, status, error } = useLeadSubmit(formId);
  const [step, setStep] = useState(1);
  /* lưu vị trí [nhóm, mục] thay cho chữ để đổi ngôn ngữ vẫn giữ lựa chọn */
  const [pick, setPick] = useState([0, 0]);
  const unitType = registerTypes[pick[0]].items[pick[1]];

  const submit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    await send({ unitType, name: fd.name, phone: fd.phone, email: fd.email, website: fd.website });
  };

  return (
    <div className="flex flex-col gap-6 rounded-panel bg-ivory p-6 sm:p-12">
      <h2 className="heading-2">{t('form.title')}</h2>
      <p className="m-0 leading-relaxed">{t('form.intro')}</p>

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <p className="eyebrow text-bronze-deep">{t('form.step1')}</p>
          <fieldset className="m-0 flex flex-col gap-5 border-0 p-0">
            <legend className="eyebrow mb-5 text-hoadau">{t('form.unitType')}</legend>
            {registerTypes.map((g, gi) => (
              <div key={g.title} className="flex flex-col gap-2.5">
                <p className="m-0 text-[13px] text-ink-soft">{g.title}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((o, oi) => (
                    <button key={o} type="button" className="chip" aria-pressed={gi === pick[0] && oi === pick[1]} onClick={() => setPick([gi, oi])}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
          <div><button type="button" className="btn btn-solid" onClick={() => setStep(2)}>{t('form.continue')}</button></div>
        </div>
      )}

      {step === 2 && (
        <form className="relative flex flex-col gap-4.5" onSubmit={submit}>
          <p className="eyebrow text-bronze-deep">{t('form.step2')} · {unitType}</p>
          <ContactFields />
          {error && <p role="alert" className="m-0 text-sm text-[#b3412e]">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>{status === 'sending' ? t('sending') : t('cta.register')}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>{t('form.back')}</button>
          </div>
        </form>
      )}

      <p className="m-0 text-[13px] text-ink-soft">{t('form.privacy')}</p>
    </div>
  );
}
