# Triển khai Norton Park lên VPS — 5 domain, mỗi domain một bản build

| Domain | Vai trò | Giao diện |
|---|---|---|
| `canho-nortonpark.vn` | Domain chính | `park` (giao diện hiện tại) |
| `nortonpark-binhduong.vn` | Vệ tinh | tạm dùng `park` |
| `nortonparkliving.vn` | Vệ tinh | tạm dùng `park` |
| `nortonparkhome.vn` | Vệ tinh | tạm dùng `park` |
| `nortonparkresidences.com` | Vệ tinh | tạm dùng `park` |

Chạy chung VPS và Cloudflare Tunnel `qtopia-vps` với QTOPIA và Imperia Sensa Park. Mỗi domain có thư mục build riêng, canonical / sitemap / robots / llms.txt riêng.

```
Khách ──► Cloudflare (5 zone) ──► Tunnel qtopia-vps ──► nginx :443 (SNI canho-nortonpark.vn)
                                                         root = /var/www/nortonpark/sites/$host/current
npm run build:release (/var/www/nortonpark/src)
  1. fetch-cms + font + ảnh (một lần)
  2. mỗi domain: vite build → vite build --ssr → prerender-seo → releases/<id>
  3. đạt → đổi symlink current; lỗi → domain đó giữ bản cũ
```

Thư mục trên VPS:

```
/var/www/nortonpark/src                              mã nguồn (git clone) + .env.production
/var/www/nortonpark/sites/<domain>/releases/<id>     các bản build (giữ 5 bản để rollback)
/var/www/nortonpark/sites/<domain>/current           symlink → bản đang chạy (nginx đọc ở đây)
```

Cấu hình riêng từng domain nằm trong repo: `sites/<domain>/site.env` (`VITE_SITE_URL`, `SITE_TEMPLATE`, có thể thêm `VITE_GTM_ID`, `VITE_GSC_VERIFICATION` riêng).

## Bước 1. Đưa 5 domain vào Cloudflare

Dùng **cùng tài khoản Cloudflare có tunnel `qtopia-vps`**. Với từng domain:

1. **Add a domain** → gói Free. Xoá các bản ghi A/AAAA/CNAME cũ của `@` và `www` (tunnel tự tạo lại ở bước 4).
2. Đổi **nameserver** ở nhà đăng ký sang 2 nameserver Cloudflare, chờ **Active**.
3. **SSL/TLS → Overview:** **Full (strict)**. **Edge Certificates:** bật **Always Use HTTPS**.

## Bước 2. Chứng chỉ Origin (chỉ cho `canho-nortonpark.vn`)

Zone `canho-nortonpark.vn` → **SSL/TLS → Origin Server → Create Certificate**: hostnames `canho-nortonpark.vn`, `*.canho-nortonpark.vn`, 15 năm, PEM. Giữ tab này mở: bước 3 sẽ hỏi dán chứng chỉ thẳng vào terminal VPS. Không dán private key vào chat hay commit vào git.

4 domain vệ tinh không cần chứng chỉ riêng: tunnel luôn kết nối vào nginx bằng tên `canho-nortonpark.vn`, nginx trả chứng chỉ này rồi chọn thư mục theo domain khách gõ.

## Bước 3. Chạy script cài đặt trên VPS (root)

```bash
curl -fsSLo /root/setup-nortonpark.sh https://raw.githubusercontent.com/linhlh-del/norton-park/main/deploy/setup-vps.sh
bash /root/setup-nortonpark.sh
```

Script tạo thư mục 5 domain, hỏi dán chứng chỉ Origin, clone mã nguồn, `npm ci`, tạo `.env.production`, build 5 domain và cài nginx (`deploy/nginx-nortonpark.conf`, `deploy/nortonpark-security.conf`). Chạy lại nhiều lần không sao.

`.env.production` (`/var/www/nortonpark/src/.env.production`, chmod 600): điền `CMS_SUPABASE_ANON_KEY` (chép từ Vercel, project `norton-park`) rồi chạy lại script. Để trống thì website dùng nội dung mặc định trong code. **Không** đặt `VITE_SITE_URL` ở đây.

