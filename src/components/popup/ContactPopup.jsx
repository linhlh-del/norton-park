import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { contact, registerTypes } from '@/data/site';
import { isVnPhone, submitLead } from '@/lib/lead';
import { track } from '@/lib/analytics';
import { hasImage } from '@/lib/images';

const LOGO = '/images/logos/norton-park-logo-primary.svg';
const SIDE = '/images/amenity-overview-portrait.jpg';
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
 * Provider + popup "Nhận tư vấn". autoOpenMs: tự mở sau N ms, mỗi phiên trình duyệt một lần (0 = tắt).
 */
export function ContactPopupProvider({ children, autoOpenMs = 8000 }) {
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

  useEffect(() => {
    if (!autoOpenMs || storage.get()) return undefined;
    const t = setTimeout(() => open('popup_auto'), autoOpenMs);
    return () => clearTimeout(t);
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
  const panel = useRef(null);
  const firstInput = useRef(null);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | done | failed
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
    if (!String(fd.fullname || '').trim()) next.fullname = 'Vui lòng nhập họ và tên.';
    if (!isVnPhone(fd.phone || '')) next.phone = 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).';
    if (!fd.consent) next.consent = 'Vui lòng đồng ý để chúng tôi liên hệ.';
    setErrors(next);
    if (Object.keys(next).length) {
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    if (fd.website) { setState('done'); return; } /* honeypot: bot điền ô ẩn */
    setState('sending');
    try {
      await submitLead({ ...fd, form_position: position }, 'popup');
      setState('done');
    } catch {
      setState('failed');
    }
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
          <p id="popSub" className="m-0 leading-relaxed">Để lại thông tin, đội ngũ cố vấn sẽ liên hệ và gửi bộ tài liệu dự án.</p>

          {state === 'done' ? (
            <div role="status" className="flex flex-col items-start gap-3 rounded-card bg-cream p-6">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--color-bronze-deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M7.5 12.5l3 3 6-7" /></svg>
              <h3 className="heading-3">Thông tin đã được ghi nhận</h3>
              <p className="m-0 leading-relaxed">Đội ngũ cố vấn sẽ liên hệ trong thời gian sớm nhất.</p>
              <button type="button" className="btn btn-ghost mt-2" onClick={onClose}>Đóng</button>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="pName" className="sr-only">Họ và tên</label>
                  <input ref={firstInput} id="pName" name="fullname" type="text" autoComplete="name" placeholder="Họ và tên" className={inputCls} {...field('fullname')} />
                  <span id="err-p-fullname" className={errCls} aria-live="polite">{errors.fullname}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="pPhone" className="sr-only">Số điện thoại</label>
                  <input id="pPhone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Số điện thoại" className={inputCls} {...field('phone')} />
                  <span id="err-p-phone" className={errCls} aria-live="polite">{errors.phone}</span>
                </div>
              </div>
              <label htmlFor="pEmail" className="sr-only">Email</label>
              <input id="pEmail" name="email" type="email" autoComplete="email" placeholder="Email" className={inputCls} />
              <label htmlFor="pUnit" className="sr-only">Loại căn quan tâm</label>
              <select id="pUnit" name="unit_interest" defaultValue="" className={`${inputCls} mt-3`}>
                <option value="">Loại căn quan tâm</option>
                {registerTypes.map((g) => (
                  <optgroup key={g.title} label={g.title}>
                    {g.items.map((o) => <option key={o} value={o}>{o}</option>)}
                  </optgroup>
                ))}
              </select>

              <label className="mt-3 flex items-start gap-3 text-sm leading-relaxed">
                <input type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-bronze-deep" {...field('consent')} />
                <span>Đồng ý được liên hệ về Norton Park và đồng ý với <a href="#legal" onClick={onClose}>chính sách bảo mật</a>.</span>
              </label>
              <span id="err-p-consent" className={errCls} aria-live="polite">{errors.consent}</span>

              {/* chống spam: ô ẩn với người dùng */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="pWebsite">Website</label>
                <input id="pWebsite" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <input type="hidden" name="page_variant" value="norton_park_lead_a" />

              {state === 'failed' && <p role="alert" className="m-0 text-sm text-[#b3412e]">Chưa gửi được thông tin, vui lòng thử lại hoặc gọi {contact.hotline}.</p>}
              <button type="submit" className="btn btn-solid mt-1 w-full" disabled={state === 'sending'}>
                {state === 'sending' ? 'Đang gửi…' : 'Nhận tư vấn ngay'}
                <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
        </div>

        {/* ảnh + thông tin liên hệ */}
        <div className="relative isolate flex min-h-[18rem] flex-col justify-end bg-hoadau p-6 text-on-dark sm:p-10">
          {mediaOk && (
            <img src={SIDE} alt="" aria-hidden="true" loading="lazy" width="900" height="1200"
              className="absolute inset-0 -z-20 h-full w-full object-cover" onError={() => setMediaOk(false)} />
          )}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hoadau-deep/60" />
          <div className="flex flex-col gap-4">
            <h3 className="heading-3">Thông tin liên hệ</h3>
            {[
              ['Hotline', contact.hotline, contact.hotlineHref],
              ['Email', contact.email, 'mailto:' + contact.email],
              ['Fanpage', contact.fanpage, contact.fanpageUrl, true],
              ['Địa chỉ dự án', contact.address, contact.mapUrl, true],
            ].map(([k, v, href, ext]) => (
              <div key={k} className="flex flex-col gap-1">
                <span className="eyebrow text-[10px] text-on-dark-soft">{k}</span>
                <a href={href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} className="leading-snug text-on-dark no-underline hover:text-on-dark-soft hover:underline">{v}</a>
              </div>
            ))}
          </div>
        </div>

        <button type="button" onClick={onClose} aria-label="Đóng"
          className="absolute right-3 top-3 grid size-11 cursor-pointer place-items-center rounded-full border-0 bg-ivory/90 text-hoadau hover:bg-ivory">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
