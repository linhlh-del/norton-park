import { Link, useLang, useT } from '@/i18n';
import { pageMeta, pages, topicPaths } from '@/seo/site-meta';
import { DeferredMap, track } from '@/pages/Home';
import Location from '@/sections/home/Location';
import Facts from '@/sections/home/Facts';
import LandscapeStory from '@/sections/home/LandscapeStory';
import ProjectSpirit from '@/sections/home/ProjectSpirit';
import Lifestyle from '@/sections/home/Lifestyle';
import Blocks from '@/sections/home/Blocks';
import Residences from '@/sections/home/Residences';
import CalcTeaser from '@/sections/home/CalcTeaser';
import Register from '@/sections/home/Register';

/* Section tái sử dụng từ trang chủ cho từng trang con */
const SECTIONS = {
  '/vi-tri': () => (<><Location /><DeferredMap onTrack={track} /><Facts /></>),
  '/tien-ich': () => (<><LandscapeStory /><ProjectSpirit /><Lifestyle /></>),
  '/mat-bang': () => (<><Blocks /><Residences /><CalcTeaser /></>),
};

/**
 * Trang con theo nhóm từ khoá ngách (/vi-tri, /tien-ich, /mat-bang và bản /en).
 * Title / description / canonical / JSON-LD lấy từ pages[path] (src/seo/site-meta.js) — mỗi trang một <h1> riêng.
 */
export default function Topic({ path }) {
  const t = useT();
  const lang = useLang();
  const p = pageMeta(pages[path], lang);
  const Body = SECTIONS[path];
  return (
    <>
      {/* giới thiệu: breadcrumb + H1 + đoạn dẫn */}
      <section className="bg-hoadau pb-20 pt-24 text-on-dark">
        <div className="container-site flex flex-col gap-7">
          <nav aria-label="Breadcrumb" className="eyebrow hero-in text-on-dark-soft">
            <Link to="/" className="text-on-dark-soft no-underline hover:text-on-dark">{t('home')}</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span aria-current="page">{p.breadcrumb}</span>
          </nav>
          <h1 className="heading-2 max-w-5xl">{p.h1}</h1>
          {p.intro.map((text) => (
            <p key={text} className="m-0 max-w-3xl text-[17px] leading-relaxed text-stone">{text}</p>
          ))}
        </div>
      </section>

      <Body />
      <Register />

      {/* liên kết nội bộ tới các trang con khác + bảng tính giá */}
      <nav aria-label={t('values.nav')} className="bg-ivory py-12">
        <div className="container-site flex flex-wrap gap-3">
          {topicPaths.filter((x) => x !== path).map((x) => (
            <Link key={x} to={x} className="btn btn-ghost">{pageMeta(pages[x], lang).breadcrumb} Norton Park</Link>
          ))}
          <Link to="/bang-tinh-gia" className="btn btn-solid">{pageMeta(pages['/bang-tinh-gia'], lang).breadcrumb}</Link>
        </div>
      </nav>
    </>
  );
}
