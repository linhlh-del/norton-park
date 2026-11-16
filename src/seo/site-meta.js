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
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://norton-park-ten.vercel.app').replace(/\/+$/, '');

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
  /* Trang chi tiết bổ sung — thân trang ở src/sections/detail/DetailBodies.jsx, nội dung src/data/details.js */
  '/tong-quan': {
    title: 'Tổng quan dự án Norton Park — Gamuda Land Bình Dương',
    description:
      'Thông tin tổng quan Norton Park: 7,9 ha, 6 toà tháp 19 tầng, 1.286 sản phẩm, mật độ xây dựng 20%, sở hữu lâu dài, bàn giao dự kiến Q3/2029. Xem chi tiết dự án.',
    breadcrumb: 'Tổng quan',
    h1: 'Tổng quan dự án căn hộ Norton Park — Gamuda Land',
    intro: [
      'Norton Park là cộng đồng căn hộ của Gamuda Land trên khu đất 7,9 ha mặt tiền Đại lộ Bình Dương, Phường Thuận Giao, TP.HCM, với mật độ xây dựng 20% và 2,5 ha cảnh quan.',
      'Dự án gồm hai phân khu, sáu toà tháp cao 19 tầng và 1.286 sản phẩm từ Studio đến Duplex, Podium Shop; bàn giao dự kiến Quý 3/2029.',
    ],
    changefreq: 'monthly',
    priority: 0.9,
    image: '/images/imgi_12_masterplan-birdview-r16.webp',
    en: {
      title: 'Norton Park overview — Gamuda Land in Binh Duong',
      description:
        'Norton Park at a glance: 7.9 ha, 6 towers of 19 floors, 1,286 units, 20% building density, long-term ownership and expected handover in Q3/2029. See details.',
      breadcrumb: 'Overview',
      h1: 'Norton Park project overview — Gamuda Land',
      intro: [
        'Norton Park is a Gamuda Land residential community on a 7.9 ha site fronting Binh Duong Boulevard in Thuan Giao Ward, Ho Chi Minh City, with 20% building density and 2.5 ha of landscape.',
        'The project has two zones, six 19-storey towers and 1,286 units from Studios to Duplexes and Podium Shops, with handover expected in Q3/2029.',
      ],
    },
  },
  '/gia-ban': {
    title: 'Giá bán Norton Park 11/2026 — Từ 66 triệu/m²',
    description:
      'Giá bán Norton Park theo bảng giá 11/2026: từ 66 triệu/m², Studio từ khoảng 2,78 tỷ, 2PN từ 4,38 tỷ, 3PN từ 6,29 tỷ. Xem giá từng loại căn và nhận báo giá.',
    breadcrumb: 'Giá bán',
    h1: 'Giá bán căn hộ Norton Park — Bảng giá tham khảo 11/2026',
    intro: [
      'Bảng giá Norton Park Phân khu B tháng 11/2026 có đơn giá tham khảo từ 66 triệu/m², áp dụng cho các loại căn Studio, 1PN+, 2PN, 2PN+, 3PN và căn hộ sân vườn.',
      'Giá từng căn thay đổi theo tầng, hướng, tầm nhìn và phương thức thanh toán. Tra cứu chi tiết 63 layout tại Bảng tính giá hoặc đăng ký để nhận báo giá chính thức.',
    ],
    changefreq: 'weekly',
    priority: 0.9,
    image: '/images/block-b.jpg',
    en: {
      title: 'Norton Park prices 11/2026 — From VND 66 million/m²',
      description:
        'Norton Park prices under the 11/2026 list: from VND 66 million/m², Studios from about VND 2.78 bn, 2BR from 4.38 bn, 3BR from 6.29 bn. See prices and get a quote.',
      breadcrumb: 'Prices',
      h1: 'Norton Park apartment prices — Reference price list 11/2026',
      intro: [
        'The November 2026 price list for Norton Park Zone B starts from VND 66 million/m² for Studio, 1BR+, 2BR, 2BR+, 3BR and garden homes.',
        'Each unit’s price depends on floor, orientation, view and payment plan. Look up all 63 layouts in the price calculator or register for an official quote.',
      ],
    },
  },
  '/chinh-sach-ban-hang': {
    title: 'Chính sách bán hàng Norton Park — 5 phương thức thanh toán',
    description:
      'Chính sách bán hàng Norton Park: 5 phương thức thanh toán, chiết khấu đến 10%, vay ngân hàng có hỗ trợ lãi suất, ký HĐMB 12/2026 và bàn giao 09/2029. Xem ngay.',
    breadcrumb: 'Chính sách bán hàng',
    h1: 'Chính sách bán hàng và phương thức thanh toán Norton Park',
    intro: [
      'Norton Park áp dụng 5 phương thức thanh toán với mức chiết khấu từ 1% đến 10%, cùng phương án vay ngân hàng có hỗ trợ lãi suất.',
      'Khách hàng thanh toán 10–15% khi ký hợp đồng mua bán (dự kiến 12/2026), 25–35% khi bàn giao (dự kiến 09/2029) và 5% khi nhận sổ.',
    ],
    changefreq: 'weekly',
    priority: 0.8,
    en: {
      title: 'Norton Park sales policy — 5 payment plans',
      description:
        'Norton Park sales policy: 5 payment plans, discounts up to 10%, bank loans with interest support, SPA signing in 12/2026 and handover in 09/2029. Read more.',
      breadcrumb: 'Sales policy',
      h1: 'Norton Park sales policy and payment plans',
      intro: [
        'Norton Park offers five payment plans with discounts from 1% to 10%, plus a bank-loan option with interest support.',
        'Buyers pay 10–15% at SPA signing (expected 12/2026), 25–35% at handover (expected 09/2029) and 5% on receiving the title deed.',
      ],
    },
  },
  '/chu-dau-tu': {
    title: 'Chủ đầu tư Norton Park — Gamuda Land Việt Nam',
    description:
      'Chủ đầu tư Norton Park là Gamuda Land, thuộc Tập đoàn Gamuda Berhad (Malaysia), 11 dự án tại Việt Nam như Gamuda City, Celadon City. Tìm hiểu đơn vị phát triển.',
    breadcrumb: 'Chủ đầu tư',
    h1: 'Chủ đầu tư Norton Park — Gamuda Land',
    intro: [
      'Norton Park được phát triển bởi Gamuda Land, đơn vị bất động sản của Tập đoàn Gamuda Berhad (Malaysia), có mặt tại Việt Nam từ năm 2007.',
      'Gamuda Land đã phát triển 11 dự án tại Việt Nam và áp dụng hệ thống kiểm soát chất lượng công trình GQUAS cho từng toà tháp trước khi bàn giao.',
    ],
    changefreq: 'monthly',
    priority: 0.7,
    image: '/images/vendor/gamuda.webp',
    en: {
      title: 'Norton Park developer — Gamuda Land Vietnam',
      description:
        'Norton Park is developed by Gamuda Land, part of Gamuda Berhad (Malaysia), with 11 projects in Vietnam including Gamuda City and Celadon City. Meet the developer.',
      breadcrumb: 'Developer',
      h1: 'Norton Park developer — Gamuda Land',
      intro: [
        'Norton Park is developed by Gamuda Land, the property arm of Gamuda Berhad (Malaysia), in Vietnam since 2007.',
        'Gamuda Land has developed 11 projects in Vietnam and applies the GQUAS construction quality system to each tower before handover.',
      ],
    },
  },
  '/tien-do': {
    title: 'Tiến độ Norton Park — Cập nhật công trường và pháp lý',
    description:
      'Tiến độ xây dựng Norton Park tháng 11/2026: thi công cọc, tường vây và tầng hầm Phân khu B; mốc ký HĐMB 12/2026, bàn giao Q3/2029 và hồ sơ pháp lý dự án.',
    breadcrumb: 'Tiến độ',
    h1: 'Tiến độ xây dựng và pháp lý dự án Norton Park',
    intro: [
      'Công trường Norton Park đang thi công phần ngầm Phân khu B: cọc và tường vây cơ bản hoàn tất ở khu phía phải, khu phía trái đang san lấp và ép cọc.',
      'Theo kế hoạch, hợp đồng mua bán dự kiến ký vào tháng 12/2026 và căn hộ dự kiến bàn giao vào Quý 3/2029.',
    ],
    changefreq: 'weekly',
    priority: 0.7,
    en: {
      title: 'Norton Park progress — Site and legal updates',
      description:
        'Norton Park construction progress in November 2026: piling, diaphragm wall and Zone B basement works; SPA signing in 12/2026, handover in Q3/2029 and legal status.',
      breadcrumb: 'Progress',
      h1: 'Norton Park construction progress and legal status',
      intro: [
        'Norton Park is building the Zone B substructure: piling and the diaphragm wall are largely complete in the right-hand area, while the left-hand area is being levelled and piled.',
        'Sale and purchase agreements are expected to be signed in December 2026, with handover expected in Q3/2029.',
      ],
    },
  },
  '/hoi-dap': {
    title: 'Hỏi đáp Norton Park — Giá, thanh toán, pháp lý, bàn giao',
    description:
      'Giải đáp câu hỏi thường gặp về Norton Park: vị trí, quy mô, giá bán, 5 phương thức thanh toán, sở hữu lâu dài, tiêu chuẩn bàn giao, vay ngân hàng và nhà mẫu.',
    breadcrumb: 'Hỏi đáp',
    h1: 'Hỏi đáp về dự án căn hộ Norton Park',
    intro: [
      'Tổng hợp câu hỏi khách hàng quan tâm nhất về Norton Park: vị trí, quy mô, loại căn, giá bán, chính sách thanh toán, hình thức sở hữu và tiến độ bàn giao.',
    ],
    changefreq: 'monthly',
    priority: 0.7,
    en: {
      title: 'Norton Park FAQ — Prices, payment, legal, handover',
      description:
        'Answers to common questions about Norton Park: location, scale, prices, 5 payment plans, long-term ownership, handover standard, bank loans and the show apartment.',
      breadcrumb: 'FAQ',
      h1: 'Norton Park frequently asked questions',
      intro: [
        'The questions buyers ask most about Norton Park: location, scale, home types, prices, payment plans, ownership and handover schedule.',
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
export const topicPaths = ['/tong-quan', '/vi-tri', '/tien-ich', '/mat-bang', '/gia-ban', '/chinh-sach-ban-hang', '/chu-dau-tu', '/tien-do', '/hoi-dap'];

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
