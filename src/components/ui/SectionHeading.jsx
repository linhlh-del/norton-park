import KeywordHeading from '@/components/ui/KeywordHeading';

/**
 * Cụm tiêu đề section: dòng nhỏ (eyebrow) + tiêu đề + đoạn dẫn — hiện dần so le khi cuộn tới.
 * seo: tiêu đề chứa từ khoá cho thẻ heading (slogan `title` vẫn hiển thị) — xem KeywordHeading.
 * tone: "light" (nền sáng) | "dark" (nền tối). align: "left" | "center".
 */
export default function SectionHeading({ eyebrow, title, seo, intro, tone = 'light', align = 'left', as: Tag = 'h2', className = '' }) {
  const dark = tone === 'dark';
  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${align === 'center' ? 'mx-auto items-center text-center' : ''} ${className}`}>
      {eyebrow && <p data-reveal="up" className={`eyebrow ${dark ? 'text-on-dark-soft' : 'text-bronze-deep'}`}>{eyebrow}</p>}
      <KeywordHeading as={Tag} seo={seo} data-reveal="up" style={{ '--reveal-i': 1 }} className="heading-2">{title}</KeywordHeading>
      {intro && <p data-reveal="up" style={{ '--reveal-i': 2 }} className={`lead ${dark ? 'text-stone' : ''}`}>{intro}</p>}
    </div>
  );
}
