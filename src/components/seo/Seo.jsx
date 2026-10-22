import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { headFor } from '@/seo/head';
import { pageView } from '@/lib/analytics';

/**
 * Đồng bộ <head> (title, description, canonical, Open Graph, JSON-LD) khi chuyển trang phía trình duyệt.
 * Lần tải đầu, prerender đã ghi sẵn các thẻ này vào HTML tĩnh — ở đây chỉ cập nhật thẻ có data-seo tương ứng.
 * JSON-LD được gán bằng textContent (không dùng innerHTML) nên tương thích Trusted Types.
 */
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/';
    const h = headFor(path);
    document.title = h.title;
    const head = document.head;
    for (const t of h.tags) {
      let el = head.querySelector(`[data-seo="${CSS.escape(t.key)}"]`);
      if (!el) { el = document.createElement(t.tag); el.dataset.seo = t.key; head.appendChild(el); }
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    }
    /* thẻ của trang trước không còn dùng (vd. canonical khi vào trang 404) */
    const keys = new Set(h.tags.map((t) => t.key).concat('jsonld'));
    head.querySelectorAll('[data-seo]').forEach((el) => { if (!keys.has(el.dataset.seo)) el.remove(); });

    let ld = head.querySelector('script[data-seo="jsonld"]');
    if (h.jsonld) {
      if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.dataset.seo = 'jsonld'; head.appendChild(ld); }
      ld.textContent = JSON.stringify(h.jsonld);
    } else ld?.remove();

    pageView(path, h.title);
  }, [pathname]);
  return null;
}
