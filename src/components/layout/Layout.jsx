import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import FloatingButtons from './FloatingButtons';
import ValueNav from './ValueNav';
import { useT } from '@/i18n';
import { ContactPopupProvider } from '@/components/popup/ContactPopup';
import useRevealObserver from '@/components/motion/useRevealObserver';
import Seo from '@/components/seo/Seo';

/* cuộn tới #anchor khi đổi trang hoặc bấm liên kết dạng "/#register" — theo dõi cả location.key để bấm lại
   cùng một CTA (URL không đổi) vẫn cuộn tới section */
function useScrollToHash() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = decodeURIComponent(hash.slice(1));
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 0);
    return () => clearTimeout(t);
  }, [pathname, hash, key]);
}

export default function Layout() {
  useScrollToHash();
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
