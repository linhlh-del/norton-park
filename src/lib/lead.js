import { attribution, track } from './analytics';

/**
 * Gửi thông tin khách hàng (lead) tới CRM.
 * Đặt endpoint trong file .env:  VITE_LEAD_ENDPOINT=https://…
 * Khi chưa có endpoint, hàm chỉ ghi ra console và trả về thành công để test giao diện.
 * Mỗi lead tự kèm nguồn truy cập (ft_* / lt_*: utm, gclid, fbclid, referrer, trang đích) để đối soát kênh.
 * form_id: tên form (popup / register / quote) — dùng làm tham số sự kiện generate_lead.
 */
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT;

export async function submitLead(payload, formId = 'unknown') {
  const body = { ...payload, form_id: formId, ...attribution(), page_url: window.location.href, submitted_at: new Date().toISOString() };
  if (!ENDPOINT) {
    console.info('[lead] Chưa cấu hình VITE_LEAD_ENDPOINT — dữ liệu:', body);
  } else {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Gửi thông tin không thành công (' + res.status + ')');
  }
  /* không gửi thông tin cá nhân (tên, SĐT, email) vào dataLayer */
  track('generate_lead', { form_id: formId, unit_type: payload.unitType || payload.unit || undefined });
  return { ok: true };
}

/* số điện thoại Việt Nam: 10 số bắt đầu bằng 0, hoặc +84 */
export const isVnPhone = (v) => /^(\+?84|0)(3|5|7|8|9)\d{8}$/.test(String(v).replace(/[\s.-]/g, ''));
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
