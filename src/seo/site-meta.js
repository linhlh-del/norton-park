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
import { cmsSeo } from '@/cms/content';

/* Tên miền chính thức — PHẢI trùng tên miền thật khi deploy (canonical, sitemap, og:url đều dựa vào đây).
   Đặt VITE_SITE_URL trong .env.production nếu khác. Không có dấu / ở cuối. */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://norton-park-rho.vercel.app').replace(/\/+$/, '');

export const SITE = {
  name: 'Norton Park',
  alternateName: 'Norton Park — A Gamuda Land Community',
  developer: 'Gamuda Land',
  locale: 'vi_VN',
  lang: 'vi',
  themeColor: '#DCD3C0',
  published: '2026-10-01', // datePublished của trang chủ
  /* ảnh chia sẻ Facebook / Zalo: 1200×630 JPG (tạo từ thumbnail.png) */
  ogImage: '/images/og-image.jpg',
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Phối cảnh các toà tháp Norton Park hai bên trục đường nội khu, giữa công viên cây xanh',
  twitterSite: '', // vd. '@nortonpark' nếu có tài khoản X
};


/* Ngôn ngữ của site: vi tại "/", en tại "/en" (hreflang, sitemap, prerender) */
export const LANG_META = {
  vi: { prefix: '', locale: 'vi_VN', inLanguage: 'vi-VN', hreflang: 'vi' },
  en: { prefix: '/en', locale: 'en_US', inLanguage: 'en-US', hreflang: 'en' },
};

/**
 * Trang (route, theo đường dẫn tiếng Việt). changefreq / priority dùng cho sitemap.xml.
 * breadcrumb: tên hiển thị trong BreadcrumbList. en: bản tiếng Anh của title / description / breadcrumb.
 */
