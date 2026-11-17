import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { cleanHead, cmsHeadPlugin, hostOf, readCms, resolveHead } from './scripts/cms-head.mjs';

/* Nội dung CMS (scripts/fetch-cms.mjs ghi trước khi build): mã GTM, endpoint lead, thẻ head.
   Giá trị trong CMS được ưu tiên hơn biến môi trường Vercel. */
const cms = readCms(fileURLToPath(new URL('./src/generated/cms-content.json', import.meta.url)));
/* Thẻ head theo domain đang build (VITE_SITE_URL từ sites/<domain>/site.env hoặc .env.production):
   GTM và mã Search Console có trình chèn riêng (src/lib/analytics.js, src/seo/head.js) → CMS ghi đè biến môi trường. */
const siteUrl = process.env.VITE_SITE_URL || loadEnv('production', fileURLToPath(new URL('.', import.meta.url)), 'VITE_').VITE_SITE_URL || '';
const cmsHead = cleanHead(resolveHead(cms.head, hostOf(siteUrl)));
if (cmsHead.gtmId) process.env.VITE_GTM_ID = cmsHead.gtmId;
if (cmsHead.googleVerification) process.env.VITE_GSC_VERIFICATION = cmsHead.googleVerification;
if (/^https:\/\/\S+$/.test(cms.lead?.endpoint || '')) process.env.VITE_LEAD_ENDPOINT = cms.lead.endpoint;
/* tracker analytics → Edge Function collect của Supabase CMS */
const cmsUrl = (process.env.CMS_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
if (cmsUrl && !process.env.VITE_CMS_COLLECT_URL) process.env.VITE_CMS_COLLECT_URL = `${cmsUrl}/functions/v1/collect`;

export default defineConfig({
  /* GTM đã có trình tải riêng (src/lib/analytics.js) nên không chèn snippet GTM */
  plugins: [react(), tailwindcss(), cmsHeadPlugin(cms, { gtm: false, nonce: '__CSP_NONCE__', host: hostOf(siteUrl), fallback: {}, omit: ['gtmId', 'googleVerification'] })],
  /* ngày build — dùng cho dateModified / article:modified_time / sitemap lastmod */
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
