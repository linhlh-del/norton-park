import { useSite, useT } from '@/i18n';
import { useContactPopup } from '@/components/popup/ContactPopup';

export default function Faq() {
  const t = useT();
  const { faq, contact } = useSite();
  const popup = useContactPopup();
  return (
    <section id="faq" className="bg-ivory py-section">
      <div className="container-site grid items-start gap-[clamp(1.25rem,5vw,6rem)] lg:grid-cols-2">
        {/* cột trái: tiêu đề + lối liên hệ khi câu hỏi chưa có trong danh sách (không còn khoảng trống ~300px) */}
        <div data-reveal="left" className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <p className="eyebrow text-bronze-deep">{t('faq.eyebrow')}</p>
          <h2 className="heading-2">{t('faq.title')}</h2>
          <div className="mt-[clamp(0.5rem,3svh,2rem)] hidden flex-col items-start gap-4 rounded-card bg-cream p-[clamp(1.25rem,3svh,2rem)] lg:flex">
            <p className="m-0 font-display text-2xl text-hoadau">{t('faq.more')}</p>
            <p className="m-0 leading-relaxed text-ink-soft">{t('faq.moreBody')}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-solid" onClick={() => popup.open('faq')} data-track="cta_click" data-track-label="faq_consult">{t('cta.register')}</button>
              <a href={contact.hotlineHref} className="btn btn-ghost" data-track="cta_click" data-track-label="faq_call">{t('faq.call', { phone: contact.hotline })}</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {faq.map((item, i) => (
            <details key={item.q} data-reveal="up" style={{ '--reveal-i': i }} className="group border-t border-line-strong py-[clamp(0.25rem,1.6svh,1.25rem)] last:border-b">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2 font-display text-[clamp(1.05rem,1.6vw,1.5rem)] leading-snug [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="font-sub text-xl text-bronze-deep transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mb-0 mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
