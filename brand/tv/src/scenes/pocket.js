/* Мобільний простір — один телефон, різні люди й різні дії (дані: i18n.ts → pocket.today /
   roll; служитель — audience.screens.volunteer, тег ролі «Свій графік у телефоні»).
   Над телефоном — плашка власника, що змінюється разом з екраном. Екран перебудовується
   тричі: старе згортається, нові плитки піднімаються. Пастор відкриває Олену — знизу
   виїжджає її картка; лідер відмічає Петра й Софію (4 → 6 з 7) і зберігає явку;
   служитель натискає «Буду». Після кожної дії екран стоїть щонайменше 2,5 с.
   «Має бути 1 екран і різні дії» — 2026-10-02. */
// icons: check, clock, chevron-left, phone, message-circle
(function () {
  const DUR = 15000;
  const T = [700, 5000, 10500]; // мить, коли екран стає екраном цієї людини
  const P1 = 2300, L1 = 6500, L2 = 7300, L3 = 8100, S1 = 11900;
  const OUT = 240;
  const W = 640, CH = 76, GAP = 18, PW = 416, PH = 900, BZ = 12, SW = PW - 2 * BZ;
  const H = CH + GAP + PH;
  const PX = (W - PW) / 2, PY = CH + GAP;
  const at = (x, y) => [PX + BZ + x, PY + BZ + y];
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const OWN = [
    { role: "Пастор", cap: "у неділю зранку", who: "Іван", c: "#007aff" },
    { role: "Лідер", cap: "на зустрічі групи", who: "Андрій", c: "#12a150" },
    { role: "Служитель", cap: "свій графік у телефоні", who: "Петро", c: "#f59e0b" },
  ];
  const d = (i, k) => (i ? T[i] + 170 : T[i] + 120) + k * 60; // поява k-ї плитки на екрані i
  const tile = (i, k, cls, inner, style = "") => `<div class="pt ${cls}" style="--d:${d(i, k)}ms;${style}">${inner}</div>`;

  // ── Пастор — у неділю зранку
  const P = OWN[0].c;
  const OLENA = [196, 504];
  const pastor = `
${tile(0, 0, "hdr", `<b>Моя Церква</b>${TV.avatar("Іван", 48)}`)}
${tile(0, 1, "hero", `<span class="soon">${TV.icon("clock", 24, "#fff", 2.4)}Через 40 хвилин</span>
  <b>Недільне служіння</b><span class="wh">10:00 · Великий зал</span>`, `background:${P}`)}
${tile(0, 2, "sh", "Потребує уваги", "top:420px")}
${tile(0, 3, "pr", `<span class="hl a-fade" style="--d:${P1}ms;background:${tint(P, 12)}"></span>${TV.avatar("Олена", 64)}<div><b>Олена Ковальчук</b><span>не була 3 тижні</span></div>`, "top:462px")}
<div class="scrim a-fade" style="--d:${P1 + 80}ms"></div>
<div class="sheet" style="--d:${P1 + 80}ms">
  <i class="grab"></i>
  <div class="sa">${TV.avatar("Олена", 96)}</div>
  <b class="sn">Олена Ковальчук</b>
  <span class="sc">не була 3 тижні</span>
  <div class="acts">${[["phone", "Подзвонити"], ["message-circle", "Написати"]].map(([ic, l]) =>
    `<span><i style="background:${tint(P, 14)}">${TV.icon(ic, 32, P, 2.3)}</i>${l}</span>`).join("")}</div>
</div>`;

  // ── Лідер — на зустрічі групи
  const L = OWN[1].c;
  const MEM = [
    { n: "Оксана", on: 1 }, { n: "Марія", on: 1 }, { n: "Тарас", on: 1 },
    { n: "Ніна", on: 1 }, { n: "Петро", tap: L1 }, { n: "Софія", tap: L2 }, { n: "Ігор", away: 1 },
  ];
  const faceC = (k) => (k < 6 ? [70 + (k % 3) * 126, 336 + Math.floor(k / 3) * 140] : [196, 616]);
  const SAVE = [196, 780];
  const leader = `
${tile(1, 0, "back", `${TV.icon("chevron-left", 32, L, 2.6)}Групи`, `color:${L}`)}
${tile(1, 0, "gt", `<b>Група Андрія</b><span>Чт, 19:00 · у Ніни</span>`)}
${tile(1, 1, "cntr", `<b><i class="lc" style="color:${L}">4</i> з 7</b><span>були</span>`)}
${MEM.map((m, k) => {
    const [x, y] = faceC(k);
    const ok = m.on || m.tap;
    const dd = m.tap ? m.tap + 40 : -400;
    return tile(1, 2 + Math.floor(k / 3), "mf", `
      <span class="fc${m.away ? " away" : ""}">${ok ? `<span class="rg a-pop" style="--d:${dd}ms;box-shadow:0 0 0 4.5px ${L}"></span>` : ""}${TV.avatar(m.n, 84)}
      ${ok ? `<span class="ok a-pop" style="--d:${dd + 30}ms;background:${L}">${TV.icon("check", 22, "#fff", 3.6)}</span>` : ""}</span>
      <span class="mn${m.away ? " away" : ""}">${m.n}</span>`, `left:${x - 60}px;top:${y - 42}px`);
  }).join("")}
${tile(1, 5, "fb", `<span class="a-outf" style="--d:${L3 + 60}ms">Зберегти явку</span>
  <span class="a-fade" style="--d:${L3 + 60}ms">${TV.icon("check", 30, "#fff", 3)}Збережено</span>`, `background:${L}`)}`;

  // ── Служитель — свій графік у телефоні
  const V = OWN[2].c, VD = "#b45309";
  const BUDU = [196, 540];
  const servant = `
${tile(2, 0, "hdr", `<b>Мій графік</b>${TV.avatar("Петро", 48)}`)}
${tile(2, 1, "slot", `
  <span class="wh">Нд, 21 квітня</span>
  <span class="tm">${TV.icon("clock", 28, VD, 2.4)}10:00</span>
  <b>Звук</b><span class="pl">Головна зала</span>
  <span class="cf">
    <span class="a-outf" style="--d:${S1 + 60}ms;background:${VD}">${TV.icon("check", 30, "#fff", 3)}Буду</span>
    <span class="a-fade" style="--d:${S1 + 60}ms;background:var(--green)">${TV.icon("check", 30, "#fff", 3)}Ви будете</span>
  </span>
  <span class="sw" style="color:${VD}">Попросити заміну</span>`, `background:${tint(V, 12)}`)}`;

  const SCREENS = [pastor, leader, servant];

  // Плашка власника: стара йде вгору й гасне, нова виринає знизу в ту саму мить.
  const chip = (p, i) => `
<div class="chw${i < 2 ? " a-out" : ""}" style="--d:${i < 2 ? T[i + 1] - 40 : 0}ms">
  <div class="chip a-up" style="--d:${i ? T[i] + 200 : 420}ms">
    ${TV.avatar(p.who, 56, `style="box-shadow:0 0 0 3.5px ${p.c}"`)}<b>${p.role}</b><span>· ${p.cap}</span>
  </div>
</div>`;

  TV.scene({
    id: "pocket",
    dur: DUR,
    bg: "light",
    css: `
[data-scene="pocket"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 0.99; --vs-port: 1.2; }
[data-scene="pocket"] .chw { position: absolute; left: 0; right: 0; top: 0; height: ${CH}px; display: flex; justify-content: center; }
[data-scene="pocket"] .chip { height: ${CH}px; display: flex; align-items: center; gap: 14px; padding: 0 28px 0 10px; border-radius: 999px; background: #fff; white-space: nowrap;
  box-shadow: 0 0 0 1px var(--hairline), 0 12px 28px -14px rgba(0,30,70,0.35); }
[data-scene="pocket"] .chip b { font-size: 32px; font-weight: 800; letter-spacing: -0.025em; }
[data-scene="pocket"] .chip span { font-size: 26px; font-weight: 550; color: var(--ink-2); }
[data-scene="pocket"] .phone { position: absolute; left: ${PX}px; top: ${PY}px; width: ${PW}px; height: ${PH}px; padding: ${BZ}px; border-radius: 66px;
  background: #101114; box-shadow: inset 0 0 0 2px #2b2d33, 0 2px 4px rgba(10,20,40,0.1), 0 30px 60px -18px rgba(10,30,70,0.35), 0 60px 90px -40px rgba(0,60,150,0.3); }
[data-scene="pocket"] .scr { position: relative; width: 100%; height: 100%; border-radius: 54px; background: var(--surface); overflow: hidden; }
[data-scene="pocket"] .island { position: absolute; left: 50%; top: 13px; width: 124px; height: 36px; margin-left: -62px; border-radius: 20px; background: #101114; z-index: 9; }
[data-scene="pocket"] .homei { position: absolute; left: 50%; bottom: 10px; width: 140px; height: 5px; margin-left: -70px; border-radius: 3px; background: #101114; z-index: 9; }
[data-scene="pocket"] .ly { position: absolute; inset: 0; transform-origin: 50% 40%; }
[data-scene="pocket"] .ly.fold { animation: pk-out ${OUT}ms var(--e-accel) var(--o) both; }
@keyframes pk-out { to { opacity: 0; transform: scale(0.92) translate3d(0, -18px, 0); } }
[data-scene="pocket"] .ly > * { position: absolute; }
[data-scene="pocket"] .pt { animation: pk-in 560ms var(--e-decel) var(--d) both; }
@keyframes pk-in { from { opacity: 0; transform: translate3d(0, 40px, 0) scale(0.95); } }
[data-scene="pocket"] .hdr { left: 22px; right: 18px; top: 62px; display: flex; align-items: center; justify-content: space-between; }
[data-scene="pocket"] .hdr b { font-size: 34px; font-weight: 800; letter-spacing: -0.025em; }
[data-scene="pocket"] .hero { left: 14px; right: 14px; top: 136px; height: 252px; border-radius: 30px; color: #fff; padding: 22px 24px; }
[data-scene="pocket"] .hero .soon { display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 18px 0 12px; border-radius: 999px; background: rgba(255,255,255,0.22); font-size: 24px; font-weight: 650; }
[data-scene="pocket"] .hero b { display: block; margin-top: 18px; font-size: 38px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.06; }
[data-scene="pocket"] .hero .wh { display: block; margin-top: 10px; font-size: 26px; font-weight: 550; opacity: 0.92; }
[data-scene="pocket"] .sh { left: 22px; font-size: 26px; font-weight: 700; letter-spacing: -0.01em; color: var(--ink-2); }
[data-scene="pocket"] .pr { left: 10px; right: 10px; height: 84px; display: flex; align-items: center; gap: 14px; padding: 0 12px; }
[data-scene="pocket"] .pr .hl { position: absolute; inset: 0; border-radius: 22px; }
[data-scene="pocket"] .pr > .avatar, [data-scene="pocket"] .pr > div { position: relative; }
[data-scene="pocket"] .pr b { display: block; font-size: 28px; font-weight: 750; letter-spacing: -0.02em; white-space: nowrap; }
[data-scene="pocket"] .pr div span { display: block; margin-top: 2px; font-size: 24px; font-weight: 500; color: var(--ink-3); }
[data-scene="pocket"] .scrim { inset: 0; background: rgba(10,15,30,0.28); }
[data-scene="pocket"] .sheet { left: 0; right: 0; bottom: 0; height: 472px; border-radius: 36px 36px 0 0; background: #fff; box-shadow: 0 -12px 30px -12px rgba(0,0,0,0.3);
  animation: pk-sheet 600ms var(--e-decel) var(--d) both; }
@keyframes pk-sheet { from { transform: translate3d(0, 105%, 0); } }
[data-scene="pocket"] .sheet .grab { position: absolute; left: 50%; top: 12px; width: 52px; height: 6px; margin-left: -26px; border-radius: 3px; background: #d6d9de; }
[data-scene="pocket"] .sheet .sa { position: absolute; left: 0; right: 0; top: 40px; display: flex; justify-content: center; }
[data-scene="pocket"] .sheet .sn { position: absolute; left: 0; right: 0; top: 152px; text-align: center; font-size: 34px; font-weight: 800; letter-spacing: -0.025em; }
[data-scene="pocket"] .sheet .sc { position: absolute; left: 50%; top: 206px; transform: translateX(-50%); height: 46px; padding: 0 20px; border-radius: 999px; background: var(--amber-soft);
  color: #b45309; font-size: 24px; font-weight: 650; display: flex; align-items: center; white-space: nowrap; }
[data-scene="pocket"] .sheet .acts { position: absolute; left: 14px; right: 14px; top: 284px; display: flex; gap: 12px; }
[data-scene="pocket"] .sheet .acts span { flex: 1; height: 136px; border-radius: 26px; background: var(--surface-3); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  font-size: 25px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="pocket"] .sheet .acts i { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
[data-scene="pocket"] .back { left: 10px; top: 62px; display: flex; align-items: center; font-size: 26px; font-weight: 600; }
[data-scene="pocket"] .gt { left: 22px; top: 104px; }
[data-scene="pocket"] .gt b { display: block; font-size: 38px; font-weight: 800; letter-spacing: -0.03em; }
[data-scene="pocket"] .gt span { display: block; margin-top: 4px; font-size: 26px; font-weight: 500; color: var(--ink-3); }
[data-scene="pocket"] .cntr { left: 22px; right: 22px; top: 196px; display: flex; align-items: baseline; gap: 12px; }
[data-scene="pocket"] .cntr b { font-size: 62px; font-weight: 800; letter-spacing: -0.035em; font-variant-numeric: tabular-nums; line-height: 1; }
[data-scene="pocket"] .cntr i { font-style: normal; }
[data-scene="pocket"] .cntr span { font-size: 26px; font-weight: 600; color: var(--ink-2); }
[data-scene="pocket"] .mf { width: 120px; display: flex; flex-direction: column; align-items: center; }
[data-scene="pocket"] .mf .fc { position: relative; width: 84px; height: 84px; }
[data-scene="pocket"] .mf .fc.away .avatar { filter: grayscale(1); opacity: 0.4; }
[data-scene="pocket"] .mf .rg { position: absolute; inset: -7px; border-radius: 50%; }
[data-scene="pocket"] .mf .ok { position: absolute; right: -6px; bottom: -4px; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3.5px #fff; }
[data-scene="pocket"] .mf .mn { margin-top: 12px; font-size: 25px; font-weight: 650; letter-spacing: -0.015em; white-space: nowrap; }
[data-scene="pocket"] .mf .mn.away { color: var(--ink-3); }
[data-scene="pocket"] .fb { left: 14px; right: 14px; top: 742px; height: 76px; border-radius: 999px; color: #fff; font-size: 28px; font-weight: 700; }
[data-scene="pocket"] .fb > span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 10px; }
[data-scene="pocket"] .slot { left: 14px; right: 14px; top: 140px; height: 560px; border-radius: 34px; padding: 28px 26px; box-shadow: inset 0 0 0 2px rgba(245,158,11,0.3); }
[data-scene="pocket"] .slot .wh { display: block; font-size: 30px; font-weight: 700; color: var(--ink-2); letter-spacing: -0.015em; }
[data-scene="pocket"] .slot .tm { display: flex; align-items: center; gap: 10px; margin-top: 10px; font-size: 32px; font-weight: 750; color: #b45309; }
[data-scene="pocket"] .slot b { display: block; margin-top: 40px; font-size: 92px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
[data-scene="pocket"] .slot .pl { display: block; margin-top: 12px; font-size: 28px; font-weight: 500; color: var(--ink-3); }
[data-scene="pocket"] .slot .cf { position: absolute; left: 20px; right: 20px; top: 360px; height: 80px; color: #fff; font-size: 32px; font-weight: 750; }
[data-scene="pocket"] .slot .cf > span { position: absolute; inset: 0; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 10px; white-space: nowrap; }
[data-scene="pocket"] .slot .sw { position: absolute; left: 0; right: 0; top: 470px; text-align: center; font-size: 26px; font-weight: 650; }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Мобільний простір", line: "Та сама система — у телефоні." })}
  <div class="vis"><div class="mock">
    ${OWN.map(chip).join("")}
    <div class="phone a-rise" style="--d:250ms"><div class="scr">
      <span class="island"></span>
      ${SCREENS.map((h, i) => `<div class="ly${i < 2 ? " fold" : ""}" style="--o:${i < 2 ? T[i + 1] - 60 : 0}ms">${h}</div>`).join("")}
      <span class="homei"></span>
    </div></div>
    ${TV.tap(...at(...OLENA), P1, OWN[0].c)}
    ${TV.tap(...at(...faceC(4)), L1, OWN[1].c)}
    ${TV.tap(...at(...faceC(5)), L2, OWN[1].c)}
    ${TV.tap(...at(...SAVE), L3, OWN[1].c)}
    ${TV.tap(...at(...BUDU), S1, OWN[2].c)}
    ${OWN.map((p, i) => TV.cursor(p.who, p.c, `pk-c${i}`)).join("")}
  </div></div>
</div>`,
    tick(t, el) {
      const n = String(4 + (t >= L1 + 60) + (t >= L2 + 60));
      const b = el.querySelector(".lc");
      if (b && b.textContent !== n) b.textContent = n;
      const enter = [W + 60, H * 0.62];
      const go = (i, taps) => {
        const start = taps[0][1] - 800, last = taps[taps.length - 1][1];
        const keys = [[start, enter[0], enter[1]]];
        taps.forEach(([pt, dd]) => { const [x, y] = at(...pt); keys.push([dd - 60, x - 10, y - 6], [dd + 150, x - 4, y - 2]); });
        keys.push([last + 800, enter[0] + 40, enter[1] + 40]);
        TV.moveCursor(el.querySelector(`#pk-c${i}`), t, { keys, show: [start, last + 740], clicks: taps.map((x) => x[1]) });
      };
      go(0, [[OLENA, P1]]);
      go(1, [[faceC(4), L1], [faceC(5), L2], [SAVE, L3]]);
      go(2, [[BUDU, S1]]);
    },
  });
})();
