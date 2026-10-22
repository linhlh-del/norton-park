/* ============================================================
   SEO — MỘT NGUỒN DUY NHẤT cho title, description, snippet của từng trang, menu và section.
   Dùng chung cho: <Seo> (đổi <head> khi chuyển trang), bước prerender (ghi <head> tĩnh vào dist/<route>/index.html),
   sitemap.xml và dữ liệu có cấu trúc (JSON-LD).

   Quy ước độ dài (để Google không cắt):
   - title  ≤ 60 ký tự   — từ khoá chính đứng trước, thương hiệu đứng sau.
   - description 120–155 ký tự — trả lời "đây là gì, ở đâu, khác gì", kết bằng lời mời hành động.
   - subtitle (menu / section) ≤ 70 ký tự; summary (section) ≤ 160 ký tự — dùng cho JSON-LD WebPageElement,
     thuộc tính title của liên kết menu và llms.txt.
   ============================================================ */

/* Tên miền chính thức — PHẢI trùng tên miền thật khi deploy (canonical, sitemap, og:url đều dựa vào đây).
   Đặt VITE_SITE_URL trong .env.production nếu khác. Không có dấu / ở cuối. */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://www.nortonpark.com.vn').replace(/\/+$/, '');

export const SITE = {
  name: 'Norton Park',
  alternateName: 'Norton Park — A Gamuda Land Community',
  developer: 'Gamuda Land',
  locale: 'vi_VN',
  lang: 'vi',
  themeColor: '#594a42',
  ogImage: '/images/_optimized/norton-park-og.jpg', // 1200 × 630, sinh bởi npm run images từ ảnh hero
  ogImageAlt: 'Phối cảnh toà tháp Norton Park lúc hoàng hôn, Đại lộ Bình Dương',
  twitterSite: '', // vd. '@nortonpark' nếu có tài khoản X
};

/**
 * Trang (route). changefreq / priority dùng cho sitemap.xml.
 * breadcrumb: tên hiển thị trong BreadcrumbList.
 */
export const pages = {
  '/': {
    title: 'Norton Park Bình Dương — Căn hộ Gamuda Land | Giá & mặt bằng',
    description:
      'Norton Park của Gamuda Land tại Số 5 Đại lộ Bình Dương, Thuận Giao: 7,9 ha, 1.286 căn, mật độ xây dựng 20%, 2,5 ha cảnh quan. Xem mặt bằng, giá và đăng ký tư vấn.',
    breadcrumb: 'Trang chủ',
    changefreq: 'weekly',
    priority: 1.0,
    image: '/images/overview_hero-facade-sunset.jpg',
  },
  '/bang-tinh-gia': {
    title: 'Bảng tính giá Norton Park — 63 layout, giá dự kiến từng căn',
    description:
      'Tra cứu giá dự kiến Norton Park theo loại căn và layout: diện tích GFA/NSA, mặt bằng minh hoạ, đơn giá từ 66 triệu/m². Nhận báo giá chính thức từ chủ đầu tư.',
    breadcrumb: 'Bảng tính giá',
    changefreq: 'weekly',
    priority: 0.9,
  },
  '/tin-tuc': {
    title: 'Tin tức Norton Park — Tiến độ, pháp lý và thị trường',
    description:
      'Tin mới về Norton Park: sự kiện, tiến độ xây dựng, pháp lý, hạ tầng khu vực Thuận Giao – Bình Dương và góc nhìn thị trường căn hộ, cập nhật thường xuyên.',
    breadcrumb: 'Tin tức',
    changefreq: 'daily',
    priority: 0.7,
  },
};

export const notFound = {
  title: 'Không tìm thấy trang — Norton Park',
  description: 'Trang bạn tìm không tồn tại hoặc đã được chuyển. Quay về trang chủ Norton Park để xem dự án.',
  noindex: true,
};

/**
 * Snippet cho MENU và SECTION trang chủ — "subtitle" ngắn + "summary" một câu.
 * - id: id của section (khớp href "#id" trong menu), để deep-link và để Google hiểu cấu trúc trang.
 * - menu: nhãn trên thanh điều hướng (nếu section có mặt trong menu).
 */
