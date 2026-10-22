/* ============================================================
   NỘI DUNG SITE — tách khỏi component để biên tập một chỗ.
   Mục ghi [ … ] là chỗ chờ thông tin chính thức.
   ============================================================ */

export const images = {
  hero: '/images/overview_hero-facade-sunset.jpg',
  designStory: '/images/hero_design-story-facade.jpg',
  landscapeStory: '/images/imgi_6_landscape-story.jpg',
  masterplan: '/images/imgi_12_masterplan-birdview-r16.webp',
  blockB: '/images/block-b.jpg',
  blockC: '/images/block-c.jpg',
};

export const contact = {
  address: 'Số 5 Đại lộ Bình Dương, Phường Thuận Giao, Thành phố Hồ Chí Minh',
  mapUrl: 'https://www.google.com/maps/place/Norton+Park+Gamuda+Land/@10.9311995,106.712967,19z/data=!4m6!3m5!1s0x3174d711342cd6b1:0x1c66dbf89b9b27df!8m2!3d10.9311995!4d106.712967!16s%2Fg%2F11p1_4vk9l',
  hotline: '093 860 90 23',
  hotlineHref: 'tel:+84938609023',
  email: 'info@nortonpark.com.vn',
  fanpage: 'Norton Park by Gamuda Land',
  fanpageUrl: 'https://www.facebook.com/NortonParkbyGLVN',
  legalName: '[TÊN PHÁP NHÂN]',
  legalAddress: '[ĐỊA CHỈ PHÁP NHÂN]',
};

export const disclaimer =
  'Hình ảnh, phối cảnh và thông tin chỉ mang tính minh hoạ, có thể được chủ đầu tư điều chỉnh. Đây không phải lời chào bán hay hợp đồng; thông tin chính thức căn cứ theo hợp đồng mua bán.';

export const mainNav = [
  { label: 'Câu chuyện', to: '/#design-story' },
  { label: 'Vị trí', to: '/#location' },
  { label: 'Tiện ích', to: '/#lifestyle' },
  { label: 'Căn hộ', to: '/#residences' },
  { label: 'Bảng tính giá', to: '/bang-tinh-gia' },
  { label: 'Tin tức', to: '/tin-tuc' },
];

export const legalLinks = ['Chính sách bảo mật', 'Điều khoản sử dụng', 'Miễn trừ trách nhiệm', 'Công bố pháp lý', 'Cảnh báo giả mạo'];

export const stations = [
  {
    title: 'Năng lượng',
    image: '/images/imgi_7_tram-nang-luong.jpg',
    imageLabel: 'Phối cảnh: trạm năng lượng',
    body: 'Hồ bơi trung tâm, sân tập golf và công viên trượt ván ngay cạnh nhà — vận động trở thành niềm vui tự nhiên mỗi ngày.',
  },
  {
    title: 'Hiệu suất',
    image: '/images/imgi_8_tram-hieu-suat.jpg',
    imageLabel: 'Phối cảnh: trạm hiệu suất',
    body: 'Work Hub với chỗ ngồi hướng cảnh quan, phòng họp riêng và góc Café & Trà — đủ gần để làm việc, đủ riêng để thư giãn.',
  },
  {
    title: 'Hứng khởi',
    image: '/images/imgi_9_tram-hung-khoi.jpg',
    imageLabel: 'Phối cảnh: trạm hứng khởi',
    body: 'Thảm cỏ rộng cho trẻ nhỏ và thú cưng, cùng Vườn Mưa nơi cây cỏ mọc trên mặt nước.',
  },
];

export const facts = [
  { value: '7,9 ha', label: 'Tổng thể quy hoạch' },
  { value: '1.286', label: 'Tổng số căn hộ' },
  { value: '20%', label: 'Mật độ xây dựng' },
  { value: '2,5 ha', label: 'Cảnh quan và công viên' },
  { value: '3 : 1', label: 'Tỉ lệ chỗ đậu xe' },
  { value: '2', label: 'Phân khu B và C' },
  { value: 'Q3/2029', label: 'Bàn giao dự kiến', count: false },
];

