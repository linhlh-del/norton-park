/* ============================================================
   ANALYTICS — Google Tag Manager + dataLayer + ghi nhận nguồn truy cập (UTM / click id / referrer).

   Cấu hình (.env.production):
     VITE_GTM_ID=GTM-XXXXXXX      bật GTM (bỏ trống = không tải gì, chỉ ghi dataLayer)
   GA4, Google Ads, Meta Pixel, TikTok… cấu hình TRONG GTM, không gắn trực tiếp vào code.
   Danh sách sự kiện và cách dựng tag/trigger: docs/ANALYTICS.md
   ============================================================ */

const GTM_ID = import.meta.env?.VITE_GTM_ID || '';
const FIRST_KEY = 'np_first_touch';
const LAST_KEY = 'np_last_touch';
const TTL = 90 * 24 * 3600 * 1000; // first-touch giữ 90 ngày (bằng cửa sổ chuyển đổi mặc định của GA4)

const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
/* click id của nền tảng quảng cáo → suy ra nguồn khi link thiếu UTM */
const CLICK_IDS = { gclid: ['google', 'cpc'], gbraid: ['google', 'cpc'], wbraid: ['google', 'cpc'], fbclid: ['facebook', 'paid_social'], ttclid: ['tiktok', 'paid_social'], msclkid: ['bing', 'cpc'], zclid: ['zalo', 'paid_social'] };
/* referrer → nguồn tự nhiên */
const REFERRERS = [
  [/(^|\.)google\./, 'google', 'organic'], [/(^|\.)bing\.com$/, 'bing', 'organic'], [/(^|\.)coccoc\.com$/, 'coccoc', 'organic'],
  [/(^|\.)yahoo\./, 'yahoo', 'organic'], [/(^|\.)duckduckgo\.com$/, 'duckduckgo', 'organic'],
  [/(^|\.)(facebook|fb)\.com$|(^|\.)m\.me$/, 'facebook', 'social'], [/(^|\.)instagram\.com$/, 'instagram', 'social'],
  [/(^|\.)zalo\.(me|vn)$/, 'zalo', 'social'], [/(^|\.)tiktok\.com$/, 'tiktok', 'social'], [/(^|\.)youtube\.com$/, 'youtube', 'social'],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, 'linkedin', 'social'], [/(^|\.)(t\.co|x\.com|twitter\.com)$/, 'twitter', 'social'],
];

export const dataLayer = () => (window.dataLayer = window.dataLayer || []);

/** Đẩy sự kiện vào dataLayer (GTM đọc). Tên sự kiện theo chuẩn GA4: chữ thường, gạch dưới. */
export function track(event, params = {}) {
  if (typeof window === 'undefined') return;
  dataLayer().push({ event, ...params });
}

const store = {
  get(k, s = localStorage) { try { return JSON.parse(s.getItem(k)); } catch { return null; } },
  set(k, v, s = localStorage) { try { s.setItem(k, JSON.stringify(v)); } catch { /* chế độ riêng tư / bị chặn */ } },
};

/** Xác định nguồn của lượt truy cập hiện tại */
function detectTouch() {
  const q = new URLSearchParams(location.search);
  const t = { landing_page: location.pathname + location.search, ts: Date.now() };
  for (const k of UTM) if (q.get(k)) t[k] = q.get(k).slice(0, 150);
  for (const [k, [src, med]] of Object.entries(CLICK_IDS)) {
    if (q.get(k)) { t[k] = q.get(k).slice(0, 200); t.utm_source ??= src; t.utm_medium ??= med; }
  }
  let refHost = '';
  try { refHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* referrer lạ */ }
  if (refHost && refHost !== location.hostname) {
    t.referrer = refHost;
    if (!t.utm_source) {
      const hit = REFERRERS.find(([re]) => re.test(refHost));
      t.utm_source = hit ? hit[1] : refHost;
      t.utm_medium = hit ? hit[2] : 'referral';
    }
  }
  if (!t.utm_source) { t.utm_source = '(direct)'; t.utm_medium = '(none)'; }
  return t;
}

/**
 * first_touch: nguồn đầu tiên đưa khách tới (giữ 90 ngày).
 * last_touch: nguồn gần nhất KHÔNG phải direct (mô hình "last non-direct click" như GA4).
 */
function captureAttribution() {
  const now = detectTouch();
  const first = store.get(FIRST_KEY);
  if (!first || Date.now() - first.ts > TTL) store.set(FIRST_KEY, now);
  if (now.utm_source !== '(direct)' || !store.get(LAST_KEY)) store.set(LAST_KEY, now);
}

const pick = (t, prefix) => t ? Object.fromEntries(
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'ttclid', 'referrer', 'landing_page']
    .filter((k) => t[k]).map((k) => [prefix + k, t[k]]),
) : {};

/** Trường nguồn gắn vào lead gửi CRM: ft_* (first touch) và lt_* (last non-direct touch) */
export function attribution() {
  if (typeof window === 'undefined') return {};
  return { ...pick(store.get(FIRST_KEY), 'ft_'), ...pick(store.get(LAST_KEY), 'lt_') };
}

/** page_view cho SPA — gọi mỗi lần đổi route (kể cả lần đầu). GA4 trong GTM tắt page_view tự động, dùng sự kiện này. */
let lastPath = '';
export function pageView(path, title) {
  if (path === lastPath) return;
  lastPath = path;
  track('virtual_page_view', { page_path: path, page_location: location.href, page_title: title });
}

/* tự ghi nhận bấm gọi / email / link ngoài / phần tử có data-track — không cần sửa từng component */
function onClick(e) {
  const el = e.target.closest?.('a, button, [data-track]');
  if (!el) return;
  if (el.dataset.track) { track(el.dataset.track, { label: el.dataset.trackLabel || el.textContent.trim().slice(0, 80) }); return; }
  const href = el.getAttribute('href') || '';
  if (href.startsWith('tel:')) track('click_call', { phone: href.slice(4) });
  else if (href.startsWith('mailto:')) track('click_email');
  else if (/^https?:/.test(href) && !href.includes(location.hostname)) {
    track('click_outbound', { link_url: href, link_domain: new URL(href).hostname });
  }
}

function loadGtm() {
  if (!GTM_ID || document.getElementById('gtm-js')) return;
  dataLayer().push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.id = 'gtm-js';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  /* CSP nonce (nếu server chèn) — GTM chuyển tiếp nonce cho tag Custom HTML có thuộc tính nonce */
  const nonce = document.querySelector('script[nonce]')?.nonce;
  if (nonce) s.nonce = nonce;
  document.head.appendChild(s);
}

/**
 * Khởi động: ghi nguồn ngay (rẻ), đẩy thông tin nguồn vào dataLayer, rồi tải GTM khi trang đã tải xong và rảnh
 * (hoặc ngay khi người dùng tương tác) — không chặn hiển thị, giữ TBT/LCP thấp.
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return;
  captureAttribution();
  track('attribution_ready', attribution());
  document.addEventListener('click', onClick, { capture: true, passive: true });

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    ['pointerdown', 'keydown', 'scroll'].forEach((ev) => removeEventListener(ev, start));
    loadGtm();
  };
  ['pointerdown', 'keydown', 'scroll'].forEach((ev) => addEventListener(ev, start, { once: true, passive: true }));
  const idle = () => (window.requestIdleCallback ? requestIdleCallback(start, { timeout: 3500 }) : setTimeout(start, 2000));
  if (document.readyState === 'complete') idle();
  else addEventListener('load', idle, { once: true });
}