export const pages = {
  '/': {
    title: 'Norton Park — Gamuda Land | Toạ độ xứng tầm tại Bình Dương',
    description:
      'Website chính thức Norton Park bởi Gamuda Land tại Số 5 Đại lộ Bình Dương, P. Thuận Giao, TP.HCM. Quy mô 7,9 ha, mật độ xây dựng 20%, kế cận AEON & VSIP 1.',
    /* Open Graph (Facebook / Zalo) có thể khác title/description */
    ogTitle: 'Norton Park | A Gamuda Land Community',
    ogDescription:
      'Không gian sống mật độ thấp trên Đại lộ Bình Dương, kế cận VSIP 1 và AEON Mall Thuận Giao. Quy mô 7,9 ha, mật độ xây dựng 20% và 2,5 ha diện tích cảnh quan.',
    breadcrumb: 'Trang chủ',
    changefreq: 'weekly',
    priority: 1.0,
    image: '/images/hero_design-story-facade.jpg',
    en: {
      title: 'Norton Park — Gamuda Land | Apartments in Binh Duong, HCMC',
      description:
        'Official website of Norton Park by Gamuda Land at 5 Binh Duong Boulevard, Thuan Giao, HCMC: 7.9 ha, 20% building density, next to AEON Mall and VSIP 1.',
      ogTitle: 'Norton Park | A Gamuda Land Community',
      ogDescription:
        'Low-density living on Binh Duong Boulevard, next to VSIP 1 and AEON Mall Thuan Giao: 7.9 hectares, 20% building density and 2.5 hectares of landscape.',
      breadcrumb: 'Home',
    },
  },
  /* Trang con theo nhóm từ khoá ngách — h1 / intro hiển thị ở src/pages/Topic.jsx */
  '/vi-tri': {
    title: 'Vị trí Norton Park — Đại lộ Bình Dương, Phường Thuận Giao',
    description:
      'Vị trí Norton Park số 5 Đại lộ Bình Dương, Phường Thuận Giao, TP.HCM: liền kề AEON Mall Thuận Giao, gần KCN VSIP 1. Xem bản đồ kết nối và đăng ký tư vấn.',
    breadcrumb: 'Vị trí',
    h1: 'Vị trí căn hộ Norton Park — Đại lộ Bình Dương, Phường Thuận Giao, TP.HCM',
    intro: [
      'Norton Park toạ lạc tại Số 5 Đại lộ Bình Dương (Quốc lộ 13), Phường Thuận Giao, Thành phố Hồ Chí Minh (trước đây thuộc TP. Thuận An, tỉnh Bình Dương).',
      'Dự án liền kề AEON Mall Thuận Giao, gần Khu công nghiệp VSIP 1 và kết nối nhanh về trung tâm TP.HCM qua trục Đại lộ Bình Dương.',
    ],
    changefreq: 'monthly',
    priority: 0.8,
    image: '/images/imgi_12_masterplan-birdview-r16.webp',
    en: {
      title: 'Norton Park location — Binh Duong Boulevard, Thuan Giao Ward',
      description:
        'Norton Park at 5 Binh Duong Boulevard, Thuan Giao Ward, HCMC: next to AEON Mall Thuan Giao and near VSIP 1. See the connectivity map and register for advice.',
      breadcrumb: 'Location',
      h1: 'Norton Park location — Binh Duong Boulevard, Thuan Giao Ward, Ho Chi Minh City',
      intro: [
        'Norton Park is located at 5 Binh Duong Boulevard (National Road 13), Thuan Giao Ward, Ho Chi Minh City (formerly Thuan An City, Binh Duong Province).',
        'The project sits next to AEON Mall Thuan Giao, near VSIP 1 Industrial Park, with quick access to central Ho Chi Minh City along Binh Duong Boulevard.',
      ],
    },
  },
  '/tien-ich': {
    title: 'Tiện ích Norton Park — Rừng Miyawaki, hồ bơi, Work Hub',
    description:
      'Tiện ích nội khu Norton Park: 2,5 ha cảnh quan rừng Miyawaki, hồ bơi trung tâm, Work Hub, quảng trường BBQ và Podium Shop. Đăng ký tham quan nhà mẫu ngay.',
    breadcrumb: 'Tiện ích',
    h1: 'Hệ thống tiện ích nội khu Norton Park',
    intro: [
      'Với mật độ xây dựng chỉ 20%, Norton Park dành 2,5 ha cho cảnh quan, trong đó có các tầng cây trồng theo phương pháp rừng Miyawaki của Nhật Bản.',
      'Tiện ích được tổ chức thành ba “trạm sạc” — năng lượng, hiệu suất, hứng khởi — gồm hồ bơi trung tâm, lối dạo cây xanh, Work Hub, quảng trường BBQ và dãy Podium Shop.',
    ],
    changefreq: 'monthly',
    priority: 0.8,
    image: '/images/tienich/1-life-wellness.jpg',
    en: {
      title: 'Norton Park amenities — Miyawaki forest, pool, Work Hub',
      description:
        'Norton Park amenities: 2.5 ha of Miyawaki forest landscape, a central pool, Work Hub, BBQ plaza and Podium Shops. Register now to visit the show apartment.',
      breadcrumb: 'Amenities',
      h1: 'Norton Park on-site amenities',
      intro: [
        'With just 20% building density, Norton Park dedicates 2.5 hectares to landscape, including layers of trees planted using Japan’s Miyawaki forest method.',
        'Amenities are organised into three “stations” — energy, performance and inspiration — with a central pool, green promenades, a Work Hub, a BBQ plaza and Podium Shops.',
      ],
    },
  },
  '/mat-bang': {
    title: 'Mặt bằng Norton Park — Căn hộ Studio đến 3PN, Duplex',
    description:
      'Mặt bằng căn hộ Norton Park Phân khu B: Studio, 1PN, 2PN, 2PN+, 3PN, Duplex, căn sân vườn và Shophouse với diện tích GFA, NSA từng căn. Nhận mặt bằng ngay.',
    breadcrumb: 'Mặt bằng',
    h1: 'Mặt bằng chi tiết căn hộ Norton Park — Phân khu B',
    intro: [
      'Phân khu B của Norton Park gồm các toà B1, B2, B3 với các loại hình Studio, 1PN, 2PN, 2PN+, 3PN, Duplex, căn hộ sân vườn và Shophouse.',
      'Xem mặt bằng minh hoạ, diện tích tim tường (GFA) và thông thuỷ (NSA) của từng căn tiêu biểu; tra cứu đủ 63 layout và giá dự kiến tại Bảng tính giá.',
    ],
    changefreq: 'monthly',
    priority: 0.8,
    image: '/images/block-b.jpg',
    en: {
      title: 'Norton Park floor plans — Studio to 3BR and Duplex homes',
      description:
        'Norton Park Zone B floor plans: Studio, 1BR, 2BR, 2BR+, 3BR, Duplex, garden homes and Shophouses with GFA and NSA areas for each unit. Get the floor plans now.',
      breadcrumb: 'Floor plans',
      h1: 'Norton Park floor plans — Zone B',
      intro: [
        'Zone B of Norton Park comprises towers B1, B2 and B3 with Studio, 1BR, 2BR, 2BR+, 3BR, Duplex, garden homes and Shophouses.',
        'See illustrative floor plans with gross (GFA) and net (NSA) areas for each typical unit; look up all 63 layouts and estimated prices in the price calculator.',
      ],
    },
  },
  '/bang-tinh-gia': {
    title: 'Bảng tính giá Norton Park — 63 layout, giá dự kiến từng căn',
    description:
      'Tra cứu giá dự kiến Norton Park theo loại căn và layout: diện tích GFA/NSA, mặt bằng minh hoạ, đơn giá từ 66 triệu/m². Nhận báo giá chính thức từ chủ đầu tư.',
    breadcrumb: 'Bảng tính giá',
    changefreq: 'weekly',
    priority: 0.9,
    en: {
      title: 'Norton Park price calculator — 63 layouts, estimated prices',
      description:
        'Look up estimated Norton Park prices by home type and layout: GFA/NSA areas, illustrative floor plans, from VND 66 million/m². Get an official quote today.',
      breadcrumb: 'Price calculator',
    },
  },
  '/tin-tuc': {
    title: 'Tin tức Norton Park — Tiến độ, pháp lý và thị trường',
    description:
      'Tin mới về Norton Park: sự kiện, tiến độ xây dựng, pháp lý, hạ tầng khu vực Thuận Giao – Bình Dương và góc nhìn thị trường căn hộ, cập nhật thường xuyên.',
    breadcrumb: 'Tin tức',
    changefreq: 'daily',
    priority: 0.7,
    en: {
      title: 'Norton Park news — Progress, legal and market updates',
      description:
        'The latest on Norton Park: events, construction progress, legal updates, Thuan Giao – Binh Duong infrastructure and apartment market insights, updated often.',
      breadcrumb: 'News',
    },
  },
};