export const GLOBAL = 'Bộ sưu tập chuẩn sống toàn cầu';
export const SPECIAL = 'Bộ sưu tập chuẩn sống đặc tuyển';

/* căn tiêu biểu theo bộ sưu tập (mặt bằng căn hộ) */
export const collections = [
  {
    key: 'global',
    title: GLOBAL,
    units: [
      { name: 'Studio', label: 'Studio', code: 'ST1.1A', rooms: '1 phòng ngủ, 1 phòng vệ sinh', gfa: '42,12 m²', nsa: '38,13 m²', view: 'Công viên nội khu, Khu dân cư Home Canary' },
      { name: '1PN+', label: '1 phòng ngủ+', code: '[Mã căn]', rooms: '[Đang cập nhật]', gfa: '50,65 m²', nsa: 'Từ 46,46 m²', view: '[Đang cập nhật]' },
      { name: '2PN', label: '2 phòng ngủ', code: '[Mã căn]', rooms: '2 phòng ngủ', gfa: '79,24 m²', nsa: 'Từ 60,80 m²', view: '[Đang cập nhật]' },
      { name: '2PN+', label: '2 phòng ngủ+', code: '[Mã căn]', rooms: '[Đang cập nhật]', gfa: '87,20 m²', nsa: 'Từ 79,96 m²', view: '[Đang cập nhật]' },
      { name: '3PN', label: '3 phòng ngủ', code: '[Mã căn]', rooms: '3 phòng ngủ', gfa: '113,65 m²', nsa: 'Từ 88,56 m²', view: '[Đang cập nhật]' },
    ],
  },
  {
    key: 'special',
    title: SPECIAL,
    units: [
      { name: 'Căn hộ sân vườn', label: 'Căn hộ sân vườn', code: '[Mã căn]', rooms: '[Đang cập nhật]', gfa: 'Từ 51,08 m²', nsa: 'Từ 47,15 m²', view: '[Đang cập nhật]' },
      { name: 'Duplex', label: 'Duplex', code: '[Mã căn]', rooms: '[Đang cập nhật]', gfa: '156,07 m²', nsa: 'Từ 128,56 m²', view: '[Đang cập nhật]' },
      { name: 'Duplex sân vườn', label: 'Duplex sân vườn', code: '[Mã căn]', rooms: '[Đang cập nhật]', gfa: '139,86 m²', nsa: '128,96 m²', view: '[Đang cập nhật]' },
      { name: 'Podium Shop', label: 'Podium Shop', code: '[Mã căn]', rooms: '—', gfa: '189,01 m²', nsa: 'Từ 129,97 m²', view: '[Đang cập nhật]' },
    ],
  },
];

export const registerTypes = [
  { title: GLOBAL, items: ['Studio', '1 phòng ngủ+', '2 phòng ngủ', '2 phòng ngủ+', '3 phòng ngủ'] },
  { title: SPECIAL, items: ['Căn hộ sân vườn', 'Duplex', 'Duplex sân vườn', 'Podium Shop', 'Standalone Shop'] },
];

