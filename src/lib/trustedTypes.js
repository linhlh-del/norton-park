/* ============================================================
   TRUSTED TYPES — chống DOM XSS khi server bật CSP "require-trusted-types-for 'script'".
   Khi bật, trình duyệt từ chối mọi chuỗi thô gán vào innerHTML / insertAdjacentHTML / eval…; chỉ nhận
   TrustedHTML tạo qua một policy có tên được CSP cho phép (trusted-types np default goog#html).

   - policy "np": dùng cho markup DO CHÍNH SITE sinh ra (artwork bản đồ build sẵn, template trong createLocationMap
     ghép từ data.json tĩnh). KHÔNG đưa dữ liệu người dùng nhập / tham số URL qua policy này.
   - policy "default": chỉ tạo khi bật GTM — thẻ Custom HTML của GTM và một số pixel quảng cáo gán innerHTML
     bằng chuỗi thô; không có default policy chúng sẽ bị chặn. Đánh đổi: default policy cho qua mọi chuỗi
     (nhưng ghi lại vào dataLayer để soát). Khi tắt GTM, không có default policy → bảo vệ tối đa.
   Trình duyệt chưa hỗ trợ Trusted Types: html() trả lại chuỗi như cũ.
   ============================================================ */

const tt = typeof window !== 'undefined' ? window.trustedTypes : undefined;

const np = tt?.createPolicy ? tt.createPolicy('np', { createHTML: (s) => s }) : null;

if (tt?.createPolicy && import.meta.env?.VITE_GTM_ID && !tt.defaultPolicy) {
  tt.createPolicy('default', {
    createHTML: (s, sink) => { (window.dataLayer = window.dataLayer || []).push({ event: 'tt_default_policy', tt_sink: sink }); return s; },
    createScriptURL: (s) => s,
    createScript: (s) => s,
  });
}

/** Đánh dấu chuỗi HTML do site tự sinh là tin cậy */
export const html = (s) => (np ? np.createHTML(s) : s);
