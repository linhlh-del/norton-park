import { faq } from '@/data/site';

export default function Faq() {
  return (
    <section id="faq" className="bg-ivory py-section">
      <div className="container-site grid items-start gap-[clamp(2rem,6vw,6rem)] lg:grid-cols-2">
        <div data-reveal="left" className="flex flex-col gap-4">
          <p className="eyebrow text-bronze-deep">Câu hỏi thường gặp</p>
          <h2 className="heading-2">Về dự án Norton Park — A Gamuda Land Community</h2>
        </div>
        <div className="flex flex-col">
          {faq.map((item, i) => (
            <details key={item.q} data-reveal="up" style={{ '--reveal-i': i }} className="group border-t border-line-strong py-5 last:border-b">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-2xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="font-sub text-xl text-bronze-deep transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mb-0 mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
