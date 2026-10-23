# Norton Park — website (Vite + React + Tailwind CSS v4)

## Chạy dự án

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # xuất bản vào dist/
npm run preview
```

Trang: `/` (trang chủ), `/bang-tinh-gia` (bảng tính giá), `/tin-tuc` (tin tức).

## Cấu trúc

```
src/
  styles/
    theme.css      ← BIẾN THIẾT KẾ: màu, font, cỡ chữ, khoảng cách (khối @theme của Tailwind v4)
    fonts.css      ← @font-face cho font thương hiệu (đang chú thích, chờ file font)
    index.css      ← nạp Tailwind + base + lớp dùng chung (.container-site, .eyebrow, .heading-*, .btn-*, .chip, .field, .media)
  data/site.js     ← toàn bộ nội dung chữ / số liệu / đường dẫn ảnh
  components/      ← layout (header, footer, nút nổi), ui, form
  sections/home/   ← từng section trang chủ
    StoryBackdrop.jsx       ← khung section có ẢNH NỀN TOÀN SECTION (#design-story, #landscape-story)
    LocationMap/            ← section bản đồ vị trí
  pages/           ← Home, Calculator, News
```

### Biến thiết kế

Mọi màu và font khai báo một lần trong `src/styles/theme.css`. Tailwind tự sinh utility từ đó:

| Biến | Utility | Dùng trong CSS |
|---|---|---|
| `--color-pine` | `bg-pine`, `text-pine`, `border-pine` | `var(--color-pine)` |
| `--font-display` / `--font-sub` / `--font-body` | `font-display` / `font-sub` / `font-body` | `var(--font-display)` |
| `--text-display-1` … `--text-lead` | `text-display-1` … `text-lead` | `var(--text-display-1)` |
| `--spacing-section` | `py-section` | `var(--spacing-section)` |

**Đổi font thương hiệu:** chép file font vào `public/fonts/`, bỏ chú thích các khối trong `src/styles/fonts.css`.
Biến font đã ưu tiên tên "Norton Seasons / Norton Futura / Norton Gotham" nên không phải sửa component nào. Bản đồ cũng
dùng chung các biến này.

### Ảnh

Đặt ảnh vào `public/images/` theo danh sách trong `public/images/README.md`. Khi chưa có ảnh, ô ảnh hiển thị màu nền và
nhãn mô tả. Ảnh nền của **#design-story** là `design-story.jpg`, của **#landscape-story** là `landscape-story.jpg`.

## Section bản đồ vị trí

Nội dung, layout, chuyển động lấy nguyên từ trang bản đồ độc lập `scripts/source/location-map.html`:

- `npm run extract:map` tách file nguồn thành `src/sections/home/LocationMap/generated/` (markup SVG + bảng thông tin,
  dữ liệu `LM_DATA`, JSON-LD) và chép logo. Bản lưu từ trình duyệt chứa sẵn các lớp phủ do script sinh ra — script tách
  sẽ gỡ chúng để không bị nhân đôi khi chạy lại.
- `createLocationMap.js` là script gốc của bản đồ chuyển thành module: khởi tạo khi section mount, huỷ sạch khi unmount.
  Toạ độ tính theo khung section thay cho cả cửa sổ.
- `location-map.css` là CSS gốc, giới hạn trong `#lm`, font/màu nối vào biến chung.
- Bản đồ "ngủ" mặc định để không chặn cuộn trang: bấm vào bản đồ để kéo / phóng; tự ngủ lại khi chuột rời khung,
  bấm ra ngoài hoặc cuộn qua section.
- Section tải trễ (chunk riêng ~250 KB gzip) để trang đầu nhẹ.
- Sự kiện tương tác phát qua `onTrack(ev, label)` của `<LocationMap>` (đang đẩy vào `window.dataLayer` trong `pages/Home.jsx`).

Cập nhật bản đồ: thay `scripts/source/location-map.html` (+ thư mục `location-map_files/`) rồi chạy `npm run extract:map`.

## Độ rộng khung nội dung

`.container-site` rộng `84vw` (giới hạn 80–86vw) từ màn ≥1024px; nhỏ hơn thì tràn ngang trừ lề.
Đổi trong `src/styles/theme.css`: `--container-site`, `--container-site-min`, `--container-site-max`.

## Carousel

`src/hooks/useCarousel.js` + `src/components/ui/CarouselControls.jsx` (nút trước/sau, chấm phân trang), dùng cho
"Những trạm sạc giữa nhịp sống" (mỗi slide một ảnh) và Tin tức trang chủ. Dựa trên scroll-snap nên vuốt / kéo trackpad
chạy sẵn; nút bấm cuộn mượt bằng requestAnimationFrame. Chấm = số điểm dừng thực tế, tự đổi theo số slide hiển thị.

## Popup liên hệ

`src/components/popup/ContactPopup.jsx` — mở bằng `useContactPopup().open('<vị trí>')` (đang gắn vào nút "Tư vấn" ở
header, menu di động và nút chat nổi). Tự mở sau 8 giây, mỗi phiên trình duyệt một lần: đổi `autoOpenMs` trong
`components/layout/Layout.jsx` (0 = tắt). Ảnh: `public/images/logos/norton-park-logo-primary.svg`,
`public/images/amenity-overview-portrait.jpg`.

Gửi form: `src/lib/lead.js` — đặt `VITE_LEAD_ENDPOINT=https://…` trong file `.env` (POST JSON). Chưa đặt thì dữ liệu chỉ
ghi ra console để test giao diện.

## Việc còn chờ

- Thông tin pháp nhân: `[TÊN PHÁP NHÂN]`, `[ĐỊA CHỈ PHÁP NHÂN]` trong `src/data/site.js`.
- Form đăng ký trong trang và form báo giá chưa dùng `submitLead`: truyền `onSubmit` vào `<Register>` / sửa `Calculator.jsx`.
- Ảnh bài báo trang chủ: `public/images/news/*.webp` (tên file trong `homeNews`, `src/data/site.js`).