export const lifestyle = [
  { tag: 'Wellness', image: '/images/lifestyle-pool.jpg', imageLabel: 'Hồ bơi trung tâm', title: 'Đánh thức nguồn năng lượng mỗi ngày', body: 'Hồ bơi rộng giữa những tầng cây, cho những vòng bơi sớm mai khởi đầu ngày mới.' },
  { tag: 'Xanh và tĩnh', image: '/images/lifestyle-walk.jpg', imageLabel: 'Lối dạo cây xanh', title: 'Từ những khoảnh khắc thân thương', body: 'Lối dạo rợp bóng, thảm cỏ mềm — nơi cả nhà cùng sống chậm lại.' },
  { tag: 'Làm việc và tập trung', image: '/images/lifestyle-workhub.jpg', imageLabel: 'Work Hub', title: 'Khơi mở không gian, đánh thức tiềm năng', body: 'Góc làm việc ngập sáng, không gian nhóm và phòng họp riêng cho mọi nhu cầu.' },
  { tag: 'Cộng đồng', image: '/images/lifestyle-plaza.jpg', imageLabel: 'Quảng trường & BBQ', title: 'Từ kết nối tự nhiên, dệt nên bản sắc cộng đồng', body: 'Quảng trường, BBQ giữa rừng và những buổi hẹn cuối tuần của cư dân đa thế hệ.' },
  { tag: 'Mua sắm và cà phê', image: '/images/lifestyle-podium.jpg', imageLabel: 'Podium Shop', title: 'Nhịp sống toàn cầu lan toả phố xá', body: 'Quán cà phê góc phố, dãy Podium Shop và khối cửa hàng độc lập nối liền nhau.' },
];

export const posts = [
  { cat: 'Thị trường & báo chí', date: '14 tháng 10, 2026', src: 'CafeF', featured: true, title: 'Nguồn cung nâng hạng, giá căn hộ phía Bắc TP.HCM thiết lập mặt bằng mới', body: 'Năm 2026, phân khúc căn hộ phía Bắc TP.HCM tăng tốc rõ rệt, giá bán lên mặt bằng mới khi nhiều chủ đầu tư lớn cùng tham gia.' },
  { cat: 'Thị trường & báo chí', date: '12 tháng 10, 2026', src: 'VietNamNet', title: 'Gamuda Land đưa chuẩn sống quốc tế đến phía Bắc TP.HCM', body: 'Norton Park — dự án 7,9 ha, sáu toà tháp, mật độ xây dựng khoảng 20% — là bước đi mới của Gamuda Land tại khu vực.' },
  { cat: 'Tin tức dự án', date: '10 tháng 10, 2026', src: 'VnEconomy', title: 'Norton Park ra mắt ấn tượng tại The Sync Show, thu hút 2.000 chuyên viên kinh doanh', body: 'Sự kiện The Sync Show là lần đầu Gamuda Land giới thiệu Norton Park tới khoảng 2.000 chuyên viên kinh doanh.' },
  { cat: 'Tin tức dự án', date: '9 tháng 10, 2026', src: 'VnExpress', title: 'Hơn 2.000 người tham gia lễ ra quân dự án Norton Park', body: 'Lễ ra quân giới thiệu dự án 7,9 ha với 1.286 sản phẩm tại phía Bắc TP.HCM.' },
  { cat: 'Thị trường & báo chí', date: '6 tháng 10, 2026', src: 'VietNamNet', title: 'Bất động sản phía bắc TP.HCM bước vào ‘cuộc đua’ nâng chuẩn không gian sống', body: 'Khu vực chuyển từ công xưởng sản xuất sang cực tăng trưởng công nghệ cao, kéo theo nhu cầu nhà ở tích hợp.' },
  { cat: 'Thị trường & báo chí', date: '[Ngày đăng]', src: 'Cafeland', title: 'Từ “thủ phủ công nghiệp” đến cực tăng trưởng mới: thị trường bất động sản phía Bắc TP.HCM bước vào cuộc đua nâng chuẩn', body: 'Nền tảng công nghiệp của phía Bắc TP.HCM đang mở ra nhu cầu về một chuẩn sống mới.' },
];

