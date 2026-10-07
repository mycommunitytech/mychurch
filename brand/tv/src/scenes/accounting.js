/* Бухгалтерія — один журнал, куди сходяться гроші (дані: src/content/modules/hr.ts →
   accounting.mock і демо бухгалтера в i18n.ts). Готівка, картка й онлайн течуть у журнал,
   з нього — оренда, виплати команді, служіння; лічильники ростуть до ₴184 500 і ₴121 300.
   Бухгалтер тисне «Звіт для ради» — унизу сам складається звіт за вересень. */
// icons: banknote, credit-card, smartphone, book-open, house, users, hand-heart, file-text, file-down, check
(function () {
  const W = 880, H = 880;
  const G = "#059669";                          // MODULE_ACCENTS.accounting
  const OUT = "#f59e0b";
  const CUR = "#0f766e";                        // бухгалтер (ROLE_ACCENTS.accountant)
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;

  const XS = [160, 440, 720];
  const SRC = [["banknote", "Готівка"], ["credit-card", "Картка"], ["smartphone", "Онлайн"]];
  const DST = [["house", "Оренда зали"], ["users", "Виплата команді"], ["hand-heart", "Служіння"]];
  const SY = 112, PH = 60, RC = { x: 440, y: 300 }, R = 84, DY = 428;

  // Криві: джерело → верх журналу; низ журналу → витрата.
  const IN = XS.map((x) => [[x, SY + PH], [x, SY + PH + 34], [RC.x, RC.y - R - 40], [RC.x, RC.y - R + 2]]);
  const OU = XS.map((x) => [[RC.x, RC.y + R - 2], [RC.x, RC.y + R + 34], [x, DY - 34], [x, DY]]);
  const bez = (c, t) => {
    const u = 1 - t, a = u * u * u, b = 3 * u * u * t, d = 3 * u * t * t, e = t * t * t;
    return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]];
  };
  const dpath = (c) => `M${c[0]} C${c[1]} ${c[2]} ${c[3]}`;

  // Потоки монет: кожна — крива, старт і тривалість.
  const FLOW = [];
  for (let i = 0; i < 6; i++) XS.forEach((_, k) => FLOW.push({ c: IN[k], s: 1000 + i * 430 + k * 140, in: true }));
  for (let i = 0; i < 5; i++) XS.forEach((_, k) => FLOW.push({ c: OU[k], s: 1300 + i * 480 + k * 160, in: false }));
  const TRAVEL = 640;

  // Звіт.
  const CLICK = 4400;
  const BTN = { x: 440, y: 686 };
  const REP = 4480;
  const BARS = [["Лют", 62], ["Бер", 70], ["Кві", 88], ["Тра", 66], ["Чер", 60], ["Лип", 55], ["Сер", 64], ["Вер", 78]];
  const KPI = [["Пожертви", "₴184 500", "+8%", G], ["Витрати", "₴121 300", "−3%", "var(--ink)"], ["Залишок у фондах", "₴412 900", "", "var(--ink)"]];
  const money = (n) => "₴" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const pill = ([icon, label], x, y, c, d) => `
<div class="pw" style="left:${x}px;top:${y}px"><div class="pill2 a-pop" style="--d:${d}ms;--c:${c}"><span class="pi">${TV.icon(icon, 24, c, 2.2)}</span>${label}</div></div>`;

  TV.scene({
    id: "accounting",
    dur: 8800,
    bg: "light",
    css: `
[data-scene="accounting"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
[data-scene="accounting"] .fin { position: absolute; inset: 0; }
[data-scene="accounting"] .head { position: absolute; left: 0; right: 0; top: 0; height: 88px; display: flex; align-items: center; padding: 0 32px;
  border-bottom: 1px solid var(--hairline); font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
[data-scene="accounting"] .head span { margin-left: auto; font-size: 22px; font-weight: 500; letter-spacing: -0.01em; color: var(--ink-3); }
[data-scene="accounting"] svg.pipes { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; overflow: visible; }
[data-scene="accounting"] .pipes path { fill: none; stroke-width: 5; stroke-linecap: round; }
[data-scene="accounting"] .pw { position: absolute; width: 0; height: ${PH}px; display: flex; justify-content: center; }
[data-scene="accounting"] .pill2 { flex: none; height: ${PH}px; border-radius: 999px; display: flex; align-items: center; gap: 12px; padding: 0 24px 0 8px;
  background: #fff; box-shadow: inset 0 0 0 2px color-mix(in oklab, var(--c) 32%, #fff), 0 8px 18px -12px rgba(0,0,0,0.3);
  font-size: 23px; font-weight: 650; letter-spacing: -0.01em; white-space: nowrap; }
[data-scene="accounting"] .pill2 .pi { flex: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: color-mix(in oklab, var(--c) 14%, #fff); }
[data-scene="accounting"] .ring { position: absolute; left: ${RC.x - R}px; top: ${RC.y - R}px; width: ${R * 2}px; height: ${R * 2}px; }
[data-scene="accounting"] .ring > div { width: 100%; height: 100%; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  box-shadow: 0 0 0 3px ${tint(G, 45)}, 0 0 0 14px ${tint(G, 10)}, 0 20px 36px -18px rgba(5, 80, 60, 0.45);
  font-size: 24px; font-weight: 700; letter-spacing: -0.01em; }
[data-scene="accounting"] .wave { position: absolute; left: ${RC.x - R}px; top: ${RC.y - R}px; width: ${R * 2}px; height: ${R * 2}px; border-radius: 50%;
  border: 3px solid ${tint(G, 55)}; opacity: 0; animation: acc-wave 900ms var(--e-decel) var(--d) both; }
@keyframes acc-wave { 0% { opacity: 0; transform: scale(1); } 20% { opacity: 1; } 100% { opacity: 0; transform: scale(1.45); } }
[data-scene="accounting"] .kpi { position: absolute; top: ${RC.y - 66}px; width: 250px; display: flex; flex-direction: column; gap: 4px; }
[data-scene="accounting"] .kpi.l { left: 40px; align-items: flex-start; }
[data-scene="accounting"] .kpi.r { right: 40px; align-items: flex-end; }
[data-scene="accounting"] .kpi .lb { font-size: 22px; font-weight: 600; color: var(--ink-3); }
[data-scene="accounting"] .kpi .v { font-size: 46px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.05; font-variant-numeric: tabular-nums; white-space: nowrap; }
[data-scene="accounting"] .kpi .ch { position: relative; height: 34px; }
[data-scene="accounting"] .kpi .ch span { display: inline-flex; align-items: center; height: 34px; padding: 0 12px; border-radius: 999px; font-size: 20px; font-weight: 700; }
[data-scene="accounting"] .dot { position: absolute; left: 0; top: 0; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; opacity: 0; }
[data-scene="accounting"] .dot.in { background: ${G}; box-shadow: 0 0 0 4px ${tint(G, 25)}; }
[data-scene="accounting"] .dot.out { background: ${OUT}; box-shadow: 0 0 0 4px ${tint(OUT, 28)}; }
[data-scene="accounting"] .rep { position: absolute; left: 24px; right: 24px; top: 516px; height: 340px; border-radius: 26px; background: var(--surface-2);
  box-shadow: inset 0 0 0 2px var(--hairline); }
[data-scene="accounting"] .rep .dash { position: absolute; inset: 0; border-radius: 26px; border: 2.5px dashed rgba(0,0,0,0.14); }
[data-scene="accounting"] .rep .skel { position: absolute; inset: 0; }
[data-scene="accounting"] .rep .skel i { position: absolute; border-radius: 10px; background: rgba(0,0,0,0.045); }
[data-scene="accounting"] .rep .skel .sb { width: 44px; border-radius: 10px 10px 4px 4px; background: rgba(0,0,0,0.045); }
[data-scene="accounting"] .rep .go { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
[data-scene="accounting"] .rep .go .btn { background: ${G}; height: 68px; padding: 0 34px 0 28px; font-size: 27px; white-space: nowrap; }
[data-scene="accounting"] .rep .ttl { position: absolute; left: 32px; top: 26px; display: flex; align-items: baseline; gap: 12px; }
[data-scene="accounting"] .rep .ttl b { font-size: 29px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="accounting"] .rep .ttl span { font-size: 22px; font-weight: 550; color: var(--ink-3); }
[data-scene="accounting"] .rep .pdf { position: absolute; right: 26px; top: 20px; }
[data-scene="accounting"] .rep .pdf span { display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 18px 0 12px; border-radius: 999px;
  background: ${tint(G, 14)}; color: ${G}; font-size: 21px; font-weight: 700; white-space: nowrap; }
[data-scene="accounting"] .rep .ks { position: absolute; left: 32px; top: 84px; display: flex; flex-direction: column; gap: 14px; }
[data-scene="accounting"] .rep .k { display: flex; flex-direction: column; gap: 2px; }
[data-scene="accounting"] .rep .k span { font-size: 20px; font-weight: 600; color: var(--ink-3); }
[data-scene="accounting"] .rep .k b { font-size: 32px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; font-variant-numeric: tabular-nums; }
[data-scene="accounting"] .rep .k i { font-style: normal; font-size: 20px; font-weight: 700; margin-left: 10px; letter-spacing: 0; }
[data-scene="accounting"] .rep .chart { position: absolute; right: 30px; bottom: 22px; width: 470px; height: 236px; display: flex; align-items: flex-end; justify-content: space-between; }
[data-scene="accounting"] .rep .col { width: 44px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
[data-scene="accounting"] .rep .bar { width: 44px; border-radius: 10px 10px 4px 4px; background: ${tint(G, 30)}; transform-origin: 50% 100%;
  animation: acc-bar 760ms var(--e-emph) var(--d) both; }
[data-scene="accounting"] .rep .col.now .bar { background: ${G}; }
@keyframes acc-bar { from { transform: scaleY(0); } }
[data-scene="accounting"] .rep .col span { font-size: 20px; font-weight: 600; color: var(--ink-3); }
[data-scene="accounting"] .rep .col.now span { color: ${G}; font-weight: 750; }
`,
    html: (o) => `
<div class="split${o === "port" ? "" : " flip"}">
  ${TV.copy({ title: "Бухгалтерія", line: "Пожертви, витрати й звіти зведені в одному місці." })}
  <div class="vis"><div class="mock">
    <div class="fin card a-rise" style="--d:250ms">
      <div class="head">Фінанси · вересень<span>Надходження проти витрат</span></div>
      <svg class="pipes a-fade" style="--d:760ms" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        ${IN.map((c) => `<path d="${dpath(c)}" stroke="${tint(G, 30)}"/>`).join("")}
        ${OU.map((c) => `<path d="${dpath(c)}" stroke="${tint(OUT, 38)}"/>`).join("")}
      </svg>
      ${SRC.map((s, i) => pill(s, XS[i], SY, G, 500 + i * 80)).join("")}
      ${DST.map((s, i) => pill(s, XS[i], DY, OUT, 620 + i * 80)).join("")}
      ${[1640, 2360, 3080].map((d) => `<i class="wave" style="--d:${d}ms"></i>`).join("")}
      <div class="ring"><div class="a-pop" style="--d:560ms">${TV.icon("book-open", 40, G, 2)}Журнал</div></div>
      ${FLOW.map((f, i) => `<i class="dot ${f.in ? "in" : "out"}" data-i="${i}"></i>`).join("")}
      <div class="kpi l a-up" style="--d:700ms"><span class="lb">Пожертви</span><b class="v" id="acc-in" style="color:${G}">₴0</b>
        <span class="ch"><span class="a-pop" style="--d:3900ms;background:${tint(G, 14)};color:${G}">+8%</span></span></div>
      <div class="kpi r a-up" style="--d:780ms"><span class="lb">Витрати</span><b class="v" id="acc-out">₴0</b>
        <span class="ch"><span class="a-pop" style="--d:3980ms;background:${tint(OUT, 18)};color:#b45309">−3%</span></span></div>
      <div class="rep a-up" style="--d:860ms">
        <div class="dash a-outf" style="--d:${REP}ms"></div>
        <div class="skel a-outf" style="--d:${REP}ms">
          <i style="left:32px;top:30px;width:220px;height:26px"></i>
          ${[0, 1, 2].map((i) => `<i style="left:32px;top:${96 + i * 76}px;width:${[190, 170, 150][i]}px;height:34px"></i>`).join("")}
          <div class="chart">${BARS.map(([, v]) => `<div class="col"><div class="sb" style="height:${Math.round(v * 2.2)}px"></div><span>&nbsp;</span></div>`).join("")}</div>
        </div>
        <div class="go"><div class="a-out" style="--d:${REP}ms"><span class="btn">${TV.icon("file-text", 28, "#fff", 2.2)}Звіт для ради</span></div></div>
        <div class="ttl a-up" style="--d:${REP + 60}ms"><b>Звіт для ради</b><span>вересень</span></div>
        <div class="ks">${KPI.map(([l, v, ch, c], i) => `
          <div class="k a-up" style="--d:${REP + 180 + i * 110}ms"><span>${l}</span><b style="color:${c}">${v}${ch ? `<i style="color:${i ? "#b45309" : G}">${ch}</i>` : ""}</b></div>`).join("")}</div>
        <div class="chart">${BARS.map(([m, v], i) => `
          <div class="col${i === BARS.length - 1 ? " now" : ""}"><div class="bar" style="height:${Math.round(v * 2.2)}px;--d:${REP + 300 + i * 90}ms"></div><span class="a-fade" style="--d:${REP + 200 + i * 60}ms">${m}</span></div>`).join("")}</div>
        <div class="pdf"><span class="a-pop" style="--d:${REP + 1500}ms">${TV.icon("check", 22, G, 3)}PDF для ради</span></div>
      </div>
    </div>
    ${TV.tap(BTN.x, BTN.y, CLICK, CUR)}
    ${TV.cursor("Наталя", CUR, "acc-c", "Бухгалтер")}
  </div></div>
</div>`,
    tick(t, el) {
      const a = el.querySelector("#acc-in"), b = el.querySelector("#acc-out");
      const vin = money(Math.round(184500 * TV.prog(t, 1100, 3800, TV.ease.inout) / 100) * 100);
      const vout = money(Math.round(121300 * TV.prog(t, 1350, 3900, TV.ease.inout) / 100) * 100);
      if (a && a.textContent !== vin) a.textContent = vin;
      if (b && b.textContent !== vout) b.textContent = vout;

      el.querySelectorAll(".dot").forEach((d) => {
        const f = FLOW[+d.dataset.i];
        const p = (t - f.s) / TRAVEL;
        if (p <= 0 || p >= 1) { d.style.opacity = "0"; return; }
        const [x, y] = bez(f.c, TV.ease.inout(p));
        d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        d.style.opacity = String(Math.min(1, p / 0.12, (1 - p) / 0.12));
      });

      TV.moveCursor(el.querySelector("#acc-c"), t, {
        keys: [[CLICK - 700, 960, 930], [CLICK - 40, BTN.x - 10, BTN.y - 6], [CLICK + 150, BTN.x - 10, BTN.y - 6], [CLICK + 560, BTN.x + 150, BTN.y + 110]],
        show: [CLICK - 700, CLICK + 600], clicks: [CLICK],
      });
    },
  });
})();
