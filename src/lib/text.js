/* tên bộ sưu tập rút gọn cho chỗ hẹp (tab điện thoại, hàng tab + chip trên laptop):
   "Bộ sưu tập chuẩn sống toàn cầu" → "Toàn cầu" · "Global Living Collection" → "Global"
   (2 tab chỉ cần phân biệt nhau; tên đầy đủ vẫn ở tiêu đề / màn ≥ 1280px) */
export const shortTitle = (s) => {
  const v = String(s).replace(/^bộ sưu tập\s+/i, '').replace(/^chuẩn sống\s+/i, '').replace(/\s+living collection$/i, '').replace(/\s+collection$/i, '');
  return v.charAt(0).toUpperCase() + v.slice(1);
};
