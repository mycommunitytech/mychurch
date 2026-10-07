/* База пісень — пісенник, сет на неділю і репетиція (i18n.ts → servicePlanning.plan.library:
   «Пісенник», «240 пісень», пошук «вел» → «Величний Бог» G, «Великий і сильний» A;
   «Співали нещодавно»: «Ти вірний» D, «Свята присутність» A, «Алілуя» E; «у плані»;
   ministries.worship: «Сет на неділю», Вокал Олена, Клавіші Марія, Барабани Тарас;
   integrations.ts: «Репетиція в суботу о 17:00, зала №2»; activities.ts: рядок про архів пісень).
   Олена шукає «вел» і перетягує «Величний Бог» у сет, ставить репетицію — Марія й Тарас
   підтверджують по черзі. */
// icons: music-4, search, plus, check, calendar-days, list-music
(function () {
  const W = 900, H = 820;
  const ACC = "#f05b8b";
  const TG = "#229ed9";
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const deep = (c) => `color-mix(in oklab, ${c} 72%, #0b0b0f)`;
  const KEY = { G: "#f05b8b", A: "#8b5bf0", D: "#0ea5e9", E: "#f59e0b" };
  const FOUND = [["Величний Бог", "G"], ["Великий і сильний", "A"]];
  const RECENT = [["Ти вірний", "D", true], ["Свята присутність", "A", true], ["Алілуя", "E", false]];
  const BAND = [
    { role: "Вокал", who: "Олена" },
    { role: "Клавіші", who: "Марія" },
    { role: "Барабани", who: "Тарас" },
  ];

  // ── хронометраж: рухи швидкі, між діями — пауза, щоб устигнути прочитати
  const T_IN = 1000, T_SEARCH = 1500, TYPE0 = 1650, TYPE1 = 2150, PUSH = 2200, FOUND_AT = 2300;
  const GRAB = 3200, DROP = 4100, RB_TAP = 5400, REH = 5500, T_OUT = 6100;
  const CONF = [REH, 6900, 8200];

  // ── геометрія (однакова для альбому й портрета)
  const L = { x: 0, y: 0, w: 410, h: H };
  const S = { x: 440, y: 0, w: 460, h: 440 };
  const R = { x: 440, y: 466, w: 460, h: H - 466 };
  const ROW = 80, STEP = 88, LTOP = 224, LLBL = 194, SHIFT = 2 * STEP + 50;
  const SROW = 108, SX = 56;
  const g0 = { x: L.x + 16, y: L.y + LTOP, w: 378 };
  const g1 = { x: S.x + SX, y: S.y + SROW, w: S.w - SX - 16 };
  const GRIP = { x: 96, y: 40 };

  const keyDot = (k, size = 56) => `<span class="key" style="width:${size}px;height:${size}px;background:${tint(KEY[k], 16)};color:${deep(KEY[k])}">${k}</span>`;
  const inPlan = (d) => `<span class="inp ${d ? "a-pop" : ""}" style="--d:${d || 0}ms">${TV.icon("check", 16, "currentColor", 3.2)}у плані</span>`;
  const libRow = (name, k, badge, top, cls = "", d = 0) =>
    `<div class="row ${cls}" style="top:${top}px;--d:${d}ms">${keyDot(k)}<div class="tx"><b>${name}</b>${badge || ""}</div></div>`;

  TV.scene({
    id: "songs",
    dur: 10800,
    bg: "light",
    css: `
[data-scene="songs"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
[data-scene="songs"] .pan { position: absolute; overflow: hidden; }
[data-scene="songs"] .hd { position: absolute; left: 0; right: 0; top: 0; height: 92px; display: flex; align-items: center; gap: 16px; padding: 0 24px; border-bottom: 1px solid var(--hairline); }
[data-scene="songs"] .hico { width: 52px; height: 52px; border-radius: 15px; display: flex; align-items: center; justify-content: center; flex: none; }
[data-scene="songs"] .h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; white-space: nowrap; }
[data-scene="songs"] .h2 { font-size: 21px; font-weight: 500; color: var(--ink-3); margin-top: 4px; white-space: nowrap; font-variant-numeric: tabular-nums; }
[data-scene="songs"] .srch { position: absolute; left: 20px; right: 20px; top: 108px; height: 64px; border-radius: 16px; background: var(--surface-2); box-shadow: inset 0 0 0 2px var(--hairline-strong);
  display: flex; align-items: center; gap: 12px; padding: 0 18px; font-size: 25px; font-weight: 500; }
[data-scene="songs"] .srch .on { position: absolute; inset: 0; border-radius: 16px; box-shadow: inset 0 0 0 2.5px ${ACC}; background: ${tint(ACC, 5)}; }
[data-scene="songs"] .srch .ic { position: relative; }
[data-scene="songs"] .srch .ph { position: absolute; left: 58px; color: var(--ink-3); }
[data-scene="songs"] .srch .q { position: absolute; left: 58px; display: flex; align-items: center; color: var(--ink); font-weight: 600; }
[data-scene="songs"] .caret { display: inline-block; width: 3px; height: 30px; margin-left: 2px; background: ${ACC}; animation: sg-blink 900ms steps(2) infinite; }
@keyframes sg-blink { 50% { opacity: 0; } }
[data-scene="songs"] .lbl { position: absolute; left: 24px; font-size: 20px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-3); }
[data-scene="songs"] .row { position: absolute; left: 16px; width: 378px; height: ${ROW}px; border-radius: 18px; display: flex; align-items: center; gap: 16px; padding: 0 16px 0 12px; background: #fff;
  box-shadow: 0 0 0 1px var(--hairline); font-size: 24px; white-space: nowrap; }
[data-scene="songs"] .row b { font-weight: 650; letter-spacing: -0.015em; }
[data-scene="songs"] .key { flex: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
[data-scene="songs"] .tx { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; min-width: 0; }
[data-scene="songs"] .tx b { line-height: 28px; }
[data-scene="songs"] .inp { display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 10px 0 7px; border-radius: 999px; background: var(--green-soft); color: #0e7a3c; font-size: 20px; font-weight: 650; }
[data-scene="songs"] .recent { position: absolute; left: 0; right: 0; top: 0; height: ${H}px; animation: sg-push 520ms var(--e-emph) ${PUSH}ms both; }
@keyframes sg-push { to { transform: translate3d(0, ${SHIFT}px, 0); } }
[data-scene="songs"] .num { position: absolute; left: 18px; width: 30px; text-align: center; font-size: 24px; font-weight: 700; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-scene="songs"] .srow { position: absolute; left: ${SX}px; width: ${g1.w}px; }
[data-scene="songs"] .srow.push { animation: sg-down 360ms var(--e-emph) ${DROP - 380}ms both; }
@keyframes sg-down { to { transform: translate3d(0, ${STEP}px, 0); } }
[data-scene="songs"] .land { animation: sg-land 220ms linear var(--d) both; }
@keyframes sg-land { from { opacity: 0; } }
[data-scene="songs"] .glow { position: absolute; left: ${SX - 5}px; top: ${SROW - 5}px; width: ${g1.w + 10}px; height: ${ROW + 10}px; border-radius: 22px; box-shadow: 0 0 0 3px ${ACC}, 0 14px 32px -14px ${ACC};
  animation: sg-hl 1200ms var(--e-std) ${DROP}ms both; }
@keyframes sg-hl { 0% { opacity: 0; } 18% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
[data-scene="songs"] .addr { position: absolute; left: 20px; right: 20px; bottom: 18px; height: 56px; border-radius: 16px; border: 2px dashed ${tint(ACC, 55)}; color: ${deep(ACC)};
  display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 23px; font-weight: 650; }
[data-scene="songs"] .addr.set { border: 0; background: ${tint("#0ea5e9", 14)}; color: ${deep("#0ea5e9")}; }
[data-scene="songs"] .ghost { position: absolute; left: 0; top: 0; z-index: 20; height: ${ROW}px; border-radius: 18px; display: flex; align-items: center; gap: 16px; padding: 0 16px 0 12px; background: #fff;
  font-size: 24px; white-space: nowrap; opacity: 0; box-shadow: 0 0 0 1.5px ${tint(ACC, 50)}, 0 24px 44px -14px rgba(10, 30, 70, 0.35); }
[data-scene="songs"] .ghost b { font-weight: 650; letter-spacing: -0.015em; }
[data-scene="songs"] .band { position: absolute; left: 0; right: 0; top: 142px; display: flex; justify-content: space-around; padding: 0 20px; }
[data-scene="songs"] .mem { position: relative; width: 130px; display: flex; flex-direction: column; align-items: center; }
[data-scene="songs"] .face { position: relative; width: 80px; height: 80px; }
[data-scene="songs"] .face > div { position: absolute; inset: 0; border-radius: 50%; }
[data-scene="songs"] .face .wait { box-shadow: 0 0 0 3px #fff, 0 0 0 5.5px rgba(0,0,0,0.16); }
[data-scene="songs"] .face .wait .avatar { filter: grayscale(1); opacity: 0.45; }
[data-scene="songs"] .face .ok { box-shadow: 0 0 0 3px #fff, 0 0 0 6px var(--green); }
[data-scene="songs"] .face .ok i { position: absolute; right: -6px; bottom: -6px; width: 32px; height: 32px; border-radius: 50%; background: var(--green); border: 3px solid #fff; display: flex; align-items: center; justify-content: center; }
[data-scene="songs"] .mem .rl { margin-top: 14px; font-size: 20px; font-weight: 600; color: var(--ink-3); }
[data-scene="songs"] .mem .nm { margin-top: 2px; font-size: 23px; font-weight: 650; }
[data-scene="songs"] .bub { position: absolute; top: -46px; left: 50%; z-index: 3; height: 40px; padding: 0 13px; border-radius: 14px 14px 14px 4px; background: ${TG}; color: #fff; display: flex; align-items: center;
  font-size: 20px; font-weight: 650; white-space: nowrap; animation: sg-bub 1500ms var(--e-emph) var(--d) both; }
@keyframes sg-bub {
  0% { opacity: 0; transform: translate3d(-50%, 10px, 0) scale(0.85); }
  14% { opacity: 1; transform: translate3d(-50%, 0, 0) scale(1); }
  78% { opacity: 1; transform: translate3d(-50%, 0, 0) scale(1); }
  100% { opacity: 0; transform: translate3d(-50%, -8px, 0) scale(1); }
}
[data-scene="songs"] .cnt { position: absolute; left: 24px; right: 24px; bottom: 18px; height: 34px; }
[data-scene="songs"] .cnt span { position: absolute; left: 0; top: 0; line-height: 34px; font-size: 22px; font-weight: 600; color: var(--ink-2); white-space: nowrap; font-variant-numeric: tabular-nums; }
`,
    html: () => {
      const found = `<div class="lbl a-up" style="top:${LLBL}px;--d:${FOUND_AT}ms">Знайдено</div>`
        + FOUND.map(([n, k], i) => libRow(n, k, i === 0 ? inPlan(DROP) : "", LTOP + i * STEP, "a-up", FOUND_AT + 80 + i * 90)).join("");
      const recent = `<div class="recent"><div class="lbl" style="top:${LLBL}px">Співали нещодавно</div>`
        + RECENT.map(([n, k, p], i) => libRow(n, k, p ? inPlan(0) : "", LTOP + i * STEP)).join("") + "</div>";
      const setRows = [
        `<div class="row srow land" style="top:${SROW}px;--d:${DROP}ms">${keyDot("G")}<b>Величний Бог</b></div>`,
        ...RECENT.slice(0, 2).map(([n, k], i) => `<div class="row srow push" style="top:${SROW + i * STEP}px">${keyDot(k)}<b>${n}</b></div>`),
      ].join("");
      const nums = [0, 1, 2].map((i) => `<div class="num ${i === 2 ? "a-fade" : ""}" style="top:${SROW + i * STEP + 26}px;--d:${DROP - 300}ms">${i + 1}</div>`).join("");
      const band = BAND.map((m, i) => `<div class="mem">
        <div class="face">
          ${i ? `<div class="wait a-outf" style="--d:${CONF[i]}ms">${TV.avatar(m.who, 80)}</div>` : ""}
          <div class="ok ${i ? "a-pop" : ""}" style="--d:${CONF[i]}ms">${TV.avatar(m.who, 80)}<i>${TV.icon("check", 16, "#fff", 3.4)}</i></div>
        </div>
        ${i ? `<span class="bub" style="--d:${CONF[i] - 150}ms">Підтверджую</span>` : ""}
        <span class="rl">${m.role}</span><span class="nm">${m.who}</span></div>`).join("");
      return `
<div class="split flip">
  ${TV.copy({ title: "База пісень" })}
  <div class="vis"><div class="mock">
    <div class="pan card a-rise" style="left:${L.x}px;top:${L.y}px;width:${L.w}px;height:${L.h}px;--d:250ms">
      <div class="hd"><span class="hico" style="background:${tint(ACC, 14)}">${TV.icon("music-4", 26, ACC, 2.3)}</span>
        <div><div class="h1">Пісенник</div><div class="h2">240 пісень</div></div></div>
      <div class="srch"><div class="on a-fade" style="--d:${T_SEARCH}ms"></div>${TV.icon("search", 26, "rgba(11,11,15,0.5)", 2.4)}
        <span class="ph a-outf" style="--d:${TYPE0}ms">Знайти пісню</span>
        <span class="q"><span class="typed"></span><span class="a-outf" style="--d:${GRAB}ms"><span class="caret a-fade" style="--d:${T_SEARCH}ms"></span></span></span></div>
      ${recent}
      ${found}
    </div>
    <div class="pan card a-rise" style="left:${S.x}px;top:${S.y}px;width:${S.w}px;height:${S.h}px;--d:400ms">
      <div class="hd"><span class="hico" style="background:${ACC}">${TV.icon("list-music", 26, "#fff", 2.3)}</span>
        <div><div class="h1">Сет на неділю</div><div class="h2 cn">2 пісні</div></div></div>
      ${nums}
      <div class="glow"></div>
      ${setRows}
      <div class="addr a-outf" style="--d:${RB_TAP + 60}ms">${TV.icon("plus", 22, "currentColor", 2.8)}Репетиція</div>
      <div class="addr set a-fade" style="--d:${RB_TAP + 60}ms">${TV.icon("check", 22, "currentColor", 3)}Репетиція · сб, 17:00</div>
    </div>
    <div class="pan card a-up" style="left:${R.x}px;top:${R.y}px;width:${R.w}px;height:${R.h}px;--d:${REH}ms;overflow:visible">
      <div class="hd"><span class="hico" style="background:${tint("#0ea5e9", 16)}">${TV.icon("calendar-days", 26, "#0ea5e9", 2.3)}</span>
        <div><div class="h1">Репетиція</div><div class="h2">сб, 17:00 · зала №2</div></div></div>
      <div class="band">${band}</div>
      <div class="cnt"><span class="cv">Підтвердили 1 з 3</span></div>
    </div>
    <div class="ghost">${keyDot("G")}<b>Величний Бог</b></div>
    ${TV.tap(L.x + 20 + 70, 140, T_SEARCH, ACC)}
    ${TV.tap(g0.x + GRIP.x, g0.y + GRIP.y, GRAB, ACC)}
    ${TV.tap(g1.x + GRIP.x, g1.y + GRIP.y, DROP, ACC)}
    ${TV.tap(S.x + S.w / 2, S.h - 46, RB_TAP, ACC)}
    ${TV.cursor("Олена", ACC, "sg-c")}
  </div></div>
</div>`;
    },
    tick(t, el) {
      const typed = el.querySelector(".typed");
      if (typed) {
        const s = "вел".slice(0, Math.round(3 * TV.prog(t, TYPE0, TYPE1, TV.ease.linear)));
        if (typed.textContent !== s) typed.textContent = s;
      }
      const cn = el.querySelector(".cn"), cs = t >= DROP ? "3 пісні" : "2 пісні";
      if (cn && cn.textContent !== cs) cn.textContent = cs;
      const n = CONF.filter((c) => t >= c).length || 1, cv = el.querySelector(".cv"), ct = `Підтвердили ${n} з 3`;
      if (cv && cv.textContent !== ct) { cv.textContent = ct; cv.style.color = n === 3 ? "#0e7a3c" : ""; }

      // Олена тягне «Величний Бог» із пісенника в сет.
      const gh = el.querySelector(".ghost");
      if (gh) {
        const q = TV.path(t, [[GRAB, g0.x, g0.y], [DROP, g1.x, g1.y]]);
        const lift = TV.prog(t, GRAB - 40, GRAB + 160, TV.ease.decel);
        const on = t >= GRAB - 40 && t < DROP + 220;
        gh.style.opacity = on ? String(Math.min(lift, 1 - TV.prog(t, DROP, DROP + 200, TV.ease.linear))) : "0";
        gh.style.width = `${TV.mix(g0.w, g1.w, TV.prog(t, GRAB, DROP, TV.ease.inout))}px`;
        gh.style.transform = `translate3d(${q.x}px, ${q.y}px, 0) rotate(${-2 * lift * (1 - TV.prog(t, DROP - 80, DROP, TV.ease.linear))}deg)`;
      }

      const cur = el.querySelector("#sg-c");
      const sx = L.x + 20 + 70 - 10, sy = 140 - 6;
      const gx = g0.x + GRIP.x - 10, gy = g0.y + GRIP.y - 6, dx = g1.x + GRIP.x - 10, dy = g1.y + GRIP.y - 6;
      const bx = S.x + S.w / 2 - 10, by = S.h - 46 - 6;
      TV.moveCursor(cur, t, {
        keys: [[T_IN, 220, H - 40], [T_SEARCH - 50, sx, sy], [TYPE1 + 200, sx + 30, sy + 30], [GRAB - 60, gx, gy], [GRAB, gx, gy], [DROP, dx, dy],
          [DROP + 300, dx, dy], [RB_TAP - 60, bx, by], [RB_TAP + 150, bx, by], [T_OUT, bx - 120, by + 260]],
        show: [T_IN, T_OUT],
        clicks: [T_SEARCH, GRAB, DROP, RB_TAP],
      });
      if (cur && t > GRAB && t < DROP - 90) cur.firstElementChild.style.transform = "scale(0.8)";
    },
  });
})();
