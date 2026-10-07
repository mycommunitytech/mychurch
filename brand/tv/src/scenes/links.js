/* Посилання — QR на афіші літнього табору (дані з tools.ts → links: mock, pipeline).
   Тарас наводить телефон на QR: рамка ловить код, лічильник сканів 311 → 312,
   відкривається /табір, він вписує ім'я і реєструється. Реєстрація злітає
   з телефона в «Посилання», лічильник 95 → 96, рядок з'являється зверху. */
// icons: link-2, tent, check, chevron-right, qr-code, camera
(function () {
  const C = "#10b981";
  const DEEP = "color-mix(in oklab, #10b981 72%, #022c22)";
  const tint = (p) => `color-mix(in oklab, ${C} ${p}%, #fff)`;
  const W = 890, H = 930;
  const PW = 440;                       // ширина афіші й панелі
  const PX = W - 390, PY = 43;          // телефон
  const SX = PX + 11, SY = PY + 11;     // екран телефона

  // Декоративний QR: 25×25 модулів, три шукачі, решта — детермінований шум.
  const QR = (() => {
    const N = 25;
    let s = 20260930;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const on = (x, y) => {
      const f = (fx, fy) => {
        const dx = x - fx, dy = y - fy;
        if (dx < -1 || dy < -1 || dx > 7 || dy > 7) return null;
        if (dx === -1 || dy === -1 || dx === 7 || dy === 7) return false;
        const r = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
        return r !== 2;
      };
      for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) { const v = f(fx, fy); if (v !== null) return v; }
      if (y === 6) return x % 2 === 0;
      if (x === 6) return y % 2 === 0;
      if (x >= 16 && x <= 20 && y >= 16 && y <= 20) return Math.max(Math.abs(x - 18), Math.abs(y - 18)) !== 1;
      return rnd() < 0.5;
    };
    let d = "";
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (on(x, y)) d += `M${x} ${y}h1v1h-1z`;
    return `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" aria-hidden="true"><path d="${d}" fill="#0b0b0f"/></svg>`;
  })();

  // Кожна дія — щонайменше 1,2 с після попередньої.
  const T = {
    lock: 2000,      // рамка зловила код
    pill: 2200,      // з'явилось посилання
    open: 3200,      // тап по посиланню
    field: 3450, t0: 3520, t1: 4120,   // поле вже у фокусі — ім'я друкується саме
    reg: 4600,       // «Зареєструватись»
  };
  const FLY = 820, LAND = T.reg + 260 + FLY;
  const NAME = "Тарас Бойко";

  const poster = () => `
    <div class="poster a-rise" style="--d:250ms">
      <span class="pl">Реєстрація</span>
      <span class="tent">${TV.icon("tent", 76, "rgba(255,255,255,0.28)", 1.7)}</span>
      <div class="pt">Літній табір</div>
      <div class="qr">${QR}</div>
      <div class="pu">${TV.icon("link-2", 34, "currentColor", 2.4)}/табір</div>
    </div>`;

  const brackets = (cls, d) => `<span class="br ${cls}" style="--d:${d}ms"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i></span>`;

  const phone = () => `
    <div class="phone a-rise" style="left:${PX}px;top:${PY}px;--d:420ms"><div class="scr">
      <div class="cam">
        <div class="shot"><div class="sq">${QR}</div></div>
        <i class="scan"></i>
        ${brackets("wh a-outf", T.lock)}
        ${brackets("gr", T.lock)}
        <span class="go a-pop" style="--d:${T.pill}ms">${TV.icon("link-2", 26, "currentColor", 2.4)}/табір${TV.icon("chevron-right", 24, "currentColor", 2.4)}</span>
      </div>
      <div class="page a-up" style="--d:${T.open + 60}ms">
        <div class="pg-h"><span class="pg-i">${TV.icon("tent", 34, "#fff", 2)}</span><div><div class="pg-t">Літній табір</div><div class="pg-s">Реєстрація</div></div></div>
        <div class="lbl">Ім'я та прізвище</div>
        <div class="box"><span class="val"><span class="ty"></span><i class="caret"></i></span><i class="ring"></i></div>
        <div class="reg">Зареєструватись</div>
        <i class="cover a-fade" style="--d:${T.reg + 60}ms"></i>
        <div class="done">
          <span class="okc a-pop" style="--d:${T.reg + 160}ms">${TV.icon("check", 60, "#fff", 3.2)}</span>
          <span class="okt a-up" style="--d:${T.reg + 260}ms">Записано</span>
          <span class="oks a-up" style="--d:${T.reg + 340}ms">Літній табір</span>
        </div>
      </div>
      <i class="island"></i><i class="home"></i>
    </div></div>`;

  // Число, що прокручується: старе їде вгору, нове — знизу.
  const roll = (a, b, d) => `<span class="roll"><span class="r0 lk-out" style="--d:${d}ms">${a}</span><span class="r1 lk-in" style="--d:${d}ms">${b}</span></span><span class="plus lk-plus" style="--d:${d}ms">+1</span>`;

  const panel = () => `
    <div class="stats card a-rise" style="--d:560ms">
      <div class="sh">${TV.icon("link-2", 28, C, 2.4)}Посилання<span class="sm">вересень</span></div>
      <div class="kpi" style="left:24px"><div class="kn">${roll("311", "312", T.lock + 80)}</div><div class="kl">${TV.icon("qr-code", 20, "currentColor", 2.2)}QR-сканів</div></div>
      <div class="kpi" style="left:${24 + 180 + 24}px"><div class="kn">${roll("95", "96", LAND)}</div><div class="kl">${TV.icon("check", 20, "currentColor", 2.6)}Реєстрацій</div></div>
      <div class="rows">
        <div class="row old lk-down" style="--d:${LAND - 200}ms">${TV.avatar("Ігор", 52)}<div><div class="rn">Ігор Лисенко</div><div class="rs">/основи · Instagram</div></div></div>
        <div class="row new lk-drop" style="--d:${LAND + 40}ms">${TV.avatar("Тарас", 52)}<div><div class="rn">${NAME}</div><div class="rs"><b>/табір</b> · QR-код</div></div><span class="now">щойно</span></div>
      </div>
    </div>`;

  // Політ реєстрації: з екрана телефона в рядок панелі (дві осі — дві криві).
  const FROM = [SX + 158, SY + 540], TO = [30, 600 + 214 + 22];
  const flyer = `<span class="fx" style="left:${TO[0]}px;top:${TO[1]}px;--fx:${FROM[0] - TO[0]}px;--d:${T.reg + 260}ms"><span class="fy" style="--fy:${FROM[1] - TO[1]}px"><span class="fo">${TV.avatar("Тарас", 52)}</span></span></span>`;

  const CLICKS = [[T.open, SX + 130, SY + 642], [T.reg, SX + 260, SY + 386]];

  TV.scene({
    id: "links",
    dur: 8400,
    bg: "light",
    css: `
[data-scene="links"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 0.96; --vs-port: 1; }
[data-scene="links"] .poster { position: absolute; left: 0; top: 0; width: ${PW}px; height: 560px; border-radius: 32px; background: ${DEEP}; color: #fff; overflow: hidden;
  box-shadow: var(--shadow-card); }
[data-scene="links"] .pl { position: absolute; left: 36px; top: 34px; height: 40px; padding: 0 18px; border-radius: 999px; background: rgba(255,255,255,0.16);
  display: inline-flex; align-items: center; font-size: 21px; font-weight: 600; }
[data-scene="links"] .tent { position: absolute; right: 28px; top: 26px; }
[data-scene="links"] .pt { position: absolute; left: 0; right: 0; text-align: center; top: 96px; font-size: 48px; font-weight: 800; letter-spacing: -0.035em; }
[data-scene="links"] .qr { position: absolute; left: ${(PW - 300) / 2}px; top: 170px; width: 300px; height: 300px; padding: 20px; border-radius: 26px; background: #fff; }
[data-scene="links"] .qr svg, [data-scene="links"] .sq svg { display: block; width: 100%; height: 100%; }
[data-scene="links"] .pu { position: absolute; left: 0; right: 0; top: 486px; display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 40px; font-weight: 750; letter-spacing: -0.02em; }

[data-scene="links"] .phone { position: absolute; width: 390px; height: 844px; border-radius: 56px; background: #0b0b0f; box-shadow: inset 0 0 0 2px #2c2c33, var(--shadow-card); z-index: 2; }
[data-scene="links"] .scr { position: absolute; inset: 11px; border-radius: 46px; background: #101418; overflow: hidden; }
[data-scene="links"] .island { position: absolute; left: 50%; top: 12px; width: 116px; height: 34px; margin-left: -58px; border-radius: 20px; background: #0b0b0f; z-index: 9; }
[data-scene="links"] .home { position: absolute; left: 50%; bottom: 9px; width: 132px; height: 5px; margin-left: -66px; border-radius: 3px; background: rgba(0,0,0,0.78); z-index: 9; }
[data-scene="links"] .cam { position: absolute; inset: 0; background: radial-gradient(120% 80% at 50% 45%, #1f3b33, #0c1512); }
[data-scene="links"] .shot { position: absolute; left: 34px; top: 170px; width: 300px; height: 380px; border-radius: 26px; background: ${DEEP}; opacity: 0.9;
  box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6); }
[data-scene="links"] .sq { position: absolute; left: 40px; top: 70px; width: 220px; height: 220px; padding: 16px; border-radius: 20px; background: #f4f4f4; }
[data-scene="links"] .scan { position: absolute; left: 60px; right: 60px; top: 220px; height: 4px; border-radius: 2px; background: ${C};
  box-shadow: 0 0 18px 4px ${tint(60)}; animation: lk-scan 1000ms ease-in-out 900ms 2 alternate both; }
@keyframes lk-scan { 0% { opacity: 0; transform: translateY(0); } 10% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0.2; transform: translateY(260px); } }
[data-scene="links"] .br { position: absolute; left: 50px; top: 210px; width: 268px; height: 300px; }
[data-scene="links"] .br i { position: absolute; width: 56px; height: 56px; border: 6px solid #fff; }
[data-scene="links"] .br .b1 { left: 0; top: 0; border-right: 0; border-bottom: 0; border-top-left-radius: 22px; }
[data-scene="links"] .br .b2 { right: 0; top: 0; border-left: 0; border-bottom: 0; border-top-right-radius: 22px; }
[data-scene="links"] .br .b3 { left: 0; bottom: 0; border-right: 0; border-top: 0; border-bottom-left-radius: 22px; }
[data-scene="links"] .br .b4 { right: 0; bottom: 0; border-left: 0; border-top: 0; border-bottom-right-radius: 22px; }
[data-scene="links"] .br.gr { left: 62px; top: 228px; width: 244px; height: 244px; animation: lk-lock 520ms var(--e-spring) var(--d) both; }
[data-scene="links"] .br.gr i { border-color: ${C}; }
@keyframes lk-lock { from { opacity: 0; transform: scale(1.18); } }
[data-scene="links"] .go { position: absolute; left: 50%; top: 610px; transform-origin: 50% 50%; margin-left: -118px; width: 236px; height: 64px; border-radius: 999px;
  background: #fff; color: #065f46; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 26px; font-weight: 700;
  box-shadow: 0 16px 34px -12px rgba(0,0,0,0.6); }
[data-scene="links"] .page { position: absolute; inset: 0; background: #fff; }
[data-scene="links"] .pg-h { position: absolute; left: 0; right: 0; top: 0; height: 200px; padding: 80px 26px 0; background: ${DEEP}; color: #fff; display: flex; gap: 16px; align-items: flex-start; }
[data-scene="links"] .pg-i { flex: none; width: 64px; height: 64px; border-radius: 18px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; }
[data-scene="links"] .pg-t { font-size: 30px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="links"] .pg-s { margin-top: 4px; font-size: 21px; font-weight: 500; opacity: 0.8; }
[data-scene="links"] .lbl { position: absolute; left: 26px; top: 238px; font-size: 20px; font-weight: 550; color: var(--ink-2); }
[data-scene="links"] .box { position: absolute; left: 26px; right: 26px; top: 270px; height: 60px; border-radius: 14px; background: #f5f7f6; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.08); }
[data-scene="links"] .ring { position: absolute; inset: 0; border-radius: 14px; box-shadow: inset 0 0 0 2.5px ${C}, 0 0 0 5px ${tint(18)}; opacity: 0; }
[data-scene="links"] .val { position: absolute; left: 18px; top: 0; height: 60px; display: flex; align-items: center; font-size: 24px; font-weight: 550; white-space: nowrap; }
[data-scene="links"] .caret { display: inline-block; width: 2.5px; height: 28px; margin-left: 2px; border-radius: 2px; background: ${C}; opacity: 0; }
[data-scene="links"] .reg { position: absolute; left: 26px; right: 26px; top: 354px; height: 64px; border-radius: 18px; background: ${C}; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 650; }
[data-scene="links"] .cover { position: absolute; left: 0; right: 0; top: 200px; bottom: 0; background: #fff; }
[data-scene="links"] .done { display: flex; position: absolute; left: 0; right: 0; top: 300px; flex-direction: column; align-items: center; }
[data-scene="links"] .okc { width: 120px; height: 120px; border-radius: 50%; background: ${C}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 14px ${tint(16)}; }
[data-scene="links"] .okt { margin-top: 36px; font-size: 34px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="links"] .oks { margin-top: 6px; font-size: 22px; font-weight: 500; color: var(--ink-3); }

[data-scene="links"] .stats { position: absolute; left: 0; top: 600px; width: ${PW}px; height: 330px; overflow: hidden; }
[data-scene="links"] .sh { position: absolute; left: 24px; right: 24px; top: 22px; display: flex; align-items: center; gap: 12px; font-size: 26px; font-weight: 700; letter-spacing: -0.01em; }
[data-scene="links"] .sm { margin-left: auto; font-size: 21px; font-weight: 500; color: var(--ink-3); }
[data-scene="links"] .kpi { position: absolute; top: 82px; width: 180px; }
[data-scene="links"] .kn { position: relative; height: 58px; }
[data-scene="links"] .roll { position: absolute; left: 0; top: 0; height: 58px; width: 130px; overflow: hidden; font-size: 50px; font-weight: 800; letter-spacing: -0.03em; line-height: 58px;
  font-variant-numeric: tabular-nums; }
[data-scene="links"] .roll span { position: absolute; left: 0; top: 0; }
[data-scene="links"] .kl { display: flex; align-items: center; gap: 8px; margin-top: 6px; font-size: 20px; font-weight: 550; color: var(--ink-3); }
[data-scene="links"] .plus { position: absolute; left: 104px; top: 4px; height: 34px; padding: 0 12px; border-radius: 999px; background: ${tint(16)}; color: #047857;
  display: inline-flex; align-items: center; font-size: 20px; font-weight: 750; }
@keyframes lk-out { to { opacity: 0; transform: translateY(-100%); } }
@keyframes lk-in { from { opacity: 0; transform: translateY(100%); } }
@keyframes lk-plus { 0% { opacity: 0; transform: translateY(10px) scale(0.7); } 18% { opacity: 1; transform: none; } 70% { opacity: 1; transform: translateY(-4px); } 100% { opacity: 0; transform: translateY(-18px); } }
[data-scene="links"] .lk-out { animation: lk-out 380ms var(--e-accel) var(--d) both; }
[data-scene="links"] .lk-in { animation: lk-in 520ms var(--e-decel) var(--d) both; }
[data-scene="links"] .lk-plus { animation: lk-plus 1500ms var(--e-std) var(--d) both; }
[data-scene="links"] .rows { position: absolute; left: 16px; right: 16px; top: 214px; height: 96px; overflow: hidden; border-radius: 20px; }
[data-scene="links"] .row { position: absolute; left: 0; right: 0; top: 0; height: 96px; padding: 0 16px 0 14px; border-radius: 20px; display: flex; align-items: center; gap: 14px; }
[data-scene="links"] .row.old { background: var(--surface-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.06); }
[data-scene="links"] .row.new { background: ${tint(9)}; box-shadow: inset 0 0 0 2px ${tint(30)}; }
[data-scene="links"] .rn { font-size: 24px; font-weight: 700; letter-spacing: -0.01em; }
[data-scene="links"] .rs { margin-top: 2px; font-size: 20px; font-weight: 550; color: var(--ink-3); }
[data-scene="links"] .rs b { color: #047857; font-weight: 700; }
[data-scene="links"] .now { margin-left: auto; align-self: flex-start; margin-top: 16px; font-size: 20px; font-weight: 600; color: #047857; }
@keyframes lk-down { to { opacity: 0; transform: translateY(70px) scale(0.96); } }
@keyframes lk-drop { from { opacity: 0; transform: translateY(-96px); } }
[data-scene="links"] .lk-down { animation: lk-down 420ms var(--e-accel) var(--d) both; }
[data-scene="links"] .lk-drop { animation: lk-drop 560ms var(--e-decel) var(--d) both; }

[data-scene="links"] .fx { position: absolute; z-index: 20; animation: lk-fx ${FLY}ms cubic-bezier(0.5, 0, 0.25, 1) var(--d) both; }
[data-scene="links"] .fy { display: block; animation: lk-fy ${FLY}ms cubic-bezier(0.1, 0, 0.5, 1) var(--d) both; }
[data-scene="links"] .fo { display: block; animation: lk-fo ${FLY}ms linear var(--d) both; }
[data-scene="links"] .fo .avatar { box-shadow: 0 0 0 4px #fff, 0 16px 30px -10px rgba(0,60,40,0.5); }
@keyframes lk-fx { from { transform: translateX(var(--fx)); } }
@keyframes lk-fy { from { transform: translateY(var(--fy)); } }
@keyframes lk-fo { 0% { opacity: 0; transform: scale(0.6); } 14% { opacity: 1; transform: scale(1.25); } 85% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1); } }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Посилання", line: "Одне посилання чи QR-код — і реєстрація вже в системі." })}
  <div class="vis"><div class="mock">
    ${poster()}
    ${panel()}
    ${phone()}
    ${flyer}
    ${CLICKS.map(([t, x, y]) => TV.tap(x, y, t, C)).join("")}
    ${TV.cursor("Тарас", C, "lk-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      const n = Math.round(NAME.length * TV.clamp((t - T.t0) / (T.t1 - T.t0)));
      const s = NAME.slice(0, n);
      const ty = el.querySelector(".ty");
      if (ty && ty.textContent !== s) ty.textContent = s;
      const focus = TV.prog(t, T.field, T.field + 160, TV.ease.decel) * (1 - TV.prog(t, T.reg - 40, T.reg + 120, TV.ease.accel));
      const ring = el.querySelector(".ring");
      if (ring) ring.style.opacity = String(focus);
      const caret = el.querySelector(".caret");
      const blink = t < T.t1 + 40 ? 1 : (Math.floor((t - T.t1) / 420) % 2 ? 0 : 1);
      if (caret) caret.style.opacity = t >= T.field && t < T.reg ? String(blink) : "0";
      const k = CLICKS.map(([ct, x, y]) => [ct, x - 10, y - 6]);
      TV.moveCursor(el.querySelector("#lk-cur"), t, {
        keys: [
          [T.open - 700, k[0][1] + 60, k[0][2] + 170],
          [T.open - 40, k[0][1], k[0][2]],
          [T.open + 200, k[0][1], k[0][2]],
          [T.open + 900, k[1][1] + 30, k[1][2] + 120],
          [T.reg - 40, k[1][1], k[1][2]],
          [T.reg + 80, k[1][1], k[1][2]],
          [T.reg + 520, k[1][1] + 60, k[1][2] + 300],
        ],
        show: [T.open - 700, T.reg + 420],
        clicks: CLICKS.map((c) => c[0]),
      });
    },
  });
})();
