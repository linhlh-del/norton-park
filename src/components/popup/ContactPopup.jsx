import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSite, useT } from '@/i18n';
import { isVnPhone } from '@/lib/lead';
import useLeadSubmit from '@/hooks/useLeadSubmit';
import { track } from '@/lib/analytics';
import { hasImage } from '@/lib/images';

const LOGO = '/images/imgi_2_norton-park-logo-primary.svg';
const SIDE = '/images/imgi_32_amenity-overview-portrait.jpg';
import { CloseIcon } from '@/components/ui/Icons';

const PopupCtx = createContext({ open: () => {}, close: () => {} });
/** Mở popup liên hệ từ bất kỳ đâu: const { open } = useContactPopup(); open('header') */
export const useContactPopup = () => useContext(PopupCtx);

const SEEN_KEY = 'np-popup-seen';
const storage = {
  get: () => { try { return sessionStorage.getItem(SEEN_KEY); } catch { return '1'; } },
  set: () => { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* chế độ riêng tư: bỏ qua */ } },
};

/**
 * Provider + popup "Nhận tư vấn". autoOpenMs: thời gian tối thiểu trước khi tự mở (0 = tắt).
 */
export function ContactPopupProvider({ children, autoOpenMs = 25000 }) {
  const [isOpen, setOpen] = useState(false);
  const [position, setPosition] = useState('popup');
  const lastFocus = useRef(null);

  const open = useCallback((from = 'popup') => {
    lastFocus.current = document.activeElement;
    setPosition(from);
    setOpen(true);
    storage.set();
    track('popup_open', { form_position: from });
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  /* Tự mở MỘT lần mỗi phiên, chỉ khi khách đã ở lại đủ lâu VÀ đã cuộn xem nội dung (≥ 40% trang).
     Không bật ngay khi vào trang: Google coi popup che nội dung lúc vừa tới từ trang tìm kiếm (nhất là trên điện thoại)
     là "intrusive interstitial" và hạ thứ hạng. Không mở trên trang cảm ơn. */
  useEffect(() => {
    if (!autoOpenMs || storage.get()) return undefined;
    let timeUp = false;
    let scrolled = false;
    const tryOpen = () => {
      if (timeUp && scrolled && !storage.get() && !location.pathname.includes('/cam-on')) open('popup_auto');
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0 && scrollY / max >= 0.4) { scrolled = true; removeEventListener('scroll', onScroll); tryOpen(); }
    };
    const t = setTimeout(() => { timeUp = true; tryOpen(); }, autoOpenMs);
    addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); removeEventListener('scroll', onScroll); };
  }, [autoOpenMs, open]);

  return (
    <PopupCtx.Provider value={{ open, close }}>
      {children}
      {isOpen && <ContactPopup position={position} onClose={close} />}
    </PopupCtx.Provider>
  );
}

const errCls = 'min-h-4 text-xs font-normal normal-case tracking-normal text-[#b3412e]';
const inputCls = 'min-h-12 w-full rounded-lg border border-line-strong bg-ivory px-3.5 font-body text-base text-hoadau placeholder:text-ink-soft/80 aria-[invalid=true]:border-[#b3412e]';

