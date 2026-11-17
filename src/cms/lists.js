/* ============================================================
   DANH SÁCH SỬA ĐƯỢC TRÊN CMS (thêm / xoá / đổi thứ tự / thay từng ảnh) — Norton Park.
   key = "site." + đường dẫn mảng trong src/data/site.js. Lõi xử lý: ./lists-core.js.
   section = id section trong src/cms/schema.js (danh sách hiện trong section đó trên CMS).
   ============================================================ */
export const CMS_LISTS = [
  { section: 'story', key: 'site.stations', label: 'Các trạm (ảnh + chữ)', itemLabel: 'Trạm', max: 6,
    fields: [['title', 'Tiêu đề'], ['body', 'Nội dung', 'textarea']],
    images: [{ key: 'image', label: 'Ảnh', ratio: '4/3', altKey: 'imageLabel' }] },
  { section: 'facts', key: 'site.facts', label: 'Số liệu', itemLabel: 'Số liệu', max: 12,
    fields: [['value', 'Giá trị'], ['label', 'Nhãn']] },
  { section: 'lifestyle', key: 'site.lifestyle', label: 'Carousel tiện ích', itemLabel: 'Tiện ích', min: 1, max: 20,
    fields: [['tag', 'Nhãn nhỏ'], ['title', 'Tiêu đề'], ['body', 'Mô tả', 'textarea']],
    images: [{ key: 'image', label: 'Ảnh tiện ích', ratio: '4/3', altKey: 'imageLabel' }] },
  { section: 'news', key: 'site.homeNews', label: 'Bài trong carousel tin tức', itemLabel: 'Bài', max: 12,
    fields: [['title', 'Tiêu đề'], ['excerpt', 'Tóm tắt', 'textarea'], ['cat', 'Chuyên mục'], ['src', 'Nguồn (tên báo)'], ['url', 'Link bài gốc']],
    images: [{ key: 'image', label: 'Ảnh bài', ratio: '16/9', altKey: 'alt' }] },
  { section: 'news-page', key: 'site.posts', label: 'Bài viết trang Tin tức', itemLabel: 'Bài', max: 30,
    fields: [['title', 'Tiêu đề'], ['cat', 'Chuyên mục'], ['date', 'Ngày đăng (vd. 14 tháng 10, 2026)'], ['src', 'Nguồn'], ['body', 'Nội dung', 'textarea']],
    images: [{ key: 'image', label: 'Ảnh bài', ratio: '16/9' }] },
  { section: 'faq', key: 'site.faq', label: 'Câu hỏi thường gặp', itemLabel: 'Câu hỏi', max: 20,
    fields: [['q', 'Câu hỏi'], ['a', 'Trả lời', 'textarea']] },
];