/* bản gốc trước khi áp CMS — CMS hiển thị làm giá trị mặc định */
export const pageDefaults = JSON.parse(JSON.stringify(pages));

/* SEO chỉnh trong CMS (bản đã đăng) đè lên mặc định ở trên */
for (const [path, page] of Object.entries(pages)) {
  const v = cmsSeo(path, 'vi');
  const e = cmsSeo(path, 'en');
  /* title/description từ CMS dùng luôn cho Open Graph (bỏ og riêng) */
  if (v.title) { page.title = v.title; delete page.ogTitle; }
  if (v.description) { page.description = v.description; delete page.ogDescription; }
  if (v.ogImage) page.ogImage = v.ogImage;
  if (page.en) {
    if (e.title) { page.en.title = e.title; delete page.en.ogTitle; }
    if (e.description) { page.en.description = e.description; delete page.en.ogDescription; }
  }
}

/* Trang không lập chỉ mục (noindex, không vào sitemap) nhưng vẫn prerender */
export const hiddenPages = {
  '/cam-on': {
    title: 'Cảm ơn bạn đã đăng ký — Norton Park',
    description: 'Thông tin đăng ký tư vấn Norton Park đã được ghi nhận. Chuyên viên sẽ liên hệ với bạn trong thời gian sớm nhất.',
    noindex: true,
    en: {
      title: 'Thank you for registering — Norton Park',
      description: 'We have received your Norton Park enquiry. An advisor will contact you as soon as possible.',
    },
  },
};

export const notFound = {
  title: 'Không tìm thấy trang — Norton Park',
  description: 'Trang bạn tìm không tồn tại hoặc đã được chuyển. Quay về trang chủ Norton Park để xem dự án.',
  noindex: true,
  en: {
    title: 'Page not found — Norton Park',
    description: 'The page you are looking for does not exist or has moved. Return to the Norton Park home page.',
  },
};

