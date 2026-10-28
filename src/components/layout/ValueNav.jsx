import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useSite, useT } from '@/i18n';
import { useContactPopup } from '@/components/popup/ContactPopup';

/**
 * CTA cố định tới các giá trị chính của landing page:
 *  - điện thoại / máy tính bảng (< 1024px): thanh sticky 3 nút dưới đáy — Gọi hotline | Chat Zalo | Nhận bảng giá
 *    (Layout chừa khoảng trống cùng chiều cao để thanh không che nội dung cuối trang)
 *  - máy tính: cột nhãn dọc mép trái, hiện sau khi qua hero, tô đậm section đang xem
 * Thứ tự ưu tiên: Vị trí (bản đồ) → Tiện ích → Mặt bằng → Bảng giá → Tư vấn (form).
 */
const ITEMS = [
  { key: 'map', to: '/#position', id: 'position', icon: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z' },
  { key: 'amenities', to: '/#lifestyle', id: 'lifestyle', icon: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z' },
  { key: 'residences', to: '/#residences', id: 'residences', icon: 'M4 4h16v16H4zM4 12h9M13 4v16M13 9h7' },
  { key: 'price', to: '/bang-tinh-gia', id: null, icon: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6' },
];

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

/* section đang nằm giữa màn hình (chỉ trên trang chủ). Tra lại getElementById mỗi nhịp cuộn vì bản đồ được
   gắn trễ (thay phần tử giữ chỗ) và để đúng khi chuyển trang. */
function useActiveSection(ids, pathname) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      const hit = ids.find((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r && r.top <= mid && r.bottom >= mid;
      });
      setActive(hit || null);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [ids, pathname]);
  return active;
}

function usePastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => { frame = 0; setPast(window.scrollY > window.innerHeight * 0.6); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return past;
}

const PHONE = 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2';
/* cao đúng --np-bar-h (trừ viền 1px) để khung hình --np-screen tính chính xác; máy ngang thấp: icon + chữ nằm ngang */
const barItem = 'flex h-[calc(var(--np-bar-h)-1px)] flex-col items-center justify-center gap-1 font-sub text-xs font-semibold uppercase tracking-[0.06em] no-underline [@media(max-height:31.25rem)]:flex-row [@media(max-height:31.25rem)]:gap-2';

const IDS = ITEMS.map((i) => i.id).filter(Boolean);

export default function ValueNav() {
  const t = useT();
  const { pathname } = useLocation();
  const popup = useContactPopup();
  const { contact } = useSite();
  const active = useActiveSection(IDS, pathname);
  const pastHero = usePastHero();

  return (
    <>
      {/* điện thoại / máy tính bảng: thanh sticky Gọi | Zalo | Nhận bảng giá */}
      <nav aria-label={t('values.quick')}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-hoadau/95 pb-[env(safe-area-inset-bottom)] text-on-dark lg:hidden">
        <ul className="m-0 grid list-none grid-cols-3 p-0">
          <li>
            <a href={contact.hotlineHref} data-track="sticky_bar" data-track-label="call" aria-label={t('fb.call', { phone: contact.hotline })}
              className={`${barItem} text-on-dark`}>
              <Icon d={PHONE} />
              {t('values.call')}
            </a>
          </li>
          <li>
            <a href={contact.zaloUrl} target="_blank" rel="noopener" data-track="sticky_bar" data-track-label="zalo" aria-label={t('fb.zalo')}
              className={`${barItem} border-x border-line-dark text-on-dark`}>
              <img src="/images/logo-zalo.webp" alt="" width="20" height="20" className="size-5 object-contain" />
              {t('values.zalo')}
            </a>
          </li>
          <li>
            <button type="button" onClick={() => popup.open('sticky_price')} data-track="sticky_bar" data-track-label="price"
              className={`btn-cta ${barItem} h-full w-full cursor-pointer border-0 bg-bronze-deep text-ivory`}>
              <Icon d={ITEMS.find((i) => i.key === 'price').icon} />
              {t('form.getPrice')}
            </button>
          </li>
        </ul>
      </nav>

      {/* máy tính: cột nhãn dọc mép trái, hiện sau hero */}
      <nav aria-label={t('values.nav')}
        className={`fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 transition-all duration-700 xl:block ${pastHero && active !== 'position' ? 'opacity-100' : 'pointer-events-none -translate-x-4 opacity-0'}`}>
        {/* chỉ từ 1280px: ở 1024–1279px khung nội dung sát mép, cột icon sẽ đè lên chữ.
            items-start: mỗi nút chỉ rộng bằng biểu tượng (không bị kéo giãn theo nút rộng nhất) */}
        <ul className="m-0 flex list-none flex-col items-start gap-1.5 p-0">
          {ITEMS.map((it) => (
            <li key={it.key}>
              <Link to={it.to} data-track="value_nav" data-track-label={it.key} aria-label={t(`values.${it.key}`)}
                aria-current={active === it.id ? 'true' : undefined} tabIndex={pastHero ? 0 : -1}
                className={`group relative grid size-10 place-items-center rounded-full border no-underline shadow-float transition-colors ${active === it.id ? 'border-bronze-deep bg-bronze-deep text-ivory' : 'border-line bg-ivory/90 text-hoadau hover:bg-ivory'}`}>
                <Icon d={it.icon} />
                {/* nhãn: chỉ hiện khi rê chuột / focus bàn phím, nổi bên phải, không chiếm chỗ */}
                <span aria-hidden="true"
                  className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-hoadau px-3 py-1.5 font-sub text-xs font-semibold uppercase tracking-[0.12em] text-ivory opacity-0 shadow-float transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {t(`values.${it.key}`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
