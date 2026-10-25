import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { cleanHead, cmsHeadPlugin, readCms } from './scripts/cms-head.mjs';

/* Nội dung CMS (scripts/fetch-cms.mjs ghi trước khi build): mã GTM, endpoint lead, thẻ head.
   Giá trị trong CMS được ưu tiên hơn biến môi trường Vercel. */
const cms = readCms(fileURLToPath(new URL('./src/generated/cms-content.json', import.meta.url)));
const cmsGtm = cleanHead(cms.head).gtmId;
if (cmsGtm) process.env.VITE_GTM_ID = cmsGtm;
if (/^https:\/\/\S+$/.test(cms.lead?.endpoint || '')) process.env.VITE_LEAD_ENDPOINT = cms.lead.endpoint;
/* tracker analytics → Edge Function collect của Supabase CMS */
const cmsUrl = (process.env.CMS_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
if (cmsUrl && !process.env.VITE_CMS_COLLECT_URL) process.env.VITE_CMS_COLLECT_URL = `${cmsUrl}/functions/v1/collect`;

export default defineConfig({
  /* GTM đã có trình tải riêng (src/lib/analytics.js) nên không chèn snippet GTM */
  plugins: [react(), tailwindcss(), cmsHeadPlugin(cms, { gtm: false, nonce: '__CSP_NONCE__' })],
  /* ngày build — dùng cho dateModified / article:modified_time / sitemap lastmod */
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
