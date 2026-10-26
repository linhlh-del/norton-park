---
name: seo-landing-page-bds
description: Checklist và quy tắc khi tạo/kiểm tra landing page bất động sản (HTML/CSS/JS thuần) chuẩn SEO, tốc độ và chuyển đổi. Dùng khi dựng trang mới hoặc audit trang dự án.
---

# CHECKLIST LANDING PAGE BẤT ĐỘNG SẢN CHUẨN SEO (Vanilla HTML/CSS/JS)

**Vai trò:** Front-end Developer + Technical SEO Specialist. Chỉ dùng HTML5, CSS3, JavaScript ES6+. Không framework nặng, không thư viện không cần thiết.

---

## 1. Thẻ `<head>` và metadata

- [x] `<meta charset="UTF-8">`
- [x] `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [x] `<meta name="robots" content="index, follow">`
- [x] **Title (tối đa 60 ký tự)** theo công thức: `[Tên dự án] + [Chủ đầu tư/Vị trí] + [Giá trị/Từ khóa chính]`
- [x] **Meta description (150-160 ký tự)**: có từ khóa địa phương, số liệu (quy mô, mật độ, tiện ích), và CTA rõ ràng
- [x] **Open Graph đầy đủ**: `og:type`, `og:title`, `og:description`, `og:image` (ảnh tuyệt đối, khoảng 1200x630), `og:url` (để chia sẻ đẹp trên Zalo/Facebook)
  > Đổi og:image sang `/images/og-image.jpg` 1200×630 (tạo từ thumbnail.png).
- [x] `<link rel="canonical" href="https://tenmien.com/...">` (URL thật của trang)
  > Có cho mọi trang (vi + /en). Domain lấy từ `VITE_SITE_URL`, mặc định `norton-park-ten.vercel.app`.
- [x] Đếm ký tự title/description bằng công cụ trước khi chốt (không đoán)

**Mẫu head:**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow">
<title>[Tên dự án] [Chủ đầu tư] | [Loại hình + Vị trí] [Từ khóa]</title>
<meta name="description" content="[Tên dự án] từ [CĐT]. [Quy mô, mật độ, vị trí]. Đăng ký nhận bảng giá và ưu đãi ngay!">
<link rel="canonical" href="https://tenmien.com/">
<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://tenmien.com/og-image.webp">
<meta property="og:url" content="https://tenmien.com/">
```

---

## 2. HTML ngữ nghĩa và cấu trúc nội dung

- [x] **Đúng 1 thẻ `<h1>`**: từ khóa chính + địa danh hành chính (vd: "Căn hộ Norton Park Gamuda Land - Đại lộ Bình Dương")
  > H1: "Căn hộ Norton Park Gamuda Land – Đại lộ Bình Dương, Phường Thuận Giao, TP.HCM"; slogan "Tinh chọn chuẩn chuyên gia" chuyển sang `<p>`.
- [x] `<h2>` cho mục chính: Vị trí, Tiện ích, Mặt bằng, Bảng giá, Tiến độ. `<h3>` cho mục con. **Không nhảy từ h2 xuống h4**
- [x] **Không đặt câu văn nghệ/slogan vào thẻ heading.** Slogan để trong `<p>` hoặc `<span>`; heading dành cho từ khóa tìm kiếm
  > Thêm `KeywordHeading`: h2 chứa từ khoá (vd. "Kiến trúc căn hộ Norton Park lấy cảm hứng từ hoa dầu"), slogan "Vũ khúc hoa trong gió" hiển thị bằng `<p>`. Áp dụng cho 11 section, cả bản tiếng Anh.
  - Sai: `<h2>Vũ khúc hoa trong gió</h2>`
  - Đúng: `<h2>Hệ thống tiện ích nội khu Norton Park</h2>` + `<p>Vũ khúc hoa trong gió...</p>`
