import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GLOBAL, PRICE_PER_M2, SPECIAL, contact, layoutsOf, m2, money, priceTypes } from '@/data/site';
import Media from '@/components/ui/Media';
import CountUp from '@/components/motion/CountUp';
import ContactFields from '@/components/forms/ContactFields';
import ContactPanel from '@/components/ContactPanel';
import { submitLead } from '@/lib/lead';

const groups = [
  { title: GLOBAL, items: priceTypes.map((t, i) => ({ t, i })).filter(({ t }) => t.col === GLOBAL) },
  { title: SPECIAL, items: priceTypes.map((t, i) => ({ t, i })).filter(({ t }) => t.col === SPECIAL) },
];

const Stat = ({ value, label, i }) => (
  <div data-reveal="up" style={{ '--reveal-i': i }}>
    <div className="font-display text-[52px] leading-none"><CountUp value={value} /></div>
    <p className="eyebrow mt-2 text-[10px] text-on-dark-soft">{label}</p>
  </div>
);

export default function Calculator() {
  const [params] = useSearchParams();
  const initial = Math.min(priceTypes.length - 1, Math.max(0, Number(params.get('loai')) || 0));
  const [typeIdx, setTypeIdx] = useState(initial);
  const [layoutIdx, setLayoutIdx] = useState(0);
  const [sent, setSent] = useState(false);

  const type = priceTypes[typeIdx];
  const layouts = useMemo(() => layoutsOf(type), [type]);
  const layout = layouts[layoutIdx] || layouts[0];
  const price = type.priced ? money(layout.gfa * PRICE_PER_M2) : 'Liên hệ nhận báo giá';

  const pickType = (i) => { setTypeIdx(i); setLayoutIdx(0); setSent(false); };

  return (
    <>
      {/* giới thiệu */}
      <section className="bg-hoadau pb-20 pt-24 text-on-dark">
        <div className="container-site flex flex-col gap-7">
          <p className="eyebrow hero-in text-on-dark-soft">Bảng tính giá dự kiến</p>
          <h1 className="heading-1 max-w-5xl">Bảng tính giá dự kiến Norton Park: <em>Tìm tổ ấm cho nhịp sống của bạn</em></h1>
          <p className="m-0 max-w-3xl text-[17px] leading-relaxed text-stone">
            Tra cứu diện tích tim tường (GFA), diện tích thông thuỷ (NSA), mặt bằng và giá dự kiến cho 63 layout thuộc ba toà B1, B2, B3 — Phân khu B.
          </p>
          <div className="grid max-w-3xl grid-cols-[repeat(auto-fit,minmax(min(100%,12.5rem),1fr))] gap-6 border-t border-line-dark pt-8">
            <Stat i={0} value="9" label="Loại sản phẩm" />
            <Stat i={1} value="63" label="Layout tra cứu" />
            <Stat i={2} value="95%" label="Căn hộ có hai mặt thoáng" />
          </div>
          <div className="flex flex-wrap gap-3.5">
            <a href="#tool" className="btn btn-solid">Bắt đầu tính giá</a>
            <a href="#quote" className="btn btn-ghost-light">Nhận báo giá chính thức</a>
          </div>
        </div>
      </section>

      {/* bảng thông số */}
      <section className="bg-ivory py-24">
        <div className="container-site flex flex-col gap-8">
          <h2 data-reveal="up" className="heading-2 max-w-4xl">Thông số diện tích và chính sách giá tham khảo — 9 loại hình Phân khu B</h2>
          <div data-reveal="up" style={{ '--reveal-i': 1 }} className="overflow-x-auto rounded-card border border-line">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="font-sub text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                  {['Loại hình', 'Bộ sưu tập', 'GFA (m²)', 'NSA (m²)', 'Giá tham khảo'].map((h) => (
                    <th key={h} scope="col" className="border-b border-line px-4 py-3.5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {priceTypes.map((t) => (
                  <tr key={t.name}>
                    <td className="border-b border-line px-4 py-3.5 font-display text-xl">{t.name}</td>
                    <td className="border-b border-line px-4 py-3.5">{t.col}</td>
                    <td className="border-b border-line px-4 py-3.5">{t.gfa}</td>
                    <td className="border-b border-line px-4 py-3.5">{t.nsa}</td>
                    <td className="border-b border-line px-4 py-3.5 font-medium">{t.priced ? 'Từ 66.000.000 VNĐ/m² (GFA)' : 'Liên hệ nhận báo giá'}</td>
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
          <div className="flex flex-col gap-3">
            <h2 data-reveal="up" className="heading-2">Chọn căn hộ phù hợp với bạn</h2>
            <p className="m-0 leading-relaxed">Chọn loại căn và layout để xem mặt bằng minh hoạ, diện tích và giá dự kiến.</p>
          </div>
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-2.5">
              <p className="eyebrow text-bronze-deep">{g.title}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map(({ t, i }) => (
                  <button key={t.name} type="button" className="chip" aria-pressed={i === typeIdx} onClick={() => pickType(i)}>{t.name}</button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-start gap-6">
            <div data-reveal="left" className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 rounded-panel bg-ivory p-[clamp(1.25rem,3vw,2.5rem)]">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col gap-2.5">
                  <Media label={`Mặt bằng minh hoạ · ${layout.code}`} className="aspect-square rounded-lg" />
                  <p className="m-0 text-[13px] leading-relaxed text-ink-soft">Mặt bằng minh hoạ căn tiêu biểu. Bố trí từng layout có thể khác, liên hệ để nhận mặt bằng chi tiết.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="eyebrow text-bronze-deep">{type.col}</p>
                  <h3 className="heading-2">{type.name}</h3>
                  <p className="eyebrow tracking-[0.2em] text-ink-soft">{type.rooms}</p>
                  <dl className="m-0 grid grid-cols-3 gap-4 border-t border-line pt-4">
                    {[['Số layout', type.count], ['DT sàn từ', m2(layouts[0].gfa)], ['DT sử dụng từ', m2(Math.min(...layouts.map((l) => l.nsa)))]].map(([k, v]) => (
                      <div key={k}>
                        <dt className="eyebrow text-[9px] tracking-[0.14em] text-ink-soft">{k}</dt>
                        <dd className="m-0 mt-1.5 font-display text-[28px]"><CountUp value={String(v)} duration={900} /></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className="eyebrow mb-2 text-hoadau">Chọn layout</legend>
                <p className="m-0 text-[13px] text-ink-soft">Hậu tố a: tầng 3–9 · b: tầng 10–19 · c: tầng 1–2 · PES: căn có sân vườn riêng</p>
                <div className="mt-2 grid grid-cols-[1fr_1fr_1fr_2fr] gap-3 px-4 py-2.5 font-sub text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-soft" aria-hidden="true">
                  <span>Layout</span><span>DT sàn</span><span>DT sử dụng</span><span>Cảnh quan</span>
                </div>
                {layouts.map((l, i) => (
                  <label key={l.code} className={`grid min-h-13 cursor-pointer grid-cols-[1fr_1fr_1fr_2fr] items-center gap-3 rounded-lg border px-4 py-3 text-sm ${i === layoutIdx ? 'border-bronze-deep bg-bronze/15' : 'border-transparent border-t-line'}`}>
                    <input type="radio" name="layout" className="sr-only" checked={i === layoutIdx} onChange={() => setLayoutIdx(i)} />
                    <span className="font-medium">{l.code}</span><span>{m2(l.gfa)}</span><span>{m2(l.nsa)}</span><span className="text-ink-soft">{l.view}</span>
                  </label>
                ))}
              </fieldset>
            </div>

            <aside data-reveal="right" className="flex min-w-0 flex-[1_1_340px] flex-col gap-4.5 rounded-panel bg-hoadau p-[clamp(1.5rem,3vw,2.25rem)] text-on-dark" aria-live="polite">
              <p className="eyebrow text-on-dark-soft">Giá dự kiến</p>
              <div className="font-display text-[clamp(2.2rem,3.4vw,3rem)] leading-tight"><CountUp value={price} duration={900} /></div>
              <p className="m-0 text-on-dark-soft">{type.name} · {layout.code}</p>
              <dl className="m-0 flex flex-col">
                {[['Diện tích sàn', m2(layout.gfa)], ['Diện tích sử dụng', m2(layout.nsa)], ['Cảnh quan', layout.view], ['Số căn', layout.units]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-t border-line-dark py-3 last:border-b">
                    <dt className="text-on-dark-soft">{k}</dt><dd className="m-0 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="#quote" className="btn btn-light">Nhận báo giá chính thức</a>
              <a href={contact.hotlineHref} className="btn btn-ghost-light">Gọi {contact.hotline}</a>
              <p data-nosnippet className="m-0 text-xs leading-relaxed text-on-dark-soft">
                Giá mô phỏng theo đơn giá dự kiến thấp nhất cho khách mua quốc tịch Việt Nam, phương thức thanh toán chuẩn, tính trên diện tích tim tường, chưa gồm VAT.
                Không phải báo giá hay cam kết của chủ đầu tư; giá thực tế có thể thay đổi theo mã căn, vị trí và chính sách bán hàng.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* báo giá */}
      <section id="quote" className="bg-sand py-24">
        <div className="container-site grid items-start gap-8 lg:grid-cols-2">
          <div data-reveal="left" className="flex flex-col gap-5 rounded-panel bg-ivory p-6 sm:p-12">
            <p className="eyebrow text-bronze-deep">Báo giá chính thức</p>
            <h2 className="heading-2">Nhận báo giá cho căn bạn chọn</h2>
            <p className="m-0 leading-relaxed">Đội ngũ cố vấn sẽ liên hệ để gửi báo giá, tình trạng căn và chính sách bán hàng hiện hành.</p>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-cream p-4">
              <div>
                <p className="eyebrow text-[9px] text-ink-soft">Căn đang chọn</p>
                <p className="m-0 mt-1.5 font-medium">{type.name} · {layout.code}</p>
              </div>
              <a href="#tool" className="inline-flex min-h-11 items-center font-sub text-[11px] font-semibold tracking-[0.16em]">ĐỔI CĂN</a>
            </div>
            {sent ? (
              <div role="status" className="flex flex-col gap-2 rounded-card bg-cream p-7 text-center">
                <p className="m-0 font-display text-[28px]">Thông tin đã được ghi nhận</p>
                <p className="m-0">Chúng tôi sẽ gửi báo giá cho căn {layout.code} sớm nhất.</p>
              </div>
            ) : (
              <form className="flex flex-col gap-4.5" onSubmit={async (e) => {
                e.preventDefault();
                const fd = Object.fromEntries(new FormData(e.currentTarget));
                await submitLead({ name: fd.name, phone: fd.phone, email: fd.email, unitType: type.name, layout: layout.code }, 'quote');
                setSent(true);
              }}>
                <ContactFields />
                <div><button type="submit" className="btn btn-solid">Nhận báo giá</button></div>
              </form>
            )}
          </div>
          <div data-reveal="right" style={{ '--reveal-i': 1 }}><ContactPanel /></div>
        </div>
      </section>

      <p className="sr-only"><Link to="/">Về trang chủ</Link></p>
    </>
  );
}
