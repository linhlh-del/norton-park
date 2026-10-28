import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import FloatingButtons from './FloatingButtons';
import ValueNav from './ValueNav';
import { langFromPath, localizePath, stripLang, useT } from '@/i18n';
import { sectionForPath, urlForSection } from '@/lib/sections';
import { ContactPopupProvider } from '@/components/popup/ContactPopup';
import useRevealObserver from '@/components/motion/useRevealObserver';
import Seo from '@/components/seo/Seo';

/* Cuộn tới section khi vào đường dẫn section (/dang-ky, /en/ban-do…) hoặc bấm lại cùng một CTA (location.key đổi);
   trang khác → về đầu trang. Liên kết cũ dạng "/#register" (đã chia sẻ / quảng cáo) → chuyển sang URL mới.
   Mở thẳng link: trong ~2,5s đầu bố cục còn đổi (bản đồ, ảnh, font) → căn lại section dưới header mỗi lần đổi,
   dừng ngay khi người dùng tự cuộn / chạm / gõ phím. */
function useScrollToSection() {
  const { pathname, hash, key } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const lang = langFromPath(pathname);
    const base = stripLang(pathname.replace(/\/+$/, '') || '/');
    const fromHash = hash ? decodeURIComponent(hash.slice(1)) : '';
    if (fromHash && base === '/') {
      const url = urlForSection(fromHash);
      if (url) { navigate(localizePath(url, lang), { replace: true }); return undefined; }
    }
    const id = sectionForPath(base) || fromHash;
    if (!id) { window.scrollTo(0, 0); return undefined; }
    const el = () => document.getElementById(id);
    const t = setTimeout(() => el()?.scrollIntoView({ block: 'start' }), 0);
    let stop = false;
    const header = () => document.querySelector('header')?.getBoundingClientRect().height || 0;
    const ro = new ResizeObserver(() => requestAnimationFrame(() => {
      const target = el();
      if (!stop && target && Math.abs(target.getBoundingClientRect().top - header()) > 2) target.scrollIntoView({ block: 'start' });
    }));
    ro.observe(document.getElementById('main') || document.body);
    const quit = () => { stop = true; ro.disconnect(); };
    const timer = setTimeout(quit, 2500);
    const evs = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    evs.forEach((ev) => window.addEventListener(ev, quit, { passive: true, once: true }));
    return () => { clearTimeout(t); clearTimeout(timer); quit(); evs.forEach((ev) => window.removeEventListener(ev, quit)); };
  }, [pathname, hash, key, navigate]);
}

export default function Layout() {
  useScrollToSection();
  useRevealObserver();
  const t = useT();
  return (
    <ContactPopupProvider autoOpenMs={25000}>
      <Seo />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ivory focus:px-4 focus:py-2">
        {t('skip')}
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      {/* chừa chỗ cho thanh CTA dưới đáy trên điện thoại / máy tính bảng */}
      <div aria-hidden="true" className="h-[var(--np-bar)] bg-hoadau-deep lg:hidden" />
      <ValueNav />
      <FloatingButtons />
    </ContactPopupProvider>
  );
}
