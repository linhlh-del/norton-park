import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { mainNav } from '@/data/site';
import { menuSubtitle } from '@/seo/site-meta';
import Wordmark from '@/components/ui/Wordmark';
import { CloseIcon, MenuIcon } from '@/components/ui/Icons';
import { useContactPopup } from '@/components/popup/ContactPopup';

const navCls = 'font-sub text-xs font-medium uppercase tracking-[0.14em] text-on-dark no-underline hover:text-on-dark-soft';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('vi');
  const { pathname, hash } = useLocation();
  const popup = useContactPopup();

  useEffect(() => setOpen(false), [pathname, hash]);

  return (
    <header className="sticky top-0 z-40 border-b border-line-dark bg-hoadau">
      <div className="container-site flex min-h-[72px] items-center justify-between gap-4 py-3">
        <Wordmark />

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) =>
            item.to.startsWith('/#') ? (
              <Link key={item.to} to={item.to} title={menuSubtitle(item.to)} className={navCls}>{item.label}</Link>
            ) : (
              <NavLink key={item.to} to={item.to} title={menuSubtitle(item.to)} className={({ isActive }) => `${navCls} ${isActive ? '!text-on-dark-soft' : ''}`}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden font-sub text-xs tracking-[0.12em] sm:flex">
            {['vi', 'en'].map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}
                className={`size-11 cursor-pointer uppercase ${lang === l ? 'text-on-dark underline underline-offset-4' : 'text-on-dark-soft'}`}>
                {l}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-ghost-light hidden sm:inline-flex" onClick={() => popup.open('header')}>Tư vấn</button>
          <button type="button" className="grid size-11 cursor-pointer place-items-center text-on-dark lg:hidden"
            aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Đóng menu' : 'Mở menu'} onClick={() => setOpen((v) => !v)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Điều hướng di động" className="border-t border-line-dark bg-hoadau lg:hidden">
          <ul className="container-site flex flex-col py-4">
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={`${navCls} flex min-h-12 items-center border-b border-line-dark`}>{item.label}</Link>
              </li>
            ))}
            <li className="pt-4">
              <button type="button" className="btn btn-solid w-full" onClick={() => { setOpen(false); popup.open('mobile_menu'); }}>Đăng ký tư vấn</button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