/* bài báo hiển thị ở section Tin tức trang chủ (carousel). Ảnh đặt tại public/images/news/ */
export const homeNews = [
  {
    id: 'import-vneconomy-the-sync-show',
    cat: 'Sự kiện',
    src: 'VnEconomy',
    url: 'https://en.vneconomy.vn/norton-park-makes-a-striking-debut-at-the-sync-show-drawing-2000-sales-professionals.htm',
    image: '/images/news/vneconomy-the-sync-show.webp',
    alt: 'Sân khấu lễ ra quân Norton Park tại The Sync Show, hàng nghìn khán giả vẫy cờ dưới ánh đèn',
    title: 'Norton Park ra mắt ấn tượng tại The Sync Show, thu hút 2.000 chuyên viên kinh doanh',
    excerpt: 'Hai nghìn chuyên viên kinh doanh tề tựu tại The Sync Show, nơi Gamuda Land lần đầu giới thiệu Norton Park, dự án quy mô 7,9 ha với sáu tòa tháp.',
  },
  {
    id: 'import-cafef-nguon-cung-nang-hang',
    cat: 'Thị trường',
    src: 'CafeF',
    url: 'https://cafef.vn/nguon-cung-nang-hang-gia-can-ho-phia-bac-tphcm-thiet-lap-mat-bang-moi-188261013104820842.chn',
    image: '/images/news/cafef-nguon-cung-nang-hang.webp',
    alt: 'Toàn cảnh trục Đại lộ Bình Dương và khu dân cư phía Bắc TP.HCM nhìn từ trên cao, phía xa là các tòa nhà cao tầng trung tâm',
    title: 'Nguồn cung nâng hạng, giá căn hộ phía Bắc TP.HCM thiết lập mặt bằng mới',
    excerpt: 'Năm 2026 chứng kiến sự tăng tốc rõ nét của thị trường căn hộ phía Bắc TP.HCM, với giá bán thiết lập mặt bằng mới và nhiều chủ đầu tư lớn cùng gia nhập “đường đua”.',
  },
  {
    id: 'import-vietnamnet-chuan-song-quoc-te',
    cat: 'Thị trường',
    src: 'VietNamNet',
    url: 'https://vietnamnet.vn/gamuda-land-dua-chuan-song-quoc-te-den-phia-bac-tp-hcm-2563454.html',
    image: '/images/news/vietnamnet-chuan-song-quoc-te.webp',
    alt: 'Phối cảnh hồ bơi, lối đi cảnh quan và quán cà phê kính cong trong khu nội khu Norton Park',
    title: 'Gamuda Land đưa chuẩn sống quốc tế đến phía Bắc TP.HCM',
    excerpt: 'Norton Park đánh dấu bước tiến mới của Gamuda Land tại phía Bắc TP.HCM, dự án quy mô 7,9 ha với sáu tòa tháp và mật độ xây dựng khoảng 20%.',
  },
];

export const newsCategories =['Tất cả', 'Tin tức dự án', 'Pháp lý & tiến độ', 'Hạ tầng khu vực', 'Thị trường & báo chí'];

export const team = [
  { role: 'Tư vấn thiết kế kiến trúc', name: 'DP Architects' },
  { role: 'Tư vấn thiết kế nội thất', name: 'dwp' },
  { role: 'Tư vấn thiết kế cảnh quan', name: 'Belt Collins' },
  { role: 'Tư vấn kết cấu', name: '[Đang cập nhật]' },
  { role: 'Nhà thầu phần ngầm', name: 'CBM' },
];

export const faq = [
  { q: 'Norton Park nằm ở đâu?', a: 'Số 5 Đại lộ Bình Dương (Quốc lộ 13), Phường Thuận Giao, TP.HCM — liền kề AEON Mall Thuận Giao và gần KCN VSIP 1.' },
  { q: 'Quy mô và mật độ xây dựng?', a: 'Tổng thể 7,9 ha, 1.286 căn, mật độ xây dựng 20% và 2,5 ha cảnh quan, chia thành hai phân khu B và C.' },
  { q: 'Dự án có những loại sản phẩm nào?', a: 'Bộ sưu tập chuẩn sống toàn cầu (Studio, 1PN+, 2PN, 2PN+, 3PN) và bộ sưu tập chuẩn sống đặc tuyển (căn hộ sân vườn, Duplex, Duplex sân vườn, Podium Shop, Standalone Shop).' },
  { q: 'Chủ đầu tư là ai?', a: 'Gamuda Land — mảng bất động sản của tập đoàn Gamuda Berhad (Malaysia).' },
  { q: 'Khi nào bàn giao?', a: 'Dự kiến quý 3 năm 2029.' },
  { q: 'Kênh thông tin chính thức?', a: '[Danh sách kênh chính thức]' },
];