export const sections = [
  { id: 'hero', subtitle: 'Toạ độ xứng tầm tại Bình Dương', summary: 'Norton Park — cộng đồng căn hộ của Gamuda Land trên Đại lộ Bình Dương, Phường Thuận Giao.' },
  { id: 'design-story', menu: 'Câu chuyện', subtitle: 'Vũ khúc hoa trong gió', summary: 'Kiến trúc lấy cảm hứng từ cánh hoa dầu xoay trong gió — đỉnh tháp uốn cong, dáng hình thanh mảnh.' },
  { id: 'landscape-story', subtitle: 'Nhịp điệu rừng xanh trên đại lộ', summary: 'Mật độ xây dựng 20%, 2,5 ha cảnh quan với rừng Miyawaki ngay bên Đại lộ Bình Dương.' },
  { id: 'story', subtitle: 'Ba trạm sạc: năng lượng, hiệu suất, hứng khởi', summary: 'Từ mỗi căn hộ, vài bước chân tới tiện ích cho cơ thể, tâm trí và cảm hứng mỗi ngày.' },
  { id: 'facts', subtitle: 'Thông tin và số liệu dự án', summary: '7,9 ha, 1.286 căn hộ, mật độ xây dựng 20%, 2,5 ha cảnh quan, bàn giao dự kiến Q3/2029.' },
  { id: 'location', menu: 'Vị trí', subtitle: 'Toạ độ tinh chọn của cộng đồng chuyên gia', summary: 'Trên trục Đại lộ Bình Dương (QL13), liền kề AEON Mall Thuận Giao và gần KCN VSIP 1.' },
  { id: 'position', subtitle: 'Bản đồ vị trí và kết nối vùng', summary: 'Bản đồ tương tác: tiện ích, khu công nghiệp, hạ tầng giao thông quanh Norton Park.' },
  { id: 'lifestyle', menu: 'Tiện ích', subtitle: 'Những trạm sạc giữa nhịp sống', summary: 'Hồ bơi, lối dạo cây xanh, Work Hub, quảng trường BBQ và dãy Podium Shop nội khu.' },
  { id: 'blocks', subtitle: 'Hai phân khu căn hộ B và C', summary: 'Phân khu B sát AEON Mall Thuận Giao, gần VSIP 1; phân khu C sắp ra mắt.' },
  { id: 'residences', menu: 'Căn hộ', subtitle: 'Mặt bằng căn hộ Studio đến 3PN, Duplex', summary: 'Bộ sưu tập chuẩn sống toàn cầu và đặc tuyển: diện tích, số phòng, cảnh quan từng căn tiêu biểu.' },
  { id: 'news', subtitle: 'Tin tức Norton Park', summary: 'Bài viết mới nhất về Norton Park trên VnEconomy, CafeF, VietnamNet.' },
  { id: 'register', subtitle: 'Đăng ký tư vấn và nhận tài liệu', summary: 'Để lại thông tin để nhận bảng giá, mặt bằng và lịch tham quan nhà mẫu.' },
  { id: 'developer', subtitle: 'Chủ đầu tư Gamuda Land', summary: 'Gamuda Land — hơn 30 năm phát triển đô thị, 11 dự án tại Việt Nam, kiểm soát chất lượng GQUAS.' },
  { id: 'calc', subtitle: 'Ước tính giá trị tổ ấm', summary: 'Chọn loại căn và layout để xem diện tích và giá dự kiến.' },
  { id: 'faq', subtitle: 'Câu hỏi thường gặp', summary: 'Vị trí, quy mô, sản phẩm, tiến độ và chính sách của Norton Park.' },
];

/* Snippet cho các mục menu trỏ sang trang khác */
export const menuPages = {
  '/bang-tinh-gia': { subtitle: 'Giá dự kiến 63 layout', summary: pages['/bang-tinh-gia'].description },
  '/tin-tuc': { subtitle: 'Tiến độ, pháp lý, thị trường', summary: pages['/tin-tuc'].description },
};

/** subtitle cho một mục menu (dùng làm thuộc tính title của liên kết) */
export function menuSubtitle(to) {
  if (to.startsWith('/#')) return sections.find((s) => s.id === to.slice(2))?.subtitle;
  return menuPages[to]?.subtitle;
}

export const routes = Object.keys(pages);
export const absUrl = (path = '/') => SITE_URL + (path.startsWith('/') ? path : '/' + path);
