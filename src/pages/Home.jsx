import { lazy, Suspense, useEffect, useRef } from 'react';
import { useInView } from '@/lib/motion';
import Hero from '@/sections/home/Hero';
import DesignStory from '@/sections/home/DesignStory';
import LandscapeStory from '@/sections/home/LandscapeStory';
import ProjectSpirit from '@/sections/home/ProjectSpirit';
import Facts from '@/sections/home/Facts';
import Location from '@/sections/home/Location';
import Lifestyle from '@/sections/home/Lifestyle';
import Blocks from '@/sections/home/Blocks';
import Residences from '@/sections/home/Residences';
import NewsPreview from '@/sections/home/NewsPreview';
import Register from '@/sections/home/Register';
import Developer from '@/sections/home/Developer';
import CalcTeaser from '@/sections/home/CalcTeaser';
import Faq from '@/sections/home/Faq';
import { cmsLayout } from '@/cms/content';
import { HOME_SECTIONS } from '@/cms/schema';

/* artwork bản đồ ~650 KB: tách thành chunk riêng, tải sau phần đầu trang */
const LocationMap = lazy(() => import('@/sections/home/LocationMap/LocationMap'));

/* chỉ tải chunk bản đồ khi người dùng cuộn tới gần (sớm ~1 màn hình) — giảm JS lúc tải trang, hiệu ứng vẽ path chạy khi thấy */
export function DeferredMap(props) {
  const ref = useRef(null);
  const near = useInView(ref, { rootMargin: '100% 0px', threshold: 0 });
  const fallback = <section ref={ref} id="position" className="bg-paper [height:clamp(640px,100svh,980px)]" aria-busy="true" />;
  if (!near) return fallback;
  return <Suspense fallback={fallback}><LocationMap {...props} /></Suspense>;
}

/* nối analytics (GA4 / GTM…) tại đây */
export const track = (ev, label) => window.dataLayer?.push({ event: 'locmap_' + ev, label });

/* trang chủ: mỗi lần lăn chuột chuyển section với thời gian chuyển động cố định */
function useSectionSnap() {
  useEffect(() => {
    const root = document.documentElement;
    const originalSnap = root.style.scrollSnapType;
    const originalBehavior = root.style.scrollBehavior;
    root.classList.add('np-snap');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const duration = 1200;
    let frame = 0;
    let locked = false;

    const onWheel = (event) => {
      if (reduceMotion.matches || !event.cancelable || Math.abs(event.deltaY) < 1 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target instanceof Element) {
        if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
        /* Bản đồ: chỉ nhường lăn chuột khi bản đồ đã được "đánh thức" (#lm.live — lăn để zoom), hoặc khi đang lăn
           trong danh sách của panel thông tin còn cuộn được. Bản đồ đang "ngủ" → chuyển section như mọi nơi khác
           (trước đây lăn trên bản đồ bị kẹt: không zoom, không sang section). */
        const lm = event.target.closest('#lm');
        if (lm) {
          if (lm.classList.contains('live')) return;
          const list = event.target.closest('.bd-body');
          if (list && (event.deltaY > 0
            ? list.scrollTop + list.clientHeight < list.scrollHeight - 1
            : list.scrollTop > 0)) return;
        }
      }
      if (locked) {
        event.preventDefault();
        return;
      }

      /* Điểm dừng = đầu section NẰM NGAY DƯỚI header dính (trùng điểm snap CSS: scroll-padding-top = header).
         Bản cũ cuộn tới mép trên tuyệt đối của section (bị header che 72px) rồi CSS snap kéo lại → mỗi section phải
         lăn 2 lần. Vùng nhìn thấy nội dung: từ đáy header tới đáy màn hình (trừ thanh liên hệ dưới đáy nếu có). */
      const headerH = document.querySelector('header')?.getBoundingClientRect().height || 0;
      const barH = parseFloat(getComputedStyle(root).getPropertyValue('--np-bar-h')) || 0;
      const viewTop = headerH;
      const viewBottom = window.innerHeight - barH;
      const sections = [...document.querySelectorAll('main > section')];
      const footer = document.querySelector('footer');
      const targets = [
        ...sections.map((element) => ({
          element,
          top: element.getBoundingClientRect().top + window.scrollY - headerH,
        })),
        ...(footer ? [{
          element: footer,
          top: footer.getBoundingClientRect().bottom + window.scrollY - window.innerHeight,
        }] : []),
      ];
      if (!targets.length) return;

      const center = (viewTop + viewBottom) / 2;
      let activeIndex = targets.findIndex(({ element }) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= center && rect.bottom > center;
      });
      if (activeIndex < 0) {
        activeIndex = targets.reduce((closest, target, index) =>
          Math.abs(target.top - window.scrollY) < Math.abs(targets[closest].top - window.scrollY) ? index : closest, 0);
      }

      /* section dài hơn khung (vd. mặt bằng trên màn thấp): cho cuộn tự do tới hết rồi mới chuyển section */
      const current = targets[activeIndex].element.getBoundingClientRect();
      if ((event.deltaY > 0 && current.bottom > viewBottom + 2) ||
          (event.deltaY < 0 && current.top < viewTop - 2)) return;

      const nextIndex = activeIndex + (event.deltaY > 0 ? 1 : -1);
      if (nextIndex < 0 || nextIndex >= targets.length) return;
      event.preventDefault();

      const from = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const to = Math.max(0, Math.min(targets[nextIndex].top, maxScroll));
      const start = performance.now();
      const previousSnap = root.style.scrollSnapType;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollSnapType = 'none';
      root.style.scrollBehavior = 'auto';
      locked = true;

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo(0, from + (to - from) * eased);
        if (progress < 1) {
          frame = requestAnimationFrame(animate);
          return;
        }
        root.style.scrollSnapType = previousSnap;
        root.style.scrollBehavior = previousBehavior;
        locked = false;
        frame = 0;
      };
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove('np-snap');
      root.style.scrollSnapType = originalSnap;
      root.style.scrollBehavior = originalBehavior;
    };
  }, []);
}

/* id section (khớp HOME_SECTIONS trong src/cms/schema.js) → component */
const COMPONENTS = {
  hero: Hero,
  'design-story': DesignStory,
  'landscape-story': LandscapeStory,
  story: ProjectSpirit,
  facts: Facts,
  location: Location,
  position: () => <DeferredMap onTrack={track} />,
  lifestyle: Lifestyle,
  blocks: Blocks,
  residences: Residences,
  news: NewsPreview,
  register: Register,
  developer: Developer,
  calc: CalcTeaser,
  faq: Faq,
};

/** Thứ tự section: theo CMS (section cố định giữ nguyên vị trí mặc định), bỏ section bị ẩn */
function homeOrder() {
  const ids = HOME_SECTIONS.map((s) => s.id);
  const locked = new Set(HOME_SECTIONS.filter((s) => s.locked).map((s) => s.id));
  const movable = [...cmsLayout.order.filter((id) => ids.includes(id) && !locked.has(id)), ...ids.filter((id) => !locked.has(id) && !cmsLayout.order.includes(id))];
  /* chèn lại section cố định vào đúng vị trí mặc định */
  const out = [];
  ids.forEach((id) => out.push(locked.has(id) ? id : movable.shift()));
  return out.filter((id) => locked.has(id) || !cmsLayout.hidden.has(id));
}

export default function Home() {
  useSectionSnap();
  return (
    <>
      {homeOrder().map((id) => {
        const Section = COMPONENTS[id];
        return Section ? <Section key={id} variant={cmsLayout.variants[id]} /> : null;
      })}
    </>
  );
}
