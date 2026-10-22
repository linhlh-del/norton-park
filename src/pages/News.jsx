import { useState } from 'react';
import { Link } from 'react-router-dom';
import { newsCategories, posts } from '@/data/site';
import Media from '@/components/ui/Media';

const countOf = (cat) => (cat === 'Tất cả' ? posts.length : posts.filter((p) => p.cat === cat).length);

export default function News() {
  const [cat, setCat] = useState('Tất cả');
  const featured = posts.find((p) => p.featured);
  const list = posts.filter((p) => !p.featured && (cat === 'Tất cả' || p.cat === cat));

  return (
    <>
      <section className="bg-cream pb-12 pt-16">
        <div className="container-site flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex gap-2.5 font-sub text-[11px] font-semibold tracking-[0.2em]">
            <Link to="/" className="no-underline">TRANG CHỦ</Link><span aria-hidden="true">/</span><span aria-current="page">TIN TỨC</span>
          </nav>
          <p className="eyebrow hero-in text-bronze-deep">Tin tức &amp; cập nhật</p>
          <h1 className="heading-1">Những chuyển động mới tại Norton Park</h1>
          <p className="m-0 max-w-2xl text-[17px] leading-relaxed">Tin dự án, tiến độ và pháp lý, hạ tầng khu vực cùng góc nhìn thị trường — cập nhật thường xuyên.</p>
        </div>
      </section>

      {featured && (
        <section className="pb-18">
          <div className="container-site">
            <article data-reveal="zoom" className="grid overflow-hidden rounded-panel bg-hoadau text-on-dark lg:grid-cols-2">
              <Media label="Ảnh bài nổi bật" tone="dark" className="min-h-[380px]" />
              <div className="flex flex-col justify-center gap-4.5 p-[clamp(1.5rem,4vw,3.5rem)]">
                <p className="eyebrow text-on-dark-soft">Bài nổi bật</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <span className="eyebrow text-[10px] text-on-dark-soft">{featured.cat}</span>
                  <span className="eyebrow text-[10px]">{featured.date} · {featured.src}</span>
                </div>
                <h2 className="heading-3 !text-[clamp(1.8rem,3vw,2.6rem)]">{featured.title}</h2>
                <p className="m-0 leading-relaxed text-stone">{featured.body}</p>
                <div><a href="#list" className="btn btn-ghost-light">Đọc trên {featured.src} ↗</a></div>
              </div>
            </article>
          </div>
        </section>
      )}

      <section id="list" className="bg-ivory pb-24 pt-18">
        <div className="container-site flex flex-col gap-8">
          <div role="tablist" aria-label="Chuyên mục" className="flex flex-wrap gap-2">
            {newsCategories.map((c) => (
              <button key={c} type="button" role="tab" className="chip" aria-selected={c === cat} onClick={() => setCat(c)}>
                {c}<span className="text-xs opacity-75">{countOf(c)}</span>
              </button>
            ))}
          </div>
          <p className="eyebrow text-ink-soft">{countOf(cat)} bài viết</p>

          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-panel border border-dashed border-line-strong px-6 py-16 text-center">
              <p className="heading-3">Chưa có bài viết trong chuyên mục này</p>
              <p className="m-0 text-ink-soft">Các cập nhật mới sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,21rem),1fr))] gap-x-6 gap-y-8">
              {list.map((p, i) => (
                <article key={p.title} data-reveal="up" style={{ '--reveal-i': i % 3 }} className="flex flex-col gap-3.5">
                  <Media label="Ảnh bài viết" className="aspect-[16/10] rounded-card" sizes="(min-width: 1024px) 27vw, 100vw" />
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    <span className="eyebrow text-[10px] text-bronze-deep">{p.cat}</span>
                    <span className="eyebrow text-[10px] text-ink-soft">{p.date}</span>
                  </div>
                  <p className="eyebrow text-[10px] text-hoadau">{p.src}</p>
                  <h3 className="heading-3">{p.title}</h3>
                  <p className="m-0 leading-relaxed text-ink-soft">{p.body}</p>
                  <a href="#list" className="inline-flex min-h-11 items-center font-sub text-[11px] font-semibold uppercase tracking-[0.16em] no-underline">Đọc trên {p.src} ↗</a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="container-site flex flex-wrap items-center justify-between gap-6">
          <div data-reveal="left" className="flex max-w-2xl flex-col gap-3">
            <h2 className="heading-2">Đăng ký tư vấn</h2>
            <p className="m-0 leading-relaxed">Nhận bộ tài liệu dự án và lịch tư vấn sau khi để lại thông tin.</p>
          </div>
          <Link to="/#register" data-reveal="right" className="btn btn-solid">Đăng ký tư vấn</Link>
        </div>
      </section>
    </>
  );
}
