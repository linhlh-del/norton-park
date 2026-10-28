import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link, useSite, useT } from '@/i18n';
import FloorPlans from '@/components/ui/FloorPlans';
import CountUp from '@/components/motion/CountUp';
import ContactFields from '@/components/forms/ContactFields';
import ContactPanel from '@/components/ContactPanel';
import useLeadSubmit from '@/hooks/useLeadSubmit';


const Stat =({ value, label, i }) => (
  <div data-reveal="up" style={{ '--reveal-i': i }}>
    <div className="font-display text-[52px] leading-none"><CountUp value={value} /></div>
    <p className="eyebrow mt-2 text-xs text-on-dark-soft">{label}</p>
  </div>
);

export default function Calculator() {
  const t = useT();
  const { GLOBAL, SPECIAL, PRICE_PER_M2, collections, contact, layoutsOf, m2, money, priceTypes } = useSite();
  const groups = [
    { title: GLOBAL, items: priceTypes.map((p, i) => ({ p, i })).filter(({ p }) => p.col === GLOBAL) },
    { title: SPECIAL, items: priceTypes.map((p, i) => ({ p, i })).filter(({ p }) => p.col === SPECIAL) },
  ];
  /* mặt bằng minh hoạ theo loại căn (ảnh trong public/images/canho, khai báo ở collections) */
  const plansOf = (name) => collections.flatMap((c) => c.units).find((u) => u.name === name)?.plans;
  const [params] = useSearchParams();
  const initial = Math.min(priceTypes.length - 1, Math.max(0, Number(params.get('loai')) || 0));
  const [typeIdx, setTypeIdx] = useState(initial);
  const [layoutIdx, setLayoutIdx] = useState(0);
  const quote = useLeadSubmit('quote');

  const type = priceTypes[typeIdx];
  const layouts = useMemo(() => layoutsOf(type), [type]);
  const layout = layouts[layoutIdx] || layouts[0];
  const price = type.priced ? money(layout.gfa * PRICE_PER_M2) : t('pc.contactPrice');

  const pickType = (i) => { setTypeIdx(i); setLayoutIdx(0); };

  return (
    <>
      {/* giới thiệu */}
      <section className="bg-hoadau pb-20 pt-24 text-on-dark">
        <div className="container-site flex flex-col gap-7">
          <p className="eyebrow hero-in text-on-dark-soft">{t('pc.eyebrow')}</p>
          <h1 className="heading-1 max-w-5xl">{t('pc.h1a')} <em>{t('pc.h1b')}</em></h1>
          <p className="m-0 max-w-3xl text-[17px] leading-relaxed text-stone">
            {t('pc.intro')}
          </p>
          <div className="grid max-w-3xl grid-cols-[repeat(auto-fit,minmax(min(100%,12.5rem),1fr))] gap-6 border-t border-line-dark pt-8">
            <Stat i={0} value="9" label={t('pc.stat1')} />
            <Stat i={1} value="63" label={t('pc.stat2')} />
            <Stat i={2} value="95%" label={t('pc.stat3')} />
          </div>
          <div className="flex flex-wrap gap-3.5">
            <a href="#tool" className="btn btn-solid">{t('pc.start')}</a>
            <a href="#quote" className="btn btn-ghost-light">{t('pc.quote')}</a>
          </div>
        </div>
      </section>

      {/* bảng thông số */}
      <section className="bg-ivory py-24">
        <div className="container-site flex flex-col gap-8">
          <h2 data-reveal="up" className="heading-2 max-w-4xl">{t('pc.tableTitle')}</h2>
          <div data-reveal="up" style={{ '--reveal-i': 1 }} className="overflow-x-auto rounded-card border border-line">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="font-sub text-xs uppercase tracking-[0.18em] text-ink-soft">
                  {[t('pc.th.type'), t('pc.th.col'), 'GFA (m²)', 'NSA (m²)', t('pc.th.price')].map((h) => (
                    <th key={h} scope="col" className="border-b border-line px-4 py-3.5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {priceTypes.map((p) => (
                  <tr key={p.name}>
                    <td className="border-b border-line px-4 py-3.5 font-display text-xl">{p.name}</td>
                    <td className="border-b border-line px-4 py-3.5">{p.col}</td>
                    <td className="border-b border-line px-4 py-3.5">{p.gfa}</td>
                    <td className="border-b border-line px-4 py-3.5">{p.nsa}</td>
                    <td className="border-b border-line px-4 py-3.5 font-medium">{p.priced ? t('pc.fromPrice') : t('pc.contactPrice')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* công cụ */}
      <section id="tool" className="bg-cream py-24">
        <div className="container-site flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex flex-col gap-3">
              <h2 data-reveal="up" className="heading-2">{t('pc.toolTitle')}</h2>
              <p className="m-0 leading-relaxed">{t('pc.toolIntro')}</p>
            </div>
            {/* về trang chủ để xem lại vị trí, tiện ích, mặt bằng rồi chọn căn khác */}
            <Link to="/#residences" title={t('pc.backHint')} className="btn btn-ghost" data-track="cta_click" data-track-label="calc_back_home">
              <span aria-hidden="true">←</span> {t('pc.backHome')}
            </Link>
          </div>
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-2.5">
              <p className="eyebrow text-bronze-deep">{g.title}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map(({ p, i }) => (
                  <button key={p.name} type="button" className="chip" aria-pressed={i === typeIdx} onClick={() => pickType(i)}>{p.name}</button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-start gap-6">
            <div data-reveal="left" className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 rounded-panel bg-white p-[clamp(1.25rem,3vw,2.5rem)]">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col gap-2.5">
                  <FloorPlans key={type.name} plans={plansOf(type.name)} name={type.name} sizes="(min-width: 768px) 30vw, 100vw" />
                  <p className="m-0 text-[13px] leading-relaxed text-ink-soft">{t('pc.planNote')}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="eyebrow text-bronze-deep">{type.col}</p>
                  <h3 className="heading-2">{type.name}</h3>
                  <p className="eyebrow tracking-[0.2em] text-ink-soft">{type.rooms}</p>
                  {/* subgrid: nhãn xuống 2 dòng ở ô nào thì số liệu cả 3 ô vẫn cùng một hàng */}
                  <dl className="m-0 grid grid-cols-3 gap-x-4 border-t border-line pt-4">
                    {[[t('pc.count'), type.count], [t('pc.gfaFrom'), m2(layouts[0].gfa)], [t('pc.nsaFrom'), m2(Math.min(...layouts.map((l) => l.nsa)))]].map(([k, v]) => (
                      <div key={k} className="row-span-2 grid grid-rows-subgrid gap-y-1.5">
                        <dt className="eyebrow self-start text-[9px] tracking-[0.14em] text-ink-soft">{k}</dt>
                        <dd className="m-0 self-start font-display text-[28px] leading-tight"><CountUp value={String(v)} duration={1300} /></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className="eyebrow mb-2 text-hoadau">{t('pc.pickLayout')}</legend>
                <p className="m-0 text-[13px] text-ink-soft">{t('pc.suffix')}</p>
                <div className="mt-2 grid grid-cols-[1fr_1fr_1fr_2fr] gap-3 px-4 py-2.5 font-sub text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-soft" aria-hidden="true">
                  <span>Layout</span><span>{t('pc.col.gfa')}</span><span>{t('pc.col.nsa')}</span><span>{t('pc.col.view')}</span>
                </div>
                {layouts.map((l, i) => (
                  <label key={l.code} className={`grid min-h-13 cursor-pointer grid-cols-[1fr_1fr_1fr_2fr] items-center gap-3 rounded-lg border px-4 py-3 text-sm ${i === layoutIdx ? 'border-bronze-deep bg-bronze/15' : 'border-transparent border-t-line'}`}>
                    <input type="radio" name="layout" className="sr-only" checked={i === layoutIdx} onChange={() => setLayoutIdx(i)} />
                    <span className="font-medium">{l.code}</span><span>{m2(l.gfa)}</span><span>{m2(l.nsa)}</span><span className="text-ink-soft">{l.view}</span>
                  </label>
                ))}
              </fieldset>
            </div>

            <aside data-reveal="right" className="@container flex min-w-0 flex-[1_1_340px] flex-col gap-4.5 rounded-panel bg-hoadau p-[clamp(1.5rem,3vw,2.25rem)] text-on-dark" aria-live="polite">
              <p className="eyebrow text-on-dark-soft">{t('pc.estimate')}</p>
              {/* giá luôn 1 dòng: cỡ chữ theo bề rộng panel (cqw), tối đa 3rem */}
              <div className="whitespace-nowrap font-display text-[clamp(1.5rem,10.5cqw,3rem)] leading-tight"><CountUp value={price} duration={1300} /></div>
              <p className="m-0 text-on-dark-soft">{type.name} · {layout.code}</p>
              <dl className="m-0 flex flex-col">
                {[[t('res.gfa'), m2(layout.gfa)], [t('res.nsa'), m2(layout.nsa)], [t('res.view'), layout.view], [t('pc.units'), layout.units]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-t border-line-dark py-3 last:border-b">
                    <dt className="text-on-dark-soft">{k}</dt><dd className="m-0 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="#quote" className="btn btn-light">{t('pc.quote')}</a>
              <a href={contact.hotlineHref} className="btn btn-ghost-light">{t('pc.call', { phone: contact.hotline })}</a>
              <p data-nosnippet className="m-0 text-xs leading-relaxed text-on-dark-soft">
                {t('pc.disclaimer')}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* báo giá */}
      <section id="quote" className="bg-sand py-24">
        <div className="container-site grid items-start gap-8 lg:grid-cols-2">
          <div data-reveal="left" className="flex flex-col gap-5 rounded-panel bg-ivory p-6 sm:p-12">
            <p className="eyebrow text-bronze-deep">{t('pc.q.eyebrow')}</p>
            <h2 className="heading-2">{t('pc.q.title')}</h2>
            <p className="m-0 leading-relaxed">{t('pc.q.intro')}</p>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-cream p-4">
              <div>
                <p className="eyebrow text-ink-soft">{t('pc.q.selected')}</p>
                <p className="m-0 mt-1.5 font-medium">{type.name} · {layout.code}</p>
              </div>
              <a href="#tool" className="inline-flex min-h-11 items-center font-sub text-xs font-semibold tracking-[0.16em]">{t('pc.q.change')}</a>
            </div>
            {/* gửi thành công → trang cảm ơn /cam-on */}
            <form className="relative flex flex-col gap-4.5" onSubmit={(e) => {
              e.preventDefault();
              const fd = Object.fromEntries(new FormData(e.currentTarget));
              quote.send({ name: fd.name, phone: fd.phone, email: fd.email, unitType: type.name, layout: layout.code, website: fd.website });
            }}>
              <ContactFields />
              {quote.error && <p role="alert" className="m-0 text-sm text-[#b3412e]">{quote.error}</p>}
              <div>
                <button type="submit" className="btn btn-solid" disabled={quote.status === 'sending'}>
                  {quote.status === 'sending' ? t('sending') : t('pc.q.submit')}
                </button>
              </div>
            </form>
          </div>
          <div data-reveal="right" style={{ '--reveal-i': 1 }}><ContactPanel /></div>
        </div>
      </section>

    </>
  );
}
