#!/usr/bin/env bash
# Cài Norton Park lên VPS (chạy bằng root, chạy lại nhiều lần không sao):
#   curl -fsSLo /root/setup-nortonpark.sh https://raw.githubusercontent.com/linhlh-del/norton-park/main/deploy/setup-vps.sh
#   bash /root/setup-nortonpark.sh
#
# Script làm:
#   1. Tạo /var/www/nortonpark/src và /var/www/nortonpark/sites/<domain>/releases cho 5 domain
#   2. Chứng chỉ Origin canho-nortonpark.vn: nếu chưa có thì hỏi để dán vào /etc/ssl/cloudflare/
#   3. Clone (hoặc git pull) mã nguồn, npm ci (không apt install gì)
#   4. Tạo /var/www/nortonpark/src/.env.production nếu chưa có (chmod 600)
#   5. Build 5 domain (npm run build:release) → sites/<domain>/current
#      Prerender bằng React SSR (không cần Chrome)
#   6. Cài cấu hình nginx (nginx -t lỗi thì tự gỡ ra, không làm hỏng site khác)
# Không đụng tới cloudflared, QTOPIA hay deploy hook.
set -euo pipefail

BASE=/var/www/nortonpark
SRC=$BASE/src
REPO=${REPO:-https://github.com/linhlh-del/norton-park.git}
DOMAINS=(canho-nortonpark.vn nortonpark-binhduong.vn nortonparkliving.vn nortonparkhome.vn nortonparkresidences.com)
CERT=/etc/ssl/cloudflare/canho-nortonpark.vn.pem
KEY=/etc/ssl/cloudflare/canho-nortonpark.vn.key

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m[!] %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m[ok] %s\033[0m\n' "$*"; }

[ "$(id -u)" = 0 ] || { echo "Chạy bằng root: sudo -i rồi bash $0"; exit 1; }

# Node cài qua nvm trong /root giống QTOPIA
export NVM_DIR="${NVM_DIR:-/root/.nvm}"
# shellcheck disable=SC1091
if [ -s "$NVM_DIR/nvm.sh" ]; then set +eu; . "$NVM_DIR/nvm.sh"; set -eu; fi
command -v node >/dev/null || { echo "Không thấy node. Cài nvm + node như QTOPIA rồi chạy lại."; exit 1; }
command -v git >/dev/null || { echo "Không thấy git: apt install -y git"; exit 1; }
command -v nginx >/dev/null || { echo "Không thấy nginx: apt install -y nginx"; exit 1; }
ok "node $(node -v), npm $(npm -v)"

step "1. Thư mục"
mkdir -p "$BASE"
for d in "${DOMAINS[@]}"; do mkdir -p "$BASE/sites/$d/releases"; done
ls -d "$BASE"/sites/*/

step "2. Chứng chỉ Origin (canho-nortonpark.vn)"
# Dán PEM từ Cloudflare: zone canho-nortonpark.vn → SSL/TLS → Origin Server → Create Certificate
# (hostnames canho-nortonpark.vn, *.canho-nortonpark.vn). Dán thẳng vào terminal VPS, KHÔNG gửi qua chat.
paste_pem() { # $1 file đích, $2 tên hiển thị, $3 quyền
  local f=$1 line tmp
  tmp=$(umask 077; mktemp)
  echo "Dán $2 (từ dòng -----BEGIN đến dòng -----END), Enter sau dòng END:"
  while IFS= read -r line; do
    line=${line%$'\r'}
    printf '%s\n' "$line" >> "$tmp"
    [[ $line == -----END* ]] && break
  done
  if grep -q -- '-----BEGIN' "$tmp" && grep -q -- '-----END' "$tmp"; then
    install -m "$3" "$tmp" "$f"; rm -f "$tmp"; ok "Đã lưu $f"
  else
    rm -f "$tmp"; warn "Không phải PEM hợp lệ, bỏ qua $f"
  fi
}
mkdir -p /etc/ssl/cloudflare
if [ -s "$CERT" ] && [ -s "$KEY" ]; then
  ok "Đã có $CERT và $KEY"
elif [ -t 0 ]; then
  [ -s "$CERT" ] || paste_pem "$CERT" "Origin Certificate" 644
  [ -s "$KEY" ]  || paste_pem "$KEY" "Private Key" 600
else
  warn "Chưa có chứng chỉ, chạy script trong terminal để dán (bash $0)"
fi
[ -f "$KEY" ] && chmod 600 "$KEY"

step "3. Mã nguồn"
if [ -d "$SRC/.git" ]; then
  git -C "$SRC" pull --ff-only
else
  [ -e "$SRC" ] && [ -n "$(ls -A "$SRC" 2>/dev/null)" ] && { echo "$SRC đã có file nhưng không phải git repo. Kiểm tra rồi xoá thư mục này."; exit 1; }
  git clone "$REPO" "$SRC"
fi
git -C "$SRC" log --oneline -1
cd "$SRC"
npm ci --no-audit --no-fund

step "4. .env.production"
ENV_FILE=$SRC/.env.production
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'EOF'
# Chép từ Vercel → project norton-park → Settings → Environment Variables (môi trường Production).
# KHÔNG đặt VITE_SITE_URL ở đây: mỗi domain lấy từ sites/<domain>/site.env.
CMS_SUPABASE_URL=https://ocbsfqgqukhaixskzwdz.supabase.co
CMS_SUPABASE_ANON_KEY=
# Để trống thì dùng endpoint lead cấu hình trong CMS
VITE_LEAD_ENDPOINT=
# GTM chung cho mọi domain (để trống nếu khai báo trong CMS); muốn riêng từng domain thì đặt trong sites/<domain>/site.env
VITE_GTM_ID=
NORTON_BASE_DIR=/var/www/nortonpark
EOF
  ok "Đã tạo $ENV_FILE"
fi
chmod 600 "$ENV_FILE"
if ! grep -qE '^CMS_SUPABASE_ANON_KEY=.+' "$ENV_FILE"; then
  warn "CMS_SUPABASE_ANON_KEY còn trống → build sẽ dùng nội dung mặc định trong code, không có nội dung CMS."
  warn "Điền vào: nano $ENV_FILE  rồi chạy lại script này."
fi

step "5. Build 5 domain"
if [ "${SKIP_BUILD:-0}" = 1 ]; then
  warn "SKIP_BUILD=1 → bỏ qua build"
else
  npm run build:release || warn "Có domain build lỗi (xem log phía trên). Domain lỗi giữ bản cũ / chưa có bản build."
fi
for d in "${DOMAINS[@]}"; do
  if [ -L "$BASE/sites/$d/current" ]; then ok "$d → $(readlink "$BASE/sites/$d/current")"; else warn "$d chưa có bản build (current)"; fi
done

step "6. nginx"
cp deploy/nortonpark-security.conf /etc/nginx/snippets/nortonpark-security.conf
cp deploy/nginx-nortonpark.conf /etc/nginx/sites-available/nortonpark
NGINX_VER=$(nginx -v 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
if [ "$(printf '%s\n1.25.1\n' "$NGINX_VER" | sort -V | head -1)" != "1.25.1" ]; then
  # nginx cũ (vd. 1.18 trên Ubuntu 22.04) chưa có "http2 on;"
  sed -i -e '/^\s*http2 on;/d' -e 's/listen \(\[::\]:\)\?443 ssl;/listen \1443 ssl http2;/' /etc/nginx/sites-available/nortonpark
  ok "nginx $NGINX_VER: dùng 'listen 443 ssl http2'"
fi
NGINX_ON=0
if [ -s "$CERT" ] && [ -s "$KEY" ]; then
  chmod 600 "$KEY"
  ln -sfn ../sites-available/nortonpark /etc/nginx/sites-enabled/nortonpark
  if nginx -t; then
    systemctl reload nginx
    sleep 2   # chờ nginx nạp xong cấu hình mới trước khi kiểm tra
    NGINX_ON=1
    ok "nginx đã bật site nortonpark"
  else
    rm -f /etc/nginx/sites-enabled/nortonpark
    warn "nginx -t lỗi → đã gỡ site nortonpark ra, nginx đang chạy giữ nguyên. Gửi lỗi phía trên để xử lý."
  fi
else
  rm -f /etc/nginx/sites-enabled/nortonpark
  warn "Chưa có chứng chỉ Origin → chưa bật nginx cho Norton Park. Tạo trên Cloudflare (zone canho-nortonpark.vn → SSL/TLS → Origin Server),"
  warn "  hostnames canho-nortonpark.vn, *.canho-nortonpark.vn, rồi dán vào:"
  warn "    nano $CERT   (Origin Certificate)"
  warn "    nano $KEY    (Private Key)"
  warn "  rồi chạy lại: SKIP_BUILD=1 bash $0"
fi

step "Kiểm tra"
if [ "$NGINX_ON" = 1 ]; then
  for d in "${DOMAINS[@]}"; do
    printf '%-28s ' "$d"
    curl -sk --resolve "$d:443:127.0.0.1" "https://$d/" | grep -o 'rel="canonical" href="[^"]*"' || echo "(không đọc được trang)"
  done
fi
echo
echo "Việc còn lại (deploy/DEPLOY-VPS.md): thêm 10 route trên Cloudflare Tunnel, Origin Server Name = canho-nortonpark.vn."
