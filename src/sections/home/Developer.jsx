import { team } from '@/data/site';
import Media from '@/components/ui/Media';
import CountUp from '@/components/motion/CountUp';

export default function Developer() {
  return (
    <section id="developer" className="bg-ivory py-section">
      <div className="container-site flex flex-col gap-16">
        <div className="grid items-center gap-[clamp(2rem,6vw,6rem)] lg:grid-cols-2">
          <div data-reveal="left" className="flex flex-col gap-5">
            <p className="eyebrow text-bronze-deep">Chủ đầu tư</p>
            <h2 className="heading-2">Phát triển bởi</h2>
            <Media src="/images/gamuda-land-logo.png" alt="Gamuda Land" label="Logo chủ đầu tư" className="h-20 w-60 rounded-md [&_img]:object-contain" />
          </div>
          <p data-reveal="right" className="lead">
            Gamuda Land, thành lập năm 1995, là mảng bất động sản của tập đoàn hạ tầng Gamuda Berhad (Malaysia). Sau hơn <CountUp value="30" /> năm, công ty đã
            phát triển các khu đô thị tại Malaysia, Singapore, Việt Nam, Anh và Úc; tại Việt Nam có <CountUp value="11" /> dự án ở TP.HCM, Hà Nội, Hải Phòng và
            Đồng Nai, đều áp dụng hệ thống kiểm soát chất lượng GQUAS.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <p data-reveal="up" className="eyebrow text-bronze-deep">Đội ngũ phát triển</p>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,12.5rem),1fr))] gap-4 p-0">
            {team.map((m, i) => (
              <li key={m.role} data-reveal="up" style={{ '--reveal-i': i }} className="flex min-h-40 flex-col justify-between gap-4 rounded-card border border-line p-6">
                <p className="eyebrow text-[10px] leading-relaxed text-ink-soft">{m.role}</p>
                <p className="m-0 font-display text-[26px]">{m.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