- [x] Mọi `<img>` có `alt` mô tả, chứa từ khóa (vd: `alt="Phối cảnh hồ bơi tràn bờ dự án Norton Park"`)
- [x] Dùng thẻ semantic: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- [x] Địa chỉ/địa giới hành chính nhất quán ở mọi nơi (liên hệ, FAQ, footer, schema)

### ⚠️ Kiểm tra địa giới hành chính (Local SEO)

- [x] Đối chiếu phường/xã, quận/thành phố, tỉnh/thành với **danh mục đơn vị hành chính hiện hành** trước khi publish
  > Phường Thuận Giao thuộc TP.HCM sau sáp nhập 2025 (Bình Dương cũ). Sửa `geo.region` VN-57 → VN-SG.
- [x] Lưu ý: Việt Nam đã sắp xếp lại đơn vị hành chính năm 2025 (có sáp nhập tỉnh, bỏ cấp huyện). Một số góp ý cũ cho rằng "Phường Thuận Giao thuộc Bình Dương, không phải TP.HCM" có thể **đã lỗi thời**. Cần kiểm tra lại nguồn chính thống thay vì tự sửa theo cảm tính
- [x] Nếu dùng tên cũ làm từ khóa tìm kiếm (Quận 9, Thuận An, Thủ Đức...), đặt trong nội dung dạng "(trước đây là...)" và vẫn ghi địa chỉ chính thức hiện hành
- [x] Địa chỉ trên trang khớp với Google Business Profile / Schema (nếu có)
  > Khớp giữa schema, footer, FAQ, trang /vi-tri. Chưa đối chiếu được với Google Business Profile.

---

## 3. UI/UX, thẩm mỹ cao cấp, tốc độ

- [x] CSS Variables trong `:root` cho màu, font, khoảng cách, transition
- [x] Font sans-serif sạch (Inter, Montserrat), `line-height` 1.6-1.8
- [x] Section có padding dọc tối thiểu 80px trên desktop; layout bằng CSS Grid/Flexbox
- [x] Ảnh dùng định dạng **.webp**, đã nén; đặt `width`/`height` để tránh nhảy layout (CLS)
  > Đã có sẵn: `<picture>` AVIF/WebP nhiều kích thước, có width/height.
- [x] `loading="lazy"` cho mọi ảnh từ giữa trang trở xuống (ảnh hero/above-the-fold **không** lazy)
- [x] Mobile-first: `@media (max-width: 768px)`, vùng chạm tối thiểu **48x48px**, chữ dễ đọc
- [x] **Không nhúng iframe nặng** (tour 360°, Google Maps) vào DOM ban đầu. Dùng ảnh preview + nút CTA mở tab mới (`target="_blank" rel="noopener"`)
  > Không có iframe; bản đồ vị trí tách chunk, chỉ tải khi cuộn tới gần.
- [x] File bảng giá/mặt bằng nặng (vd: 63 mặt bằng) chỉ tải khi người dùng bấm xem
  > 63 layout ở /bang-tinh-gia chỉ tải mặt bằng của loại căn đang chọn (lazy).
- [x] CSS/JS tách file riêng; không inline style, không inline script
  > Không có inline script; chỉ còn `style` cho biến CSS động (`--reveal-i`, màu nền ảnh).

---

## 4. Chuyển đổi (CRO) và tương tác

- [x] **Form 3 trường**: Họ tên, Số điện thoại, nút gửi (vd: "Nhận bảng giá"). Không form nhiều bước ở các section chính
  > Form #register (trước là 2 bước) và popup chỉ còn Họ tên + SĐT + nút "Nhận bảng giá". Ô đồng ý được thay bằng câu đồng ý ngầm định dưới nút gửi.
- [x] Form khảo sát chi tiết (loại căn, layout, ngân sách) chỉ đặt ở trang/mục "Bảng tính giá"
  > Chọn loại căn/layout chỉ còn ở /bang-tinh-gia.