function ContactPopup({ position, onClose }) {
  const t = useT();
  const { contact } = useSite();
  const panel = useRef(null);
  const firstInput = useRef(null);
  const [errors, setErrors] = useState({});
  /* form_type trên Sheet: popup / popup_auto / popup_header / popup_floating_price… */
  const { send, status, error } = useLeadSubmit(position.startsWith('popup') ? position : `popup_${position}`);
  const [logoOk, setLogoOk] = useState(() => hasImage(LOGO));
  const [mediaOk, setMediaOk] = useState(() => hasImage(SIDE));

  /* khoá cuộn trang, Esc để đóng, giữ Tab trong popup */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstInput.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const f = panel.current.querySelectorAll('a[href],button:not([disabled]),input:not([type="hidden"]):not([tabindex="-1"]),select,textarea');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prevOverflow; document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const next = {};
    if (!String(fd.fullname || '').trim()) next.fullname = t('form.err.name');
    if (!isVnPhone(fd.phone || '')) next.phone = t('form.err.phone');
    setErrors(next);
    if (Object.keys(next).length) {
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    /* thành công → đóng popup, chuyển sang /cam-on (honeypot "website" được Worker xử lý) */
    const ok = await send({ name: fd.fullname, phone: fd.phone, website: fd.website });
    if (ok) onClose();
  };

  const field = (name) => ({ 'aria-invalid': errors[name] ? 'true' : undefined, 'aria-describedby': `err-p-${name}` });

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-hoadau-deep/70 motion-safe:animate-[np-fade_.25s_ease]" onClick={onClose} aria-hidden="true" />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="popSub"
        className="relative grid max-h-[calc(100svh-1.5rem)] w-full max-w-[60rem] overflow-y-auto rounded-panel bg-ivory shadow-float motion-safe:animate-[np-pop_.35s_var(--ease-soft)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:overflow-hidden">

        {/* biểu mẫu */}
        <div className="flex flex-col gap-5 p-6 sm:p-10">
          {logoOk ? (
            <img src={LOGO} alt="Norton Park" width="1200" height="200" className="h-auto w-48" onError={() => setLogoOk(false)} />
          ) : (
            <p className="m-0 font-display text-2xl tracking-logo text-hoadau">NORTON PARK</p>
          )}
          <p id="popSub" className="m-0 leading-relaxed">{t('popup.intro')}</p>

            <form noValidate onSubmit={submit} className="flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="pName" className="sr-only">{t('form.name')}</label>
                  <input ref={firstInput} id="pName" name="fullname" type="text" autoComplete="name" placeholder={t('form.name')} className={inputCls} {...field('fullname')} />
                  <span id="err-p-fullname" className={errCls} aria-live="polite">{errors.fullname}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="pPhone" className="sr-only">{t('form.phone')}</label>
                  <input id="pPhone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={t('form.phone')} className={inputCls} {...field('phone')} />
                  <span id="err-p-phone" className={errCls} aria-live="polite">{errors.phone}</span>
                </div>
              </div>

              {/* chống spam: ô ẩn với người dùng */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="pWebsite">Website</label>
                <input id="pWebsite" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <input type="hidden" name="page_variant" value="norton_park_lead_a" />

              {status === 'failed' && <p role="alert" className="m-0 text-sm text-[#b3412e]">{error || t('form.err.send')} {t('form.err.orCall', { phone: contact.hotline })}</p>}
              <button type="submit" className="btn btn-solid mt-1 w-full" disabled={status === 'sending'}>
                {status === 'sending' ? t('sending') : t('form.getPrice')}
                <span aria-hidden="true">→</span>
              </button>
              <p className="m-0 text-[13px] leading-relaxed text-ink-soft">
                {t('form.consentNote')} <a href="#legal" onClick={onClose}>{t('form.policy')}</a>.
              </p>
            </form>
        </div>

        {/* ảnh + thông tin liên hệ */}
        <div className="relative isolate flex min-h-[18rem] flex-col justify-end bg-hoadau p-6 text-on-dark sm:p-10">
          {mediaOk && (
            <img src={SIDE} alt="" aria-hidden="true" loading="lazy" width="900" height="1200"
              className="absolute inset-0 -z-20 h-full w-full object-cover" onError={() => setMediaOk(false)} />
          )}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hoadau-deep/60" />
          <div className="flex flex-col gap-4">
            <h3 className="heading-3">{t('contact.title')}</h3>
            {[
              ['Hotline', contact.hotline, contact.hotlineHref],
              ['Email', contact.email, 'mailto:' + contact.email],
              ['Fanpage', contact.fanpage, contact.fanpageUrl, true],
              [t('contact.address'), contact.address, contact.mapUrl, true],
            ].map(([k, v, href, ext]) => (
              <div key={k} className="flex flex-col gap-1">
                <span className="eyebrow text-xs text-on-dark-soft">{k}</span>
                <a href={href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} className="leading-snug text-on-dark no-underline hover:text-on-dark-soft hover:underline">{v}</a>
              </div>
            ))}
          </div>
        </div>

        <button type="button" onClick={onClose} aria-label={t('close')}
          className="absolute right-3 top-3 grid size-11 cursor-pointer place-items-center rounded-full border-0 bg-ivory/90 text-hoadau hover:bg-ivory">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