/** Thông tin trang theo ngôn ngữ (gộp bản en lên bản vi) */
export function pageMeta(p, lang = 'vi') {
  if (!p) return p;
  return lang === 'en' && p.en ? { ...p, ...p.en } : p;
}

/**
 * Snippet cho MENU và SECTION trang chủ — "subtitle" ngắn + "summary" một câu.
 * - id: id của section (khớp href "#id" trong menu), để deep-link và để Google hiểu cấu trúc trang.
 * - menu: nhãn trên thanh điều hướng (nếu section có mặt trong menu).
 */
export const sections = [
  { id: 'hero', subtitle: 'Toạ độ xứng tầm tại Bình Dương', summary: 'Norton Park — cộng đồng căn hộ của Gamuda Land trên Đại lộ Bình Dương, Phường Thuận Giao.',
    en: { subtitle: 'A worthy address in Binh Duong', summary: 'Norton Park — a Gamuda Land residential community on Binh Duong Boulevard, Thuan Giao Ward.' } },
  { id: 'design-story', menu: 'Câu chuyện', subtitle: 'Vũ khúc hoa trong gió', summary: 'Kiến trúc lấy cảm hứng từ cánh hoa dầu xoay trong gió — đỉnh tháp uốn cong, dáng hình thanh mảnh.',
    en: { menu: 'Story', subtitle: 'A dance of blossoms in the wind', summary: 'Architecture inspired by dipterocarp blossoms spinning in the wind — curved crowns and slender towers.' } },
  { id: 'landscape-story', subtitle: 'Nhịp điệu rừng xanh trên đại lộ', summary: 'Mật độ xây dựng 20%, 2,5 ha cảnh quan với rừng Miyawaki ngay bên Đại lộ Bình Dương.',
    en: { subtitle: 'A forest rhythm on the boulevard', summary: '20% building density and 2.5 ha of landscape with a Miyawaki forest beside Binh Duong Boulevard.' } },
  { id: 'story', subtitle: 'Ba trạm sạc: năng lượng, hiệu suất, hứng khởi', summary: 'Từ mỗi căn hộ, vài bước chân tới tiện ích cho cơ thể, tâm trí và cảm hứng mỗi ngày.',
    en: { subtitle: 'Three stations: energy, performance, inspiration', summary: 'From every home, a few steps to amenities for body, mind and daily inspiration.' } },
  { id: 'facts', subtitle: 'Thông tin và số liệu dự án', summary: '7,9 ha, 1.286 căn hộ, mật độ xây dựng 20%, 2,5 ha cảnh quan, bàn giao dự kiến Q3/2029.',
    en: { subtitle: 'Project facts and figures', summary: '7.9 ha, 1,286 homes, 20% building density, 2.5 ha of landscape, expected handover Q3/2029.' } },
  { id: 'location', menu: 'Vị trí', subtitle: 'Toạ độ tinh chọn của cộng đồng chuyên gia', summary: 'Trên trục Đại lộ Bình Dương (QL13), liền kề AEON Mall Thuận Giao và gần KCN VSIP 1.',
    en: { menu: 'Location', subtitle: 'A curated address for professionals', summary: 'On Binh Duong Boulevard (NR13), next to AEON Mall Thuan Giao and near VSIP 1 Industrial Park.' } },
  { id: 'position', subtitle: 'Bản đồ vị trí và kết nối vùng', summary: 'Bản đồ tương tác: tiện ích, khu công nghiệp, hạ tầng giao thông quanh Norton Park.',
    en: { subtitle: 'Location and regional connections map', summary: 'Interactive map of amenities, industrial parks and transport infrastructure around Norton Park.' } },
  { id: 'lifestyle', menu: 'Tiện ích', subtitle: 'Những trạm sạc giữa nhịp sống', summary: 'Hồ bơi, lối dạo cây xanh, Work Hub, quảng trường BBQ và dãy Podium Shop nội khu.',
    en: { menu: 'Amenities', subtitle: 'Recharging stations within everyday life', summary: 'A pool, green promenades, a Work Hub, a BBQ plaza and an internal row of Podium Shops.' } },
  { id: 'blocks', subtitle: 'Hai phân khu căn hộ B và C', summary: 'Phân khu B sát AEON Mall Thuận Giao, gần VSIP 1; phân khu C sắp ra mắt.',
    en: { subtitle: 'Two residential zones, B and C', summary: 'Zone B is next to AEON Mall Thuan Giao and near VSIP 1; Zone C is coming soon.' } },
  { id: 'residences', menu: 'Căn hộ', subtitle: 'Mặt bằng căn hộ Studio đến 3PN, Duplex', summary: 'Bộ sưu tập chuẩn sống toàn cầu và đặc tuyển: diện tích, số phòng, cảnh quan từng căn tiêu biểu.',
    en: { menu: 'Residences', subtitle: 'Floor plans from Studio to 3BR and Duplex', summary: 'Global and Signature collections: areas, rooms and views of each typical unit.' } },
  { id: 'news', subtitle: 'Tin tức Norton Park', summary: 'Bài viết mới nhất về Norton Park trên VnEconomy, CafeF, VietnamNet.',
    en: { subtitle: 'Norton Park news', summary: 'The latest articles about Norton Park on VnEconomy, CafeF and VietnamNet.' } },
  { id: 'register', subtitle: 'Đăng ký tư vấn và nhận tài liệu', summary: 'Để lại thông tin để nhận bảng giá, mặt bằng và lịch tham quan nhà mẫu.',
    en: { subtitle: 'Register for advice and brochures', summary: 'Leave your details to receive the price list, floor plans and a show-flat visit schedule.' } },
  { id: 'developer', subtitle: 'Chủ đầu tư Gamuda Land', summary: 'Gamuda Land — hơn 30 năm phát triển đô thị, 11 dự án tại Việt Nam, kiểm soát chất lượng GQUAS.',
    en: { subtitle: 'Developer Gamuda Land', summary: 'Gamuda Land — over 30 years of township development, 11 projects in Vietnam, GQUAS quality control.' } },
  { id: 'calc', subtitle: 'Ước tính giá trị tổ ấm', summary: 'Chọn loại căn và layout để xem diện tích và giá dự kiến.',
    en: { subtitle: 'Estimate the value of your home', summary: 'Choose a home type and layout to see areas and the estimated price.' } },
  { id: 'faq', subtitle: 'Câu hỏi thường gặp', summary: 'Vị trí, quy mô, sản phẩm, tiến độ và chính sách của Norton Park.',
    en: { subtitle: 'Frequently asked questions', summary: 'Location, scale, home types, schedule and policies of Norton Park.' } },
];

