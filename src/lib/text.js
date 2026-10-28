/* tên bộ sưu tập rút gọn cho chỗ hẹp (tab điện thoại):
   "Bộ sưu tập chuẩn sống toàn cầu" → "Chuẩn sống toàn cầu" · "Global Living Collection" → "Global Living" */
export const shortTitle = (s) => {
  const v = String(s).replace(/^bộ sưu tập\s+/i, '').replace(/\s+collection$/i, '');
  return v.charAt(0).toUpperCase() + v.slice(1);
};
