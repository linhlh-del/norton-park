import { useEffect, useState } from 'react';
import { Link as RRLink, useLocation } from 'react-router-dom';
import { LANGS, Link, NavLink, localizePath, stripLang, useLang, useSite, useT } from '@/i18n';
import { menuSubtitle } from '@/seo/site-meta';
import Wordmark from '@/components/ui/Wordmark';
import { CloseIcon, MenuIcon } from '@/components/ui/Icons';
import { useContactPopup } from '@/components/popup/ContactPopup';

const navCls = 'font-sub text-xs font-medium uppercase tracking-[0.14em] text-on-dark no-underline hover:text-on-dark-soft';

/* VI | EN: giữ nguyên trang, tham số và #section đang xem, chỉ đổi ngôn ngữ */
function LangSwitch({ className = '' }) {
  const t = useT();
  const lang = useLang();
  const { pathname, search, hash } = useLocation();
  const base = stripLang(pathname);
  return (
    <div role="group" aria-label={t('nav.lang')} className={`font-sub text-xs tracking-[0.12em] ${className}`}>
      {LANGS.map((l) => (
        <RRLink key={l} to={localizePath(base, l) + search + hash} hrefLang={l} lang={l} aria-current={lang === l ? 'true' : undefined}
          className={`grid size-11 place-items-center uppercase no-underline ${lang === l ? 'text-on-dark underline underline-offset-4' : 'text-on-dark-soft hover:text-on-dark'}`}>
          {l}
        </RRLink>
      ))}
    </div>
  );
}

export default function SiteHeader() {
  const t = useT();
  const lang = useLang();
  const { mainNav } = useSite();
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const popup = useContactPopup();

  useEffect(() => setOpen(false), [pathname, hash]);

  return (
    <header className="sticky top-0 z-40 bg-hoadau shadow-[inset_0_-1px_0_var(--color-line-dark)]">
      {/* cao đúng --header-h (72px máy tính · 60px điện thoại/máy tính bảng · 52px máy ngang thấp); viền dưới vẽ bằng
          box-shadow, không cộng thêm chiều cao — lệch 1px làm điểm dừng cuộn theo section thành y=1 */}
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-3">
        <Wordmark />

        <nav aria-label={t('nav.main')} className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) =>
            item.to.startsWith('/#') ? (
              <Link key={item.to} to={item.to} title={menuSubtitle(item.to, lang)} className={navCls}>{item.label}</Link>
            ) : (
              <NavLink key={item.to} to={item.to} title={menuSubtitle(item.to, lang)} className={({ isActive }) => `${navCls} ${isActive ? '!text-on-dark-soft' : ''}`}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-4">
          <LangSwitch className="hidden sm:flex" />
          {/* nút Tư vấn: hiện cả trên điện thoại (gọn hơn) */}
          <button type="button" className="btn btn-solid min-h-10 px-4 sm:min-h-12 sm:px-7" onClick={() => popup.open('header')}
            data-track="cta_click" data-track-label="header_consult">
            {t('cta.consult')}
          </button>
          <button type="button" className="grid size-11 cursor-pointer place-items-center text-on-dark lg:hidden"
            aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t('menu.close') : t('menu.open')} onClick={() => setOpen((v) => !v)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label={t('nav.mobile')} className="max-h-[calc(100svh-var(--header-h)-var(--np-bar))] overflow-y-auto border-t border-line-dark bg-hoadau lg:hidden">
          <ul className="container-site flex flex-col py-4">
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={`${navCls} flex min-h-12 items-center border-b border-line-dark`}>{item.label}</Link>
              </li>
            ))}
            <li className="flex items-center justify-between pt-3 sm:hidden">
              <LangSwitch className="flex" />
            </li>
            <li className="pt-4">
              <button type="button" className="btn btn-solid w-full" onClick={() => { setOpen(false); popup.open('mobile_menu'); }}>{t('cta.register')}</button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
