/* Оргструктура — схема команди церкви (content/modules/hr.ts → org.mock).
   Від пастора вниз проростає хребет, гілка за гілкою на ньому з'являються
   відділи з керівниками. Новенький Марко питає в пошуку «Хто відповідає за
   дитяче служіння?» — схема гасить решту й веде лінією до Наталі Рудь. */
// icons: search, users, music, baby, hand-heart, sliders-horizontal, briefcase
(function () {
  const A = "#7c5cf0";
  const W = 900, H = 812, PAD = 24;
  const SX = W / 2, GX = 36, CW = (W - PAD * 2 - GX * 2) / 2, CH = 140, RG = 20;
  const ROOT_Y = 196, ROOT_H = 92, ROOT_B = ROOT_Y + ROOT_H;
  const rowY = (r) => 328 + r * (CH + RG);
  const cy = (r) => rowY(r) + CH / 2;
  const DEPTS = [
    { name: "Прославлення", who: "Олена Ковальчук", n: 14, icon: "music", c: "#f05b8b", row: 0, side: 0 },
    { name: "Малі групи", who: "Андрій Мельник", n: 23, icon: "users", c: "#12a150", row: 0, side: 1 },
    { name: "Дитяче служіння", who: "Наталя Рудь", n: 11, icon: "baby", c: "#f59e0b", row: 1, side: 0, hit: true },
    { name: "Зустріч гостей", who: "Василь Панченко", n: 6, icon: "hand-heart", c: "#0ea5e9", row: 1, side: 1 },
    { name: "Технічна команда", who: null, n: 4, icon: "sliders-horizontal", c: "#64748b", row: 2, side: 0 },
    { name: "Адміністрація", who: "Ірина Шевчук", n: 3, icon: "briefcase", c: "#0069e0", row: 2, side: 1 },
  ];
  // Хребет росте трьома відрізками — до кожного ряду відділів.
  const SEG = [[800, 320], [1380, 340], [1960, 340]];
  const segY = [ROOT_B, cy(0), cy(1), cy(2)];
  const stubAt = (d) => SEG[d.row][0] + SEG[d.row][1] + d.side * 130;
  const CLICK = 3300, TYPE0 = 3440, TYPE1 = 4560, RES = 4760;
  const Q = "Хто відповідає за дитяче служіння?";
  const SEARCH = { x: 640, y: 136 };
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;

  function dept(d) {
    const x = d.side ? SX + GX : PAD;
    const at = stubAt(d);
    const lead = d.who
      ? `<span class="av">${d.hit ? `<i class="halo" style="--d:${RES + 700}ms"></i>` : ""}${TV.avatar(d.who, 52)}</span>
         <span class="nm"><b>${TV.esc(d.who)}</b><span>керівник</span></span>`
      : `<span class="av vac-av">?</span><span class="nm"><b class="vac">Вакансія</b><span>керівник</span></span>`;
    return `
<div class="dept ${d.side ? "a-left" : "a-right"}" style="left:${x}px;top:${rowY(d.row)}px;width:${CW}px;height:${CH}px;--d:${at + 70}ms">
  <div class="top"><span class="dn">${TV.esc(d.name)}</span>
    <span class="badge" style="background:${tint(d.c, 14)};color:${d.c}">${TV.icon(d.icon, 24, "currentColor", 2.2)}</span></div>
  <div class="bot">${lead}<span class="cnt">${TV.icon("users", 22, "currentColor", 2.2)}${d.n}</span></div>
  ${d.hit ? `<i class="ring" style="--d:${RES + 620}ms"></i>` : `<i class="veil a-fade" style="--d:${RES}ms"></i>`}
</div>`;
  }

  function stub(d) {
    const y = cy(d.row) - 1.5, at = stubAt(d);
    const x = d.side ? SX : PAD + CW;
    return `<i class="ln h ${d.side ? "r" : "l"}" style="left:${x}px;top:${y}px;width:${GX}px;--d:${at}ms"></i>`;
  }

  const hit = DEPTS.find((d) => d.hit);

  TV.scene({
    id: "org",
    dur: 8200,
    bg: "light",
    css: `
[data-scene="org"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.0; }
[data-scene="org"] .board { position: absolute; inset: 0; }
[data-scene="org"] .head { position: absolute; left: 0; right: 0; top: 0; height: 80px; display: flex; align-items: center; padding: 0 32px;
  border-bottom: 1px solid var(--hairline); font-size: 27px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="org"] .head .dot { width: 14px; height: 14px; border-radius: 50%; background: ${A}; margin-right: 16px; }
[data-scene="org"] .stat { margin-left: auto; font-size: 24px; font-weight: 500; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-scene="org"] .stat b { color: var(--ink); font-weight: 700; }
[data-scene="org"] .stat .vacs { color: #b45309; font-weight: 600; }
[data-scene="org"] .search { position: absolute; left: ${PAD}px; right: ${PAD}px; top: 100px; height: 72px; border-radius: 20px; background: var(--surface-3);
  display: flex; align-items: center; gap: 16px; padding: 0 24px; color: var(--ink-3); }
[data-scene="org"] .search .focus { position: absolute; inset: 0; border-radius: 20px; background: #fff; box-shadow: inset 0 0 0 3px ${A}, 0 10px 30px -14px ${A}; }
[data-scene="org"] .search .ic { position: relative; }
[data-scene="org"] .search .ph { position: absolute; left: 68px; font-size: 26px; font-weight: 500; }
[data-scene="org"] .typed { position: relative; display: flex; align-items: center; font-size: 27px; font-weight: 600; color: var(--ink); letter-spacing: -0.01em; white-space: pre; }
[data-scene="org"] .caret { display: block; width: 3px; height: 32px; margin-left: 3px; border-radius: 2px; background: ${A}; animation: org-blink 1000ms steps(1) infinite; }
@keyframes org-blink { 50% { opacity: 0; } }
[data-scene="org"] .root { position: absolute; display: flex; align-items: center; gap: 16px; padding: 0 26px 0 16px; border-radius: 999px;
  background: var(--surface); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.09), 0 10px 26px -14px rgba(10,30,70,0.3); }
[data-scene="org"] .root .rr { position: absolute; inset: -4px; border-radius: 999px; box-shadow: 0 0 0 4px ${A}; }
[data-scene="org"] .nm { display: flex; flex-direction: column; line-height: 1.15; min-width: 0; }
[data-scene="org"] .nm b { font-size: 23px; font-weight: 650; letter-spacing: -0.01em; white-space: nowrap; }
[data-scene="org"] .nm span { font-size: 20px; font-weight: 500; color: var(--ink-3); margin-top: 3px; }
[data-scene="org"] .root .nm b { font-size: 26px; }
[data-scene="org"] .ln { position: absolute; display: block; background: rgba(11,11,15,0.16); border-radius: 3px; }
[data-scene="org"] .ln.v { width: 3px; transform-origin: 50% 0; animation: org-y var(--t) cubic-bezier(0.4, 0, 0.6, 1) var(--d) both; }
[data-scene="org"] .ln.h { height: 3px; animation: org-x 300ms var(--e-emph) var(--d) both; }
[data-scene="org"] .ln.h.l, [data-scene="org"] .hl.h { transform-origin: 100% 50%; }
[data-scene="org"] .ln.h.r { transform-origin: 0 50%; }
[data-scene="org"] .jn { position: absolute; width: 13px; height: 13px; border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 3px rgba(11,11,15,0.22); }
[data-scene="org"] .hl { position: absolute; display: block; background: ${A}; border-radius: 4px; z-index: 2; }
[data-scene="org"] .hl.v { width: 5px; transform-origin: 50% 0; animation: org-y 480ms var(--e-emph) var(--d) both; }
[data-scene="org"] .hl.h { height: 5px; animation: org-x 260ms var(--e-emph) var(--d) both; }
[data-scene="org"] .hl.dot { width: 17px; height: 17px; border-radius: 50%; box-shadow: 0 0 0 4px #fff; }
@keyframes org-y { from { transform: scaleY(0); } }
@keyframes org-x { from { transform: scaleX(0); } }
[data-scene="org"] .dept { position: absolute; border-radius: 22px; background: var(--surface-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.09);
  display: flex; flex-direction: column; justify-content: space-between; padding: 18px 20px 18px 22px; }
[data-scene="org"] .dept .top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
[data-scene="org"] .dn { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; white-space: nowrap; }
[data-scene="org"] .badge { flex: none; width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; }
[data-scene="org"] .bot { display: flex; align-items: center; gap: 12px; }
[data-scene="org"] .av { position: relative; flex: none; width: 52px; height: 52px; }
[data-scene="org"] .vac-av { border-radius: 50%; border: 2.5px dashed #d97706; color: #d97706; background: #fff8eb;
  display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; }
[data-scene="org"] .nm b.vac { color: #b45309; }
[data-scene="org"] .cnt { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 23px; font-weight: 650; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-scene="org"] .veil { position: absolute; inset: -3px; border-radius: 24px; background: rgba(255,255,255,0.7); }
[data-scene="org"] .ring { position: absolute; inset: -4px; border-radius: 26px; box-shadow: 0 0 0 4px ${A}, 0 26px 50px -18px rgba(124,92,240,0.55);
  animation: org-ring 700ms var(--e-spring) var(--d) both; }
@keyframes org-ring { from { opacity: 0; transform: scale(1.07); } }
[data-scene="org"] .halo { position: absolute; inset: -5px; border-radius: 50%; border: 3px solid ${A}; animation: org-halo 1500ms var(--e-decel) var(--d) infinite both; }
@keyframes org-halo { 0% { opacity: 0; transform: scale(0.92); } 20% { opacity: 1; } 100% { opacity: 0; transform: scale(1.5); } }
[data-scene="org"] .ans { position: absolute; z-index: 5; display: flex; align-items: center; gap: 18px; padding: 18px 30px 18px 18px; border-radius: 24px;
  background: ${A}; color: #fff; box-shadow: 0 24px 48px -18px rgba(76,48,190,0.6); }
[data-scene="org"] .ans .tip { position: absolute; left: 44px; top: -11px; width: 24px; height: 24px; background: ${A}; transform: rotate(45deg); border-radius: 4px; }
[data-scene="org"] .ans .avatar { box-shadow: 0 0 0 3px rgba(255,255,255,0.6); }
[data-scene="org"] .ans b { display: block; font-size: 28px; font-weight: 750; letter-spacing: -0.015em; }
[data-scene="org"] .ans span { display: block; font-size: 22px; font-weight: 500; color: rgba(255,255,255,0.86); margin-top: 3px; white-space: nowrap; }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Оргструктура", line: "Питання «а хто цим займається?» більше не виникає." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="head"><span class="dot"></span>Команда церкви
        <span class="stat"><b class="n">0</b> у команді · <span class="vacs">3 вакансії</span></span></div>
      <div class="search a-fade" style="--d:520ms">
        <i class="focus a-fade" style="--d:${CLICK}ms"></i>
        ${TV.icon("search", 28, "currentColor", 2.4)}
        <span class="ph a-outf" style="--d:${CLICK}ms">Знайти, хто за що відповідає</span>
        <span class="typed"><span class="q"></span><span class="a-fade" style="--d:${CLICK}ms"><span class="a-outf" style="--d:${RES}ms"><i class="caret"></i></span></span></span>
      </div>
      ${SEG.map(([d, t], i) => `<i class="ln v" style="left:${SX - 1.5}px;top:${segY[i]}px;height:${segY[i + 1] - segY[i]}px;--d:${d}ms;--t:${t}ms"></i>`).join("")}
      ${DEPTS.map(stub).join("")}
      ${SEG.map(([d, t], i) => `<i class="jn a-pop" style="left:${SX - 6.5}px;top:${segY[i + 1] - 6.5}px;--d:${d + t - 40}ms"></i>`).join("")}
      <i class="hl v" style="left:${SX - 2.5}px;top:${ROOT_B}px;height:${cy(hit.row) - ROOT_B}px;--d:${RES}ms"></i>
      <i class="hl h" style="left:${PAD + CW}px;top:${cy(hit.row) - 2.5}px;width:${GX + 2}px;--d:${RES + 440}ms"></i>
      <i class="hl dot a-pop" style="left:${SX - 8.5}px;top:${cy(hit.row) - 8.5}px;--d:${RES + 420}ms"></i>
      <div class="root a-pop" style="left:${SX - 175}px;top:${ROOT_Y}px;width:350px;height:${ROOT_H}px;--d:600ms">
        <i class="rr a-fade" style="--d:${RES}ms"></i>
        ${TV.avatar("Іван", 62)}<span class="nm"><b>Пастор Іван</b><span>старший пастор</span></span>
      </div>
      ${DEPTS.map(dept).join("")}
      <div class="ans a-up" style="left:${PAD - 4}px;top:${rowY(hit.row + 1) - 4}px;height:${CH + 8}px;--d:${RES + 820}ms">
        <i class="tip"></i>
        ${TV.avatar(hit.who, 68)}
        <div><b>${hit.who}</b><span>Керівник дитячого служіння</span><span>Звітує пастору Івану</span></div>
      </div>
    </div>
    ${TV.tap(SEARCH.x, SEARCH.y, CLICK, "#f97316")}
    ${TV.cursor("Марко", "#f97316", "org-c")}
  </div></div>
</div>`,
    tick(t, el) {
      const set = (sel, v) => { const n = el.querySelector(sel); if (n && n.textContent !== String(v)) n.textContent = v; };
      set(".n", TV.count(t, 800, 2600, 0, 46, TV.ease.inout));
      set(".q", Q.slice(0, Math.round(Q.length * TV.prog(t, TYPE0, TYPE1, TV.ease.linear))));
      const tx = SEARCH.x - 10, ty = SEARCH.y - 6;
      TV.moveCursor(el.querySelector("#org-c"), t, {
        keys: [[CLICK - 700, 1000, 720], [CLICK - 40, tx, ty], [TYPE1, tx + 30, ty + 10], [RES + 520, tx + 120, ty + 140]],
        show: [CLICK - 700, RES + 560],
        clicks: [CLICK],
      });
    },
  });
})();
