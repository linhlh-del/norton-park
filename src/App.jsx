import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Calculator from '@/pages/Calculator';
import News from '@/pages/News';
import NotFound from '@/pages/NotFound';

/* bật sớm hành vi React Router v7 (tắt cảnh báo console, nâng cấp sau không đổi gì) */
export const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

/* dùng chung cho trình duyệt (BrowserRouter) và prerender (StaticRouter trong entry-server.jsx) */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="bang-tinh-gia" element={<Calculator />} />
        <Route path="tin-tuc" element={<News />} />
        <Route path="*" element={<NotFound />} />
      </Route>
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
