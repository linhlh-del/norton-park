import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './lib/trustedTypes'; // tạo policy trước mọi script khác (GTM cần default policy)
import { initAnalytics } from './lib/analytics';
import './styles/webfonts';
import './styles/index.css';

initAnalytics();

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
/* HTML đã prerender cho đúng route này → hydrate (giữ nguyên DOM, không vẽ lại).
   Trường hợp còn lại (dev server, hoặc host trả nhầm HTML của trang khác/SPA fallback) → xoá và render mới. */
const path = location.pathname.replace(/\/+$/, '') || '/';
const prerendered = root.dataset.route;
/* dist/404.html được server trả cho mọi URL không tồn tại → khớp trang NotFound phía client */
if (prerendered && (prerendered === path || prerendered === '/404')) hydrateRoot(root, app);
else {
  root.replaceChildren();
  createRoot(root).render(app);
}
