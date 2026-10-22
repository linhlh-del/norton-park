/**
 * Tách file "Norton Park — Bản đồ vị trí.html" (bản lưu từ trình duyệt) thành dữ liệu cho section React.
 *
 * File lưu từ trình duyệt là DOM SAU khi script bản đồ đã chạy, nên trong SVG và bảng thông tin đã có sẵn
 * các phần tử do script sinh ra (vệt sáng, vòng sóng, tàu metro, vùng chạm, mục bộ lọc…). Nếu giữ nguyên rồi
 * chạy lại script thì mọi thứ bị nhân đôi. Script này đưa markup về đúng trạng thái gốc trước khi chạy:
 *   - giữ nguyên artwork SVG, bảng thông tin, nút điều khiển, thẻ điểm, nội dung SEO ẩn
 *   - gỡ các lớp phủ do script tạo, xoá class trạng thái (on / boot / hl / off-*)
 *   - làm trống các ô mà script tự dựng (Nổi bật, Thời gian, mẫu lọc, chú thích)
 *
 * Kết quả (src/sections/home/LocationMap/generated):
 *   markup.html   – toàn bộ nội dung #lm + khối SEO ẩn
 *   data.json     – window.LM_DATA (điểm, mốc thời gian, chú thích, icon…)
 *   schema.json   – JSON-LD của trang bản đồ
 * và logo → src/sections/home/LocationMap/assets/location-map-logo.png
 *
 * Chạy: npm run extract:map [-- "<đường dẫn file .html>"]
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(process.argv[2] || join(root, 'scripts/source/location-map.html'));
const outDir = join(root, 'src/sections/home/LocationMap/generated');
const assetDir = join(root, 'src/sections/home/LocationMap/assets');
mkdirSync(outDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const html = readFileSync(src, 'utf8');
const $ = cheerio.load(html);

/* ---------- dữ liệu ---------- */
const dataScript = $('script')
  .toArray()
  .map((s) => $(s).html() || '')
  .find((t) => t.trim().startsWith('window.LM_DATA='));
if (!dataScript) throw new Error('Không tìm thấy window.LM_DATA trong file nguồn');
const data = JSON.parse(dataScript.trim().replace(/^window\.LM_DATA=/, '').replace(/;\s*$/, ''));
writeFileSync(join(outDir, 'data.json'), JSON.stringify(data));

const ld = $('script[type="application/ld+json"]').first().html();
if (ld) writeFileSync(join(outDir, 'schema.json'), JSON.stringify(JSON.parse(ld), null, 2));

/* ---------- làm sạch SVG ---------- */
const svg = $('#art');
const GENERATED = [
  '#comets', '#fadeR', '#fadeT', '#fadeB', '#fadeL', '#halo', '#pulses', '#hits',
  'g.echo', 'g.ripple', 'g.train', 'g[clip-path="url(#riverClip)"]',
  '#fadeRG', '#fadeTG', '#fadeBG', '#fadeLG', '#sheenG', '#riverClip',
  'clipPath[id^="rv"]', 'mask[id^="rv"]',
];
let removed = 0;
GENERATED.forEach((sel) => { const n = svg.find(sel); removed += n.length; n.remove(); });
svg.find('[mask^="url(#rv"]').removeAttr('mask');
svg.find('[clip-path="url(#rvRiver)"]').removeAttr('clip-path');
svg.find('#m1path').removeAttr('id');
svg.find('.on').removeClass('on');
svg.find('[style]').each((_, e) => {
  /* thuộc tính style chỉ do Web Animations / script để lại */
  $(e).removeAttr('style');
});
svg.attr('class', '');

/* ---------- làm sạch bảng thông tin & điều khiển ---------- */
$('#secHi .hi-grid').empty();
$('#secTime .bands').empty();
$('#secFilter .presets').empty();
$('#secFilter .legend').empty();
$('#board').removeClass('min up drag').removeAttr('style');
$('.bd-tabs button, .bd-body .sec').removeClass('on');
$('#bdOpen').attr('hidden', '');
$('#hint').removeClass('gone');
$('#card').attr('class', '').removeAttr('style');
$('#card .k, #card .n').text('');
$('#card .m').empty();
$('#lm').attr('class', '');

/* logo: thay đường dẫn tương đối của bản lưu bằng chỗ giữ, React gắn URL đã bundle */
const logo = $('#board .logo');
const logoSrc = logo.attr('src');
logo.attr('src', '__LOGO__');
if (logoSrc) {
  const rel = decodeURIComponent(logoSrc.replace(/^\.\//, ''));
  const fromFile = join(dirname(src), rel);
  const fallback = join(dirname(src), basename(src, extname(src)) + '_files', basename(rel));
  const found = [fromFile, fallback].find((p) => existsSync(p));
  if (found) copyFileSync(found, join(assetDir, 'location-map-logo.png'));
  else console.warn('! Không thấy file logo, hãy chép location-map-logo.png vào', assetDir);
}

/* ---------- xuất markup ---------- */
const lmHtml = $.html($('#lm'));
const seo = $('body > div.sr').first();
const seoHtml = seo.length ? $.html(seo.removeAttr('style').attr('class', 'sr')) : '';
writeFileSync(join(outDir, 'markup.html'), lmHtml + '\n' + seoHtml + '\n');

console.log('✓ Đã gỡ', removed, 'phần tử do script sinh ra');
console.log('✓ markup.html', (lmHtml.length / 1024).toFixed(0) + ' KB', '· data.json · schema.json →', outDir);
