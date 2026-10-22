import { contact, images, lifestyle, priceTypes } from '@/data/site';
import { getSite } from '@/i18n';
import { LANG_META, SITE, SITE_URL, absUrl, langUrl, pageMeta, pages, sectionsOf } from './site-meta';
import { MODIFIED } from './build-date';

/* ============================================================
   DỮ LIỆU CÓ CẤU TRÚC (schema.org JSON-LD) — một @graph cho mỗi trang, các node nối nhau bằng @id
   (Organization ← WebSite ← WebPage → about ApartmentComplex …) để Google hiểu đây là MỘT thực thể.
   Kiểm tra: https://validator.schema.org và https://search.google.com/test/rich-results
   Chỉ khai báo điều có thật trên trang; mục còn chờ thông tin ("[ … ]") bị lọc bỏ.
   ============================================================ */

const id = (frag) => `${SITE_URL}/#${frag}`;
const known = (v) => (typeof v === 'string' && v.trim().startsWith('[') ? undefined : v);
const num = (s) => Number(String(s).replace(/\./g, '').replace(',', '.'));

const organization = {
  '@type': 'Organization',
  '@id': id('organization'),
  name: SITE.developer,
  url: absUrl('/'),
  logo: { '@type': 'ImageObject', url: absUrl('/images/vendor/imgi_24_gamuda-land-logo.webp') },
  sameAs: ['https://gamudaland.com.vn/', contact.fanpageUrl],
  /* pháp nhân chủ đầu tư dự án */
  subOrganization: {
    '@type': 'Organization',
    name: 'Công ty TNHH Skybridge',
    legalName: 'SKYBRIDGE COMPANY LIMITED',
    taxID: '3700755234',
    telephone: '+84-274-6262-888',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Phòng 01-01, Canary Plaza, Số 5, Đại lộ Bình Dương, Phường Thuận Giao',
      addressLocality: 'Thành phố Hồ Chí Minh',
      addressCountry: 'VN',
    },
  },
};

