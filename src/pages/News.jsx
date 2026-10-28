import { useState } from 'react';
import { Link, useSite, useT } from '@/i18n';
import Media from '@/components/ui/Media';

export default function News() {
  const t = useT();
  const { newsCategories, posts } = useSite();
  const ALL = newsCategories[0];
  const [catIdx, setCatIdx] = useState(0);
  const cat = newsCategories[catIdx];
  const countOf = (c) => (c === ALL ? posts.length : posts.filter((p) => p.cat === c).length);
  const featured = posts.find((p) => p.featured);
  const list = posts.filter((p) => !p.featured && (cat === ALL || p.cat === cat));

  return (
    <>
      <section className="bg-cream pb-12 pt-16">
        <div className="container-site flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex gap-2.5 font-sub text-xs font-semibold tracking-[0.2em]">
            <Link to="/" className="no-underline">{t('np.home')}</Link><span aria-hidden="true">/</span><span aria-current="page">{t('np.crumb')}</span>
          </nav>
          <p className="eyebrow hero-in text-bronze-deep">{t('np.eyebrow')}</p>
          <h1 className="heading-1">{t('np.title')}</h1>
          <p className="m-0 max-w-2xl text-[17px] leading-relaxed">{t('np.intro')}</p>
        </div>
      </section>

      {featured && (
        <section className="pb-18">
          <div className="container-site">
            <article data-reveal="zoom" className="group grid overflow-hidden rounded-panel bg-hoadau text-on-dark lg:grid-cols-2">
              <Media src={featured.image} alt={featured.title} label={t('np.featuredImage')} tone="dark" className="min-h-[380px]"
                sizes="(min-width: 1024px) 42vw, 100vw" />
              <div className="flex flex-col justify-center gap-4.5 p-[clamp(1.5rem,4vw,3.5rem)]">
                <p className="eyebrow text-on-dark-soft">{t('np.featured')}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <span className="eyebrow text-xs text-on-dark-soft">{featured.cat}</span>
                  <span className="eyebrow text-xs">{featured.date} · {featured.src}</span>
                </div>
                <h2 className="heading-3 !text-[clamp(1.8rem,3vw,2.6rem)]">{featured.title}</h2>
                <p className="m-0 leading-relaxed text-stone">{featured.body}</p>
                <div><a href="#list" className="btn btn-ghost-light">{t('np.readOn', { src: featured.src })}</a></div>
              </div>
            </article>
          </div>
        </section>
      )}

      <section id="list" className="bg-ivory pb-24 pt-18">
        <div className="container-site flex flex-col gap-8">
          <div role="tablist" aria-label={t('np.cats')} className="flex flex-wrap gap-2">
            {newsCategories.map((c, i) => (
              <button key={c} type="button" role="tab" className="chip" aria-selected={i === catIdx} onClick={() => setCatIdx(i)}>
                {c}<span className="text-xs opacity-75">{countOf(c)}</span>
              </button>
            ))}
          </div>
          <p className="eyebrow text-ink-soft">{t('np.count', { n: countOf(cat) })}</p>

          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-panel border border-dashed border-line-strong px-6 py-16 text-center">
              <p className="heading-3">{t('np.empty')}</p>
              <p className="m-0 text-ink-soft">{t('np.emptyHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,21rem),1fr))] gap-x-6 gap-y-8">
              {list.map((p, i) => (
                /* subgrid 6 dòng (ảnh · chuyên mục · nguồn · tiêu đề · tóm tắt · liên kết): tiêu đề dài ngắn khác nhau
                   thì tóm tắt và liên kết của các thẻ cùng hàng vẫn thẳng hàng, chung mép trên */
                <article key={p.title} data-reveal="up" style={{ '--reveal-i': i % 3 }} className="group row-span-6 grid grid-rows-subgrid content-start gap-y-3.5">
                  <Media src={p.image} alt={p.title} label={t('news.image')} className="aspect-[16/10] rounded-card" sizes="(min-width: 1024px) 27vw, 100vw" />
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    <span className="eyebrow text-xs text-bronze-deep">{p.cat}</span>
                    <span className="eyebrow text-xs text-ink-soft">{p.date}</span>
                  </div>
                  <p className="eyebrow text-xs text-hoadau">{p.src}</p>
                  <h3 className="heading-3">{p.title}</h3>
                  <p className="m-0 leading-relaxed text-ink-soft">{p.body}</p>
                  <a href="#list" className="inline-flex min-h-11 items-center font-sub text-xs font-semibold uppercase tracking-[0.16em] no-underline">{t('np.readOn', { src: p.src })}</a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="container-site flex flex-wrap items-center justify-between gap-6">
          <div data-reveal="left" className="flex max-w-2xl flex-col gap-3">
            <h2 className="heading-2">{t('np.ctaTitle')}</h2>
            <p className="m-0 leading-relaxed">{t('np.ctaBody')}</p>
          </div>
          <Link to="/#register" data-reveal="right" className="btn btn-solid">{t('cta.register')}</Link>
        </div>
      </section>
    </>
  );
}
