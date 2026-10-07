/* Допоможемо організувати — безлад, що складається в систему.
   Джерело — блок сайту «Допоможемо організувати»: church-brief-scene.tsx (+ .module.css)
   і i18n.ts → brief.scene (клаптики, `tiles`, `notes`). Рядок — cta.text, він же перше
   речення brief.note. Строків («за 7 днів») немає — власник їх прибрав.
   1) Безлад: таблиця «ФІНАЛ(2)», чат без відповіді, стікер, зошит групи, фото нової
      сім'ї (мальовані обличчя), календар, підрахунок, голосове, анкета — навскоси, ворушаться.
   2) Збирання: кожен клаптик летить у свою клітинку одного вікна й стає плиткою модуля
      (порядок — як `tiles`); вікно світлішає, у шапці з'являється команда.
   3) Обіцянка: вікно відсувається, з'являється «Допоможемо організувати». */
// icons: users, flame, house, ticket, heart, inbox, clipboard-list, megaphone, chart-column, check, clock, check-check, file-spreadsheet, play
(function () {
  const ID = "organize";
  const FW = 1000, FH = 760, TW = 300, TH = 190;
  const COLX = [30, 350, 670], ROWY = [120, 330, 540];
  const T = { asm: 3100, step: 130, fly: 1000, promise: 6100 };
  const GLOW = 5250, TEAM_AT = 5450;

  // Плитки — у порядку brief.scene.tiles; кольори й значки — модулів (module-icons.ts).
  const TILES = [
    { id: "people", label: "Люди", value: "248", icon: "users", c: "#0ea5e9" },
    { id: "ministries", label: "Служіння", icon: "flame", c: "#f97316" },
    { id: "groups", label: "Малі групи", icon: "house", c: "#0d9488" },
    { id: "events", label: "Події", icon: "ticket", c: "#f59e0b" },
    { id: "family", label: "Сім'ї", icon: "heart", c: "#ec4899" },
    { id: "applications", label: "Заявки", value: "5", icon: "inbox", c: "#6366f1" },
    { id: "forms", label: "Форми", icon: "clipboard-list", c: "#7c3aed" },
    { id: "campaigns", label: "Розсилки", icon: "megaphone", c: "#d946ef" },
    { id: "analytics", label: "Аналітика", icon: "chart-column", c: "#0891b2" },
  ];
  // Клаптик → клітинка. Центри безладу — у пікселях полотна для кожної орієнтації;
  // d — черга вильоту (як на сайті: навхрест, а не до найближчої клітинки).
  const PIECES = [
    { kind: "xlsx", slot: 0, w: 400, h: 250, r: 7, z: 3, d: 0, toss: 0, land: [360, 250], port: [330, 470] },
    { kind: "chat", slot: 1, w: 540, h: 130, r: -5, z: 6, d: 2, toss: 3, land: [1000, 140], port: [560, 200] },
    { kind: "notebook", slot: 2, w: 280, h: 290, r: -9, z: 2, d: 4, toss: 5, land: [1660, 320], port: [830, 560] },
    { kind: "calendar", slot: 3, w: 270, h: 290, r: 10, z: 4, d: 7, toss: 7, land: [1650, 820], port: [820, 1480] },
    { kind: "photo", slot: 4, w: 280, h: 340, r: -6, z: 5, d: 3, toss: 1, land: [740, 560], port: [260, 930] },
    { kind: "sticky", slot: 5, w: 270, h: 240, r: 6, z: 7, d: 1, toss: 2, land: [1170, 470], port: [640, 850] },
    { kind: "form", slot: 6, w: 320, h: 260, r: -9, z: 3, d: 5, toss: 6, land: [330, 790], port: [300, 1400] },
    { kind: "voice", slot: 7, w: 390, h: 104, r: 4, z: 8, d: 6, toss: 4, land: [1120, 950], port: [540, 1740] },
    { kind: "tally", slot: 8, w: 300, h: 200, r: -12, z: 3, d: 8, toss: 8, land: [1290, 760], port: [720, 1180] },
  ];
  // Вікно: у безладі й збиранні — по центру великим (0), в обіцянці — збоку чи внизу (1).
  const LAYOUT = {
    land: { s0: 1.15, x0: 960 - FW * 0.575, y0: 540 - FH * 0.575, s1: 0.95, x1: 1920 - 110 - FW * 0.95, y1: 540 - FH * 0.475, big: 1.22 },
    port: { s0: 0.98, x0: 540 - FW * 0.49, y0: 960 - FH * 0.49, s1: 0.9, x1: 90, y1: 1185 - FH * 0.45, big: 1.25 },
  };
  const FAMILY = [TV.LOOKS[3], TV.LOOKS[7], TV.LOOKS[2]];
  const TEAMF = [TV.LOOKS[0], TV.LOOKS[1], TV.LOOKS[4], TV.LOOKS[5]];
  const BARS = [10, 15, 13, 19, 18, 26];
  const WAVE = [5, 9, 14, 8, 12, 18, 11, 6, 15, 20, 13, 7, 10, 16, 9, 5, 12, 8, 14, 6];
  const CELLS = [[70, 55, 80, 40], [60, 75, 0, 55], [85, 45, 60, 70], [50, 0, 75, 45], [75, 60, 50, 0]];
  const QR = [[0, 0, 7, 1], [0, 6, 7, 1], [0, 0, 1, 7], [6, 0, 1, 7], [2, 2, 3, 3], [14, 0, 7, 1], [14, 6, 7, 1], [14, 0, 1, 7], [20, 0, 1, 7], [16, 2, 3, 3],
    [0, 14, 7, 1], [0, 20, 7, 1], [0, 14, 1, 7], [6, 14, 1, 7], [2, 16, 3, 3], [8, 0, 2, 2], [11, 1, 2, 3], [8, 4, 1, 3], [10, 6, 2, 2], [9, 9, 3, 2],
    [0, 8, 2, 2], [3, 9, 3, 1], [4, 11, 2, 2], [13, 8, 2, 3], [16, 9, 3, 2], [19, 8, 2, 4], [8, 12, 2, 3], [11, 13, 3, 2], [15, 14, 2, 2], [18, 13, 2, 3],
    [8, 17, 3, 2], [12, 16, 2, 4], [15, 18, 3, 2], [19, 17, 2, 2], [9, 20, 2, 1]];
  const SCRIB = `<path d="M1 5 C6 1 9 7 14 4 S22 1 27 5 S36 7 41 3 S52 2 59 5"/>`;

  // ── клаптики безладу (brief.scene — дослівно)
  const MESS = {
    xlsx: () => `<div class="paper xlsx"><div class="xbar">${TV.icon("file-spreadsheet", 24, "#fff", 2.2)}<span>члени_ФІНАЛ(2).xlsx</span></div>
      <div class="xgrid">${CELLS.flatMap((row, ri) => row.map((w, ci) => ri === 1 && ci === 2 ? `<span class="odd">???</span>`
        : ri === 3 && ci === 1 ? `<span class="mark"></span>` : `<span>${w ? `<i style="width:${w}%"></i>` : ""}</span>`)).join("")}</div></div>`,
    chat: () => `<div class="chat">${TV.avatar(TV.LOOKS[3], 66)}<div class="cb"><span class="cf">Чат служителів</span><span class="ct">Хто в неділю на дитячому??</span></div><span class="badge">47</span></div>`,
    notebook: () => `<div class="paper note"><span class="pen">Група, вівторок</span>${["✓", "✓", "✗", "?", "✓"].map((m, i) =>
      `<span class="nrow"><svg class="scrib" viewBox="0 0 60 8" style="width:${96 + ((i * 29) % 56)}px">${SCRIB}</svg><b class="${m === "✗" ? "bad" : m === "?" ? "uns" : ""}">${m}</b></span>`).join("")}</div>`,
    calendar: () => `<div class="paper cal"><div class="ctop">Жовтень</div><div class="cgrid">${Array.from({ length: 21 }, (_, i) =>
      `<span class="${i === 11 ? "circ" : i === 5 ? "cross" : ""}">${i + 6}</span>`).join("")}</div><span class="cnote">Табір??</span></div>`,
    photo: () => `<div class="photo"><div class="pic">${FAMILY.map((l, i) => `<span>${TV.avatar(l, i === 2 ? 66 : 86)}</span>`).join("")}</div><span class="cap">Нова сім'я — як звати??</span></div>`,
    sticky: () => `<div class="sticky"><span class="tape"></span>Олена просила молитву!!</div>`,
    form: () => `<div class="paper form"><span class="ftl">Анкета гостя (копія 3)</span>${["Ім'я", "Телефон"].map((f, i) =>
      `<span class="ff"><span>${f}</span><span class="fl">${i === 0 ? `<svg class="scrib" viewBox="0 0 60 8" style="width:110px">${SCRIB}</svg>` : ""}</span></span>`).join("")}</div>`,
    voice: () => `<div class="voice"><span class="vp">${TV.icon("play", 26, "#fff", 0)}</span><span class="wave">${WAVE.map((h, i) =>
      `<i style="height:${h * 2.2}px;animation-delay:${-i * 90}ms"></i>`).join("")}</span><span class="vt">0:47</span></div>`,
    tally: () => `<div class="paper tally"><span class="pen">Неділя</span><svg class="marks" viewBox="0 0 120 26">${[0, 38, 76].map((ox, g) =>
      `<g transform="translate(${ox} 0)">${[4, 10, 16, 22].map((x) => `<line x1="${x}" y1="3" x2="${x + 1}" y2="23"/>`).join("")}${g < 2 ? `<line x1="0" y1="19" x2="27" y2="6"/>` : ""}</g>`).join("")}</svg><span class="tn">~140?</span></div>`,
  };

  // ── плитки системи: число — лише «Люди» і «Заявки», решта — шматочок інтерфейсу (brief.scene.notes)
  const VIS = {
    ministries: (d) => `<span class="pill ok a-pop" style="--d:${d}ms">${TV.icon("check", 24, "currentColor", 3)}Усі на місці</span>`,
    groups: (d, c) => `<span class="pill a-pop" style="--d:${d}ms;color:${c};background:color-mix(in oklab, ${c} 12%, #fff)">${TV.icon("clock", 24, "currentColor", 2.6)}Вт, 19:00</span>`,
    events: (d, c) => `<span class="ev a-pop" style="--d:${d}ms"><span class="leaf"><b style="background:${c}">жов</b><span>17</span></span>Табір</span>`,
    family: (d) => `<span class="fam">${FAMILY.map((l, j) => `<span class="a-pop" style="--d:${d + j * 70}ms">${TV.avatar(l, 64)}</span>`).join("")}</span>`,
    forms: (d) => `<span class="qrw a-pop" style="--d:${d}ms"><svg class="qr" viewBox="0 0 21 21">${QR.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join("")}</svg>Анкета гостя</span>`,
    campaigns: (d, c) => `<span class="bub a-pop" style="--d:${d}ms;background:color-mix(in oklab, ${c} 12%, #fff)">Надіслано${TV.icon("check-check", 26, "#3b82f6", 2.6)}</span>`,
    analytics: (d, c) => `<span class="bars">${BARS.map((h, j) => `<i style="height:${h * 2.6}px;background:${j === 5 ? c : `color-mix(in oklab, ${c} 70%, #fff)`};--d:${d + j * 60}ms"></i>`).join("")}</span>`,
  };

  function item(p, L) {
    const tile = TILES[p.slot];
    const ox = COLX[p.slot % 3], oy = ROWY[Math.floor(p.slot / 3)];
    const [cx, cy] = p[L.key];
    const mx = (cx - L.x0) / L.s0 - TW / 2, my = (cy - L.y0) / L.s0 - TH / 2;
    const d = T.asm + p.d * T.step;           // виліт
    const vis = d + 640;                       // плитка лягла — її вміст проступає
    return `
    <div class="item" style="--ox:${ox}px;--oy:${oy}px;--mx:${mx.toFixed(1)}px;--my:${my.toFixed(1)}px;--mr:${p.r}deg;--d:${d}ms;z-index:${p.z}">
      <div class="mess" style="--d:${d}ms;width:${p.w}px;height:${p.h}px;margin:${-p.h / 2}px 0 0 ${-p.w / 2}px">
        <div class="toss" style="--d:${250 + p.toss * 110}ms"><div class="big"><div class="jit" style="--j:${p.d}">${MESS[p.kind]()}</div></div></div>
      </div>
      <div class="tile" style="--d:${d + 560}ms">
        <span class="th"><span class="ti" style="color:${tile.c};background:color-mix(in oklab, ${tile.c} 13%, #fff)">${TV.icon(tile.icon, 28, "currentColor", 2.2)}</span>${tile.label}</span>
        ${tile.value ? `<b class="tv a-fade" style="--d:${vis}ms">${tile.value}</b>` : VIS[tile.id](vis, tile.c)}
      </div>
    </div>`;
  }

  const S = `[data-scene="${ID}"]`;
  TV.scene({
    id: ID,
    dur: 11800,
    bg: "light",
    css: `
${S} .win { position: absolute; left: 0; top: 0; width: ${FW}px; height: ${FH}px; transform-origin: 0 0;
  animation: org-move 950ms var(--e-emph) ${T.promise}ms both; }
@keyframes org-move {
  from { transform: translate(var(--x0), var(--y0)) scale(var(--s0)); }
  to { transform: translate(var(--x1), var(--y1)) scale(var(--s1)); }
}
${S} .halo { position: absolute; inset: -160px; border-radius: 50%; background: radial-gradient(closest-side, rgba(0, 105, 224, 0.2), transparent);
  animation: a-fade 1200ms var(--e-std) ${GLOW}ms both; }
${S} .fbg { position: absolute; inset: 0; border-radius: 40px; background: #fff;
  box-shadow: 0 0 0 1.5px var(--hairline), 0 40px 90px -40px rgba(0, 45, 110, 0.45), 0 2px 4px rgba(0,0,0,0.04);
  animation: org-frame 700ms var(--e-emph) ${T.asm}ms both; }
@keyframes org-frame { from { opacity: 0; transform: scale(0.94); } }
${S} .fhd { position: absolute; left: 0; right: 0; top: 0; height: 90px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px 0 34px;
  border-bottom: 1.5px solid var(--hairline); }
${S} .team { display: flex; align-items: center; gap: 14px; font-size: 24px; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
${S} .team .fs { display: flex; }
${S} .team .fs span { margin-left: -12px; border-radius: 50%; box-shadow: 0 0 0 3px #fff; }
${S} .team .fs span:first-child { margin-left: 0; }
${S} .team .live { width: 12px; height: 12px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 5px rgba(34,197,94,0.18); }
${S} .team .lbl { display: flex; align-items: center; gap: 10px; }
${S} .slot { position: absolute; width: ${TW}px; height: ${TH}px; border-radius: 26px; border: 2.5px dashed color-mix(in oklab, var(--brand) 30%, transparent);
  background: color-mix(in oklab, var(--brand) 4%, transparent); animation: a-fade 400ms var(--e-std) ${T.asm + 200}ms both; }
/* клаптик, що стає плиткою */
${S} .item { position: absolute; left: 0; top: 0; width: ${TW}px; height: ${TH}px;
  animation: org-fly ${T.fly}ms cubic-bezier(0.62, 0, 0.18, 1.06) var(--d) both; }
@keyframes org-fly {
  from { transform: translate(var(--mx), var(--my)) rotate(var(--mr)); }
  to { transform: translate(var(--ox), var(--oy)) rotate(0deg); }
}
${S} .mess { position: absolute; left: 50%; top: 50%; animation: org-mess 900ms cubic-bezier(0.62, 0, 0.18, 1.06) var(--d) both; }
@keyframes org-mess { 0%, 46% { opacity: 1; transform: none; } 84% { opacity: 0; } 100% { opacity: 0; transform: scale(0.7); } }
${S} .toss { width: 100%; height: 100%; animation: org-toss 620ms var(--e-decel) var(--d) both; }
@keyframes org-toss { from { opacity: 0; transform: scale(1.22) rotate(-7deg); } }
${S} .big { width: 100%; height: 100%; transform: scale(var(--big)); }
${S} .jit { width: 100%; height: 100%; filter: drop-shadow(0 18px 22px rgba(15, 23, 42, 0.16)) drop-shadow(0 2px 2px rgba(15, 23, 42, 0.1));
  animation: org-jit calc(2300ms + var(--j) * 190ms) ease-in-out calc(var(--j) * -370ms) infinite; }
@keyframes org-jit {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  22% { transform: translate(4px, -6px) rotate(1.6deg); }
  47% { transform: translate(-6px, 2px) rotate(-1.4deg); }
  71% { transform: translate(4px, 6px) rotate(0.9deg); }
}
${S} .tile { position: absolute; inset: 0; border-radius: 26px; background: #fff; padding: 22px 24px; display: flex; flex-direction: column; justify-content: space-between;
  box-shadow: 0 0 0 1.5px var(--hairline-strong), 0 14px 30px -22px rgba(0, 45, 110, 0.35); animation: a-fade 420ms var(--e-std) var(--d) both; }
${S} .th { display: flex; align-items: center; gap: 14px; font-size: 31px; font-weight: 700; letter-spacing: -0.02em; white-space: nowrap; }
${S} .ti { flex: none; width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
${S} .tv { font-size: 70px; font-weight: 800; letter-spacing: -0.04em; line-height: 0.9; font-variant-numeric: tabular-nums; }
${S} .pill { align-self: flex-start; height: 54px; display: inline-flex; align-items: center; gap: 10px; padding: 0 22px 0 16px; border-radius: 999px; font-size: 26px; font-weight: 650; white-space: nowrap; }
${S} .pill.ok { background: rgba(22,163,74,0.12); color: #15803d; }
${S} .ev { display: flex; align-items: center; gap: 16px; font-size: 30px; font-weight: 700; }
${S} .leaf { width: 60px; height: 66px; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: inset 0 0 0 1.5px var(--hairline-strong); }
${S} .leaf b { height: 24px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; font-weight: 750; letter-spacing: 0.06em; text-transform: uppercase; }
${S} .leaf span { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; }
${S} .fam { display: flex; }
${S} .fam span { margin-left: -14px; border-radius: 50%; box-shadow: 0 0 0 4px #fff; }
${S} .fam span:first-child { margin-left: 0; }
${S} .qrw { display: flex; align-items: center; gap: 16px; font-size: 25px; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
${S} .qr { width: 62px; height: 62px; fill: var(--ink); shape-rendering: crispEdges; flex: none; }
${S} .bub { align-self: flex-start; height: 54px; display: inline-flex; align-items: center; gap: 10px; padding: 0 18px 0 22px; border-radius: 26px 26px 26px 8px; font-size: 26px; font-weight: 550; }
${S} .bars { height: 70px; display: flex; align-items: flex-end; gap: 10px; }
${S} .bars i { display: block; width: 24px; border-radius: 6px 6px 2px 2px; transform-origin: 50% 100%; animation: org-bar 600ms var(--e-emph) var(--d) both; }
@keyframes org-bar { from { transform: scaleY(0); } }
/* ── безлад: папір лишається папером */
${S} .paper { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 10px; background: #fffdf8; color: #1f2937; }
${S} .pen { display: block; font-style: italic; font-weight: 650; font-size: 27px; line-height: 1.3; color: #1e40af; }
${S} .scrib { height: 16px; fill: none; stroke: #1e40af; stroke-width: 1.8; stroke-linecap: round; }
${S} .xlsx { display: flex; flex-direction: column; background: #fff; }
${S} .xbar { height: 50px; flex: none; display: flex; align-items: center; gap: 10px; padding: 0 16px; background: #1d6f42; color: #fff; font-size: 22px; font-weight: 650; white-space: nowrap; }
${S} .xgrid { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 1fr; }
${S} .xgrid span { display: flex; align-items: center; padding: 0 10px; border-right: 1.5px solid rgba(15,23,42,0.08); border-bottom: 1.5px solid rgba(15,23,42,0.08); }
${S} .xgrid i { display: block; height: 8px; border-radius: 4px; background: rgba(15,23,42,0.2); }
${S} .xgrid .odd { justify-content: center; background: #fee2e2; color: #dc2626; font-size: 22px; font-weight: 800; }
${S} .xgrid .mark { background: #fef08a; }
${S} .chat { position: relative; width: 100%; height: 100%; display: flex; align-items: flex-end; gap: 12px; }
${S} .cb { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; padding: 14px 22px 16px; border-radius: 28px 28px 28px 8px; background: #fff; box-shadow: inset 0 0 0 1.5px var(--hairline-strong); }
${S} .cf { font-size: 21px; font-weight: 650; color: #7c3aed; }
${S} .ct { font-size: 28px; line-height: 1.2; font-weight: 500; white-space: nowrap; }
${S} .badge { position: absolute; top: -16px; right: -14px; min-width: 50px; height: 50px; padding: 0 12px; border-radius: 999px; background: #ef4444; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 25px; font-weight: 800; box-shadow: 0 0 0 4px #fff; animation: org-beat 1300ms ease-in-out infinite; }
@keyframes org-beat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.18); } 30% { transform: scale(1); } }
${S} .note { padding: 14px 22px 0 54px; background-color: #fffdf8;
  background-image: linear-gradient(to right, transparent 40px, rgba(239,68,68,0.45) 40px, rgba(239,68,68,0.45) 42px, transparent 42px),
    repeating-linear-gradient(to bottom, transparent 0, transparent 38px, rgba(59,130,246,0.22) 38px, rgba(59,130,246,0.22) 40px);
  background-position: 0 0, 0 12px; }
${S} .nrow { display: flex; align-items: center; justify-content: space-between; height: 40px; }
${S} .nrow b { font-size: 28px; font-weight: 800; color: #16a34a; }
${S} .nrow b.bad { color: #dc2626; } ${S} .nrow b.uns { color: #d97706; }
${S} .cal { background: #fff; }
${S} .ctop { height: 50px; display: flex; align-items: center; justify-content: center; background: #ef4444; color: #fff; font-size: 22px; font-weight: 750; letter-spacing: 0.08em; text-transform: uppercase; }
${S} .cgrid { display: grid; grid-template-columns: repeat(7, 1fr); padding: 14px 10px; row-gap: 10px; }
${S} .cgrid span { position: relative; text-align: center; font-size: 20px; line-height: 30px; color: rgba(15,23,42,0.55); }
${S} .cgrid .circ { color: #dc2626; font-weight: 800; }
${S} .cgrid .circ::after { content: ""; position: absolute; inset: -3px -1px; border: 2.5px solid #dc2626; border-radius: 50%; transform: rotate(-10deg); }
${S} .cgrid .cross { text-decoration: line-through 2.5px #dc2626; }
${S} .cnote { position: absolute; right: 16px; bottom: 14px; font-style: italic; font-weight: 800; font-size: 32px; color: #dc2626; transform: rotate(-7deg); }
${S} .photo { width: 100%; height: 100%; display: flex; flex-direction: column; padding: 14px 14px 0; border-radius: 6px; background: #fff; }
${S} .pic { flex: 1; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 12px; border-radius: 4px;
  background: linear-gradient(to bottom, #bfdbfe 0%, #dbeafe 58%, #bbf7d0 58%, #86efac 100%); }
${S} .pic span { margin-left: -16px; border-radius: 50%; box-shadow: 0 0 0 3px #fff; }
${S} .pic span:first-child { margin-left: 0; }
${S} .cap { height: 80px; display: flex; align-items: center; font-style: italic; font-weight: 650; font-size: 23px; line-height: 1.2; color: #1e40af; }
${S} .sticky { position: relative; width: 100%; height: 100%; padding: 40px 26px 20px; border-radius: 4px 4px 34px 4px;
  background: linear-gradient(172deg, #fef3a0 0%, #fde68a 62%, #fcd34d 100%); color: #422006; font-style: italic; font-weight: 650; font-size: 31px; line-height: 1.25; }
${S} .tape { position: absolute; top: -14px; left: 50%; width: 100px; height: 30px; margin-left: -50px; background: rgba(255,255,255,0.62); box-shadow: 0 0 0 1.5px rgba(0,0,0,0.04); transform: rotate(-4deg); }
${S} .form { padding: 20px 24px; background: #fff; }
${S} .ftl { display: block; margin-bottom: 20px; font-size: 24px; font-weight: 650; color: #111827; }
${S} .ff { display: block; margin-bottom: 16px; font-size: 20px; color: rgba(15,23,42,0.5); }
${S} .fl { display: flex; align-items: flex-end; height: 30px; border-bottom: 2px solid rgba(15,23,42,0.25); }
${S} .voice { width: 100%; height: 100%; display: flex; align-items: center; gap: 16px; padding: 0 26px 0 18px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 1.5px var(--hairline-strong); }
${S} .vp { flex: none; width: 66px; height: 66px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; padding-left: 4px; }
${S} .vp svg * { fill: #fff; }
${S} .wave { flex: 1; height: 50px; display: flex; align-items: center; gap: 4px; }
${S} .wave i { display: block; width: 6px; border-radius: 3px; background: rgba(59,130,246,0.55); animation: org-wave 900ms ease-in-out infinite alternate; }
@keyframes org-wave { from { transform: scaleY(0.45); } to { transform: scaleY(1); } }
${S} .vt { font-size: 22px; color: var(--ink-3); font-variant-numeric: tabular-nums; }
${S} .tally { padding: 20px 22px; border-radius: 0 0 12px 12px;
  clip-path: polygon(0 8px, 9% 0, 18% 6px, 29% 0, 40% 8px, 52% 2px, 63% 8px, 74% 0, 86% 6px, 94% 0, 100% 6px, 100% 100%, 0 100%); }
${S} .marks { display: block; width: 246px; height: 54px; margin-top: 10px; stroke: #1e40af; stroke-width: 2; stroke-linecap: round; }
${S} .tn { position: absolute; right: 22px; bottom: 14px; font-style: italic; font-weight: 800; font-size: 32px; color: #1e40af; }
/* обіцянка */
${S} .cp { position: absolute; }
${S} .cp .copy { width: 100%; }
`,
    html: (o) => {
      const L = { ...LAYOUT[o], key: o === "port" ? "port" : "land" };
      const cp = o === "port"
        ? `left:90px;right:90px;top:170px`
        : `left:130px;width:650px;top:0;bottom:0;display:flex;align-items:center`;
      return `
<div class="win" style="--big:${L.big};--x0:${L.x0}px;--y0:${L.y0}px;--s0:${L.s0};--x1:${L.x1}px;--y1:${L.y1}px;--s1:${L.s1}">
  <div class="halo"></div>
  <div class="fbg"><div class="fhd">${TV.wordmark(40)}
    <span class="team"><span class="fs">${TEAMF.map((l, i) => `<span class="a-pop" style="--d:${TEAM_AT + i * 90}ms">${TV.avatar(l, 44)}</span>`).join("")}</span>
      <span class="lbl a-left" style="--d:${TEAM_AT + 420}ms"><i class="live"></i>Команда в системі</span></span>
  </div></div>
  ${TILES.map((_, i) => `<span class="slot" style="left:${COLX[i % 3]}px;top:${ROWY[Math.floor(i / 3)]}px"></span>`).join("")}
  ${PIECES.map((p) => item(p, L)).join("")}
</div>
<div class="cp" style="${cp}">${TV.copy({ title: ["Допоможемо", "організувати"], accent: "організувати", line: "Перенесемо дані, налаштуємо процеси й навчимо команду.", d0: T.promise + 250 })}</div>`;
    },
  });
})();
