/* Єдиний простір — заголовок героя з сайту (i18n.ts → hero: badge, h1Lines, h1Rotate),
   хвіст якого крутиться, як rotating-words.tsx: «вашої церкви» → «вашого служіння» →
   «вашої групи» → «вашого клубу» → «вашої організації» → знову «вашої церкви».
   Потім два рядки злітають угору в один, а знизу піднімається головний екран
   продукту (i18n.ts → preview, app-preview.tsx): лічильники, стовпчики відвідуваності
   за 8 тижнів, кільце 87 % і «Потребують уваги». Стовпчики — не міняти на крапки. */
// icons: house, users, users-round, heart-handshake, calendar-days, chart-column
(function () {
  const ROT = ["вашої церкви", "вашого служіння", "вашої групи", "вашого клубу", "вашої організації", "вашої церкви"];
  /* Хвіст: кожне слово стоїть нерухомо ~1,3 с (читається через залу), а сама
     заміна швидка — ~0,5 с: старе їде вгору 440 мс, нове за 100 мс виїжджає знизу. */
  const SWAP0 = 2200, STEP = 1820, IN_D = 100, IN_T = 520, OUT_T = 440;
  const LIFT = SWAP0 + STEP * (ROT.length - 2) + IN_D + 440;   // рядки злітають угору, щойно «вашої церкви» стало
  const WIN = LIFT + 200;                       // вікно піднімається разом із рядками
  const NAV = [["house", "Головна"], ["users", "Люди"], ["users-round", "Групи"], ["heart-handshake", "Служіння"], ["calendar-days", "Події"], ["chart-column", "Аналітика"]];
  const STATS = [["Людей у церкві", 428, "+12"], ["Активних груп", 23, "+2"], ["Служінь", 9, "+1"]];
  const BARS = [52, 64, 58, 71, 66, 79, 74, 88];
  const WEEKS = ["3.03", "10.03", "17.03", "24.03", "31.03", "7.04", "14.04", "21.04"];
  const ATT = [["Олена Ковальчук", "не була 3 тижні"], ["Дмитро Лис", "не був 2 тижні"], ["Наталя Рудь", "новенька, без групи"], ["Василь Панченко", "не був 4 тижні"]];
  const T_STAT = WIN + 500, T_BAR = WIN + 650, T_RING = WIN + 800, T_ATT = WIN + 950;
  const RC = 2 * Math.PI * 50;

  /* Геометрія заголовка. Ширини — виміряні для Inter 800, -0.045em на 100 px:
     «Єдиний простір для» 940, «вашої церкви» 634, пробіл 17.
     Альбом: два рядки по 150 px → один рядок 88 px угорі.
     Портрет: «Єдиний / простір для / хвіст» по 116 px → ті самі три рядки, 100 px. */
  const G = {
    land: (() => {
      const f = 150, s = 88 / 150, y0 = 414, lh = f * 0.98, yF = 110, gap = 0.09 * f;
      const w1 = 9.40 * 88, w2 = 6.34 * 88, sp = 0.17 * 88, left = 960 - (w1 + sp + w2) / 2;
      return {
        f, pill: 322,
        lines: [{ text: "Єдиний простір для", top: y0, x: left + w1 / 2 - 960, y: yF - (y0 + f * 0.6), s }],
        rot: { top: y0 + lh + gap, x: left + w1 + sp + w2 / 2 - 960, y: yF - (y0 + lh + gap + f * 0.6), s },
      };
    })(),
    port: (() => {
      const f = 116, s = 100 / 116, y0 = 786, lh = f * 0.98, yF = 170, lhF = 100 * 0.98, gap = 0.09 * f;
      // Хвіст (i = 2) стоїть на gap нижче: його маска не зачіпає виносні «д», «р» рядка над ним.
      const at = (i) => { const g2 = i === 2 ? gap : 0; return { top: y0 + lh * i + g2, x: 0, y: yF + lhF * i + g2 * s - (y0 + lh * i + g2 + f * 0.6), s }; };
      return {
        f, pill: 690,
        lines: [{ text: "Єдиний", ...at(0) }, { text: "простір для", ...at(1) }],
        rot: at(2),
      };
    })(),
  };

  const words = (text, d0) => text.split(" ").map((w, i) =>
    `<span class="w"><span style="--d:${d0 + i * 70}ms">${TV.esc(w)}</span></span>`).join(" ");

  function title(o) {
    const g = G[o];
    let d = 150;
    const lines = g.lines.map((l) => {
      const html = `<div class="ly" style="top:${l.top}px;--y:${l.y}px"><div class="ln" style="--x:${l.x}px;--s:${l.s}">${words(l.text, d)}</div></div>`;
      d += l.text.split(" ").length * 70;
      return html;
    }).join("");
    const r = g.rot;
    const vs = ROT.map((w, i) => {
      const tin = i === 0 ? d : SWAP0 + STEP * (i - 1) + IN_D;
      const tout = i < ROT.length - 1 ? SWAP0 + STEP * i : 0;
      return `<span class="v" style="--in:${tin}ms;--vt:${i === 0 ? 700 : IN_T}ms"><span class="vi ${tout ? "go" : ""}" style="--out:${tout}ms">${w}</span></span>`;
    }).join("");
    return `
${lines}
<div class="ly" style="top:${r.top}px;--y:${r.y}px"><div class="ln rot" style="--x:${r.x}px;--s:${r.s}">${vs}</div></div>`;
  }

  const win = () => `
<div class="win">
  <div class="chrome">
    <span class="lights"><i></i><i></i><i></i></span>
    <span class="url"><i></i>mychurch.com.ua</span>
    <span class="me"><i></i><i></i></span>
  </div>
  <div class="body">
    <aside class="side">
      <div class="brandrow a-fade" style="--d:${WIN + 350}ms">${TV.wordmark(34)}</div>
      <nav>${NAV.map(([ic, l], i) => `<div class="nav ${i ? "" : "on"} a-left" style="--d:${WIN + 380 + i * 50}ms">${TV.icon(ic, 26, "currentColor", 2.1)}<span>${l}</span></div>`).join("")}</nav>
      <div class="next a-up" style="--d:${WIN + 700}ms"><small>Наступна подія</small><b>Недільне служіння</b><span>Неділя, 10:00</span></div>
    </aside>
    <main class="main">
      <div class="top a-fade" style="--d:${WIN + 420}ms">
        <div><h3>Головна</h3><small>Оновлено щойно</small></div>
        <span class="month">Квітень</span><span class="add">+ Додати людину</span>
      </div>
      <div class="stats">${STATS.map(([l, , tr], i) => `
        <div class="stat a-up" style="--d:${T_STAT - 80 + i * 90}ms"><small>${l}</small><div><b>0</b><em class="a-pop" style="--d:${T_STAT + 1150 + i * 80}ms">${tr}</em></div></div>`).join("")}
      </div>
      <div class="row2">
        <div class="panel chart a-up" style="--d:${T_BAR - 150}ms">
          <div class="ch-head">
            <div><h4>Відвідуваність</h4><small>останні 8 тижнів</small></div>
            <div class="ring"><svg width="124" height="124" viewBox="0 0 124 124"><circle cx="62" cy="62" r="50" class="trk"/><circle cx="62" cy="62" r="50" class="val" stroke-dasharray="${RC.toFixed(2)}" stroke-dashoffset="${RC.toFixed(2)}" transform="rotate(-90 62 62)"/></svg><b>0%</b></div>
          </div>
          <div class="bars">${BARS.map((h, i) => `
            <div class="col"><div class="slot"><i class="${i === BARS.length - 1 ? "now" : ""}" style="height:${h}%;--d:${T_BAR + i * 75}ms"></i></div><span>${WEEKS[i]}</span></div>`).join("")}
          </div>
        </div>
        <div class="panel att a-up" style="--d:${T_ATT - 200}ms">
          <h4><span class="pulse"><i></i></span>Потребують уваги</h4>
          ${ATT.map(([n, note], i) => `<div class="pp a-left" style="--d:${T_ATT + i * 110}ms">${TV.avatar(n.split(" ")[0], 50)}<div><b>${n}</b><small>${note}</small></div></div>`).join("")}
        </div>
      </div>
    </main>
  </div>
</div>`;

  const S = '[data-scene="space"]';
  const P = '[data-o="port"] [data-scene="space"]';
  TV.scene({
    id: "space",
    dur: 14200,
    bg: "light",
    css: `
${S} .sp { position: absolute; inset: 0; }
${S} .pill { position: absolute; left: 50%; transform: translateX(-50%); }
${S} .pill.a-up { animation-name: space-pill; }
@keyframes space-pill { from { opacity: 0; transform: translate3d(-50%, 40px, 0); } }
${S} .pill-out { position: absolute; inset: 0; animation: a-outf 360ms var(--e-std) ${LIFT}ms both; }
/* Злиття в один рядок — двома рухами: спершу рядки розходяться вбік і меншають
   (.ln, швидка крива), потім піднімаються (.ly, пізніше й м'якше) — так «для»
   і «вашої церкви» ніде не налазять одне на одне. */
${S} .ly { position: absolute; z-index: 2; left: 0; right: 0; height: 1.2em; font-size: ${G.land.f}px;
  animation: space-ly 900ms cubic-bezier(0.6, 0, 0.2, 1) ${LIFT + 200}ms both; }
${P} .ly { font-size: ${G.port.f}px; }
@keyframes space-ly { to { transform: translate3d(0, var(--y), 0); } }
${S} .ln { position: absolute; inset: 0; line-height: 1.2em; text-align: center; white-space: nowrap;
  font-weight: 800; letter-spacing: -0.045em; color: var(--ink); transform-origin: 50% 50%;
  animation: space-ln 760ms var(--e-decel) ${LIFT}ms both; }
@keyframes space-ln { to { transform: translate3d(var(--x), 0, 0) scale(var(--s)); } }
/* Маска хвоста: верхні 0,2em рядка порожні (над великими літерами), а сам хвіст
   стоїть на 0,09em нижче — слово, що виїжджає вгору, зникає під лінією, яка
   проходить нижче виносних «д» і «р» рядка над ним. */
${S} .rot { clip-path: inset(0.2em -0.3em 0 -0.3em); color: var(--brand); }
${S} .v { position: absolute; inset: 0; animation: space-in var(--vt) var(--e-emph) var(--in) both; }
${S} .vi { display: block; }
${S} .vi.go { animation: space-out ${OUT_T}ms var(--e-emph) var(--out) both; }
@keyframes space-in { from { transform: translate3d(0, 100%, 0); opacity: 0; } 40% { opacity: 1; } }
@keyframes space-out { to { transform: translate3d(0, -100%, 0); opacity: 0; } }

${S} .win { position: absolute; left: 240px; top: 200px; width: 1440px; height: 850px; text-align: left; border-radius: 30px; overflow: hidden;
  background: var(--surface); box-shadow: 0 0 0 1px var(--hairline), var(--shadow-card);
  display: flex; flex-direction: column; animation: space-win 1000ms cubic-bezier(0.6, 0, 0.2, 1) ${WIN}ms both; }
${P} .win { left: 60px; top: 520px; width: 960px; height: 1250px; }
/* Вікно їде тією самою кривою, що й рядки, і на 720 px нижче — верх вікна
   завжди під хвостом заголовка. */
@keyframes space-win { from { opacity: 0; transform: translate3d(0, 720px, 0); } 25% { opacity: 1; } }
${S} .chrome { flex: none; height: 60px; display: flex; align-items: center; padding: 0 24px; gap: 16px; background: var(--surface-2); border-bottom: 1px solid var(--hairline); }
${S} .lights { display: flex; gap: 9px; width: 120px; }
${S} .lights i { width: 15px; height: 15px; border-radius: 50%; background: #ff5f57; }
${S} .lights i:nth-child(2) { background: #febc2e; } ${S} .lights i:nth-child(3) { background: #28c840; }
${S} .url { margin: 0 auto; height: 38px; min-width: 360px; padding: 0 22px; border-radius: 10px; background: var(--surface-3);
  display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 21px; color: var(--ink-3); }
${S} .url i { width: 11px; height: 11px; border-radius: 50%; background: var(--green); }
${S} .me { display: flex; gap: 10px; width: 120px; justify-content: flex-end; }
${S} .me i { width: 30px; height: 30px; border-radius: 50%; background: var(--surface-3); } ${S} .me i + i { background: var(--brand); }
${S} .body { flex: 1; display: flex; min-height: 0; }
${S} .side { flex: none; width: 300px; padding: 26px 18px 22px; background: var(--surface-2); border-right: 1px solid var(--hairline); display: flex; flex-direction: column; gap: 26px; }
${P} .side { width: 262px; padding: 24px 14px; }
${S} .brandrow { padding: 4px 12px 0; }
${S} .brandrow .wordmark { display: block; }
${S} nav { display: flex; flex-direction: column; gap: 4px; }
${S} .nav { height: 58px; border-radius: 14px; padding: 0 16px; display: flex; align-items: center; gap: 16px; font-size: 24px; font-weight: 500; color: var(--ink-2); }
${S} .nav .ic { color: var(--ink-3); }
${S} .nav.on { background: var(--brand); color: #fff; font-weight: 600; }
${S} .nav.on .ic { color: #fff; }
${S} .next { margin-top: auto; border-radius: 18px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--hairline); padding: 18px 18px; display: flex; flex-direction: column; gap: 8px; }
${S} .next small { font-size: 20px; color: var(--ink-3); }
${S} .next b { font-size: 23px; font-weight: 650; letter-spacing: -0.01em; }
${S} .next span { font-size: 21px; color: var(--brand); font-weight: 550; }
${S} .main { flex: 1; min-width: 0; padding: 30px 34px 32px; display: flex; flex-direction: column; gap: 24px; }
${P} .main { padding: 28px 28px; }
${S} .top { display: flex; align-items: center; gap: 14px; }
${S} .top > div { margin-right: auto; display: flex; flex-direction: column; gap: 6px; }
${S} .top h3 { font-size: 36px; font-weight: 750; letter-spacing: -0.025em; line-height: 1; }
${S} .top small { font-size: 20px; color: var(--ink-3); }
${S} .month { height: 46px; padding: 0 20px; border-radius: 999px; box-shadow: inset 0 0 0 1.5px var(--hairline-strong); display: flex; align-items: center; font-size: 21px; color: var(--ink-2); }
${S} .add { height: 46px; padding: 0 22px; border-radius: 999px; background: var(--brand); color: #fff; display: flex; align-items: center; font-size: 21px; font-weight: 600; white-space: nowrap; }
${S} .stats { display: flex; gap: 18px; }
${P} .stats { gap: 14px; }
${S} .stat { flex: 1; border-radius: 20px; box-shadow: inset 0 0 0 1.5px var(--hairline), 0 1px 2px var(--hairline); padding: 20px 22px; display: flex; flex-direction: column; gap: 10px; }
${P} .stat { padding: 18px 18px; }
${S} .stat small { font-size: 21px; color: var(--ink-3); white-space: nowrap; }
${S} .stat div { display: flex; align-items: flex-end; gap: 12px; }
${S} .stat b { font-size: 52px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
${S} .stat em { font-style: normal; font-size: 22px; font-weight: 650; color: #0e7a3c; padding-bottom: 5px; }
${S} .row2 { flex: 1; min-height: 0; display: flex; gap: 22px; }
${P} .row2 { flex-direction: column; }
${S} .panel { border-radius: 22px; box-shadow: inset 0 0 0 1.5px var(--hairline), 0 1px 2px var(--hairline); padding: 24px 26px; }
${S} .panel h4 { font-size: 26px; font-weight: 650; letter-spacing: -0.015em; line-height: 1.1; }
${S} .chart { flex: 1.5; display: flex; flex-direction: column; }
${S} .ch-head { display: flex; justify-content: space-between; align-items: flex-start; }
${S} .ch-head small { display: block; margin-top: 8px; font-size: 20px; color: var(--ink-3); }
${S} .ring { position: relative; width: 124px; height: 124px; margin: -6px -4px 0 0; }
${S} .ring svg { display: block; }
${S} .ring circle { fill: none; stroke-width: 12; }
${S} .ring .trk { stroke: var(--surface-3); }
${S} .ring .val { stroke: var(--brand); stroke-linecap: round; }
${S} .ring b { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 29px; font-weight: 700; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
${S} .bars { flex: 1; display: flex; gap: 14px; margin-top: 10px; min-height: 0; }
${S} .col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; }
${S} .slot { flex: 1; width: 100%; display: flex; align-items: flex-end; }
${S} .slot i { display: block; width: 100%; border-radius: 10px; background: color-mix(in oklab, var(--brand) 24%, #fff);
  transform-origin: 50% 100%; animation: space-bar 900ms var(--e-emph) var(--d) both; }
${S} .slot i.now { background: var(--brand); }
@keyframes space-bar { from { transform: scaleY(0); } }
${S} .col span { font-size: 20px; color: var(--ink-3); font-variant-numeric: tabular-nums; white-space: nowrap; }
${S} .att { flex: 1; display: flex; flex-direction: column; gap: 24px; }
${P} .att { flex: none; }
${S} .att h4 { display: flex; align-items: center; gap: 14px; margin-bottom: 2px; }
${S} .pulse { position: relative; width: 14px; height: 14px; border-radius: 50%; background: #ff9500; }
${S} .pulse i { position: absolute; inset: 0; border-radius: 50%; background: #ff9500; animation: space-pulse 1600ms ease-out ${T_ATT}ms infinite both; }
@keyframes space-pulse { 0% { opacity: 0.6; transform: scale(1); } 100% { opacity: 0; transform: scale(2.8); } }
${S} .pp { display: flex; align-items: center; gap: 16px; }
${S} .pp div { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
${S} .pp b { font-size: 23px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
${S} .pp small { font-size: 20px; color: var(--ink-3); white-space: nowrap; }
${P} .att { display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px; row-gap: 20px; }
${P} .att h4 { grid-column: 1 / -1; }
`,
    html: (o) => `
<div class="center"><div class="sp">
  ${title(o)}
  ${win()}
</div></div>`,
    tick(t, el) {
      const nums = el.querySelectorAll(".stat b");
      STATS.forEach(([, v], i) => {
        const n = String(TV.count(t, T_STAT + i * 90, T_STAT + 1100 + i * 90, 0, v));
        if (nums[i] && nums[i].textContent !== n) nums[i].textContent = n;
      });
      const p = TV.prog(t, T_RING, T_RING + 1300);
      const val = el.querySelector(".ring .val");
      if (val) val.setAttribute("stroke-dashoffset", (RC * (1 - 0.87 * p)).toFixed(2));
      const pct = el.querySelector(".ring b");
      const s = Math.round(87 * p) + "%";
      if (pct && pct.textContent !== s) pct.textContent = s;
    },
  });
})();
