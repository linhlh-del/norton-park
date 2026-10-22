import { Children } from 'react';
import Media from '@/components/ui/Media';

/**
 * Section câu chuyện với ẢNH NỀN TOÀN SECTION. Chữ nằm trên lớp phủ tối để luôn đủ tương phản.
 * Khối chữ trượt vào từ phía nó đứng (trái / phải), các đoạn hiện so le.
 * align: "left" | "right" — phía đặt khối chữ.
 */
export default function StoryBackdrop({ id, image, imageAlt = '', imageLabel, eyebrow, title, children, align = 'left' }) {
  const dir = align === 'right' ? 'right' : 'left';
  return (
    <section id={id} className="relative isolate flex min-h-[clamp(640px,100svh,920px)] items-center overflow-hidden bg-hoadau text-on-dark">
      <Media src={image} alt={imageAlt} label={imageLabel} tone="dark" className="!absolute inset-0 -z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hoadau-deep/55" />
      <div className={`container-site flex py-section ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div className="flex max-w-xl flex-col gap-6">
          <p data-reveal={dir} className="eyebrow text-on-dark-soft">{eyebrow}</p>
          <h2 data-reveal={dir} style={{ '--reveal-i': 1 }} className="heading-2">{title}</h2>
          <div className="flex flex-col gap-5 text-stone">
            {Children.map(children, (child, i) => (
              <div data-reveal={dir} style={{ '--reveal-i': i + 2 }}>{child}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
