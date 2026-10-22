import { useState } from 'react';
import { registerTypes } from '@/data/site';
import ContactFields from './ContactFields';

/**
 * Form đăng ký tư vấn 2 bước: chọn loại căn → thông tin liên hệ → xác nhận.
 * onSubmit(payload) nhận { unitType, name, phone, email } — nối API CRM tại đây.
 */
export default function ConsultForm({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [unitType, setUnitType] = useState(registerTypes[0].items[0]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    await onSubmit?.({ unitType, name: fd.name, phone: fd.phone, email: fd.email });
    setStep(3);
  };

  return (
    <div className="flex flex-col gap-6 rounded-panel bg-ivory p-6 sm:p-12">
      <h2 className="heading-2">Đăng ký tư vấn</h2>
      <p className="m-0 leading-relaxed">Sau khi nhận thông tin, chúng tôi sẽ gửi bộ tài liệu dự án và sắp xếp buổi tư vấn.</p>

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <p className="eyebrow text-bronze-deep">Bước một trên hai</p>
          <fieldset className="m-0 flex flex-col gap-5 border-0 p-0">
            <legend className="eyebrow mb-5 text-hoadau">Loại căn quan tâm</legend>
            {registerTypes.map((g) => (
              <div key={g.title} className="flex flex-col gap-2.5">
                <p className="m-0 text-[13px] text-ink-soft">{g.title}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((o) => (
                    <button key={o} type="button" className="chip" aria-pressed={o === unitType} onClick={() => setUnitType(o)}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
          <div><button type="button" className="btn btn-solid" onClick={() => setStep(2)}>Tiếp tục →</button></div>
        </div>
      )}

      {step === 2 && (
        <form className="flex flex-col gap-4.5" onSubmit={submit}>
          <p className="eyebrow text-bronze-deep">Bước hai trên hai · {unitType}</p>
          <ContactFields />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-solid">Đăng ký tư vấn</button>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Quay lại bước trước</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div role="status" className="flex flex-col items-center gap-3 rounded-card bg-cream p-8 text-center">
          <h3 className="heading-3">Thông tin đã được ghi nhận</h3>
          <p className="m-0 leading-relaxed">Đội ngũ cố vấn sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
          <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Đăng ký thêm</button>
        </div>
      )}

      <p className="m-0 text-[13px] text-ink-soft">Thông tin được bảo mật theo chính sách bảo mật của chủ đầu tư.</p>
    </div>
  );
}