/** Section theo ngôn ngữ */
export const sectionsOf = (lang = 'vi') => sections.map((s) => (lang === 'en' && s.en ? { ...s, ...s.en } : s));

/* Snippet cho các mục menu trỏ sang trang khác */
/* Trang con theo chủ đề (hiện ở chân trang để liên kết nội bộ) */
export const topicPaths = ['/vi-tri', '/tien-ich', '/mat-bang'];

export const menuPages = {
  '/bang-tinh-gia': { subtitle: 'Giá dự kiến 63 layout', en: { subtitle: 'Estimated prices for 63 layouts' } },
  '/tin-tuc': { subtitle: 'Tiến độ, pháp lý, thị trường', en: { subtitle: 'Progress, legal and market updates' } },
};

/** subtitle cho một mục menu (dùng làm thuộc tính title của liên kết) */
export function menuSubtitle(to, lang = 'vi') {
  if (to.startsWith('/#')) return sectionsOf(lang).find((s) => s.id === to.slice(2))?.subtitle;
  const m = menuPages[to];
  return m && (lang === 'en' && m.en ? m.en.subtitle : m.subtitle);
}

export const routes = Object.keys(pages);
export const absUrl = (path = '/') => SITE_URL + (path === '/' ? '/' : path.startsWith('/') ? path : '/' + path);

/** URL tuyệt đối của một route (đường dẫn tiếng Việt) theo ngôn ngữ: ('/tin-tuc','en') → https://…/en/tin-tuc */
export function langUrl(path, lang = 'vi') {
  if (lang !== 'en') return absUrl(path);
  return SITE_URL + '/en' + (path === '/' ? '' : path);
}
