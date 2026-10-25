/**
 * Tiêu đề chuẩn SEO: thẻ heading chứa TỪ KHOÁ (seo), câu slogan hiển thị nằm trong <p> cùng kiểu chữ.
 * - Có seo  → <Tag class="sr-only">{seo}</Tag> + <p aria-hidden>{title}</p> (giao diện giữ nguyên).
 * - Không seo → <Tag>{title}</Tag> như cũ.
 * Các prop còn lại (className, style, data-reveal…) gắn vào phần chữ hiển thị.
 */
export default function KeywordHeading({ as: Tag = 'h2', seo, children, ...rest }) {
  if (!seo) return <Tag {...rest}>{children}</Tag>;
  return (
    <>
      <Tag className="sr-only">{seo}</Tag>
      <p aria-hidden="true" {...rest}>{children}</p>
    </>
  );
}
