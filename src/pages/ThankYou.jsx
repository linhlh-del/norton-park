import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link, localizePath, useLang, useSite, useT } from '@/i18n';
import QuachoMark from '@/components/ui/QuachoMark';

/**
 * Trang cảm ơn sau khi gửi thông tin thành công (/cam-on, /en/cam-on) — noindex, không có trong sitemap.
 * Dùng làm đích chuyển đổi: GTM bắt sự kiện virtual_page_view có page_path = /cam-on (hoặc generate_lead).
 * Form chuyển tới đây bằng navigate('/cam-on', { state: { from } }) — "from" là trang khách đang xem.
 */
export default function ThankYou() {
  const t = useT();
  const lang = useLang();
  const { contact } = useSite();
  const navigate = useNavigate();
  const { state } = useLocation();
  const heading = useRef(null);
  const back = state?.from && !state.from.includes('/cam-on') ? state.from : localizePath('/', lang);

  /* đưa tiêu điểm lên tiêu đề để trình đọc màn hình đọc ngay thông báo */
  useEffect(() => { heading.current?.focus(); }, []);

  return (
    <section className="grid min-h-[70svh] place-items-center bg-cream px-4 py-section text-center">
      <div className="w-full max-w-xl rounded-panel bg-white p-8 shadow-float md:p-12">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-hoadau text-3xl text-on-dark" aria-hidden="true">✓</div>
        <div className="flex justify-center"><QuachoMark tone="light" size={28} /></div>
        <p className="eyebrow mt-4 text-bronze-deep">Norton Park</p>
        <h1 ref={heading} tabIndex={-1} className="heading-2 mt-3 outline-none">{t('ty.title')}</h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">{t('ty.body')}</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          {t('ty.help')} <a href={contact.hotlineHref} className="font-medium">{contact.hotline}</a>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => navigate(back)} className="btn btn-solid">{t('ty.back')}</button>
          <Link to="/bang-tinh-gia" className="btn btn-ghost">{t('ty.price')}</Link>
        </div>
      </div>
    </section>
  );
}
