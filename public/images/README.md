# Ảnh của site

Đường dẫn khai báo trong `src/data/site.js`. Ảnh JPG/PNG/WebP được tự tạo bản AVIF/WebP nhiều kích thước vào
`_optimized/` khi chạy `npm run dev` / `npm run build` (không sửa tay thư mục đó). Ảnh thiếu → section hiện khung màu.

| File | Dùng ở |
|---|---|
| `hero_design-story-facade.jpg` | Hero (máy tính, tablet ngang) |
| `imgi_34_hero-facade-plot-portrait.jpg` | Hero trên điện thoại cầm dọc |
| `imgi_4_hero-facade-sunset.jpg` | #design-story — ảnh nền toàn section |
| `imgi_6_landscape-story.jpg` | #landscape-story — ảnh nền toàn section |
| `imgi_7/8/9_tram-*.jpg` | Tinh thần dự án — 3 trạm sạc |
| `imgi_12_masterplan-birdview-r16.webp` | Vị trí — phối cảnh tổng thể |
| `tienich/1…5-life-*.jpg` | Đời sống & tiện ích (carousel, theo thứ tự) |
| `block-b.jpg`, `block-c.jpg` | Hai phân khu |
| `canho/*` | Mặt bằng căn hộ (trường `plan` của từng căn trong `collections`) |
| `news/*` | Tin tức trang chủ (`homeNews`) và trang Tin tức (`posts`); `other.jpg` cho bài chưa có ảnh |
| `imgi_32_amenity-overview-portrait.jpg` | Popup liên hệ |
| `imgi_1_…-beige.svg` / `imgi_2_…primary.svg` | Logo trên nền tối (header, footer) / nền sáng (popup) |
| `quacho-symbol-bronze.webp` / `-beige.webp` | Biểu tượng đầu section nền sáng / nền tối · favicon |

Ảnh Open Graph: sinh từ `overview_hero-facade-sunset.jpg`.
Chưa dùng: `imgi_5_hoa-dau-artwork.webp`, `imgi_35_hero-facade-sunset-portrait.jpg`, `imgi_37_….webp`, `backgound-logo.svg`,
`logo-header.png`, `overview_hero-facade-sunset.jpg` (trùng `imgi_4`), thư mục `vendor/`.
