/* Кемпуси — чотири локації на схемі міста (content/modules/campuses.ts →
   campuses.mock: Центр 186, 124, 76, 42 —
   разом 428, явка 316, 23 групи, «+10 за тиждень»). Назви — сторони світу, а не
   райони Києва (власник 2026-10-01: «не називай на честь Києва»). Шпильки падають на мапу
   зі своїми числами; пастор перемикає «Разом» — числа злітають у спільну
   смугу церкви, і лічильник складає їх у 428. */
// icons: calendar-days
(function () {
  const A = "#0f766e";
  const W = 880, H = 826, PAD = 24, MAP_T = 80, MAP_B = 556;
  const CAMPS = [
    { name: "Центр", n: 186, att: 142, grp: 10, badge: "+5 нових", tone: "green", c: A, x: 360, y: 530 },
    { name: "Захід", n: 124, att: 91, grp: 6, badge: "+3 нових", tone: "green", c: "#0ea5e9", x: 170, y: 330 },
    { name: "Схід", n: 76, att: 47, grp: 4, badge: "Явка −12%", tone: "amber", c: "#f59e0b", x: 612, y: 508 },
    { name: "Північ", n: 42, att: 36, grp: 3, badge: "Новий кемпус", tone: "brand", c: "#8b5bf0", x: 744, y: 302 },
  ];
  const TONES = { green: ["#e3f6ea", "#0d7a3d"], amber: ["#fff4dc", "#a15c00"], brand: ["#eaf3ff", "#0058bd"] };
  const LW = 214, LH = 132;
  const PIN0 = 800, PIN_STEP = 350, LBL = 140;
  const SW = { x: PAD, y: 14, w: 290, h: 52 };
  const CLICK = 3600, GO = CLICK + 500, STEP = 700, FLIGHT = 800;
  const BAR = { x: PAD + 8, y: 752, w: W - PAD * 2 - 16, h: 34 };
  const TOTAL = CAMPS.reduce((s, c) => s + c.n, 0);
  let acc = 0;
  CAMPS.forEach((c, i) => {
    c.pin = PIN0 + i * PIN_STEP;
    c.lx = Math.min(Math.max(c.x - LW / 2, PAD - 8), W - PAD + 8 - LW);
    c.ly = c.y - 70 - LH;
    c.seg0 = BAR.x + (acc / TOTAL) * BAR.w;
    c.segW = (c.n / TOTAL) * BAR.w;
    acc += c.n;
    c.go = GO + i * STEP;
    c.land = c.go + FLIGHT;
  });
  // 1 людина, 2–4 людини, 5+ людей (11–14 — людей)
  const ppl = (n) => (n % 10 === 1 && n % 100 !== 11 ? "людина" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "людини" : "людей");
  const cum = (key, i) => CAMPS.slice(0, i).reduce((s, c) => s + c[key], 0);

  function label(c) {
    const [bg, fg] = TONES[c.tone];
    return `
<div class="lbl-w" style="left:${c.lx}px;top:${c.ly}px">
  <div class="lbl a-up" style="--d:${c.pin + LBL}ms">
    <b class="nm"><i style="background:${c.c}"></i>${c.name}</b>
    <span class="num"><b class="cn">0</b> <span class="pw">людей</span></span>
    <span class="bdg" style="background:${bg};color:${fg}">${c.badge}</span>
    <i class="ptr" style="left:${c.x - c.lx - 9}px"></i>
  </div>
</div>`;
  }
  function pin(c) {
    return `
<i class="shadow a-fade" style="left:${c.x - 16}px;top:${c.y - 6}px;--d:${c.pin + 200}ms"></i>
<i class="pulse" style="left:${c.x - 30}px;top:${c.y - 30}px;--d:${c.go}ms;border-color:${c.c}"></i>
<svg class="pin" style="left:${c.x - 24}px;top:${c.y - 58}px;--d:${c.pin}ms" width="48" height="58" viewBox="0 0 48 58" aria-hidden="true">
  <path d="M24 0C10.7 0 0 10.5 0 23.5 0 40 24 58 24 58S48 40 48 23.5C48 10.5 37.3 0 24 0Z" fill="${c.c}"/><circle cx="24" cy="23" r="8.5" fill="#fff"/></svg>`;
  }
  const seg = (c) => `<i class="seg" style="left:${c.seg0}px;width:${c.segW + 0.5}px;background:${c.c};--d:${c.land}ms"></i>`;
  const packet = (c, i) => `<span class="pk" id="cp-p${i}" style="background:${c.c};opacity:0">+${c.n}</span>`;

  TV.scene({
    id: "campuses",
    dur: 10200,
    bg: "light",
    css: `
[data-scene="campuses"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
[data-scene="campuses"] .board { position: absolute; inset: 0; overflow: hidden; }
[data-scene="campuses"] .head { position: absolute; left: 0; right: 0; top: 0; height: ${MAP_T}px; display: flex; align-items: center; padding: 0 32px 0 ${PAD}px;
  border-bottom: 1px solid var(--hairline); }
[data-scene="campuses"] .sw { position: relative; width: ${SW.w}px; height: ${SW.h}px; border-radius: 999px; background: var(--surface-3); display: flex; }
[data-scene="campuses"] .sw .th { position: absolute; left: 4px; top: 4px; width: ${SW.w / 2 - 4}px; height: ${SW.h - 8}px; border-radius: 999px; background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08), 0 4px 12px -4px rgba(0,0,0,0.2); animation: cp-thumb 380ms var(--e-emph) ${CLICK + 30}ms both; }
@keyframes cp-thumb { to { transform: translateX(${SW.w / 2 - 4}px); } }
[data-scene="campuses"] .sw span { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 650; color: var(--ink-2); }
[data-scene="campuses"] .sw span i { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-style: normal; color: ${A}; }
[data-scene="campuses"] .when { margin-left: auto; display: inline-flex; align-items: center; gap: 10px; font-size: 23px; font-weight: 550; color: var(--ink-3); }
[data-scene="campuses"] .map { position: absolute; left: 0; right: 0; top: ${MAP_T}px; height: ${MAP_B - MAP_T}px; background: #f3f7f6; border-bottom: 1px solid var(--hairline); }
[data-scene="campuses"] .map svg.city { position: absolute; inset: 0; }
[data-scene="campuses"] .draw { stroke-dasharray: 1; animation: cp-draw 1100ms var(--e-emph) var(--d) both; }
@keyframes cp-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
[data-scene="campuses"] .pin { position: absolute; z-index: 3; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.18)); animation: cp-drop 620ms var(--e-decel) var(--d) both; }
@keyframes cp-drop { 0% { opacity: 0; transform: translateY(-70px); } 55% { opacity: 1; transform: translateY(5px); } 100% { transform: none; } }
[data-scene="campuses"] .shadow { position: absolute; width: 32px; height: 12px; border-radius: 50%; background: rgba(0,0,0,0.16); }
[data-scene="campuses"] .pulse { position: absolute; z-index: 2; width: 60px; height: 60px; border-radius: 50%; border: 3px solid; animation: cp-pulse 800ms var(--e-decel) var(--d) both; }
@keyframes cp-pulse { 0% { opacity: 0; transform: scale(0.3); } 20% { opacity: 1; } 100% { opacity: 0; transform: scale(1.6); } }
[data-scene="campuses"] .lbl-w { position: absolute; z-index: 4; width: ${LW}px; height: ${LH}px; }
[data-scene="campuses"] .lbl { position: relative; height: 100%; border-radius: 20px; background: #fff; padding: 14px 18px;
  box-shadow: 0 0 0 1px var(--hairline), 0 14px 30px -14px rgba(10,40,40,0.35); display: flex; flex-direction: column; align-items: flex-start; }
[data-scene="campuses"] .lbl .nm { display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 700; letter-spacing: -0.015em; white-space: nowrap; }
[data-scene="campuses"] .lbl .nm i { width: 12px; height: 12px; border-radius: 50%; }
[data-scene="campuses"] .num { margin-top: 2px; font-size: 21px; font-weight: 550; color: var(--ink-3); white-space: nowrap; }
[data-scene="campuses"] .num b { font-size: 38px; font-weight: 800; color: var(--ink); letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
[data-scene="campuses"] .bdg { margin-top: auto; font-size: 20px; font-weight: 650; padding: 4px 12px; border-radius: 999px; white-space: nowrap; }
[data-scene="campuses"] .ptr { position: absolute; bottom: -8px; width: 18px; height: 18px; background: #fff; transform: rotate(45deg); border-radius: 3px;
  box-shadow: 4px 4px 6px -3px rgba(10,40,40,0.18); }
[data-scene="campuses"] .tot { position: absolute; left: ${PAD + 8}px; right: ${PAD + 8}px; top: ${MAP_B + 22}px; }
[data-scene="campuses"] .tot .t1 { display: flex; align-items: center; gap: 14px; height: 40px; font-size: 26px; font-weight: 700; letter-spacing: -0.01em; }
[data-scene="campuses"] .tot .grow { font-size: 21px; font-weight: 650; padding: 5px 14px; border-radius: 999px; background: #e3f6ea; color: #0d7a3d; }
[data-scene="campuses"] .big { display: flex; align-items: baseline; gap: 14px; margin-top: 6px; }
[data-scene="campuses"] .big b { font-size: 92px; line-height: 1; font-weight: 800; letter-spacing: -0.05em; color: ${A}; font-variant-numeric: tabular-nums; }
[data-scene="campuses"] .big > span { font-size: 30px; font-weight: 600; color: var(--ink-2); }
[data-scene="campuses"] .kv { position: absolute; right: 0; top: 52px; display: flex; gap: 40px; }
[data-scene="campuses"] .kv div { display: flex; flex-direction: column; align-items: flex-end; }
[data-scene="campuses"] .kv b { font-size: 44px; line-height: 1.05; font-weight: 750; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
[data-scene="campuses"] .kv span { font-size: 20px; font-weight: 550; color: var(--ink-3); }
[data-scene="campuses"] .track { position: absolute; left: ${BAR.x}px; top: ${BAR.y}px; width: ${BAR.w}px; height: ${BAR.h}px; border-radius: 999px; background: var(--surface-3); overflow: hidden; }
[data-scene="campuses"] .seg { position: absolute; top: 0; bottom: 0; transform-origin: 0 50%; animation: cp-seg 520ms var(--e-emph) var(--d) both; box-shadow: inset -2px 0 0 #fff; }
@keyframes cp-seg { from { transform: scaleX(0); } }
[data-scene="campuses"] .pk { position: absolute; left: 0; top: 0; z-index: 20; height: 42px; padding: 0 16px; margin: -21px 0 0 -44px; border-radius: 999px;
  display: flex; align-items: center; color: #fff; font-size: 23px; font-weight: 750; font-variant-numeric: tabular-nums; box-shadow: 0 10px 22px -8px rgba(0,0,0,0.35); }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Кемпуси", line: "Кожна локація своя, а картина церкви — спільна." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="map a-fade" style="--d:420ms">
        <svg class="city" viewBox="0 0 ${W} ${MAP_B - MAP_T}" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="#e2e9e7" stroke-width="7" stroke-linecap="round">
            <path class="draw" pathLength="1" style="--d:600ms" d="M-10 150 C 150 170, 260 210, 360 300 S 470 330, 890 200"/>
            <path class="draw" pathLength="1" style="--d:700ms" d="M360 300 C 330 360, 300 420, 250 490"/>
            <path class="draw" pathLength="1" style="--d:800ms" d="M540 380 C 650 360, 760 330, 890 360"/>
          </g>
          <path class="draw" pathLength="1" style="--d:450ms" fill="none" stroke="#cfe5f4" stroke-width="58" stroke-linecap="round"
            d="M575 -40 C 540 90, 440 170, 470 270 S 560 400, 505 520"/>
        </svg>
        <div style="position:absolute;inset:0;top:-${MAP_T}px">
          ${CAMPS.map(pin).join("")}
          ${CAMPS.map(label).join("")}
        </div>
      </div>
      <div class="head">
        <div class="sw a-fade" style="--d:520ms"><i class="th"></i><span>Окремо</span><span>Разом<i class="a-fade" style="--d:${CLICK + 60}ms">Разом</i></span></div>
        <span class="when">${TV.icon("calendar-days", 24, "currentColor", 2.2)}нд, 21 квітня</span>
      </div>
      <div class="tot a-up" style="--d:${CLICK + 80}ms">
        <div class="t1">Уся церква<span class="grow a-pop" style="--d:${CAMPS[3].land + 800}ms">+10 за тиждень</span></div>
        <div class="big"><b class="tn">0</b><span class="tw">людей</span></div>
        <div class="kv"><div><b class="ta">0</b><span>явка в неділю</span></div><div><b class="tg">0</b><span>груп</span></div></div>
      </div>
      <div class="track a-fade" style="--d:${CLICK + 200}ms">${CAMPS.map((c) => seg({ ...c, seg0: c.seg0 - BAR.x })).join("")}</div>
      ${CAMPS.map(packet).join("")}
    </div>
    ${TV.tap(SW.x + SW.w * 0.75, SW.y + SW.h / 2, CLICK, "#007aff")}
    ${TV.cursor("Іван", "#007aff", "cp-c", "Пастор Іван")}
  </div></div>
</div>`,
    tick(t, el) {
      const set = (sel, v) => { const n = el.querySelector(sel); if (n && n.textContent !== String(v)) n.textContent = v; };
      const labels = el.querySelectorAll(".cn"), words = el.querySelectorAll(".pw");
      CAMPS.forEach((c, i) => {
        const t0 = c.pin + LBL + 120;
        const v = String(TV.count(t, t0, t0 + 700, 0, c.n));
        if (labels[i] && labels[i].textContent !== v) labels[i].textContent = v;
        if (words[i] && words[i].textContent !== ppl(+v)) words[i].textContent = ppl(+v);
        // Пакет із числом летить дугою від таблички до свого відрізка смуги.
        const p = el.querySelector(`#cp-p${i}`);
        if (p) {
          const k = TV.prog(t, c.go, c.land, TV.ease.inout);
          const x0 = c.x + 10, y0 = c.y - 36, x2 = c.seg0 + c.segW / 2, y2 = BAR.y + BAR.h / 2;
          const cx = (x0 + x2) / 2 + (x2 > x0 ? -60 : 60), cy = Math.min(y0, y2) - 70;
          const x = (1 - k) * (1 - k) * x0 + 2 * (1 - k) * k * cx + k * k * x2;
          const y = (1 - k) * (1 - k) * y0 + 2 * (1 - k) * k * cy + k * k * y2;
          const on = Math.min(TV.prog(t, c.go, c.go + 160, TV.ease.decel), 1 - TV.prog(t, c.land - 120, c.land + 40, TV.ease.accel));
          p.style.opacity = String(Math.max(0, on));
          p.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 - 0.25 * k})`;
        }
      });
      const roll = (key) => {
        let v = 0;
        CAMPS.forEach((c, i) => { if (t >= c.land) v = TV.count(t, c.land, c.land + 520, cum(key, i), cum(key, i + 1)); });
        return v;
      };
      const tn = roll("n");
      set(".tn", tn);
      set(".tw", ppl(tn));
      set(".ta", roll("att"));
      set(".tg", roll("grp"));
      const sx = SW.x + SW.w * 0.75 - 10, sy = SW.y + SW.h / 2 - 6;
      TV.moveCursor(el.querySelector("#cp-c"), t, {
        keys: [[CLICK - 720, 140, 900], [CLICK - 40, sx, sy], [CLICK + 500, sx + 40, sy + 80]],
        show: [CLICK - 720, CLICK + 560],
        clicks: [CLICK],
      });
    },
  });
})();
