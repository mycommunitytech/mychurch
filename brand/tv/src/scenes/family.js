/* Сім'я — родина Ковальчуків (content/modules/people.ts → family: mock і pipeline)
   складається деревом: подружжя з річницею 14 травня, мама Андрія над ним, діти
   під батьками. Потім пастор кладе запрошення «Сімейний табір» на контакт родини
   (Андрія), і участь розходиться лініями до кожного з п'ятьох: «5 з 5». */
// icons: heart, tent, check, users, calendar-days, bell
(function () {
  const W = 880, H = 880;
  const C = "#ec4899";                                   // MODULE_ACCENTS.family
  const tint = (p) => `color-mix(in oklab, ${C} ${p}%, #fff)`;
  // Вузли: центр аватарки, розмір, підпис. Діти — під батьками, мама — над сином.
  const N = {
    andrii: { x: 260, y: 430, r: 60, name: "Андрій", sub: "чоловік · контакт родини", d: 600 },
    olena: { x: 630, y: 430, r: 60, name: "Олена", sub: "дружина", d: 740 },
    halyna: { x: 260, y: 240, r: 50, name: "Галина", sub: "мама Андрія", d: 1500, side: true, look: 5 },
    marko: { x: 300, y: 670, r: 48, name: "Марко", sub: "9 років · група 7–10", d: 2450, kid: true },
    sofia: { x: 590, y: 670, r: 48, name: "Софія", sub: "5 років · група 4–6", d: 2600, kid: true },
  };
  const MID = (N.andrii.x + N.olena.x) / 2, KY = 578;
  const A = N.andrii;
  // Лінії родини (малюються) і шляхи запрошення від Андрія (імпульси).
  const LINES = [
    { d: `M${A.x} ${A.y}H${N.olena.x}`, len: N.olena.x - A.x, t: 900 },
    { d: `M${A.x} ${N.halyna.y}V${A.y}`, len: A.y - N.halyna.y, t: 1600 },
    { d: `M${MID} ${A.y}V${KY}H${N.marko.x}V${N.marko.y}`, len: (KY - A.y) + (MID - N.marko.x) + (N.marko.y - KY), t: 2150 },
    { d: `M${MID} ${KY}H${N.sofia.x}V${N.sofia.y}`, len: (N.sofia.x - MID) + (N.sofia.y - KY), t: 2300 },
  ];
  const DROP = 4720;
  // Імпульс іде від краю аватарки Андрія до краю аватарки адресата.
  const AX = A.x + A.r;
  const GO = {
    olena: { d: `M${AX} ${A.y}H${N.olena.x - N.olena.r}`, dur: 480 },
    halyna: { d: `M${A.x} ${A.y - A.r}V${N.halyna.y + N.halyna.r}`, dur: 360 },
    marko: { d: `M${AX} ${A.y}H${MID}V${KY}H${N.marko.x}V${N.marko.y - N.marko.r}`, dur: 700 },
    sofia: { d: `M${AX} ${A.y}H${MID}V${KY}H${N.sofia.x}V${N.sofia.y - N.sofia.r}`, dur: 740 },
  };
  const ARRIVE = { andrii: DROP + 40 };
  Object.entries(GO).forEach(([k, g], i) => { g.t = DROP + 80 + i * 60; ARRIVE[k] = g.t + g.dur; });
  const ALL = Math.max(...Object.values(ARRIVE));

  // Квиток: звідки бере курсор і куди кладе.
  const TK = { x: 520, y: 150, w: 330, h: 112 };
  const GRAB = [TK.x + 70, TK.y + 64], PICK = 4000;
  const CUR = [[3280, 760, 1010], [PICK - 40, GRAB[0] - 10, GRAB[1] - 6], [DROP - 40, A.x + 4 - 10, A.y - 16 - 6], [DROP + 400, A.x + 40, A.y + 30]];

  // Портрет вищий: під деревом — дати родини (mock.footer, pipeline: нагадування за три дні).
  const EXTRA = { land: 0, port: 210 };
  const DATES = [["тра", "14", "Річниця весілля", "нагадати за 3 дні"], ["чер", "20", "День народження", "Андрій"]];
  const dates = `
<div class="dsec a-fade" style="top:${H - 6}px;--d:2950ms">${TV.icon("calendar-days", 24, C, 2.2)}Дати родини</div>
${DATES.map(([m, d, what, sub], i) => `
<div class="dt a-up" style="left:${36 + i * 412}px;top:${H + 40}px;--d:${3000 + i * 90}ms">
  <span class="leaf"><i>${m}</i><b>${d}</b></span>
  <span class="dtx"><b>${what}</b>${i ? `<small>${sub}</small>` : `<small class="rem">${TV.icon("bell", 20, C, 2.4)}${sub}</small>`}</span>
</div>`).join("")}`;

  const node = (k) => {
    const n = N[k], s = n.r * 2;
    const lab = n.side
      ? `<div class="lab side a-left" style="left:${n.x + n.r + 18}px;top:${n.y - 30}px;--d:${n.d + 120}ms"><b>${n.name}</b><small>${n.sub}</small></div>`
      : `<div class="lab a-up" style="left:${n.x - 150}px;top:${n.y + n.r + 12}px;--d:${n.d + 120}ms"><b>${n.name}</b><small>${n.sub}</small></div>`;
    return `
<div class="nd a-pop" style="left:${n.x - n.r}px;top:${n.y - n.r}px;width:${s}px;height:${s}px;--d:${n.d}ms">${TV.avatar(n.look != null ? TV.LOOKS[n.look] : n.name, s)}
  <span class="ok a-pop" style="--d:${ARRIVE[k]}ms">${TV.icon("check", 22, "#fff", 3.2)}</span>
</div>${lab}`;
  };

  const S = '[data-scene="family"]';
  TV.scene({
    id: "family",
    dur: 8600,
    bg: "light",
    css: `
${S} .mock { position: relative; width: ${W}px; --vs: 1; --vs-port: 1.02; }
${S} .dsec { position: absolute; left: 36px; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 600; color: var(--ink-2); }
${S} .dt { position: absolute; width: 396px; height: 132px; border-radius: 22px; background: var(--surface-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.07);
  display: flex; align-items: center; gap: 20px; padding: 0 18px; }
${S} .leaf { flex: none; width: 88px; height: 100px; border-radius: 16px; background: #fff; overflow: hidden; display: flex; flex-direction: column; align-items: center;
  box-shadow: 0 0 0 1.5px var(--hairline), 0 10px 20px -12px rgba(120,20,70,0.35); }
${S} .leaf i { width: 100%; height: 30px; background: ${C}; color: #fff; font-style: normal; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
${S} .leaf b { font-size: 46px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.4; }
${S} .dtx { display: flex; flex-direction: column; gap: 8px; }
${S} .dtx b { font-size: 25px; font-weight: 700; letter-spacing: -0.015em; }
${S} .dtx small { font-size: 21px; color: var(--ink-3); display: flex; align-items: center; gap: 8px; }
${S} .dtx .rem { color: ${C}; font-weight: 600; }
${S} .card { position: absolute; inset: 0; }
${S} .hd { position: absolute; left: 36px; right: 32px; top: 30px; height: 84px; display: flex; align-items: center; gap: 18px; }
${S} .hd .ic-b { width: 64px; height: 64px; border-radius: 18px; background: ${tint(14)}; display: flex; align-items: center; justify-content: center; flex: none; }
${S} .hd h3 { font-size: 34px; font-weight: 780; letter-spacing: -0.03em; line-height: 1.05; }
${S} .hd small { display: block; margin-top: 6px; font-size: 22px; color: var(--ink-3); }
${S} .camp { margin-left: auto; position: relative; height: 54px; display: flex; align-items: center; gap: 10px; padding: 0 20px 0 16px; border-radius: 999px;
  background: ${C}; color: #fff; font-size: 23px; font-weight: 650; white-space: nowrap; font-variant-numeric: tabular-nums; }
${S} .camp b { font-weight: 800; }
${S} svg.tree { position: absolute; inset: 0; overflow: visible; }
${S} .ln { fill: none; stroke: ${tint(45)}; stroke-width: 5; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: var(--l); stroke-dashoffset: var(--l); animation: family-draw 620ms var(--e-emph) var(--d) both; }
@keyframes family-draw { to { stroke-dashoffset: 0; } }
${S} .nd { position: absolute; border-radius: 50%; box-shadow: 0 0 0 6px #fff, 0 0 0 8px ${tint(30)}, 0 16px 30px -14px rgba(120,20,70,0.45); }
${S} .nd .avatar { width: 100%; height: 100%; }
${S} .ok { position: absolute; right: -6px; top: -6px; width: 40px; height: 40px; border-radius: 50%; background: ${C};
  display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px #fff; }
${S} .lab { position: absolute; width: 300px; text-align: center; display: flex; flex-direction: column; gap: 4px; }
${S} .lab.side { width: auto; text-align: left; }
${S} .lab b { font-size: 27px; font-weight: 720; letter-spacing: -0.02em; line-height: 1.1; }
${S} .lab small { font-size: 21px; color: var(--ink-3); white-space: nowrap; }
${S} .heart { position: absolute; left: ${MID - 26}px; top: ${A.y - 26}px; width: 52px; height: 52px; border-radius: 50%; background: ${C};
  display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px #fff; }
${S} .anniv { position: absolute; left: ${MID - 110}px; width: 220px; top: ${A.y - 76}px; text-align: center; font-size: 21px; font-weight: 650; color: ${C}; white-space: nowrap; }
${S} .kid { position: absolute; transform: translateX(-50%); height: 36px; padding: 0 14px; border-radius: 999px; display: flex; align-items: center;
  font-size: 20px; font-weight: 650; color: #b45309; background: #fef3c7; white-space: nowrap; }
${S} .tk { position: absolute; left: ${TK.x}px; top: ${TK.y}px; width: ${TK.w}px; height: ${TK.h}px; z-index: 20; }
${S} .tk .in { position: absolute; inset: 0; display: flex; border-radius: 20px; background: #fff; overflow: hidden;
  box-shadow: 0 0 0 1.5px ${tint(40)}, 0 20px 40px -18px rgba(120,20,70,0.5); }
${S} .tk .stub { width: 80px; flex: none; background: ${C}; display: flex; align-items: center; justify-content: center; position: relative; }
${S} .tk .stub::after { content: ""; position: absolute; right: -1px; top: 10px; bottom: 10px; border-right: 3px dashed #fff; }
${S} .tk .txt { padding: 0 18px; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
${S} .tk b { font-size: 26px; font-weight: 750; letter-spacing: -0.02em; line-height: 1.05; }
${S} .tk small { font-size: 20px; color: var(--ink-3); }
${S} .pulse { position: absolute; left: 0; top: 0; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%; background: ${C};
  box-shadow: 0 0 0 7px ${tint(30)}, 0 0 22px 6px ${tint(60)}; offset-rotate: 0deg; z-index: 5;
  animation: family-go var(--t) var(--e-inout, cubic-bezier(0.45, 0, 0.25, 1)) var(--d) both; }
@keyframes family-go { 0% { offset-distance: 0%; opacity: 0; } 8% { opacity: 1; } 88% { opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } }
`,
    html: (o) => `
<div class="split">
  ${TV.copy({ title: "Сім'я", line: "Сім'я видна цілком — діти, зв'язки й спільні події." })}
  <div class="vis"><div class="mock" style="height:${H + EXTRA[o]}px">
    <div class="card a-rise" style="--d:200ms">
      <div class="hd a-fade" style="--d:380ms">
        <span class="ic-b">${TV.icon("users", 34, C, 2.2)}</span>
        <div><h3>Родина Ковальчуків</h3><small>5 осіб · кемпус Центр</small></div>
        <span class="camp a-pop" style="--d:${DROP + 60}ms">${TV.icon("tent", 26, "#fff", 2.2)}Табір: <b class="n">1</b> з 5</span>
      </div>
      <svg class="tree" viewBox="0 0 ${W} ${H}">${LINES.map((l) => `<path class="ln" d="${l.d}" style="--l:${l.len};--d:${l.t}ms"/>`).join("")}</svg>
      <div class="anniv a-fade" style="--d:1350ms">річниця 14 травня</div>
      <span class="heart a-pop" style="--d:1250ms">${TV.icon("heart", 26, "#fff", 2.6)}</span>
      ${Object.keys(N).map(node).join("")}
      ${["marko", "sofia"].map((k, i) => `<span class="kid a-pop" style="left:${N[k].x}px;top:${N[k].y + N[k].r + 86}px;--d:${2850 + i * 90}ms">Дитяча реєстрація</span>`).join("")}
      ${o === "port" ? dates : ""}
      ${Object.entries(GO).map(([, g]) => `<i class="pulse" style="offset-path:path('${g.d}');--t:${g.dur}ms;--d:${g.t}ms"></i>`).join("")}
    </div>
    <div class="tk" id="fm-tk"><div class="in a-right" style="--d:3300ms"><span class="stub">${TV.icon("tent", 40, "#fff", 2)}</span>
      <span class="txt"><b>Сімейний табір</b><small>запрошення родині</small></span></div></div>
    ${TV.tap(GRAB[0], GRAB[1], PICK, C)}${TV.tap(A.x + 4, A.y - 16, DROP, C)}
    ${TV.cursor("Іван", "#8b5bf0", "fm-cur", "Пастор Іван")}
  </div></div>
</div>`,
    tick(t, el) {
      const n = String(Object.values(ARRIVE).filter((a) => t >= a).length || 1);
      const b = el.querySelector(".camp .n");
      if (b && b.textContent !== n) b.textContent = n;
      const cur = el.querySelector("#fm-cur");
      TV.moveCursor(cur, t, { keys: CUR, show: [CUR[0][0], CUR[3][0]], clicks: [PICK, DROP] });
      // Квиток їде за курсором від кліку до кліку, потім пірнає в Андрія.
      const tk = el.querySelector("#fm-tk");
      if (tk) {
        const p = TV.path(Math.min(Math.max(t, PICK), DROP - 40), CUR);
        const dx = p.x + 10 - GRAB[0], dy = p.y + 6 - GRAB[1];
        const lift = TV.prog(t, PICK - 40, PICK + 160);
        const sink = TV.prog(t, DROP, DROP + 260, TV.ease.accel);
        const s = (1 + 0.05 * lift) * (1 - 0.75 * sink);
        tk.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${s.toFixed(3)})`;
        tk.style.opacity = String(1 - sink);
      }
    },
  });
})();
