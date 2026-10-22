import { contact, faq, homeNews, images, lifestyle, posts, priceTypes } from '@/data/site';
import { SITE, SITE_URL, absUrl, pages, sections } from './site-meta';

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
  url: 'https://gamudaland.com.vn/',
  legalName: known(contact.legalName),
};

const project = {
  '@type': ['ApartmentComplex', 'Place'],
  '@id': id('project'),
  name: SITE.name,
  alternateName: SITE.alternateName,
  description: pages['/'].description,
  url: absUrl('/'),
  image: absUrl(images.hero),
  telephone: '+84938609023',
  email: contact.email,
  numberOfAccommodationUnits: 1286,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Số 5 Đại lộ Bình Dương (Quốc lộ 13)',
    addressLocality: 'Phường Thuận Giao',
    addressRegion: 'Thành phố Hồ Chí Minh',
    addressCountry: 'VN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 10.9311995, longitude: 106.712967 },
  hasMap: contact.mapUrl,
  sameAs: [contact.fanpageUrl],
  amenityFeature: lifestyle.map((l) => ({ '@type': 'LocationFeatureSpecification', name: l.imageLabel, value: true })),
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
  alternateName: SITE.alternateName,
  inLanguage: SITE.lang,
  publisher: { '@id': id('organization') },
  about: { '@id': id('project') },
};

function breadcrumb(path) {
  const items = [{ name: pages['/'].breadcrumb, url: absUrl('/') }];
  if (path !== '/') items.push({ name: pages[path].breadcrumb, url: absUrl(path) });
  return {
    '@type': 'BreadcrumbList',
    '@id': absUrl(path) + '#breadcrumb',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

function webPage(path, type = 'WebPage') {
  const p = pages[path];
  return {
    '@type': type,
    '@id': absUrl(path) + '#webpage',
    url: absUrl(path),
    name: p.title,
    description: p.description,
    inLanguage: SITE.lang,
    isPartOf: { '@id': id('website') },
    about: { '@id': id('project') },
    publisher: { '@id': id('organization') },
    breadcrumb: { '@id': absUrl(path) + '#breadcrumb' },
    primaryImageOfPage: { '@type': 'ImageObject', url: absUrl(p.image || images.hero) },
  };
}

const perPage = {
  '/': () => [
    {
      ...webPage('/'),
      /* snippet từng section: Google dùng để hiểu cấu trúc trang & gợi ý sitelinks/đoạn trích */
      hasPart: sections.map((s) => ({
        '@type': 'WebPageElement',
        '@id': `${absUrl('/')}#${s.id}`,
        cssSelector: `#${s.id}`,
        name: s.subtitle,
        description: s.summary,
      })),
      mainEntity: { '@id': id('faq') },
    },
    {
      '@type': 'FAQPage',
      '@id': id('faq'),
      inLanguage: SITE.lang,
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'ItemList',
      '@id': id('news'),
      name: 'Báo chí viết về Norton Park',
      itemListElement: homeNews.map((n, i) => ({ '@type': 'ListItem', position: i + 1, url: n.url, name: n.title })),
    },
  ],
  '/bang-tinh-gia': () => [webPage('/bang-tinh-gia')],
  '/tin-tuc': () => [
    {
      ...webPage('/tin-tuc', 'CollectionPage'),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title })),
      },
    },
  ],
};

/* bỏ khoá undefined để JSON gọn và hợp lệ */
const clean = (v) => JSON.parse(JSON.stringify(v));

/** JSON-LD đầy đủ cho một route (null nếu route không lập chỉ mục) */
export function structuredData(path) {
  const build = perPage[path];
  if (!build) return null;
  return clean({
    '@context': 'https://schema.org',
    '@graph': [organization, website, project, ...build(), breadcrumb(path)],
  });
}
