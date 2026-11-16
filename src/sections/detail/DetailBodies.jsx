/* Thân các trang chi tiết (/tong-quan, /gia-ban, /chinh-sach-ban-hang, /chu-dau-tu, /tien-do, /hoi-dap).
   Nội dung: src/data/details.js (vi + en). Section dùng lại từ trang chủ được ghép ở src/pages/Topic.jsx. */
import { Link, useLang, useSite } from '@/i18n';
import { details, fullFaq } from '@/data/details';
import { PRICE_PER_M2 } from '@/data/site';
import { useContactPopup } from '@/components/popup/ContactPopup';

const useDetails = () => details[useLang()] || details.vi;

/* tỷ đồng, 2 chữ số thập phân: 2.779.920.000 → "2,78 tỷ" / "VND 2.78 bn" */
function billions(vnd, lang) {
  const n = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(vnd / 1e9);
  return lang === 'en' ? `VND ${n} bn` : `${n} tỷ`;
}

function Block({ title, tone = 'ivory', children, id }) {
  return (
    <section id={id} className={`${tone === 'cream' ? 'bg-cream' : 'bg-ivory'} py-[clamp(3rem,9svh,6rem)]`}>
      <div className="container-site flex flex-col gap-8">
        {title && <h2 className="heading-3 m-0">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

function Rows({ rows }) {
  return (
    <dl className="m-0 grid border-t border-line-strong md:grid-cols-2 md:gap-x-12">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[minmax(8rem,38%)_1fr] gap-4 border-b border-line py-4">
          <dt className="eyebrow text-xs leading-relaxed text-bronze-deep">{k}</dt>
          <dd className="m-0 leading-relaxed">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Cards({ items, cols = 2 }) {
  return (
    <ul className={`m-0 grid list-none gap-4 p-0 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map((it) => (
        <li key={it.title || it.name} className="flex flex-col gap-3 rounded-card border border-line bg-ivory p-[clamp(1.25rem,3svh,2rem)]">
          {it.place && <p className="eyebrow m-0 text-xs text-bronze-deep">{it.place}</p>}
          <h3 className="m-0 font-display text-[clamp(1.25rem,2vw,1.625rem)] leading-snug">{it.title || it.name}</h3>
          <p className="m-0 leading-relaxed text-ink-soft">{it.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Bullets({ items }) {
  return (
    <ul className="m-0 flex max-w-4xl list-none flex-col gap-3 p-0">
      {items.map((x) => (
        <li key={x} className="relative pl-6 leading-relaxed before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-bronze">{x}</li>
      ))}
    </ul>
  );
}

function Timeline({ items }) {
  return (
    <ol className="m-0 grid list-none border-t border-line-strong p-0">
      {items.map((it) => (
        <li key={it.when + it.what} className="grid gap-2 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <span className="font-display text-xl text-bronze-deep">{it.when}</span>
          <span className="leading-relaxed">{it.what}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---------- /tong-quan ---------- */
export function OverviewBody() {
  const d = useDetails().overview;
  return (
    <>
      <Block title={d.title}><Rows rows={d.rows} /></Block>
      <Block title={d.zonesTitle} tone="cream"><Cards items={d.zones} /></Block>
      <Block title={d.designTitle}><Cards items={d.design} /></Block>
    </>
  );
}

/* ---------- /gia-ban ---------- */
export function PriceBody() {
  const d = useDetails().price;
  const lang = useLang();
  const { priceTypes } = useSite();
  const popup = useContactPopup();
  return (
    <>
      <Block title={d.title}>
        <div className="overflow-x-auto">
          <table className="w-full sm:min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line-strong">
                {/* điện thoại: ẩn cột NSA để bảng vừa màn hình, không phải cuộn ngang */}
                {d.cols.map((c, i) => <th key={c} scope="col" className={`eyebrow py-3 pr-4 text-xs font-medium text-bronze-deep ${i === 2 ? 'max-sm:hidden' : ''}`}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {priceTypes.map((t) => {
                const minGfa = t.layouts ? Math.min(...t.layouts.map((l) => l.gfa)) : t.min[0];
                return (
                  <tr key={t.name} className="border-b border-line">
                    <th scope="row" className="py-3 pr-4 font-display text-lg font-normal">{t.name}</th>
                    <td className="py-3 pr-4">{t.gfa}</td>
                    <td className="py-3 pr-4 max-sm:hidden">{t.nsa}</td>
                    <td className="py-3 font-medium">
                      {t.priced ? billions(minGfa * PRICE_PER_M2, lang) : (
                        <button type="button" className="cursor-pointer border-0 bg-transparent p-0 font-medium text-bronze-deep underline" onClick={() => popup.open('price_table')} data-track="cta_click" data-track-label="price_table_contact">{d.contact}</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="m-0 max-w-4xl text-sm leading-relaxed text-ink-soft">{d.note}</p>
      </Block>
      <Block title={d.factorsTitle} tone="cream"><Bullets items={d.factors} /></Block>
    </>
  );
}

/* ---------- /chinh-sach-ban-hang ---------- */
export function PolicyBody() {
  const d = useDetails().policy;
  return (
    <>
      <Block title={d.plansTitle}>
        <p className="m-0 max-w-3xl leading-relaxed text-ink-soft">{d.plansNote}</p>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
          {d.plans.map((p) => (
            <li key={p.name} className="flex flex-col gap-4 rounded-card border border-line bg-ivory p-[clamp(1.25rem,3svh,2rem)]">
              <div className="flex items-start justify-between gap-4">
                <h3 className="m-0 font-display text-[clamp(1.2rem,1.8vw,1.5rem)] leading-snug">{p.name}</h3>
                <span className="shrink-0 rounded-full bg-cream px-3 py-1 text-sm font-medium text-bronze-deep" title={d.discountLabel}>{p.discount}</span>
              </div>
              <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 leading-relaxed text-ink-soft">
                {p.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </li>
          ))}
        </ul>
      </Block>
      <Block title={d.milestonesTitle} tone="cream"><Timeline items={d.milestones} /></Block>
      <Block title={d.noteTitle}><Bullets items={d.notes} /></Block>
    </>
  );
}

/* ---------- /chu-dau-tu ---------- */
export function DeveloperBody() {
  const d = useDetails().developer;
  return (
    <>
      <Block title={d.title}>
        {d.paras.map((p) => <p key={p} className="lead m-0 max-w-4xl">{p}</p>)}
      </Block>
      <Block title={d.projectsTitle} tone="cream"><Cards items={d.projects} cols={3} /></Block>
      <Block title={d.gquasTitle}><p className="m-0 max-w-4xl leading-relaxed">{d.gquas}</p></Block>
    </>
  );
}

/* ---------- /tien-do ---------- */
export function ProgressBody() {
  const d = useDetails().progress;
  return (
    <>
      <Block title={d.timelineTitle}><Timeline items={d.timeline} /></Block>
      <Block title={d.updateTitle} tone="cream"><Bullets items={d.update} /></Block>
      <Block title={d.legalTitle}>
        <Bullets items={d.legal} />
        <p className="m-0 max-w-4xl text-sm leading-relaxed text-ink-soft">{d.legalNote}</p>
      </Block>
    </>
  );
}

/* ---------- /hoi-dap ---------- */
export function FaqBody() {
  const lang = useLang();
  const site = useSite();
  const items = fullFaq(site, lang);
  return (
    <section id="faq" className="bg-ivory py-[clamp(3rem,9svh,6rem)]">
      <div className="container-site flex max-w-5xl flex-col">
        {items.map((item) => (
          <details key={item.q} className="group border-t border-line-strong py-3 last:border-b">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2 font-display text-[clamp(1.05rem,1.6vw,1.4rem)] leading-snug [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden="true" className="font-sub text-xl text-bronze-deep transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mb-0 mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
        <p className="mb-0 mt-8">
          <Link to="/bang-tinh-gia" className="btn btn-solid">{lang === 'en' ? 'Open the price calculator' : 'Mở bảng tính giá'}</Link>
        </p>
      </div>
    </section>
  );
}
