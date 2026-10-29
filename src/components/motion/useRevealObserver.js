import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Hiệu ứng hiện dần khi cuộn tới — khai báo bằng thuộc tính, không cần bọc component:
 *   <div data-reveal="up">        trồi lên    (mặc định)
 *   <div data-reveal="left">      trượt từ trái vào
 *   <div data-reveal="right">     trượt từ phải vào
 *   <div data-reveal="zoom">      phóng nhẹ
 *   <div data-reveal="fade">      chỉ hiện mờ dần
 *   style={{ '--reveal-i': 2 }}   thứ tự trong nhóm → trễ 2 × 90ms (so le)
 *
 * Gắn một lần ở Layout. Chỉ khi script chạy và người dùng không bật "giảm chuyển động" thì <html> mới có
 * class "reveal-ready" và nội dung mới bị ẩn chờ hiện — không có JS thì mọi thứ vẫn hiển thị bình thường.
 * Phần tử thêm sau (đổi trang, section tải trễ, popup) được bắt qua MutationObserver.
 */
export default function useRevealObserver() {
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined;
    const root = document.documentElement;
    root.classList.add('reveal-ready');

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          // dùng thuộc tính riêng (không phải class) vì React quản lý toàn bộ `className` theo render — một
          // class gắn ngoài React sẽ bị className mới của lần render sau ghi đè mất (vd. đổi tab làm đổi
          // grid-cols-2/3), khiến phần tử ẩn vĩnh viễn dù đã từng hiện. Thuộc tính data-* thì React không đụng tới.
          e.target.setAttribute('data-revealed', '');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    const scan = (node) => {
      if (!(node instanceof Element)) return;
      if (node.matches('[data-reveal]:not([data-revealed])')) io.observe(node);
      node.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => io.observe(el));
    };
    scan(document.body);

    const mo = new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach(scan)));
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);
}
