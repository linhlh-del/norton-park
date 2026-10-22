/* ============================================================
   BẢN ĐỒ VỊ TRÍ NORTON PARK — chuyển từ script của trang bản đồ độc lập sang module cho section React.
   Giữ nguyên toàn bộ logic: khung nhìn viewBox (kéo / phóng / chụm), làm nổi theo mốc thời gian & mục nổi bật,
   bộ lọc lớp, thẻ điểm, mở màn và chuyển động nền, bảng thông tin (thẻ bên phải / tấm kéo lên trên điện thoại).
   Khác bản gốc:
     - mọi truy vấn DOM giới hạn trong khung section (không dùng document toàn trang)
     - toạ độ tính theo kích thước khung bản đồ thay cho cửa sổ (bản gốc chạy trong iframe toàn màn hình)
     - có hàm huỷ: gỡ sự kiện, dừng hiệu ứng, xoá style chèn vào <head> (React StrictMode / chuyển trang)
     - "ngủ" khi chuột rời khung, bấm ra ngoài hoặc cuộn qua section (thay cho postMessage với trang cha)
     - sự kiện đo lường phát ra dưới dạng CustomEvent "locmap:track" trên phần tử #lm
   ============================================================ */
import { html } from '@/lib/trustedTypes';

const NS = 'http://www.w3.org/2000/svg';