Cuối log phải có `xong <id>: 5 thành công` và 5 dòng canonical đúng domain.

## Bước 4. Route trên Cloudflare Tunnel

**Zero Trust → Networks → Tunnels → `qtopia-vps` → Public hostnames** (hoặc *Published application routes*) → **Add**. Tạo 10 route, mọi route **Service `HTTPS` · `localhost:443`**:

| Subdomain | Domain |
|---|---|
| *(trống)* và `www` | `canho-nortonpark.vn` |
| *(trống)* và `www` | `nortonpark-binhduong.vn` |
| *(trống)* và `www` | `nortonparkliving.vn` |
| *(trống)* và `www` | `nortonparkhome.vn` |
| *(trống)* và `www` | `nortonparkresidences.com` |

Mỗi route: **Additional application settings → TLS → Origin Server Name = `canho-nortonpark.vn`** (cả 10 route). **HTTP Host Header để trống**, nếu không domain vệ tinh sẽ hiện nội dung domain chính.

Kiểm tra từ máy bất kỳ:

```bash
for d in canho-nortonpark.vn nortonpark-binhduong.vn nortonparkliving.vn nortonparkhome.vn nortonparkresidences.com; do printf '%-28s ' $d; curl -s https://$d/ | grep -o 'rel="canonical" href="[^"]*"'; done
curl -sI https://www.nortonparkhome.vn | grep -i location     # → https://nortonparkhome.vn/
```

## Bước 5. Google

Thêm 5 property dạng *Domain* trong Search Console (xác minh bằng bản ghi TXT trong Cloudflare DNS), gửi `https://<domain>/sitemap.xml`.

> **SEO:** khi 4 domain vệ tinh còn chung giao diện và nội dung với domain chính, Google dễ coi là trùng lặp và chỉ xếp hạng một domain. Ưu tiên làm giao diện / nội dung riêng cho vệ tinh.

---

## Vận hành

| Việc | Lệnh (trên VPS, quyền root) |
|---|---|
| Phát hành code mới | `cd /var/www/nortonpark/src && git pull && npm ci && npm run build:release` |
| Chỉ một domain | `npm run build:release -- nortonparkhome.vn` |
| Rollback một domain | `cd /var/www/nortonpark/sites/<domain> && ls releases && ln -sfn releases/<id> current.tmp && mv -T current.tmp current` |
| Bản đang chạy | `curl -s https://canho-nortonpark.vn/cms-status.json` |
| Build thử trên máy dev | `npm run build:sites` → `dist-sites/<domain>/` |

Nút "Đăng" của CMS (`norton-park-cms`) chưa nối với VPS: sau khi đăng nội dung, chạy `npm run build:release` trên VPS. Muốn tự động, thêm project `norton-park` vào deploy hook dùng chung (`cms-supabase/vps-deploy-hook/server.mjs`, `script: 'build:release'`, thư mục `/var/www/nortonpark/src`) giống Sensa.

## Khi có giao diện thứ 2

1. Làm giao diện mới, cho build chọn giao diện theo `SITE_TEMPLATE`, thêm tên vào `TEMPLATES` trong `scripts/sites.mjs`.
2. Đổi `SITE_TEMPLATE=<tên>` trong `sites/<domain>/site.env` của domain vệ tinh.
3. Commit, push, chạy `git pull && npm run build:release` trên VPS. nginx, tunnel và Cloudflare không phải sửa gì.

## Thêm domain thứ 6

Tạo `sites/<domain>/site.env`, thêm tên vào 3 chỗ `server_name` trong `deploy/nginx-nortonpark.conf` và vào `DOMAINS` trong `deploy/setup-vps.sh`, thêm 2 route tunnel (Origin Server Name `canho-nortonpark.vn`), rồi chạy lại script.

`deploy/nginx.conf` là cấu hình cũ cho một domain (Let's Encrypt), không dùng cho VPS này.
