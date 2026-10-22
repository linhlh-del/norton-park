/* Quầng sáng chạy theo con trỏ trên CTA: ghi vị trí chuột (%) vào --rx / --ry của nút đang rê.
   Một listener ủy quyền cho cả trang, không cần gắn vào từng nút. CSS: .btn-solid::before trong index.css */
export function initCtaFx() {
  if (typeof window === 'undefined' || !matchMedia('(hover: hover)').matches) return;
  let frame = 0;
  document.addEventListener('pointermove', (e) => {
    const btn = e.target.closest?.('.btn-solid, .btn-light, .btn-cta, button[type="submit"].btn');
    if (!btn || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      btn.style.setProperty('--ry', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    });
  }, { passive: true });
}