const project = {
  '@type': 'ApartmentComplex',
  '@id': id('project'),
  name: SITE.name,
  alternateName: ['Norton Park', 'Norton Park Gamuda Land', 'Norton Park, A Gamuda Land Community', 'Gamuda Land Norton Park'],
  description: 'Không gian sống mật độ thấp trên Đại lộ Bình Dương, kế cận Khu công nghiệp VSIP 1 và AEON Mall Thuận Giao. A Gamuda Land Community.',
  url: absUrl('/'),
  tourBookingPage: contact.tour360Url,
  image: absUrl(images.hero),
  telephone: '+84934483138',
  email: contact.email,
  numberOfAvailableAccommodationUnits: 1286,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Số 5 Đại lộ Bình Dương, Phường Thuận Giao',
    addressLocality: 'Thành phố Hồ Chí Minh',
    addressCountry: 'VN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 10.9311995, longitude: 106.712967 },
  hasMap: contact.mapUrl,
  sameAs: [contact.mapUrl, contact.tour360Url, contact.fanpageUrl, contact.zaloUrl],
  amenityFeature: [
    'Mật độ xây dựng toàn khu 20%',
    '2,5 ha diện tích cảnh quan với các tầng cây vun bồi theo phương pháp rừng Miyawaki Nhật Bản',
    '3 Trạm sạc: Trạm sạc năng lượng, Trạm sạc hiệu suất, Trạm sạc hứng khởi',
    'Tỷ lệ chỗ đỗ xe 3:1',
    ...lifestyle.map((l) => l.imageLabel),
  ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  contributor: [
    ['DP Architects', 'Tư vấn thiết kế kiến trúc'],
    ['dwp (Design Worldwide Partnership)', 'Tư vấn thiết kế nội thất'],
    ['Belt Collins', 'Tư vấn thiết kế cảnh quan'],
    ['CBM', 'Nhà thầu phần ngầm'],
  ].map(([name, description]) => ({ '@type': 'Organization', name, description })),
  containsPlace: priceTypes
    .filter((t) => !/shop/i.test(t.name))
    .map((t) => ({
      '@type': 'Apartment',
      name: `${SITE.name} — ${t.name}`,
      numberOfRooms: known(t.rooms) && Number(t.rooms.match(/\d+/)?.[0]) || undefined,
      floorSize: {
        '@type': 'QuantitativeValue',
        minValue: num(t.gfa.split('–')[0]),
        maxValue: num((t.gfa.split('–')[1] || t.gfa.split('–')[0])),
        unitCode: 'MTK',
      },
    })),
};

const website = {
  '@type': 'WebSite',
  '@id': id('website'),
  url: absUrl('/'),
  name: SITE.name,
  alternateName: 'Norton Park, A Gamuda Land Community',
  inLanguage: ['vi-VN', 'en-US'],
  publisher: { '@id': id('organization') },
};

function breadcrumb(path, lang) {
  const home = pageMeta(pages['/'], lang);
  const items = [{ name: home.breadcrumb, url: langUrl('/', lang) }];
  if (path !== '/') items.push({ name: pageMeta(pages[path], lang).breadcrumb, url: langUrl(path, lang) });
  return {
    '@type': 'BreadcrumbList',
    '@id': langUrl(path, lang) + '#breadcrumb',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

function webPage(path, lang, type = 'WebPage') {
  const p = pageMeta(pages[path], lang);
  const url = langUrl(path, lang);
  return {
    '@type': type,
    '@id': url + '#webpage',
    url,
    name: p.title,
    description: p.description,
    dateModified: MODIFIED,
    inLanguage: LANG_META[lang].inLanguage,
    isPartOf: { '@id': id('website') },
    about: { '@id': id('project') },
    author: { '@id': id('organization') },
    publisher: { '@id': id('organization') },
    breadcrumb: { '@id': url + '#breadcrumb' },
    primaryImageOfPage: { '@type': 'ImageObject', url: absUrl(p.image || images.hero) },
  };
}

const citations = [
  'https://thanhnien.vn/norton-park-khi-loi-the-canh-tranh-bat-dau-tu-tu-duy-quy-hoach-ben-vung-185261019111828875.htm',
  'https://cafef.vn/nguon-cung-nang-hang-gia-can-ho-phia-bac-tphcm-thiet-lap-mat-bang-moi-188261013104820842.chn',
  'https://vietnamnet.vn/gamuda-land-dua-chuan-song-quoc-te-den-phia-bac-tp-hcm-2563454.html',
  'https://en.vneconomy.vn/norton-park-makes-a-striking-debut-at-the-sync-show-drawing-2000-sales-professionals.htm',
  'https://vnexpress.net/hon-2-000-nguoi-tham-gia-le-ra-quan-du-an-norton-park-5130441.html',
  'https://vietnamnet.vn/bat-dong-san-phia-bac-tp-hcm-buoc-vao-cuoc-dua-nang-chuan-khong-gian-song-2561812.html',
  'https://cafeland.vn/tin-tuc/tu-thu-phu-cong-nghiep-den-cuc-tang-truong-moi-thi-truong-bat-dong-san-phia-bac-tphcm-buoc-vao-cuoc-dua-nang-chuan-155552.html',
];

const perPage = {
  '/': (lang) => {
    const { faq, homeNews } = getSite(lang);
    const url = langUrl('/', lang);
    return [
      {
        ...webPage('/', lang),
        datePublished: SITE.published,
        /* đoạn trợ lý giọng nói / AI ưu tiên đọc */
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hero h1', '#facts h2', '#position h2', '#faq summary'] },
        /* bài báo độc lập viết về dự án */
        citation: citations,
        /* snippet từng section: Google dùng để hiểu cấu trúc trang & gợi ý sitelinks/đoạn trích */
        hasPart: sectionsOf(lang).map((s) => ({
          '@type': 'WebPageElement',
          '@id': `${url}#${s.id}`,
          cssSelector: `#${s.id}`,
          name: s.subtitle,
          description: s.summary,
        })),
        mainEntity: { '@id': url + '#faq' },
      },
      {
        '@type': 'FAQPage',
        '@id': url + '#faq',
        inLanguage: LANG_META[lang].inLanguage,
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': url + '#news',
        name: lang === 'en' ? 'Press coverage of Norton Park' : 'Báo chí viết về Norton Park',
        itemListElement: homeNews.map((n, i) => ({ '@type': 'ListItem', position: i + 1, url: n.url, name: n.title })),
      },
    ];
  },
  '/bang-tinh-gia': (lang) => [webPage('/bang-tinh-gia', lang)],
  '/tin-tuc': (lang) => [
    {
      ...webPage('/tin-tuc', lang, 'CollectionPage'),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: getSite(lang).posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title })),
      },
    },
  ],
};

/* bỏ khoá undefined để JSON gọn và hợp lệ */
const clean = (v) => JSON.parse(JSON.stringify(v));

/** JSON-LD đầy đủ cho một route (null nếu route không lập chỉ mục). Dự án / tổ chức / website là thực thể chung
    của hai bản ngôn ngữ (cùng @id); trang, breadcrumb, FAQ là riêng từng bản. */
export function structuredData(path, lang = 'vi') {
  const build = perPage[path];
  if (!build) return null;
  return clean({
    '@context': 'https://schema.org',
    '@graph': [project, organization, website, ...build(lang), breadcrumb(path, lang)],
  });
}
