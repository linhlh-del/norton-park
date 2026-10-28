/* Giá trị nội dung "đã có thật": không rỗng và không phải chỗ trống chờ điền dạng "[TÊN PHÁP NHÂN]",
   "[Đang cập nhật]", "[Mã căn]"… — giao diện ẩn dòng/ô tương ứng thay vì hiện placeholder cho khách.
   Điền giá trị thật trong CMS (Thông tin chung) hoặc src/data/site.js là tự hiện lại. */
export const isFilled = (v) => {
  if (v == null) return false;
  const s = String(v).trim();
  return s !== '' && !/^\[.*\]$/.test(s);
};