- [x] Validate số điện thoại Việt Nam phía client; có thông báo gửi thành công
- [x] **Sticky bar mobile** cố định đáy màn hình với 3 nút: **Gọi hotline | Chat Zalo | Nhận bảng giá**; đảm bảo không che nội dung quan trọng (thêm `padding-bottom` cho `body`)
  > ValueNav < 1024px: Gọi hotline | Chat Zalo | Nhận bảng giá; Layout có khoảng trống bù chiều cao. Nút nổi gọi/Zalo/bảng giá chỉ hiện trên desktop.
- [x] **Công cụ tương tác** bằng JS thuần (ước tính vay/giá, tính trả góp) để tăng thời gian trên trang
  > Bảng tính giá /bang-tinh-gia (giá dự kiến theo layout).

---

## 5. Cấu trúc site và chiến lược nội dung (tùy chọn, nâng cao)

- [x] Trang chủ giữ vai trò landing page tổng quan (tốt cho chạy ads)
- [x] Muốn SEO nhiều từ khóa: tách thành trang con có URL riêng (`/vi-tri`, `/tien-ich`, `/mat-bang`, `/bang-gia`, `/tien-do`, `/tin-tuc`), mỗi trang tối ưu một nhóm từ khóa ngách (vd: "Mặt bằng chi tiết căn hộ Norton Park")
  > Thêm /vi-tri, /tien-ich, /mat-bang (+ /en). Đã có /bang-tinh-gia, /tin-tuc. Chưa làm /tien-do vì chưa có dữ liệu tiến độ.
- [x] Mỗi trang con có title, description, h1, canonical riêng
  > Khai báo trong `pages` (src/seo/site-meta.js); prerender, sitemap, JSON-LD WebPage + Breadcrumb tự sinh.
- [x] Có mục Blog/Tin tức viết trực tiếp trên site (vd: "Đánh giá tiềm năng đầu tư căn hộ khu vực X năm 2026"), **internal link** về trang bảng giá/đăng ký
- [x] Hạn chế dẫn link ra báo ngoài ở vị trí nổi bật; nếu cần thì mở tab mới và thêm `rel="noopener"` (có thể thêm `nofollow` tùy mục tiêu)
  > Tin báo chí ở trang chủ mở tab mới với `rel="noopener"`.
- [x] Có `sitemap.xml` và `robots.txt`
- [x] Cân nhắc JSON-LD schema (`RealEstateListing`/`Organization`/`FAQPage`) cho FAQ và thông tin liên hệ

---

## 6. Quy tắc xuất code (cho AI)

- [ ] Xuất 3 file tách biệt: `index.html`, `style.css`, `script.js` (hoặc một file thống nhất có chú thích rõ)
  > Không áp dụng: dự án React + Vite + Tailwind; thay bằng prerender HTML tĩnh cho từng route.
- [x] Code có comment rõ từng khối
- [x] Không CSS/JS inline trong thẻ HTML
- [ ] Nhẹ, nhanh, không phụ thuộc framework
  > Dùng React (có sẵn), không viết lại.

---

## 7. Kiểm tra trước khi publish

- [x] Đúng 1 `<h1>`, thứ tự heading hợp lệ
- [x] Title ≤ 60 ký tự, description 150-160 ký tự (đã đếm thực tế)
- [x] Tất cả ảnh có alt; ảnh dưới màn hình đầu có lazy
- [x] Địa chỉ/địa giới nhất quán và đúng theo đơn vị hành chính hiện hành
- [ ] Test OG preview (Facebook Sharing Debugger, Zalo)
  > Cần làm thủ công sau khi deploy.
- [ ] Test Lighthouse/PageSpeed trên mobile (mục tiêu điểm Performance và SEO cao)
  > Cần làm thủ công sau khi deploy.
- [ ] Test sticky bar, form, nút gọi/Zalo trên điện thoại thật
  > Đã test trên trình duyệt giả lập 375px; chưa test máy thật.
- [ ] Canonical, sitemap, robots đã đúng domain thật
  > Đang dùng `norton-park-ten.vercel.app`; đặt `VITE_SITE_URL` khi có domain chính thức khác.
