import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Calculator from '@/pages/Calculator';
import News from '@/pages/News';
import NotFound from '@/pages/NotFound';
import ThankYou from '@/pages/ThankYou';
import Topic from '@/pages/Topic';
import { topicPaths } from '@/seo/site-meta';
import { SECTION_PATHS } from '@/lib/sections';

/* bật sớm hành vi React Router v7 (tắt cảnh báo console, nâng cấp sau không đổi gì) */
export const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

/* cùng bộ trang cho tiếng Việt (/) và tiếng Anh (/en) — ngôn ngữ đọc từ URL (src/i18n) */
const pages = (
  <>
    <Route index element={<Home />} />
    {/* /cau-chuyen, /ban-do, /dang-ky: trang chủ, Layout cuộn tới section (src/lib/sections.js) */}
    {Object.keys(SECTION_PATHS).map((p) => <Route key={p} path={p.slice(1)} element={<Home />} />)}
    {topicPaths.map((p) => <Route key={p} path={p.slice(1)} element={<Topic path={p} />} />)}
    <Route path="bang-tinh-gia" element={<Calculator />} />
    <Route path="tin-tuc" element={<News />} />
    <Route path="cam-on" element={<ThankYou />} />
    <Route path="*" element={<NotFound />} />
  </>
);

/* dùng chung cho trình duyệt (BrowserRouter) và prerender (StaticRouter trong entry-server.jsx) */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="en" element={<Layout />}>{pages}</Route>
      <Route element={<Layout />}>{pages}</Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter future={routerFuture}>
      <AppRoutes />
    </BrowserRouter>
  );
}
