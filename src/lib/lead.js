import { leadAttribution, track } from './analytics';

/**
 * Gửi lead → Cloudflare Worker (be/norton-park-lead-worker) → Apps Script → Google Sheet.
 * Đặt endpoint trong .env.production:  VITE_LEAD_ENDPOINT=https://<worker>.workers.dev/lead
 * Chưa có endpoint (dev): chỉ ghi console và coi như thành công để test giao diện.
 *
 * payload: { name, phone, email?, unitType?, message?, website? (honeypot) }
 * formId: popup / popup_auto / register / quote / floating_price… → cột form_type trên Sheet.
 * Lỗi → ném Error có message tiếng Việt hiển thị được cho khách.
 */
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT;
const TIMEOUT_MS = 20000;

export async function submitLead(payload, formId = 'unknown') {
  const body = {
    name: payload.name,
    phone: payload.phone,
    email: payload.email || '',
    apartment_types: payload.unitType || payload.unit || '',
    message: payload.message || (payload.layout ? `Layout: ${payload.layout}` : ''),
    form_type: formId,
    page_url: window.location.href,
    submitted_at: new Date().toISOString(),
    website: payload.website || '', // honeypot
    ...leadAttribution(),
  };

  if (!ENDPOINT) {
    console.info('[lead] Chưa cấu hình VITE_LEAD_ENDPOINT — dữ liệu:', body);
  } else {
    let res;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch {
      throw new Error('Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      clearTimeout(timer);
    }
    const out = await res.json().catch(() => null);
    if (!res.ok || !out?.success) throw new Error(out?.error || 'Gửi thông tin không thành công, vui lòng thử lại.');
  }

  /* không gửi thông tin cá nhân (tên, SĐT, email) vào dataLayer */
  track('generate_lead', { form_id: formId, unit_type: body.apartment_types || undefined });
  return { ok: true };
}

/* số điện thoại Việt Nam: 10 số bắt đầu bằng 0, hoặc +84 */
export const isVnPhone = (v) => /^(\+?84|0)(3|5|7|8|9)\d{8}$/.test(String(v).replace(/[\s.-]/g, ''));
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