/* ---------- bảng tính giá ---------- */
export const PRICE_PER_M2 = 66000000;

export const priceTypes = [
  {
    name: 'Studio', col: GLOBAL, rooms: '1 phòng ngủ · 1 phòng vệ sinh', count: 3, gfa: '42,12 – 42,32', nsa: '38,00 – 38,44', priced: true,
    layouts: [
      { code: 'ST1.1a', gfa: 42.12, nsa: 38.13, view: 'Công viên nội khu · Khu dân cư Home Canary', units: '7 căn' },
      { code: 'ST1.1b', gfa: 42.32, nsa: 38.44, view: 'Công viên nội khu · Khu dân cư Home Canary', units: '[Số căn]' },
      { code: 'ST1.1c', gfa: 42.15, nsa: 38.0, view: 'Công viên nội khu · Khu dân cư Home Canary', units: '[Số căn]' },
    ],
  },
  { name: '1PN+', col: GLOBAL, rooms: '[Số phòng]', count: 8, gfa: '50,45 – 51,08', nsa: '46,46 – 47,00', priced: true, min: [50.45, 46.46], max: [51.08, 47.0] },
  { name: '2PN', col: GLOBAL, rooms: '2 phòng ngủ', count: 20, gfa: '66,38 – 79,36', nsa: '60,80 – 72,43', priced: true, min: [66.38, 60.8], max: [79.36, 72.43] },
  { name: '2PN+', col: GLOBAL, rooms: '[Số phòng]', count: 3, gfa: '86,93 – 87,20', nsa: '79,96 – 80,42', priced: true, min: [86.93, 79.96], max: [87.2, 80.42] },
  { name: '3PN', col: GLOBAL, rooms: '3 phòng ngủ', count: 11, gfa: '95,36 – 113,81', nsa: '88,56 – 106,98', priced: true, min: [95.36, 88.56], max: [113.81, 106.98] },
  { name: 'Căn hộ sân vườn', col: SPECIAL, rooms: '[Số phòng]', count: 6, gfa: '51,08 – 95,44', nsa: '47,15 – 88,55', priced: true, min: [51.08, 47.15], max: [95.44, 88.55] },
  { name: 'Duplex', col: SPECIAL, rooms: '[Số phòng]', count: 2, gfa: '140,21 – 156,07', nsa: '128,56 – 143,01', priced: false, min: [140.21, 128.56], max: [156.07, 143.01] },
  { name: 'Duplex sân vườn', col: SPECIAL, rooms: '[Số phòng]', count: 1, gfa: '139,86', nsa: '128,96', priced: false, min: [139.86, 128.96] },
  { name: 'Podium Shop', col: SPECIAL, rooms: 'Thương mại khối đế', count: 9, gfa: '141,70 – 255,48', nsa: '129,97 – 238,69', priced: false, min: [141.7, 129.97], max: [255.48, 238.69] },
];

export function layoutsOf(type) {
  if (type.layouts) return type.layouts;
  const out = [{ code: '[Layout nhỏ nhất]', gfa: type.min[0], nsa: type.min[1], view: '[Cảnh quan]', units: '[Số căn]' }];
  if (type.max) out.push({ code: '[Layout lớn nhất]', gfa: type.max[0], nsa: type.max[1], view: '[Cảnh quan]', units: '[Số căn]' });
  return out;
}

const area = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const vnd = new Intl.NumberFormat('vi-VN');
export const m2 = (x) => area.format(x) + ' m²';
export const money = (x) => vnd.format(Math.round(x)) + ' ₫';
