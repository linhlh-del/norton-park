/* ============================================================
   NỘI DUNG TIẾNG ANH — chỉ chứa CHỮ, ghép đè lên src/data/site.js theo đúng cấu trúc
   (mảng ghép theo thứ tự phần tử). Ảnh, mã căn, diện tích số, đường dẫn… lấy từ bản tiếng Việt.
   Số liệu dạng chữ viết theo kiểu tiếng Anh (7.9 ha, 1,286).
   ============================================================ */

const GLOBAL = 'Global Living Collection';
const SPECIAL = 'Signature Living Collection';

export default {
  GLOBAL,
  SPECIAL,

  contact: {
    address: '5 Binh Duong Boulevard, Thuan Giao Ward, Ho Chi Minh City',
  },

  disclaimer:
    'Images, renderings and information are for illustration only and may be adjusted by the developer. This is not an offer for sale or a contract; official information is governed by the sale and purchase agreement.',

  mainNav: [
    { label: 'Story' },
    { label: 'Location' },
    { label: 'Amenities' },
    { label: 'Residences' },
    { label: 'Price calculator' },
    { label: 'News' },
  ],

  legalLinks: ['Privacy policy', 'Terms of use', 'Disclaimer', 'Legal disclosure', 'Fraud warning'],

  stations: [
    {
      title: 'Energy',
      imageLabel: 'Rendering: energy station',
      body: 'A central pool, golf practice area and skate park right next to home — staying active becomes a natural joy every day.',
    },
    {
      title: 'Performance',
      imageLabel: 'Rendering: performance station',
      body: 'A Work Hub with landscape-facing seats, private meeting rooms and a Café & Tea corner — close enough to work, private enough to unwind.',
    },
    {
      title: 'Inspiration',
      imageLabel: 'Rendering: inspiration station',
      body: 'Wide lawns for children and pets, plus a Rain Garden where plants grow on the water.',
    },
  ],

  facts: [
    { value: '7.9 ha', label: 'Master plan' },
    { value: '1,286', label: 'Residences' },
    { value: '20%', label: 'Building density' },
    { value: '2.5 ha', label: 'Landscape & parks' },
    { value: '3 : 1', label: 'Parking ratio' },
    { value: '2', label: 'Zones B and C' },
    { value: 'Q3/2029', label: 'Expected handover' },
  ],

  collections: [
    {
      title: GLOBAL,
      units: [
        { label: 'Studio', rooms: '1 bedroom, 1 bathroom', gfa: '42.12 m²', nsa: '38.13 m²', view: 'Internal park, Home Canary residential area' },
        { name: '1BR+', label: '1 bedroom+', code: '[Unit code]', rooms: '[Updating]', gfa: '50.65 m²', nsa: 'From 46.46 m²', view: '[Updating]' },
        { name: '2BR', label: '2 bedrooms', code: '[Unit code]', rooms: '2 bedrooms', gfa: '79.24 m²', nsa: 'From 60.80 m²', view: '[Updating]' },
        { name: '2BR+', label: '2 bedrooms+', code: '[Unit code]', rooms: '[Updating]', gfa: '87.20 m²', nsa: 'From 79.96 m²', view: '[Updating]' },
        { name: '3BR', label: '3 bedrooms', code: '[Unit code]', rooms: '3 bedrooms', gfa: '113.65 m²', nsa: 'From 88.56 m²', view: '[Updating]' },
      ],
    },
    {
      title: SPECIAL,
      units: [
        { name: 'Garden residence', label: 'Garden residence', code: '[Unit code]', rooms: '[Updating]', gfa: 'From 51.08 m²', nsa: 'From 47.15 m²', view: '[Updating]' },
        { plans: [{ label: 'Level 1' }, { label: 'Level 2' }], code: '[Unit code]', rooms: '[Updating]', gfa: '156.07 m²', nsa: 'From 128.56 m²', view: '[Updating]' },
        { name: 'Garden duplex', label: 'Garden duplex', plans: [{ label: 'Level 1' }, { label: 'Level 2' }], code: '[Unit code]', rooms: '[Updating]', gfa: '139.86 m²', nsa: '128.96 m²', view: '[Updating]' },
        { plans: [{ label: 'Level 1' }, { label: 'Level 2' }], code: '[Unit code]', rooms: '—', gfa: '189.01 m²', nsa: 'From 129.97 m²', view: '[Updating]' },
      ],
    },
  ],

  registerTypes: [
    { title: GLOBAL, items: ['Studio', '1 bedroom+', '2 bedrooms', '2 bedrooms+', '3 bedrooms'] },
    { title: SPECIAL, items: ['Garden residence', 'Duplex', 'Garden duplex', 'Podium Shop', 'Standalone Shop'] },
  ],

  lifestyle: [
    { tag: 'Wellness', imageLabel: 'Central swimming pool', title: 'Recharge your energy every day', body: 'A generous pool among layers of greenery, for morning laps that start the day right.' },
    { tag: 'Green & calm', imageLabel: 'Tree-lined promenade', title: 'Made of cherished moments', body: 'Shaded walkways and soft lawns — where the whole family slows down together.' },
    { tag: 'Work & focus', imageLabel: 'Work Hub', title: 'Open space, unlocked potential', body: 'Sun-filled work corners, team spaces and private meeting rooms for every need.' },
    { tag: 'Community', imageLabel: 'Plaza & BBQ', title: 'Natural connections that shape a community', body: 'A plaza, BBQ in the forest and weekend gatherings for residents of every generation.' },
    { tag: 'Shopping & café', imageLabel: 'Podium Shop', title: 'A global rhythm along the streets', body: 'Corner cafés, a row of Podium Shops and standalone stores flowing into one another.' },
  ],

  posts: [
    { cat: 'Market & press', date: 'October 14, 2026', title: 'Upgraded supply sets a new price level for apartments in northern Ho Chi Minh City', body: 'In 2026 the northern HCMC apartment segment clearly accelerated, with prices reaching a new level as major developers entered the market.' },
    { cat: 'Market & press', date: 'October 12, 2026', title: 'Gamuda Land brings international living standards to northern Ho Chi Minh City', body: 'Norton Park — a 7.9-hectare project with six towers and around 20% building density — marks Gamuda Land’s new step in the area.' },
    { cat: 'Project news', date: 'October 10, 2026', title: 'Norton Park makes a striking debut at The Sync Show, drawing 2,000 sales professionals', body: 'The Sync Show was the first time Gamuda Land introduced Norton Park to around 2,000 sales professionals.' },
    { cat: 'Project news', date: 'October 9, 2026', title: 'Over 2,000 people join the Norton Park kick-off ceremony', body: 'The kick-off introduced the 7.9-hectare project with 1,286 units in northern Ho Chi Minh City.' },
    { cat: 'Market & press', date: 'October 6, 2026', title: 'Northern HCMC real estate enters the “race” to raise living standards', body: 'The area is shifting from manufacturing hub to high-tech growth pole, driving demand for integrated housing.' },
    { cat: 'Market & press', date: '[Publish date]', title: 'From “industrial capital” to a new growth pole: northern HCMC real estate races to raise the bar', body: 'Northern HCMC’s industrial foundation is creating demand for a new standard of living.' },
  ],

  homeNews: [
    {
      cat: 'Event',
      alt: 'The Norton Park kick-off stage at The Sync Show, thousands of attendees waving flags under the lights',
      title: 'Norton Park makes a striking debut at The Sync Show, drawing 2,000 sales professionals',
      excerpt: 'Two thousand sales professionals gathered at The Sync Show, where Gamuda Land first introduced Norton Park, a 7.9-hectare project with six towers.',
    },
    {
      cat: 'Market',
      alt: 'Aerial view of Binh Duong Boulevard and residential areas in northern HCMC, with downtown high-rises in the distance',
      title: 'Upgraded supply sets a new price level for apartments in northern Ho Chi Minh City',
      excerpt: '2026 saw a clear acceleration of the northern HCMC apartment market, with prices reaching a new level and many major developers joining the “race”.',
    },
    {
      cat: 'Market',
      alt: 'Rendering of the pool, landscaped walkway and curved-glass café inside Norton Park',
      title: 'Gamuda Land brings international living standards to northern Ho Chi Minh City',
      excerpt: 'Norton Park marks a new step for Gamuda Land in northern HCMC: a 7.9-hectare project with six towers and around 20% building density.',
    },
  ],

  newsCategories: ['All', 'Project news', 'Legal & progress', 'Regional infrastructure', 'Market & press'],

  team: [
    { role: 'Architectural design consultant' },
    { role: 'Interior design consultant' },
    { role: 'Landscape design consultant' },
    { role: 'Structural consultant', name: '[Updating]' },
    { role: 'Substructure contractor' },
  ],

  faq: [
    { q: 'Where is Norton Park located?', a: 'Norton Park is located at 5 Binh Duong Boulevard (National Route 13), Thuan Giao Ward, Ho Chi Minh City — a well-connected address next to AEON Mall Thuan Giao and VSIP 1 Industrial Park, opposite Song Be Golf Course.' },
    { q: 'What is the scale and building density of Norton Park?', a: 'The project covers 7.9 hectares with a building density of only 20% and 2.5 hectares of landscape, where layers of trees are grown using Japan’s Miyawaki forest method. It comprises two zones, B and C, with six 19-storey towers (plus one basement) and five standalone shop buildings, offering 1,286 units and a 3:1 parking ratio.' },
    { q: 'What types of homes does Norton Park offer?', a: 'Norton Park has two collections: the Global Living Collection with Studio (typical unit 42.12 m²), 1 bedroom+ (50.65 m²), 2 bedrooms (79.24 m²), 2 bedrooms+ (87.20 m²) and 3 bedrooms (113.65 m²); and the Signature Living Collection with Garden residences (from 51.08 m²), Duplex (156.07 m²), Garden duplex (139.86 m²), Podium Shop (189.01 m²) and Standalone Shops.' },
    { q: 'Who is the developer of Norton Park?', a: 'Norton Park is developed by Gamuda Land (founded in 1995) — the property arm of Gamuda Berhad (Malaysia), with more than 30 years of experience creating sustainable townships in Malaysia, Singapore, Vietnam, the UK and Australia. In Vietnam, Gamuda Land has delivered 11 projects under the comprehensive GQUAS construction quality system.' },
    { q: 'When is Norton Park expected to be handed over?', a: 'Norton Park is expected to be handed over in Q3/2029 (the detailed schedule and handover conditions are set out in the Sale and Purchase Agreement and the developer’s official announcements).' },
    { q: 'Where are Norton Park’s official channels, price calculator and 360° map?', a: 'The only official website of Norton Park (developer Gamuda Land — legal entity: Skybridge Company Limited, tax code 3700755234) is https://www.nortonpark.com.vn/. Customers can use the estimated price calculator and look up 63 official Zone B floor plans at https://www.nortonpark.com.vn/en/bang-tinh-gia, explore the 360° map at https://360.nortonpark.com.vn/ or contact the official hotline 093 860 90 23 and info@nortonpark.com.vn.' },
  ],

  priceTypes: [
    { rooms: '1 bedroom · 1 bathroom', gfa: '42.12 – 42.32', nsa: '38.00 – 38.44', layouts: [
      { view: 'Internal park · Home Canary residential area', units: '7 units' },
      { view: 'Internal park · Home Canary residential area', units: '[Units]' },
      { view: 'Internal park · Home Canary residential area', units: '[Units]' },
    ] },
    { name: '1BR+', rooms: '[Rooms]', gfa: '50.45 – 51.08', nsa: '46.46 – 47.00' },
    { name: '2BR', rooms: '2 bedrooms', gfa: '66.38 – 79.36', nsa: '60.80 – 72.43' },
    { name: '2BR+', rooms: '[Rooms]', gfa: '86.93 – 87.20', nsa: '79.96 – 80.42' },
    { name: '3BR', rooms: '3 bedrooms', gfa: '95.36 – 113.81', nsa: '88.56 – 106.98' },
    { name: 'Garden residence', rooms: '[Rooms]', gfa: '51.08 – 95.44', nsa: '47.15 – 88.55' },
    { rooms: '[Rooms]', gfa: '140.21 – 156.07', nsa: '128.56 – 143.01' },
    { name: 'Garden duplex', rooms: '[Rooms]', gfa: '139.86', nsa: '128.96' },
    { rooms: 'Podium retail', gfa: '141.70 – 255.48', nsa: '129.97 – 238.69' },
  ],

  layoutPlaceholders: { smallest: '[Smallest layout]', largest: '[Largest layout]', view: '[View]', units: '[Units]' },
};
