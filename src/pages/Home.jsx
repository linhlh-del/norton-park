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

/* artwork bản đồ ~650 KB: tách thành chunk riêng, tải sau phần đầu trang */
const LocationMap = lazy(() => import('@/sections/home/LocationMap/LocationMap'));

/* chỉ tải chunk bản đồ khi người dùng cuộn tới gần (sớm ~1 màn hình) — giảm JS lúc tải trang, hiệu ứng vẽ path chạy khi thấy */
function DeferredMap(props) {
  const ref = useRef(null);
  const near = useInView(ref, { rootMargin: '100% 0px', threshold: 0 });
  const fallback = <section ref={ref} id="position" className="bg-paper [height:clamp(640px,100svh,980px)]" aria-busy="true" />;
  if (!near) return fallback;
  return <Suspense fallback={fallback}><LocationMap {...props} /></Suspense>;
}

/* nối analytics (GA4 / GTM…) tại đây */
const track = (ev, label) => window.dataLayer?.push({ event: 'locmap_' + ev, label });

/* trang chủ: mỗi lần vuốt / lăn chuột chuyển đúng một section (CSS: html.np-snap trong index.css) */
function useSectionSnap() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('np-snap');
    return () => root.classList.remove('np-snap');
  }, []);
}

export default function Home() {
  useSectionSnap();
  return (
    <>
      <Hero />
      <DesignStory />
      <LandscapeStory />
      <ProjectSpirit />
      <Facts />
      <Location />
      <DeferredMap onTrack={track} />
      <Lifestyle />
      <Blocks />
      <Residences />
      <NewsPreview />
      <Register />
      <Developer />
      <CalcTeaser />
      <Faq />
    </>
  );
}
