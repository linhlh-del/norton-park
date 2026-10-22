import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppRoutes, routerFuture } from './App';

export { headHtml } from './seo/head';
export { routes, SITE_URL, SITE, sections, pages, hiddenPages, absUrl, langUrl, pageMeta } from './seo/site-meta';
export { faq } from './data/site';

/* Prerender: HTML tĩnh của một route — nội dung đọc được ngay cả khi chưa chạy JS (SEO, LCP) */
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} future={routerFuture}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}