export function createLocationMap(host, { markup, data, logoUrl }) {
  host.innerHTML = html(markup.replace('__LOGO__', logoUrl));

  const D = data;
  const $ = (s) => host.querySelector(s);
  const $$ = (s, r) => Array.from((r || host).querySelectorAll(s));
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lm = $('#lm'), stage = $('#stage'), svg = $('#art');
  const MAP = { x: 118, y: 190, w: 1742, h: 1086 };
  const NP = D.features.norton;
  const F = {};
  ['poi', 'junction', 'bridge', 'airport', 'road'].forEach((k) => (D.features[k] || []).forEach((f) => { F[f.id] = { ...f, kind: k }; }));

  /* ---------- dọn dẹp ---------- */
  let dead = false;
  const offs = [], timers = [], injected = [];
  const on = (t, type, fn, opt) => { t.addEventListener(type, fn, opt); offs.push(() => t.removeEventListener(type, fn, opt)); };
  const later = (fn, ms) => { const id = setTimeout(() => { if (!dead) fn(); }, ms); timers.push(id); return id; };
  const raf = (fn) => requestAnimationFrame((t) => { if (!dead) fn(t); });

  const TRK = (ev, label) => lm.dispatchEvent(new CustomEvent('locmap:track', { bubbles: true, detail: { ev, label } }));
  const el = (tag, attrs, parentEl) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parentEl) parentEl.appendChild(e);
    return e;
  };
  const W = () => lm.clientWidth || 1;
  const H = () => lm.clientHeight || 1;
  const local = (e) => { const r = lm.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const isSheet = () => innerWidth <= 760 && innerHeight > 520;
  const defs = svg.querySelector('defs') || el('defs', {}, svg);

  /* ============================================================
     LỚP PHỦ: mép nhạt, quầng Norton Park, vệt sáng, xung làm nổi, vùng chạm
     ============================================================ */
  const art = svg.querySelector('g[clip-path],g[mask]') || svg;
  const lg = el('linearGradient', { id: 'fadeRG', x1: '0', x2: '1', y1: '0', y2: '0' }, defs);
  el('stop', { offset: '0', 'stop-color': '#FFF8F2', 'stop-opacity': '0' }, lg);
  el('stop', { offset: '1', 'stop-color': '#FFF8F2', 'stop-opacity': '1' }, lg);
  const comets = el('g', { id: 'comets' }, art);
  el('rect', { id: 'fadeR', x: 1700, y: 150, width: 190, height: 1170, fill: 'url(#fadeRG)' }, svg);
  [['fadeT', 1, 0, MAP.x - 40, MAP.y - 2, MAP.w + 80, 70], ['fadeB', 0, 1, MAP.x - 40, MAP.y + MAP.h - 68, MAP.w + 80, 70]].forEach(([id, a, b, x, y, w, h]) => {
    const g = el('linearGradient', { id: id + 'G', x1: '0', x2: '0', y1: '0', y2: '1' }, defs);
    el('stop', { offset: '0', 'stop-color': '#FFF8F2', 'stop-opacity': String(a) }, g);
    el('stop', { offset: '1', 'stop-color': '#FFF8F2', 'stop-opacity': String(b) }, g);
    el('rect', { id, x, y, width: w, height: h, fill: 'url(#' + id + 'G)', 'pointer-events': 'none' }, svg);
  });
  {
    const g = el('linearGradient', { id: 'fadeLG', x1: '0', x2: '1', y1: '0', y2: '0' }, defs);
    el('stop', { offset: '0', 'stop-color': '#FFF8F2', 'stop-opacity': '1' }, g);
    el('stop', { offset: '1', 'stop-color': '#FFF8F2', 'stop-opacity': '0' }, g);
    el('rect', { id: 'fadeL', x: MAP.x - 2, y: MAP.y - 40, width: 64, height: MAP.h + 80, fill: 'url(#fadeLG)', 'pointer-events': 'none' }, svg);
  }
  const halo = el('g', { id: 'halo' }, null);
  const npG = svg.querySelector('#np');
  if (npG) npG.parentNode.insertBefore(halo, npG); else art.appendChild(halo);
  el('circle', { cx: NP.x, cy: NP.y, r: 64, class: 'glow' }, halo);
  [0, 1, 2].forEach(() => el('circle', { cx: NP.x, cy: NP.y, r: 58, 'stroke-width': 3 }, halo));
  const pulses = el('g', { id: 'pulses' }, svg);
  const hits = el('g', { id: 'hits' }, svg);
  const hitList = [];
  ['poi', 'junction', 'bridge', 'airport'].forEach((k) => (D.features[k] || []).forEach((f) => {
    const c = el('circle', { cx: f.x, cy: f.y, r: 16, 'data-id': f.id, 'data-g': k }, hits);
    if (f.cat) c.setAttribute('data-cat', f.cat);
    hitList.push(c);
  }));

  /* ============================================================
     KHUNG NHÌN (viewBox) — kéo, phóng, chụm hai ngón
     ============================================================ */
  let vb = { x: MAP.x, y: MAP.y, w: MAP.w, h: MAP.h }, fitW = MAP.w, tween = null;
  function freeRect() {
    const w = W(), h = H();
    const top = parseFloat(getComputedStyle(lm).getPropertyValue('--top')) || 14;
    if (isSheet()) {
      const peek = parseFloat(getComputedStyle(lm).getPropertyValue('--peek')) || 78;
      return { l: 10, t: top + 4, r: w - 10, b: h - peek - 12 };
    }
    const b = $('#board');
    const bw = lm.classList.contains('bd-min') ? 0 : b.offsetWidth + 28;
    return { l: 12, t: top - 6, r: w - bw - 8, b: h - 12 };
  }
  function viewFor(box, pad) {
    const w = W(), h = H(), fr = freeRect();
    const fw = Math.max(80, fr.r - fr.l - 2 * pad), fh = Math.max(80, fr.b - fr.t - 2 * pad);
    const s = Math.min(fw / box.w, fh / box.h);
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    const sx = (fr.l + fr.r) / 2, sy = (fr.t + fr.b) / 2;
    return { x: cx - sx / s, y: cy - sy / s, w: w / s, h: h / s };
  }
  function setVB(v) {
    vb = v;
    svg.setAttribute('viewBox', v.x.toFixed(2) + ' ' + v.y.toFixed(2) + ' ' + v.w.toFixed(2) + ' ' + v.h.toFixed(2));
    const s = W() / v.w;
    const r = (isSheet() ? 22 : 16) / s;
    hitList.forEach((c) => c.setAttribute('r', r.toFixed(1)));
    placeCard();
  }
  function goTo(v, ms) {
    if (tween) cancelAnimationFrame(tween);
    if (!ms || RM) { setVB(v); return; }
    const a = { ...vb }, t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      const t = Math.min(1, Math.max(0, (now - t0) / ms)), k = ease(t);
      setVB({ x: a.x + (v.x - a.x) * k, y: a.y + (v.y - a.y) * k, w: a.w + (v.w - a.w) * k, h: a.h + (v.h - a.h) * k });
      tween = t < 1 ? raf(step) : null;
    };
    tween = raf(step);
  }
  const START_SHEET = { x: 300, y: 196, w: 600, h: 1074 };
  function home(ms) {
    const v = viewFor(isSheet() ? START_SHEET : MAP, isSheet() ? 4 : 6);
    fitW = viewFor(MAP, 6).w;
    goTo(v, ms);
  }
  function zoomAt(px, py, k, ms) {
    const minW = 330, maxW = fitW * 1.35;
    const nw = Math.max(minW, Math.min(maxW, vb.w * k)), rk = nw / vb.w;
    const mx = vb.x + (px / W()) * vb.w, my = vb.y + (py / H()) * vb.h;
    const v = { x: mx - (mx - vb.x) * rk, y: my - (my - vb.y) * rk, w: nw, h: vb.h * rk };
    goTo(clampV(v), ms);
  }
  function clampV(v) {
    const mx = v.w * 0.35, my = v.h * 0.35;
    v.x = Math.min(MAP.x + MAP.w - mx, Math.max(MAP.x - v.w + mx, v.x));
    v.y = Math.min(MAP.y + MAP.h - my, Math.max(MAP.y - v.h + my, v.y));
    return v;
  }

  /* bản đồ "ngủ" mặc định: lăn chuột / kéo một ngón để cuộn trang; bấm vào bản đồ để "đánh thức" */
  let live = false;
  function setLive(v) {
    if (live === v) return;
    live = v;
    lm.classList.toggle('live', v);
    if (v) { const h = $('#hint'); if (h) h.classList.remove('gone'); TRK('map', 'activate'); }
  }
  on(lm, 'mouseleave', () => setLive(false));
  on(window, 'blur', () => setLive(false));
  on(document, 'pointerdown', (e) => { if (!lm.contains(e.target)) setLive(false); });
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(([en]) => { if (!en.isIntersecting || en.intersectionRatio < 0.3) setLive(false); }, { threshold: [0, 0.3] })
    : null;
  if (io) io.observe(lm);
  if (matchMedia('(hover:none)').matches) { const g = $('#gate span'); if (g) g.textContent = 'Chạm vào bản đồ để khám phá'; }

  const gone = () => { const h = $('#hint'); if (h) h.classList.add('gone'); };
  function wireNav() {
    on(stage, 'wheel', (e) => {
      if (!live && !e.ctrlKey) return;
      e.preventDefault();
      const p = local(e);
      zoomAt(p.x, p.y, e.deltaY > 0 ? 1.14 : 1 / 1.14, 0);
      gone();
    }, { passive: false });
    const ptr = new Map();
    let pinch = null, down = null, moved = false;
    on(stage, 'pointerdown', (e) => {
      ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try { stage.setPointerCapture(e.pointerId); } catch (x) { /* bỏ qua */ }
      if (ptr.size === 1) { down = { x: e.clientX, y: e.clientY, t: performance.now(), target: e.target }; moved = false; }
      if (ptr.size === 2) {
        const [a, b] = [...ptr.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), v: { ...vb } };
      }
      if (tween) { cancelAnimationFrame(tween); tween = null; }
    });
    on(stage, 'pointermove', (e) => {
      if (!ptr.has(e.pointerId)) return;
      const p = ptr.get(e.pointerId);
      ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (!live) return;
      if (ptr.size === 1) {
        if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) moved = true;
        if (!moved) return;
        stage.classList.add('drag');
        setVB(clampV({ ...vb, x: vb.x - ((e.clientX - p.x) / W()) * vb.w, y: vb.y - ((e.clientY - p.y) / H()) * vb.h }));
        gone();
      } else if (ptr.size === 2 && pinch) {
        moved = true;
        const [a, b] = [...ptr.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 0) {
          vb = { ...pinch.v };
          const m = local({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
          zoomAt(m.x, m.y, pinch.d / d, 0);
        }
        gone();
      }
    });
    const up = (e) => {
      const was = ptr.has(e.pointerId);
      ptr.delete(e.pointerId);
      if (ptr.size < 2) pinch = null;
      if (!ptr.size) stage.classList.remove('drag');
      if (was && !ptr.size && down && !moved && performance.now() - down.t < 450) {
        if (!live) setLive(true);
        tapAt(down.target);
      }
      if (!ptr.size) down = null;
    };
    on(stage, 'pointerup', up);
    on(stage, 'pointercancel', up);
    on(stage, 'dblclick', (e) => { const p = local(e); zoomAt(p.x, p.y, 1 / 1.8, 350); });
    on($('#zIn'), 'click', () => zoomAt(W() / 2, H() / 2, 1 / 1.4, 320));
    on($('#zOut'), 'click', () => zoomAt(W() / 2, H() / 2, 1.4, 320));
    on($('#zFit'), 'click', () => { clearHL(); goTo(viewFor(MAP, 6), 650); TRK('map', 'fit'); });
    on($('#replay'), 'click', () => { clearHL(); home(0); intro(); TRK('map', 'replay'); });
    let rt = null;
    const ro = new ResizeObserver(() => { clearTimeout(rt); rt = later(() => home(0), 120); });
    ro.observe(lm);
    offs.push(() => ro.disconnect());
  }

  /* ============================================================
     CHẠM / RÊ: thẻ điểm
     ============================================================ */
  let cardFor = null;
  const CAT = D.cats;
  function bandOf(id) {
    const b = D.bands.find((x) => x.items.some((it) => it.f === id));
    return b ? b.t : null;
  }
  function showCard(id) {
    const f = F[id]; if (!f) return;
    cardFor = f;
    const kick = f.kind === 'poi' ? (CAT[f.cat] || {}).name : { junction: 'Nút giao', bridge: 'Cầu', airport: 'Hướng sân bay', road: 'Trục đường' }[f.kind];
    $('#card .k').textContent = kick || '';
    $('#card .n').textContent = f.name;
    const band = bandOf(id), near = D.near[id];
    $('#card .m').innerHTML = html(band
      ? '<b>' + band + '</b><span>phút di chuyển<br>từ Norton Park</span>'
      : near ? '<b>' + near + '</b><span>Norton Park</span>' : '');
    $('#card').classList.add('on');
    placeCard();
    TRK('poi', f.name);
  }
  function hideCard() { cardFor = null; $('#card').classList.remove('on'); }
  function placeCard() {
    const c = $('#card');
    if (!cardFor || !c.classList.contains('on') || isSheet()) return;
    const s = W() / vb.w;
    const x = (cardFor.x - vb.x) * s, y = (cardFor.y - vb.y) * s;
    const w = c.offsetWidth, h = c.offsetHeight, fr = freeRect();
    let left = x + 18, top = y - h / 2;
    if (left + w > fr.r) left = x - 18 - w;
    left = Math.max(fr.l, Math.min(fr.r - w, left));
    top = Math.max(fr.t, Math.min(fr.b - h, top));
    c.style.left = left + 'px'; c.style.top = top + 'px';
  }
  function tapAt(t) {
    const id = t && t.closest && t.closest('#hits circle') && t.getAttribute('data-id');
    if (id) { showCard(id); pulseOn([id]); return; }
    hideCard(); clearHL();
  }
  on($('#card .x'), 'click', () => { hideCard(); clearHL(); });
  on(hits, 'pointerenter', (e) => { if (e.pointerType === 'mouse') { const id = e.target.getAttribute('data-id'); if (id) showCard(id); } }, true);
  on(hits, 'pointerleave', (e) => { if (e.pointerType === 'mouse' && !svg.classList.contains('hl')) hideCard(); }, true);

  /* ============================================================
     LÀM NỔI: bấm mốc thời gian / mục nổi bật
     ============================================================ */
  function pulseOn(ids) {
    pulses.replaceChildren();
    ids.forEach((id) => {
      const f = F[id]; if (!f || f.kind === 'road') return;
      el('circle', { cx: f.x, cy: f.y, r: 26, class: 'core' }, pulses);
      [0, 1, 2].forEach(() => el('circle', { cx: f.x, cy: f.y, r: 30, 'stroke-width': 3 }, pulses));
    });
  }
  function highlight(ids, opt) {
    opt = opt || {};
    svg.classList.add('hl');
    $$('#art .on').forEach((e) => e.classList.remove('on'));
    ids.forEach((id) => $$('#art [data-f="' + id + '"]').forEach((e) => e.classList.add('on')));
    pulseOn(ids);
    if (opt.frame !== false) frame(ids);
    if (isSheet()) setSheet(false);
  }
  function clearHL() {
    svg.classList.remove('hl');
    $$('#art .on').forEach((e) => e.classList.remove('on'));
    pulses.replaceChildren();
    $$('.band.on,.hi.on').forEach((b) => b.classList.remove('on'));
  }
  function frame(ids) {
    let x0 = NP.x, y0 = NP.y, x1 = NP.x, y1 = NP.y;
    ids.forEach((id) => $$('#art [data-f="' + id + '"]').forEach((e) => {
      try {
        const b = e.getBBox();
        x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
      } catch (x) { /* bỏ qua */ }
    }));
    x0 = Math.max(MAP.x, x0); y0 = Math.max(MAP.y, y0); x1 = Math.min(MAP.x + MAP.w, x1); y1 = Math.min(MAP.y + MAP.h, y1);
    const w = Math.max(260, x1 - x0), h = Math.max(260, y1 - y0);
    goTo(viewFor({ x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h }, 40), 800);
  }

  /* ============================================================
     BẢNG THÔNG TIN (HTML)
     ============================================================ */
  const TICK = '<svg viewBox="0 0 24 24"><path d="M5 13l4 4 10-11"/></svg>';
  function buildBoard() {
    const hi = $('#secHi .hi-grid');
    D.highlights.forEach((h) => {
      const b = document.createElement('button');
      b.className = 'hi';
      b.innerHTML = html('<span class="k">' + h.k + '</span><span class="ic">' + D.icons[h.icon] + '</span><b>' + h.title + '</b><span>' + h.sub + '</span>');
      b.onclick = () => {
        const was = b.classList.contains('on');
        clearHL(); hideCard();
        if (!was) { b.classList.add('on'); highlight(h.f); if (F[h.f[0]]) showCard(h.f[0]); }
        TRK('highlight', h.title);
      };
      hi.appendChild(b);
    });
    const bands = $('#secTime .bands');
    D.bands.forEach((bd) => {
      const row = document.createElement('div');
      row.className = 'band'; row.tabIndex = 0; row.setAttribute('role', 'button');
      row.innerHTML = html('<span class="num"><b>' + bd.t.replace('-', '<span class="dash" aria-label="đến"></span>') + '</b><i>PHÚT</i></span><span class="leaf">' + D.icons.leaf + '</span><ul>' +
        bd.items.map((it) => '<li class="' + (it.f ? 'go' : 'off') + '"' + (it.f ? ' data-f="' + it.f + '"' : '') + '>' + it.name + '</li>').join('') + '</ul>');
      const all = bd.items.filter((it) => it.f).map((it) => it.f);
      const act = (e) => {
        const li = e.target.closest('li.go');
        clearHL(); hideCard();
        if (li) { row.classList.add('on'); highlight([li.dataset.f]); showCard(li.dataset.f); TRK('band-item', li.textContent); return; }
        if (row.dataset.was === '1') { row.dataset.was = ''; return; }
        $$('.band').forEach((r) => { r.dataset.was = ''; });
        row.classList.add('on'); row.dataset.was = '1'; highlight(all);
        TRK('band', bd.t);
      };
      row.addEventListener('click', act);
      row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(e); } });
      bands.appendChild(row);
    });
    buildFilter();
  }

  /* ---------- bộ lọc ---------- */
  const state = {}, catState = {};
  function applyFilter() {
    D.legend.forEach((L) => svg.classList.toggle('off-' + L.id, state[L.id] === false));
    Object.keys(CAT).forEach((c) => svg.classList.toggle('offcat-' + c, catState[c] === false));
    $$('.lg').forEach((r) => r.classList.toggle('on', state[r.dataset.id] !== false));
    $$('.cats button').forEach((b) => b.classList.toggle('on', catState[b.dataset.cat] !== false));
    $$('.presets button').forEach((b) => {
      const P = D.presets.find((p) => p.id === b.dataset.id);
      b.classList.toggle('on', D.legend.every((L) => (state[L.id] !== false) === P.on.includes(L.id)) && Object.keys(CAT).every((c) => catState[c] !== false));
    });
    syncComets();
  }
  function buildFilter() {
    /* luật ẩn theo lớp: #art.off-<lớp> [data-g=<lớp>] và theo nhóm tiện ích — ẩn bằng fill-/stroke-opacity để Chrome
       không tách SVG thành nhiều lớp GPU (xem location-map.css) */
    const HIDE = '{fill-opacity:0!important;stroke-opacity:0!important;pointer-events:none}';
    const css = D.legend.map((L) => L.g.map((g) => '#art.off-' + L.id + ' [data-g="' + g + '"]').join(',') + HIDE).join('\n') +
      Object.keys(CAT).map((c) => '\n#art.offcat-' + c + ' [data-g="poi"][data-cat="' + c + '"]' + HIDE).join('');
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    injected.push(st);
    const pr = $('#secFilter .presets');
    D.presets.forEach((P) => {
      const b = document.createElement('button');
      b.dataset.id = P.id; b.textContent = P.name;
      b.onclick = () => {
        D.legend.forEach((L) => { state[L.id] = P.on.includes(L.id); });
        Object.keys(CAT).forEach((c) => { catState[c] = true; });
        clearHL(); applyFilter(); TRK('preset', P.name);
      };
      pr.appendChild(b);
    });
    const box = $('#secFilter .legend');
    D.legend.forEach((L) => {
      const r = document.createElement('button');
      r.className = 'lg' + (L.isNew ? ' new' : ''); r.dataset.id = L.id;
      r.innerHTML = html('<span class="sw">' + L.sw + '</span><i>' + L.name + '</i><span class="tick">' + TICK + '</span>');
      r.onclick = () => { state[L.id] = state[L.id] === false; applyFilter(); TRK('filter', L.name + (state[L.id] ? ' on' : ' off')); };
      box.appendChild(r);
      if (L.id === 'poi') {
        const cats = document.createElement('div'); cats.className = 'cats';
        Object.keys(CAT).forEach((c) => {
          const b = document.createElement('button');
          b.dataset.cat = c; b.style.setProperty('--c', CAT[c].color);
          b.innerHTML = html('<i></i>' + CAT[c].name);
          b.onclick = () => { catState[c] = catState[c] === false; if (catState[c]) state.poi = true; applyFilter(); TRK('cat', CAT[c].name); };
          cats.appendChild(b);
        });
        box.appendChild(cats);
      }
    });
    applyFilter();
  }

  /* ---------- thu gọn / mở bảng (máy tính) · tấm kéo lên (điện thoại) ---------- */
  function setMin(v) {
    lm.classList.toggle('bd-min', v);
    $('#board').classList.toggle('min', v);
    $('#bdOpen').hidden = !v || isSheet();
    later(() => home(500), 60);
  }
  function setSheet(up, sec) {
    const b = $('#board');
    b.classList.toggle('up', !!up);
    lm.classList.toggle('sheet-up', !!up);
    if (sec) showSec(sec);
  }
  function showSec(sec) {
    $$('.bd-tabs button').forEach((t) => t.classList.toggle('on', t.dataset.sec === sec));
    $$('.bd-body .sec').forEach((s) => s.classList.toggle('on', s.dataset.sec === sec));
  }
  function wireBoard() {
    on($('#bdMin'), 'click', () => { setMin(true); TRK('board', 'min'); });
    on($('#bdOpen'), 'click', () => { setMin(false); TRK('board', 'open'); });
    $$('.bd-tabs button').forEach((t) => on(t, 'click', () => {
      if (!isSheet()) {
        const sec = $('.bd-body .sec[data-sec="' + t.dataset.sec + '"]'), body = $('.bd-body');
        body.scrollTo({ top: sec.offsetTop - body.offsetTop - 4, behavior: RM ? 'auto' : 'smooth' });
        TRK('board', t.dataset.sec); return;
      }
      const b = $('#board'), same = t.classList.contains('on') && b.classList.contains('up');
      setSheet(!same, t.dataset.sec); TRK('sheet', t.dataset.sec);
    }));
    showSec('hi');
    on($('.bd-body'), 'scroll', () => {
      if (isSheet()) return;
      const body = $('.bd-body'), y = body.scrollTop + 60;
      let cur = 'hi';
      $$('.bd-body .sec').forEach((s) => { if (s.offsetTop - body.offsetTop <= y) cur = s.dataset.sec; });
      if (body.scrollTop + body.clientHeight >= body.scrollHeight - 4) cur = 'filter';
      $$('.bd-tabs button').forEach((t) => t.classList.toggle('on', t.dataset.sec === cur));
    }, { passive: true });
    const b = $('#board'), body = $('.bd-body');
    let g = null;
    on(b, 'touchstart', (e) => {
      if (!isSheet() || e.touches.length !== 1) { g = null; return; }
      const t = e.touches[0], peek = parseFloat(getComputedStyle(lm).getPropertyValue('--peek')) || 78;
      const max = b.offsetHeight - peek;
      g = { y: t.clientY, x: t.clientX, max, base: b.classList.contains('up') ? 0 : max, cur: null, mode: '',
        inBody: body.contains(e.target), y1: t.clientY, t1: performance.now(), v: 0 };
    }, { passive: true });
    on(b, 'touchmove', (e) => {
      if (!g || g.mode === 'none') return;
      const t = e.touches[0], dx = t.clientX - g.x, dy = t.clientY - g.y;
      if (!g.mode) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dx) > Math.abs(dy)) { g.mode = 'none'; return; }
        if (g.inBody && b.classList.contains('up') && (body.scrollTop > 0 || dy < 0)) { g.mode = 'none'; return; }
        g.mode = 'drag'; b.classList.add('drag');
      }
      e.preventDefault();
      g.cur = Math.min(g.max, Math.max(0, g.base + dy));
      b.style.transform = 'translateY(' + g.cur + 'px)';
      const now = performance.now();
      if (now > g.t1) g.v = (t.clientY - g.y1) / (now - g.t1);
      g.y1 = t.clientY; g.t1 = now;
    }, { passive: false });
    const end = () => {
      const d = g; g = null;
      if (!d || d.mode !== 'drag') return;
      const y = d.cur == null ? d.base : d.cur;
      const up = d.v < -0.3 ? true : d.v > 0.3 ? false : y < d.max / 2;
      b.classList.remove('drag'); b.style.transform = '';
      setSheet(up);
    };
    on(b, 'touchend', end);
    on(b, 'touchcancel', end);
    on($('.bd-handle'), 'click', () => setSheet(!b.classList.contains('up')));
  }

  /* ============================================================
     MỞ MÀN (~3,2 s): sông lan ra từ dự án → đường vẽ dần theo cấp → điểm bật lên → nhãn hiện → la bàn, máy bay
     ============================================================ */
  let running = [];
  const dist = (e) => { try { const b = e.getBBox(); return Math.hypot(b.x + b.width / 2 - NP.x, b.y + b.height / 2 - NP.y); } catch (x) { return 600; } };
  function ends(e) {
    try {
      const L = e.getTotalLength(), a = e.getPointAtLength(0), b = e.getPointAtLength(L);
      return { L, far: Math.hypot(a.x - NP.x, a.y - NP.y) > Math.hypot(b.x - NP.x, b.y - NP.y) };
    } catch (x) { return { L: 0, far: false }; }
  }
  const A = (e, kf, o) => { const a = e.animate(kf, { fill: 'backwards', ...o }); running.push(a); return a; };
  const loose = (e) => !e.closest('#np,#compassG,[id^="air-"]');
  const GDELAY = { ql13: 250, ringdone: 480, ringplan: 900, road: 650, expr: 900, prov: 1050, metrolive: 700, metrofut: 900 };
  function intro() {
    running.forEach((a) => { try { a.cancel(); } catch (x) { /* bỏ qua */ } });
    running = [];
    stopAmbient();
    lm.classList.remove('boot'); void lm.offsetWidth; lm.classList.add('boot');
    svg.classList.add('boot');
    later(() => svg.classList.remove('boot'), 60);
    if (RM) { lm.classList.remove('boot'); startAmbient(); return; }
    const river = svg.querySelector('[data-g="river"]');
    if (river) {
      const old = defs.querySelector('#rvRiver'); if (old) old.remove();
      const cp = el('clipPath', { id: 'rvRiver' }, defs), c = el('circle', { cx: NP.x, cy: NP.y, r: 0 }, cp);
      river.setAttribute('clip-path', 'url(#rvRiver)');
      const t0 = performance.now(), R = 1500, ms = 1900;
      const st = (now) => {
        const t = Math.min(1, Math.max(0, (now - t0) / ms)), k = 1 - Math.pow(1 - t, 3);
        c.setAttribute('r', (R * k).toFixed(1));
        if (t < 1) raf(st); else { river.removeAttribute('clip-path'); cp.remove(); }
      };
      raf(st);
    }
    const np = $('#np');
    if (np) A(np, [{ opacity: 0, transform: 'translateY(-26px) scale(1.25)' }, { opacity: 1, transform: 'none', offset: 0.75 }, { transform: 'none' }],
      { duration: 900, delay: 120, easing: 'cubic-bezier(.2,.9,.3,1.15)' });
    A(halo, [{ opacity: 0 }, { opacity: 1 }], { duration: 800, delay: 700 });
    $$('#art [data-k="line"]').filter(loose).forEach((e) => {
      const g = e.getAttribute('data-g'), dly = GDELAY[g] || 900;
      const dashed = e.getAttribute('stroke-dasharray');
      const filled = e.getAttribute('fill') && e.getAttribute('fill') !== 'none';
      const { L, far } = ends(e);
      const dd = dly + Math.min(700, dist(e) * 0.35);
      if (!L) return;
      if (dashed || g === 'metrolive' || g === 'metrofut') { maskReveal(e, dd, Math.max(900, Math.min(1700, L * 1.25)), far); return; }
      if (filled) { A(e, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: dd }); return; }
      const from = far ? -L : L;
      A(e, [{ strokeDasharray: L + ' ' + L, strokeDashoffset: from }, { strokeDasharray: L + ' ' + L, strokeDashoffset: 0 }],
        { duration: Math.max(650, Math.min(1500, L * 1.1)), delay: dd, easing: 'cubic-bezier(.45,.05,.25,1)' });
    });
    const POP = { junction: 1250, station: 1450, bridge: 1650, poi: 1500 };
    $$('#art [data-k="node"],#art [data-k="dot"],#art [data-k="station"],#art [data-g="bridge"][data-k="icon"]').filter(loose).forEach((e) => {
      const g = e.getAttribute('data-k') === 'station' ? 'station' : e.getAttribute('data-g');
      const dd = (POP[g] || 1500) + Math.min(900, dist(e) * 0.9);
      A(e, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.3)', offset: 0.6 }, { transform: 'scale(1)' }],
        { duration: 620, delay: dd, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    });
    $$('#art [data-k="label"]').filter(loose).filter((e) => !/^(river|paper)$/.test(e.getAttribute('data-g'))).forEach((e) => {
      const g = e.getAttribute('data-g');
      const base = g === 'poi' || g === 'junction' || g === 'bridge' ? 1750 : (GDELAY[g] || 900) + 900;
      const dd = base + Math.min(900, dist(e) * 0.8);
      A(e, [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: dd, easing: 'ease-out' });
    });
    const cg = $('#compassG');
    if (cg) A(cg, [{ opacity: 0, transform: 'rotate(-140deg) scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 1100, delay: 2100, easing: 'cubic-bezier(.2,.9,.3,1.2)' });
    $$('#art [id^="air-"]').forEach((g, i) => {
      const dx = i === 0 ? 60 : -60;
      A(g, [{ opacity: 0, transform: 'translate(' + dx + 'px,-18px)' }, { opacity: 1, transform: 'none' }], { duration: 1200, delay: 2300 + i * 150, easing: 'cubic-bezier(.2,.8,.3,1)' });
    });
    const fr = $('#fadeR');
    if (fr) A(fr, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 900 });
    later(() => { lm.classList.remove('boot'); startAmbient(); }, 3400);
  }
  let uid = 0;
  function maskReveal(e, delay, dur, far) {
    const L = e.getTotalLength();
    const id = 'rv' + ++uid;
    const m = el('mask', { id, maskUnits: 'userSpaceOnUse', x: -500, y: -500, width: 3600, height: 2800 }, defs);
    const p = el('path', { d: e.getAttribute('d'), fill: 'none', stroke: '#fff', 'stroke-linecap': 'round',
      'stroke-width': (parseFloat(e.getAttribute('stroke-width')) || 3) + 12 }, m);
    const from = far ? -L : L;
    p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = from;
    e.setAttribute('mask', 'url(#' + id + ')');
    const a = p.animate([{ strokeDashoffset: from }, { strokeDashoffset: 0 }], { duration: dur, delay, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'forwards' });
    running.push(a);
    const done = () => { e.removeAttribute('mask'); m.remove(); };
    a.onfinish = done; a.oncancel = done;
  }

  /* ============================================================
     CHUYỂN ĐỘNG NỀN: vệt sáng dọc trục chính, metro chảy, nét đứt chạy chậm, máy bay bồng bềnh
     ============================================================ */
  let ambient = [];
  const TINT = { ql13: '#FFF6DC', ringdone: '#FBE6D2', expr: '#F7FBE6', road: '#EEF2DC' };
  function startAmbient() {
    if (RM) return;
    stopAmbient();
    const lines = $$('#art [data-k="line"]').filter((e) => TINT[e.getAttribute('data-g')] && !e.getAttribute('stroke-dasharray') &&
      parseFloat(e.getAttribute('stroke-width')) >= 10 && !(e.getAttribute('fill') && e.getAttribute('fill') !== 'none'));
    const max = isSheet() ? 7 : 14;
    lines.map((e) => ({ e, L: e.getTotalLength() })).filter((o) => o.L > 380).sort((a, b) => b.L - a.L).slice(0, max).forEach((o, i) => {
      const g = o.e.getAttribute('data-g'), w = parseFloat(o.e.getAttribute('stroke-width'));
      const seg = Math.min(160, o.L * 0.2);
      [[w * 1.8, 0.3], [w * 0.5, 1]].forEach(([sw, op]) => {
        const p = el('path', { d: o.e.getAttribute('d'), stroke: TINT[g], 'stroke-width': sw.toFixed(1), opacity: op, 'data-comet': g }, comets);
        p.style.strokeDasharray = seg + ' ' + (o.L + seg);
        const dur = ((o.L + seg) / 170) * 1000;
        ambient.push(p.animate([{ strokeDashoffset: seg }, { strokeDashoffset: -o.L, offset: 0.72 }, { strokeDashoffset: -o.L }],
          { duration: dur / 0.72, delay: -(i * 1300) % 9000, iterations: Infinity, easing: 'linear' }));
      });
    });
    const flow = (sel, period, ms) => $$(sel).forEach((e) => ambient.push(e.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -period * 2 }], { duration: ms, iterations: Infinity })));
    flow('#art [data-g="metrolive"][data-k="line"]', 6, 1100);
    flow('#art [data-g="metrofut"][data-k="line"][stroke-dasharray]', 17, 3200);
    flow('#art [data-g="ringplan"][stroke-dasharray]', 16.73, 4200);
    $$('#art [id^="air-"]').forEach((g, i) => ambient.push(g.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }],
      { duration: 2600, delay: i * 700, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })));
    buildEffects();
    syncComets();
  }
  function stopAmbient() {
    ambient.forEach((a) => { try { a.cancel(); } catch (x) { /* bỏ qua */ } }); ambient = []; comets.replaceChildren();
    fx.forEach((e) => e.remove()); fx = [];
    const m1 = svg.querySelector('#m1path'); if (m1) m1.removeAttribute('id');
  }
  function syncComets() {
    $$('#comets path').forEach((p) => {
      const L = D.legend.find((l) => l.g.includes(p.getAttribute('data-comet')));
      p.style.display = L && state[L.id] === false ? 'none' : '';
    });
  }

  /* ============================================================
     HIỆU ỨNG LAN TOẢ: chữ "Vành đai…" và ghi chú sân bay lan rộng rồi tan; vòng sóng quanh máy bay; ga Metro 2 sáng
     lần lượt; tàu chạy trên Metro 1; mũi tên nhún; nút giao thở; vệt sáng lướt trên sông
     ============================================================ */
  let fx = [];
  const AMB = (e, kf, o) => { const a = e.animate(kf, o); ambient.push(a); return a; };
  function bb(els) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    els.forEach((e) => { try { const b = e.getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); } catch (x) { /* bỏ qua */ } });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function echo(els, color, delay, layer) {
    const first = els[0], b = bb(els), k = 1 + Math.min(0.55, 46 / Math.max(b.w, b.h, 1));
    for (let r = 0; r < 2; r++) {
      const g = el('g', { class: 'echo', 'data-g': layer, 'pointer-events': 'none' });
      els.forEach((x) => {
        const c = x.cloneNode(false);
        ['data-g', 'data-k', 'data-f', 'data-u', 'data-cat', 'class', 'id', 'mask', 'clip-path'].forEach((a) => c.removeAttribute(a));
        c.setAttribute('fill', color); c.setAttribute('stroke', color); c.setAttribute('stroke-width', '4.5'); c.setAttribute('stroke-linejoin', 'round');
        g.appendChild(c);
      });
      first.parentNode.insertBefore(g, first);
      fx.push(g);
      AMB(g, [{ transform: 'scale(1)', opacity: 0.5 }, { transform: 'scale(' + k.toFixed(3) + ')', opacity: 0, offset: 0.6 }, { transform: 'scale(' + k.toFixed(3) + ')', opacity: 0 }],
        { duration: 3600, delay: delay + r * 1200, iterations: Infinity, easing: 'cubic-bezier(.15,.6,.3,1)' });
    }
  }
  function ripple(x, y, r0, color, layer, n, period, delay, hostEl) {
    const g = el('g', { class: 'ripple', 'data-g': layer, 'pointer-events': 'none' }, hostEl || art);
    fx.push(g);
    for (let i = 0; i < n; i++) {
      const c = el('circle', { cx: x, cy: y, r: r0, fill: 'none', stroke: color, 'stroke-width': 2.2 }, g);
      AMB(c, [{ transform: 'scale(.6)', opacity: 0.9 }, { transform: 'scale(2.8)', opacity: 0 }],
        { duration: period, delay: delay + (i * period) / n, iterations: Infinity, easing: 'cubic-bezier(.2,.7,.3,1)' });
    }
    return g;
  }
  function buildEffects() {
    const units = {};
    $$('#art [data-u^="ring"]').forEach((e) => { (units[e.dataset.u] = units[e.dataset.u] || []).push(e); });
    Object.keys(units).sort().forEach((u, k) => {
      const els = units[u];
      echo(els, '#D29A6A', 300 + k * 520, els[0].getAttribute('data-g'));
    });
    $$('#art [id^="air-"]').forEach((grp, i) => {
      const f = F[grp.getAttribute('data-f')];
      const txt = $$('[data-k="label"]', grp);
      if (!f) return;
      ripple(f.x, f.y, 13, '#8C9178', 'airport', 3, 2700, i * 600, grp);
      if (txt.length) echo(txt, '#9AA08A', 900 + i * 700, 'airport');
    });
    $$('#art [data-u="arrow"]').forEach((e, i) => {
      const d = (e.getAttribute('data-dir') || '0,-1').split(',').map(Number);
      AMB(e, [{ transform: 'translate(0,0)', opacity: 0.75 }, { transform: 'translate(' + d[0] * 10 + 'px,' + d[1] * 10 + 'px)', opacity: 1, offset: 0.5 },
        { transform: 'translate(0,0)', opacity: 0.75 }], { duration: 1700, delay: i * 300, iterations: Infinity, easing: 'ease-in-out' });
    });
    const st = $$('#art [data-f="m2"][data-k="station"]').filter((e) => (e.getAttribute('stroke') || '').toUpperCase() === '#6699FF');
    st.map((e) => ({ e, y: bb([e]).y })).sort((a, b) => a.y - b.y).forEach((o, i) => {
      AMB(o.e, [{ transform: 'scale(1)' }, { transform: 'scale(1.9)', offset: 0.08 }, { transform: 'scale(1)', offset: 0.18 }, { transform: 'scale(1)' }],
        { duration: 4200, delay: 600 + i * 150, iterations: Infinity, easing: 'ease-out' });
    });
    $$('#art [data-u="bigst"]').forEach((e, i) => {
      const b = bb([e]);
      ripple(b.x + b.w / 2, b.y + b.h / 2, 7, '#6699FF', e.getAttribute('data-g'), 2, 2400, i * 500);
    });
    const m1 = svg.querySelector('[data-f="m1"][data-k="line"]');
    if (m1) {
      m1.id = 'm1path';
      [[0, '1;0'], [4.5, '0;1']].forEach(([begin, pts]) => {
        const t = el('g', { class: 'train', 'data-g': 'metrolive', 'pointer-events': 'none' }, art);
        el('rect', { x: -15, y: -7, width: 30, height: 14, rx: 7, fill: '#6699FF', opacity: 0.22 }, t);
        el('rect', { x: -10, y: -4, width: 20, height: 8, rx: 4, fill: '#4F86F7' }, t);
        el('rect', { x: -6, y: -1.6, width: 12, height: 3.2, rx: 1.6, fill: '#fff', opacity: 0.85 }, t);
        const am = el('animateMotion', { dur: '9s', begin: begin + 's', repeatCount: 'indefinite', rotate: 'auto', keyPoints: pts, keyTimes: '0;1', calcMode: 'linear' }, t);
        el('mpath', { href: '#m1path' }, am).setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#m1path');
        fx.push(t);
      });
    }
    $$('#art [data-g="junction"][data-k="node"]').filter((e) => (e.getAttribute('fill') || '').toUpperCase() === '#FCD48C').forEach((e, i) => {
      AMB(e, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.22)', opacity: 0.65 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 3000, delay: i * 430, iterations: Infinity, easing: 'ease-in-out' });
    });
    const river = svg.querySelector('[data-g="river"]');
    if (river) {
      const cp = el('clipPath', { id: 'riverClip' }, defs);
      el('path', { d: river.getAttribute('d'), 'clip-rule': river.getAttribute('fill-rule') || 'nonzero' }, cp);
      const sg = el('linearGradient', { id: 'sheenG', x1: '0', x2: '1', y1: '0', y2: '0' }, defs);
      [['0', 0], ['.5', 0.75], ['1', 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': '#FFFFFF', 'stop-opacity': a }, sg));
      const g = el('g', { 'clip-path': 'url(#riverClip)', 'data-g': 'river', 'pointer-events': 'none' });
      river.parentNode.insertBefore(g, river.nextSibling);
      const r = el('rect', { x: -260, y: MAP.y - 60, width: 240, height: MAP.h + 120, fill: 'url(#sheenG)' }, g);
      fx.push(g, cp, sg);
      AMB(r, [{ transform: 'translateX(0) skewX(-18deg)' }, { transform: 'translateX(2300px) skewX(-18deg)', offset: 0.65 }, { transform: 'translateX(2300px) skewX(-18deg)' }],
        { duration: 11000, delay: 800, iterations: Infinity, easing: 'ease-in-out' });
    }
  }

  /* ============================================================
     KHỞI ĐỘNG
     ============================================================ */
  buildBoard();
  wireBoard();
  wireNav();
  home(0);
  intro();
  later(() => gone(), 7000);

  return function destroy() {
    dead = true;
    if (tween) cancelAnimationFrame(tween);
    running.forEach((a) => { try { a.cancel(); } catch (x) { /* bỏ qua */ } });
    ambient.forEach((a) => { try { a.cancel(); } catch (x) { /* bỏ qua */ } });
    timers.forEach(clearTimeout);
    offs.forEach((off) => off());
    if (io) io.disconnect();
    injected.forEach((n) => n.remove());
    host.replaceChildren();
  };
}
