/**
 * Biểu tượng quả cho (quacho) — dấu trang trí đầu section.
 * tone="light" (section nền sáng) → bản màu đồng; tone="dark" (nền tối) → bản màu be.
 * Ảnh trang trí nên alt rỗng; kích thước cố định để không xê dịch bố cục.
 */
const SRC = {
  light: '/images/quacho-symbol-bronze.webp',
  dark: '/images/quacho-symbol-beige.webp',
};

export default function QuachoMark({ tone = 'light', size = 44, className = '', ...rest }) {
  return (
    <img src={SRC[tone]} alt="" aria-hidden="true" width={size} height={Math.round(size * 322 / 256)}
      loading="lazy" decoding="async" className={`block h-auto select-none ${className}`} {...rest} />
  );
}
