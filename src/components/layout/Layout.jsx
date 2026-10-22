import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import FloatingContacts from './FloatingContacts';
import { ContactPopupProvider } from '@/components/popup/ContactPopup';
import useRevealObserver from '@/components/motion/useRevealObserver';
import Seo from '@/components/seo/Seo';

/* cuộn tới #anchor khi đổi trang hoặc bấm liên kết dạng "/#register" */
function useScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = decodeURIComponent(hash.slice(1));
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 0);
    return () => clearTimeout(t);
  }, [pathname, hash]);
}

export default function Layout() {
  useScrollToHash();
  useRevealObserver();
  return (
    <ContactPopupProvider autoOpenMs={8000}>
      <Seo />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ivory focus:px-4 focus:py-2">
        Bỏ qua tới nội dung
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
      <FloatingContacts />
    </ContactPopupProvider>
  );
}
