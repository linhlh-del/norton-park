/* ============================================================
   SONG NGỮ VI / EN
   - Ngôn ngữ lấy từ URL: /… = tiếng Việt, /en/… = tiếng Anh (mỗi bản một URL riêng để Google lập chỉ mục, hreflang).
   - useT(): chữ giao diện (nút, nhãn, tiêu đề section) — từ điển ./ui.js
   - useSite(): nội dung (src/data/site.js + bản dịch site.en.js)
   - Link / NavLink / useLocalizedNavigate: tự thêm "/en" khi đang ở bản tiếng Anh — trong code luôn viết đường dẫn
     tiếng Việt ("/bang-tinh-gia", "/#position").
   ============================================================ */
import { forwardRef, useCallback } from 'react';
import { Link as RRLink, NavLink as RRNavLink, useLocation, useNavigate } from 'react-router-dom';
import * as vi from '@/data/site';
import en from '@/data/site.en';
import ui from './ui';
import { applySiteOverrides, cmsText } from '@/cms/content';

export const LANGS = ['vi', 'en'];
export const LOCALE = { vi: 'vi-VN', en: 'en-US' };

export const langFromPath = (pathname = '/') => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'vi');

/** Bỏ tiền tố /en: "/en/tin-tuc" → "/tin-tuc", "/en" → "/" */
export const stripLang = (path = '/') => (langFromPath(path) === 'en' ? path.slice(3) || '/' : path);

/** Đường dẫn tiếng Việt → đường dẫn theo ngôn ngữ: ("/#position","en") → "/en#position" */
export function localizePath(path, lang) {
  if (lang !== 'en' || typeof path !== 'string' || !path.startsWith('/') || langFromPath(path) === 'en') return path;
  if (path === '/') return '/en';
  if (path.startsWith('/#') || path.startsWith('/?')) return '/en' + path.slice(1);
  return '/en' + path;
}

/* ---------- nội dung ---------- */
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
function merge(base, over) {
  if (over === undefined) return base;
  if (Array.isArray(base) && Array.isArray(over)) return base.map((b, i) => merge(b, over[i]));
  if (isObj(base) && isObj(over)) {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  }
  return over;
}

const cache = {};
export function getSite(lang = 'vi') {
  if (lang !== 'en') return (cache.vi ||= applySiteOverrides({ ...vi }, 'vi'));
  if (cache.en) return cache.en;
  const s = { ...vi };
  for (const k of Object.keys(en)) s[k] = merge(vi[k], en[k]);
  // loại căn: tên bộ sưu tập theo bản dịch
  s.priceTypes = s.priceTypes.map((t) => ({ ...t, col: t.col === vi.GLOBAL ? en.GLOBAL : t.col === vi.SPECIAL ? en.SPECIAL : t.col }));
  const fmt = makeFormat('en');
  s.m2 = fmt.m2;
  s.money = fmt.money;
  s.layoutsOf = (type) => {
    if (type.layouts) return type.layouts;
    const p = en.layoutPlaceholders;
    const out = [{ code: p.smallest, gfa: type.min[0], nsa: type.min[1], view: p.view, units: p.units }];
    if (type.max) out.push({ code: p.largest, gfa: type.max[0], nsa: type.max[1], view: p.view, units: p.units });
    return out;
  };
  return (cache.en = applySiteOverrides(s, 'en'));
}

/* ---------- định dạng số theo ngôn ngữ ---------- */
export function makeFormat(lang) {
  const area = new Intl.NumberFormat(LOCALE[lang], { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const whole = new Intl.NumberFormat(LOCALE[lang]);
  return {
    m2: (x) => area.format(x) + ' m²',
    money: (x) => (lang === 'en' ? 'VND ' + whole.format(Math.round(x)) : whole.format(Math.round(x)) + ' ₫'),
  };
}

/* ---------- hooks ---------- */
export function useLang() {
  return langFromPath(useLocation().pathname);
}

export function useSite() {
  return getSite(useLang());
}

/** t('key') hoặc t('key', { n: 3 }) — thay {n} trong chuỗi */
export function translate(lang, key, vars) {
  /* CMS (bản đã đăng) → từ điển theo ngôn ngữ → tiếng Việt */
  let s = cmsText(key, lang) ?? ui[lang]?.[key] ?? ui.vi[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}
export function useT() {
  const lang = useLang();
  return useCallback((key, vars) => translate(lang, key, vars), [lang]);
}

export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const lang = useLang();
  return useCallback((to, opts) => navigate(typeof to === 'string' ? localizePath(to, lang) : to, opts), [navigate, lang]);
}

export const Link = forwardRef(function Link({ to, ...rest }, ref) {
  return <RRLink ref={ref} to={localizePath(to, useLang())} {...rest} />;
});

export const NavLink = forwardRef(function NavLink({ to, ...rest }, ref) {
  return <RRNavLink ref={ref} to={localizePath(to, useLang())} {...rest} />;
});
