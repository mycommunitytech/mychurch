/* Все в одному місці — сітка всіх модулів каталогу (i18n.ts → modules.groups, без «soon»:
   37 штук; іконки — MODULE_ICONS, кольори — MODULE_ACCENTS; заголовок — capabilities.caption).
   Великі плитки заповнюють екран діагональною хвилею, група за групою, лічильник росте
   до 37; краї сітки згасають. Потім плитки злітаються у велике вікно «Моя Церква» —
   лаунчер з іконкою й назвою кожного модуля, який читається через усю залу. */
// icons: users, heart, rocket, flame, house, blocks, graduation-cap, tent, calendar-days, ticket, leaf, list-checks, kanban, clipboard-list, inbox, link-2, megaphone, bot, book-open, table-2, chart-column, target, sparkles, network, file-check, building-2, door-open, package, hammer, calculator, sliders-horizontal, layout-template, zap, send, message-circle, message-square-text, notebook-pen
(function () {
  // [назва, іконка lucide, колір] — у порядку каталогу, група за групою.
  const MODS = [
    ["Люди", "users", "#0ea5e9"], ["Сім'я", "heart", "#ec4899"], ["Онбординг", "rocket", "#7c5cf0"],
    ["Служіння", "flame", "#f97316"], ["Малі групи", "house", "#0d9488"], ["Дитяча реєстрація", "blocks", "#e11d48"], ["Навчання", "graduation-cap", "#4f46e5"], ["Табори", "tent", "#15803d"],
    ["Календар", "calendar-days", "#3b82f6"], ["Організатор подій", "ticket", "#f59e0b"], ["Сезони", "leaf", "#65a30d"], ["Планування служіння", "list-checks", "#ea580c"], ["Проєкти", "kanban", "#2563eb"],
    ["Форми", "clipboard-list", "#7c3aed"], ["Заявки", "inbox", "#6366f1"], ["Посилання", "link-2", "#10b981"], ["Розсилки", "megaphone", "#d946ef"], ["Telegram-бот", "bot", "#229ed9"], ["База знань", "book-open", "#b45309"], ["Таблиці", "table-2", "#64748b"],
    ["Аналітика та звіти", "chart-column", "#0891b2"], ["Цілі та метрики", "target", "#dc2626"], ["ШІ-асистенти", "sparkles", "#a855f7"],
    ["Оргструктура", "network", "#7c5cf0"], ["Запити", "file-check", "#0891b2"], ["Кемпуси", "building-2", "#0f766e"],
    ["Кімнати", "door-open", "#8b5e3c"], ["Інвентаризація", "package", "#b07d4f"], ["Інфраструктура", "hammer", "#6b7280"],
    ["Бухгалтерія", "calculator", "#059669"],
    ["Кастомізація", "sliders-horizontal", "#64748b"], ["Шаблони", "layout-template", "#0d9488"], ["Автоматизації", "zap", "#ca8a04"],
    ["Telegram", "send", "#229ed9"], ["Viber", "message-circle", "#7360f2"], ["TurboSMS", "message-square-text", "#f59e0b"], ["Notion", "notebook-pen", "#52525b"],
  ];
  const N = MODS.length; // 37
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const plural = (n) => {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return "модуль";
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return "модулі";
    return "модулів";
  };

  // ── хронометраж
  const D0 = 450, WAVE = 3800;           // хвиля плиток
  const PLATE_OUT = 5900, WIN0 = 6250;   // лічильник гасне, з'являється вікно
  const FLY0 = 6250, FLY = 1150, SPREAD = 700;
  const TITLE = 7500;

  // ── плитки сітки: іконка 80 (гліф 44), назва 22 px
  const TH = 196, PY = 212, IC = 80, IY = 22, SI = 60 / IC; // у вікні іконка 60 px
  const geo = (o) => {
    const port = o === "port";
    const CW = port ? 1080 : 1920, CH = port ? 1920 : 1080;
    const TW = port ? 196 : 220, PX = port ? 212 : 236;
    const cols = port ? 5 : 8, rows = port ? 9 : 5;
    const x0 = (CW - (cols * PX - (PX - TW))) / 2, y0 = (CH - (rows * PY - (PY - TH))) / 2;
    const plate = port ? { c0: 1, c1: 3, r0: 4, r1: 4 } : { c0: 3, c1: 4, r0: 2, r1: 2 };
    const IX = (TW - IC) / 2;
    const slots = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (c >= plate.c0 && c <= plate.c1 && r >= plate.r0 && r <= plate.r1) continue;
      const x = x0 + c * PX, y = y0 + r * PY;
      const dx = (x + TW / 2 - CW / 2) / (CW / 2), dy = (y + TH / 2 - CH / 2) / (CH / 2);
      const rr = Math.hypot(dx, dy);
      // Краї згасають: центр — повністю, кути — наполовину.
      slots.push({ c, r, x, y, dist: rr, op: TV.clamp(1 - Math.max(0, rr - 0.7) * 1.1, 0.3, 1) });
    }
    const near = [...slots].sort((a, b) => a.dist - b.dist);
    const mods = near.slice(0, N).sort((a, b) => (a.c + a.r) - (b.c + b.r) || a.r - b.r);
    const empties = near.slice(N);
    const maxDiag = cols + rows - 2;
    const delay = (s, k) => D0 + ((s.c + s.r) / maxDiag) * (WAVE - D0) + (k || 0);
    const plateBox = { x: x0 + plate.c0 * PX, y: y0 + plate.r0 * PY, w: (plate.c1 - plate.c0 + 1) * PX - (PX - TW), h: TH };

    // ── вікно-лаунчер: іконка 60 + назва 18 px під нею
    const ROWS = port ? [6, 5, 6, 5, 6, 5, 4] : [8, 8, 7, 7, 7];
    const CELL = port ? 152 : 164, RP = 124, BAR = 76, PT = 38, PB = 30;
    const W = port ? 960 : 1400;
    const H = BAR + PT + ROWS.length * RP - 10 + PB;
    const titleH = port ? 124 : 132, gap = port ? 48 : 40;
    const top = (CH - (titleH + gap + H)) / 2;
    const win = { x: (CW - W) / 2, y: top + titleH + gap, w: W, h: H };
    const cells = [];
    ROWS.forEach((n, ri) => {
      const sx = CW / 2 - (n * CELL) / 2;
      for (let k = 0; k < n; k++) {
        const cx = sx + k * CELL;
        cells.push({ x: cx + (CELL - 60) / 2, y: win.y + BAR + PT + ri * RP, cx });
      }
    });
    return { port, CW, CH, TW, IX, mods, empties, delay, plateBox, win, cells, CELL, BAR, title: { y: top } };
  };

  TV.scene({
    id: "all-in-one",
    dur: 12800,
    bg: "light",
    css: `
[data-scene="all-in-one"] .tl { position: absolute; height: ${TH}px; transform-origin: var(--ox) ${IY}px; opacity: var(--o);
  animation: ai-fly ${FLY}ms var(--e-emph) var(--f) both; }
@keyframes ai-fly { to { opacity: 1; transform: translate3d(var(--tx), var(--ty), 0) scale(${SI}); } }
[data-scene="all-in-one"] .tl > .in { position: absolute; inset: 0; }
[data-scene="all-in-one"] .bgc { position: absolute; inset: 0; border-radius: 32px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), 0 14px 34px -18px rgba(10, 30, 70, 0.28); }
[data-scene="all-in-one"] .ico { position: absolute; top: ${IY}px; width: ${IC}px; height: ${IC}px; border-radius: 24px; display: flex; align-items: center; justify-content: center; }
[data-scene="all-in-one"] .nm { position: absolute; left: 4px; right: 4px; top: ${IY + IC + 12}px; text-align: center; font-size: 22px; line-height: 26px; font-weight: 650; letter-spacing: -0.02em; color: var(--ink); }
[data-scene="all-in-one"] .em { position: absolute; height: ${TH}px; border-radius: 32px; box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.06); background: rgba(255, 255, 255, 0.5); }
[data-scene="all-in-one"] .plate { position: absolute; border-radius: 40px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), var(--shadow-card);
  display: flex; align-items: baseline; justify-content: center; gap: 18px; padding-top: 16px; }
[data-scene="all-in-one"] .plate b { font-size: 150px; line-height: 150px; font-weight: 800; letter-spacing: -0.06em; color: var(--brand); font-variant-numeric: tabular-nums; }
[data-scene="all-in-one"] .plate span { font-size: 48px; font-weight: 650; letter-spacing: -0.02em; color: var(--ink-2); }
[data-scene="all-in-one"] .win { position: absolute; border-radius: 40px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), var(--shadow-card); overflow: hidden; }
[data-scene="all-in-one"] .bar { position: absolute; left: 0; right: 0; top: 0; display: flex; align-items: center; gap: 24px; padding: 0 30px; border-bottom: 1px solid var(--hairline); background: var(--surface-2); }
[data-scene="all-in-one"] .dots { display: flex; gap: 10px; }
[data-scene="all-in-one"] .dots i { width: 15px; height: 15px; border-radius: 50%; background: rgba(0, 0, 0, 0.12); }
[data-scene="all-in-one"] .cnt { margin-left: auto; height: 48px; padding: 0 22px; border-radius: 999px; background: var(--brand-soft); color: var(--brand-deep);
  display: flex; align-items: center; font-size: 25px; font-weight: 700; font-variant-numeric: tabular-nums; }
[data-scene="all-in-one"] .wn { position: absolute; text-align: center; font-size: 18px; line-height: 22px; font-weight: 650; letter-spacing: -0.025em; color: var(--ink); }
[data-scene="all-in-one"] .ttl { position: absolute; left: 0; right: 0; text-align: center; }
[data-scene="all-in-one"] .ttl .t { font-size: 118px; }
[data-o="port"] [data-scene="all-in-one"] .ttl .t { font-size: 104px; }
`,
    html: (o) => {
      const G = geo(o);
      const cx = G.CW / 2, cy = G.CH / 2;
      const lands = [];
      const tiles = G.mods.map((s, i) => {
        const [name, icon, c] = MODS[i];
        const tg = G.cells[i];
        const far = Math.hypot(s.x + G.TW / 2 - cx, s.y + TH / 2 - cy) / Math.hypot(cx, cy);
        const f = Math.round(FLY0 + far * SPREAD);
        lands.push(f + FLY - 200);
        return `<div class="tl" style="left:${s.x}px;top:${s.y}px;width:${G.TW}px;--ox:${G.IX}px;--o:${s.op.toFixed(2)};--tx:${tg.x - (s.x + G.IX)}px;--ty:${tg.y - (s.y + IY)}px;--f:${f}ms">
          <div class="in a-pop" style="--d:${Math.round(G.delay(s))}ms">
            <div class="bgc a-outf" style="--d:${f}ms"></div>
            <span class="ico" style="left:${G.IX}px;background:${tint(c, 15)}">${TV.icon(icon, 44, c, 2.1)}</span>
            <div class="nm a-outf" style="--d:${f - 80}ms">${TV.esc(name)}</div>
          </div></div>`;
      }).join("");
      const empties = G.empties.map((s) => `<div class="a-outf" style="--d:${PLATE_OUT}ms"><div class="em a-pop" style="left:${s.x}px;top:${s.y}px;width:${G.TW}px;opacity:${s.op.toFixed(2)};--d:${Math.round(G.delay(s, 60))}ms"></div></div>`).join("");
      const pb = G.plateBox, w = G.win;
      const names = G.cells.map((cl, i) => `<div class="wn a-fade" style="left:${cl.cx - w.x + 4}px;top:${cl.y - w.y + 60 + 10}px;width:${G.CELL - 8}px;--d:${lands[i]}ms">${TV.esc(MODS[i][0])}</div>`).join("");
      return `
${empties}
<div class="a-out" style="--d:${PLATE_OUT}ms"><div class="plate a-scale" style="left:${pb.x}px;top:${pb.y}px;width:${pb.w}px;height:${pb.h}px;--d:250ms"><b class="n">0</b><span class="u">модулів</span></div></div>
<div class="win a-scale" style="left:${w.x}px;top:${w.y}px;width:${w.w}px;height:${w.h}px;--d:${WIN0}ms">
  <div class="bar" style="height:${G.BAR}px"><span class="dots"><i></i><i></i><i></i></span>${TV.wordmark(40)}<span class="cnt a-pop" style="--d:${WIN0 + 600}ms">${N} ${plural(N)}</span></div>
  ${names}
</div>
${tiles}
<div class="ttl" style="top:${G.title.y}px"><h1 class="t">${TV.words("Все в одному місці", TITLE, 80)}</h1></div>`;
    },
    tick(t, el, o) {
      const G = geo(o);
      const n = G.mods.filter((s) => t >= G.delay(s) + 120).length;
      const b = el.querySelector(".plate .n"), u = el.querySelector(".plate .u");
      if (b && b.textContent !== String(n)) { b.textContent = n; u.textContent = plural(n); }
    },
  });
})();
