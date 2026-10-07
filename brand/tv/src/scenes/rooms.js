/* Кімнати — план будівлі згори (content/modules/resources.ts → rooms.mock:
   «Великий зал · Кімната 2 · Дитяча»; mocks: «Недільне служіння · Великий зал»,
   «Зала №3», «Кімната 2 12:00 Основи віри»; «Мала група «Надія»» — з профілю).
   Неділя, 12:00: зал, Кімната 2 і Дитяча зайняті, Зала №3 вільна. Андрій
   тягне картку групи на 13:00 у Кімнату 2 — кімната спалахує червоним
   «Зайнята: Основи віри», Зала №3 світиться зеленим «Вільна 13:00–15:00»,
   він кладе картку туди — і в шапці «Без накладок». */
// icons: clock, check
(function () {
  const A = "#8b5e3c", RED = "#e5484d", GREEN = "#12a150";
  const W = 880, H = 790;
  const X0 = 36, X1 = 844, Y0 = 100, Y1 = 760, HX = 366, CX = 446;
  const R = {
    hall: { x: X0, y: Y0, w: HX - X0, h: Y1 - Y0, c: "#0069e0" },
    kids: { x: CX, y: 100, w: X1 - CX, h: 220, c: "#f05b8b" },
    z3: { x: CX, y: 320, w: X1 - CX, h: 220 },
    r2: { x: CX, y: 540, w: X1 - CX, h: 220, c: "#8b5bf0" },
  };
  const T = { hall: 1400, kids: 1700, r2: 2000, free: 2300, drag: 3000, hover: 4000, suggest: 5500, move: 6300, drop: 7000, chip: 8500 };
  const CARD = { w: 330, h: 80 };
  const P0 = { x: 880, y: 900 }, PR = { x: CX + 50, y: R.r2.y + 130 }, PZ = { x: CX + 50, y: R.z3.y + 130 };
  const GRAB = { x: 150, y: 74 };
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const deep = (c) => `color-mix(in oklab, ${c} 76%, #0b0b0f)`;
  const at = (x, y, extra = "") => `left:${x}px;top:${y}px;${extra}`;
  // Шар, що з'являється в мить a і гасне в мить b (два вкладені примітиви).
  const span = (a, b, inner, cls = "") =>
    `<div class="a-fade ${cls}" style="--d:${a}ms"><div class="a-outf" style="--d:${b}ms">${inner}</div></div>`;
  const face = (who, x, y, d, size = 32) =>
    `<span class="face a-pop" style="${at(x - size / 2, y - size / 2)}--d:${d}ms">${TV.avatar(who, size)}</span>`;

  // ─── великий зал: сцена, два блоки крісел, люди на місцях
  const CH = { w: 30, h: 16, gx: 10, py: 31, rows: 10, cols: 3, aisle: 36, y: 200 };
  const blockW = CH.cols * CH.w + (CH.cols - 1) * CH.gx;
  const cx0 = X0 + (R.hall.w - (blockW * 2 + CH.aisle)) / 2;
  const chairX = (b, c) => cx0 + b * (blockW + CH.aisle) + c * (CH.w + CH.gx);
  const chairY = (r) => CH.y + r * CH.py;
  let chairs = "";
  for (let b = 0; b < 2; b++) for (let r = 0; r < CH.rows; r++) for (let c = 0; c < CH.cols; c++)
    chairs += `<i class="chair" style="${at(chairX(b, c), chairY(r))}width:${CH.w}px;height:${CH.h}px"></i>`;
  const SEATED = [[0, 1, 0, "Олена"], [1, 2, 0, "Дмитро"], [0, 2, 2, "Оксана"], [1, 0, 3, "Марко"], [0, 0, 5, "Ірина"], [1, 2, 5, "Василь"], [0, 1, 7, "Наталя"], [1, 1, 8, "Павло"]];
  const hallFaces = SEATED.map(([b, c, r, who], i) => face(who, chairX(b, c) + CH.w / 2, chairY(r) + CH.h / 2, T.hall + 120 + i * 50, 30)).join("");

  // ─── кімнати праворуч: меблі й обличчя
  const zc = (i) => ({ x: 664 + (i % 5) * 36, y: R.z3.y + 146 + Math.floor(i / 5) * 34 });
  const z3Chairs = Array.from({ length: 10 }, (_, i) => `<i class="chair" style="${at(zc(i).x, zc(i).y)}width:26px;height:15px"></i>`).join("");
  const r2Table = `<i class="table" style="${at(696, R.r2.y + 126)}width:138px;height:42px"></i>`;
  const r2Faces = face("Софія", 718, R.r2.y + 106, T.r2 + 150) + face("Павло", 765, R.r2.y + 106, T.r2 + 200) + face("Марія", 812, R.r2.y + 106, T.r2 + 250)
    + face("Тимофій", 765, R.r2.y + 188, T.r2 + 300);
  const KT = [654, 734, 814];
  const kidsTables = KT.map((x) => `<i class="table round" style="${at(x - 18, R.kids.y + 154)}width:36px;height:36px"></i>`).join("");
  const kidsFaces = KT.map((x, i) => face(["Софія", "Тимофій", "Марія"][i], x - 30, R.kids.y + 172, T.kids + 150 + i * 60, 28)).join("");
  const z3Faces = [[0, "Андрій"], [2, "Олена"], [6, "Марко"]].map(([i, who], k) => face(who, zc(i).x + 13, zc(i).y + 7, T.drop + 260 + k * 60, 30)).join("");

  // ─── стіни (одна лінія навколо будівлі + внутрішні з прорізами-дверима)
  const DOORS = [
    { x: HX, a: 600, b: 660, dir: -1 },
    { x: CX, a: 250, b: 305, dir: 1 },
    { x: CX, a: 470, b: 525, dir: 1 },
    { x: CX, a: 690, b: 745, dir: 1 },
  ];
  const walls = `
<path class="draw" pathLength="1" style="--d:400ms;--t:1100ms" stroke-width="10" stroke-linejoin="miter" d="M434 ${Y1} H${X1} V${Y0} H${X0} V${Y1} H378"/>
<path class="draw" pathLength="1" style="--d:900ms" stroke-width="6" d="M${HX} ${Y0} V600 M${HX} 660 V${Y1}"/>
<path class="draw" pathLength="1" style="--d:1000ms" stroke-width="6" d="M${CX} ${Y0} V250 M${CX} 305 V470 M${CX} 525 V690 M${CX} 745 V${Y1}"/>
<path class="draw" pathLength="1" style="--d:1100ms" stroke-width="6" d="M${CX} 320 H${X1} M${CX} 540 H${X1}"/>`;
  const doors = DOORS.map((d) => {
    const r = d.b - d.a, ex = d.x + d.dir * r;
    return `<path d="M${d.x} ${d.b} L${ex} ${d.b} M${d.x} ${d.a} A${r} ${r} 0 0 ${d.dir > 0 ? 1 : 0} ${ex} ${d.b}"/>`;
  }).join("");

  const fill = (r, d, c, p = 12) => `<i class="fill a-fade" style="${at(r.x + 4, r.y + 4)}width:${r.w - 8}px;height:${r.h - 8}px;background:${tint(c, p)};--d:${d}ms"></i>`;
  const book = (c, name, time) => `<b style="color:${deep(c)}">${name}</b><span>${time}</span>`;
  const rx = CX + 30;

  TV.scene({
    id: "rooms",
    dur: 11600,
    bg: "light",
    css: `
[data-scene="rooms"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
[data-scene="rooms"] .board { position: absolute; inset: 0; }
[data-scene="rooms"] .head { position: absolute; left: 0; right: 0; top: 0; height: 80px; display: flex; align-items: center; gap: 12px; padding: 0 28px 0 32px;
  border-bottom: 1px solid var(--hairline); font-size: 27px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="rooms"] .head .dot { width: 14px; height: 14px; border-radius: 50%; background: ${A}; margin-right: 4px; }
[data-scene="rooms"] .clean { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 18px 0 12px; border-radius: 999px;
  background: ${GREEN}; color: #fff; font-size: 22px; font-weight: 650; }
[data-scene="rooms"] .clock { display: inline-flex; align-items: center; gap: 10px; height: 46px; padding: 0 18px 0 14px; border-radius: 999px;
  background: var(--surface-3); font-size: 23px; font-weight: 650; color: var(--ink); font-variant-numeric: tabular-nums; }
[data-scene="rooms"] .clean + .clock { margin-left: 0; }
[data-scene="rooms"] .head .sp { margin-left: auto; }
[data-scene="rooms"] .floor { position: absolute; left: ${X0}px; top: ${Y0}px; width: ${X1 - X0}px; height: ${Y1 - Y0}px; background: #fbfbfc; }
[data-scene="rooms"] .fill { position: absolute; display: block; }
[data-scene="rooms"] .chair { position: absolute; display: block; border-radius: 4px; background: rgba(11,11,15,0.13); }
[data-scene="rooms"] .table { position: absolute; display: block; border-radius: 10px; background: #fff; box-shadow: inset 0 0 0 2.5px rgba(11,11,15,0.2); }
[data-scene="rooms"] .table.round { border-radius: 50%; }
[data-scene="rooms"] .stg { position: absolute; left: ${X0 + 30}px; top: ${Y0 + 22}px; width: ${R.hall.w - 60}px; height: 50px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
  background: ${tint(R.hall.c, 20)}; color: ${deep(R.hall.c)}; }
[data-scene="rooms"] svg.walls { position: absolute; left: 0; top: 0; overflow: visible; }
[data-scene="rooms"] svg.walls path { fill: none; stroke: #3b4250; }
[data-scene="rooms"] svg.walls .doors path { stroke: #9aa3b2; stroke-width: 2; }
[data-scene="rooms"] .draw { stroke-dasharray: 1; animation: rm-draw var(--t, 700ms) var(--e-emph) var(--d) both; }
@keyframes rm-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
[data-scene="rooms"] .face { position: absolute; display: block; }
[data-scene="rooms"] .face .avatar { box-shadow: 0 0 0 2.5px #fff; }
[data-scene="rooms"] .rn { position: absolute; font-size: 29px; font-weight: 750; letter-spacing: -0.02em; white-space: nowrap; }
[data-scene="rooms"] .rn.big { font-size: 34px; }
[data-scene="rooms"] .lab { position: absolute; display: flex; flex-direction: column; gap: 2px; white-space: nowrap; }
[data-scene="rooms"] .lab b { font-size: 23px; font-weight: 700; letter-spacing: -0.01em; }
[data-scene="rooms"] .lab span { font-size: 21px; font-weight: 550; color: var(--ink-2); font-variant-numeric: tabular-nums; }
[data-scene="rooms"] .lab.big b { font-size: 26px; }
[data-scene="rooms"] .lab .free { font-size: 23px; font-weight: 650; color: ${GREEN}; }
[data-scene="rooms"] .lab.red b, [data-scene="rooms"] .lab.red span { color: #c4262c; }
[data-scene="rooms"] .lab.red b { font-size: 25px; font-weight: 800; }
[data-scene="rooms"] .lab.green b { font-size: 25px; font-weight: 800; color: #0d7a3d; }
[data-scene="rooms"] .lab.green span { color: #0d7a3d; font-weight: 650; }
[data-scene="rooms"] .alarm { position: absolute; left: ${R.r2.x + 4}px; top: ${R.r2.y + 4}px; width: ${R.r2.w - 8}px; height: ${R.r2.h - 8}px;
  background: rgba(229,72,77,0.13); box-shadow: inset 0 0 0 4px ${RED}; animation: rm-flash 900ms var(--e-std) ${T.hover}ms both; }
@keyframes rm-flash { 0% { opacity: 0; } 18% { opacity: 1; background: rgba(229,72,77,0.3); } 40% { opacity: 0.75; } 60% { opacity: 1; background: rgba(229,72,77,0.26); } 100% { opacity: 1; } }
[data-scene="rooms"] .glow { position: absolute; left: ${R.z3.x + 4}px; top: ${R.z3.y + 4}px; width: ${R.z3.w - 8}px; height: ${R.z3.h - 8}px;
  background: rgba(18,161,80,0.1); box-shadow: inset 0 0 0 4px ${GREEN}; }
[data-scene="rooms"] .ping { position: absolute; left: ${R.z3.x + 4}px; top: ${R.z3.y + 4}px; width: ${R.z3.w - 8}px; height: ${R.z3.h - 8}px; border-radius: 6px;
  box-shadow: 0 0 0 4px ${GREEN}; animation: rm-ping 900ms var(--e-decel) ${T.suggest}ms 2 both; }
@keyframes rm-ping { 0% { opacity: 0; transform: scale(1); } 20% { opacity: 0.9; } 100% { opacity: 0; transform: scale(1.08); } }
[data-scene="rooms"] .shake { animation: rm-shake 520ms linear ${T.hover}ms both; }
@keyframes rm-shake { 15% { transform: translateX(-8px); } 35% { transform: translateX(8px); } 55% { transform: translateX(-6px); } 75% { transform: translateX(4px); } }
[data-scene="rooms"] .in { position: absolute; font-size: 20px; font-weight: 600; color: var(--ink-3); left: ${HX + 8}px; width: ${CX - HX - 16}px; text-align: center; top: ${Y1 - 42}px; }
[data-scene="rooms"] .nb { position: absolute; left: 0; top: 0; z-index: 20; width: ${CARD.w}px; height: ${CARD.h}px; }
[data-scene="rooms"] .nb .cd { position: absolute; inset: 0; border-radius: 16px; background: #fff; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 22px;
  box-shadow: 0 0 0 1px var(--hairline-strong), 0 22px 40px -14px rgba(60,30,10,0.5); }
[data-scene="rooms"] .nb .cd::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 7px; border-radius: 16px 0 0 16px; background: ${A}; }
[data-scene="rooms"] .nb .tx { position: relative; display: flex; flex-direction: column; line-height: 1.15; white-space: nowrap; }
[data-scene="rooms"] .nb b { font-size: 22px; font-weight: 700; color: ${deep(A)}; }
[data-scene="rooms"] .nb .tx span { font-size: 20px; font-weight: 600; color: var(--ink-2); font-variant-numeric: tabular-nums; }
[data-scene="rooms"] .nb .bad { position: absolute; inset: 0; border-radius: 16px; box-shadow: inset 0 0 0 3px ${RED}; }
`,
    html: () => `
<div class="split flip">
  ${TV.copy({ title: "Кімнати", line: "Зал не буває зайнятий двома групами одночасно." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="head"><span class="dot"></span>План приміщень<span class="sp"></span>
        <span class="clean a-pop" style="--d:${T.chip}ms">${TV.icon("check", 22, "#fff", 3)}Без накладок</span>
        <span class="clock a-fade" style="--d:600ms">${TV.icon("clock", 24, "currentColor", 2.3)}Нд · 12:00</span></div>
      <div class="floor a-fade" style="--d:420ms"></div>
      ${fill(R.hall, T.hall, R.hall.c, 9)}${fill(R.r2, T.r2, R.r2.c)}${fill(R.kids, T.kids, R.kids.c)}
      <i class="fill a-fade" style="${at(R.z3.x + 4, R.z3.y + 4)}width:${R.z3.w - 8}px;height:${R.z3.h - 8}px;background:${tint(A, 14)};--d:${T.drop}ms"></i>
      ${span(T.suggest, T.drop, `<i class="glow"></i>`)}
      <i class="ping"></i>
      ${span(T.hover, T.move, `<i class="alarm"></i>`)}
      <div class="a-fade" style="--d:800ms">
        <div class="stg">Сцена</div>
        ${chairs}${z3Chairs}
      </div>
      <div class="a-fade" style="--d:${T.r2}ms">${r2Table}</div><div class="a-fade" style="--d:${T.kids}ms">${kidsTables}</div>
      <svg class="walls" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        ${walls}<g class="doors a-fade" style="--d:1300ms">${doors}</g></svg>
      <span class="in a-fade" style="--d:1300ms">Вхід</span>
      ${hallFaces}${r2Faces}${kidsFaces}${z3Faces}

      <span class="rn big a-up" style="${at(X0 + 30, 540)}--d:900ms">Великий зал</span>
      <div class="lab big a-up" style="${at(X0 + 30, 588)}--d:${T.hall}ms">${book(R.hall.c, "Служіння", "10:00–13:00")}</div>

      <span class="rn a-up" style="${at(rx, R.z3.y + 22)}--d:980ms">Зала №3</span>
      ${span(T.free, T.suggest, `<div class="lab" style="${at(rx, R.z3.y + 66)}"><b class="free">вільна</b></div>`)}
      ${span(T.suggest, T.drop, `<div class="lab green" style="${at(rx, R.z3.y + 66)}"><b>Вільна</b><span>13:00–15:00</span></div>`)}
      <div class="lab a-down" style="${at(rx, R.z3.y + 66)}--d:${T.drop + 80}ms">${book(A, "Мала група «Надія»", "13:00–15:00")}</div>

      <span class="rn a-up" style="${at(rx, R.r2.y + 22)}--d:1040ms">Кімната 2</span>
      <div class="shake" style="position:absolute;left:0;top:0">
        ${span(T.r2, T.hover, `<div class="lab" style="${at(rx, R.r2.y + 66)}">${book(R.r2.c, "Основи віри", "12:00–14:00")}</div>`)}
        ${span(T.hover, T.move, `<div class="lab red" style="${at(rx, R.r2.y + 66)}"><b>Зайнята:</b><span>Основи віри</span></div>`)}
        <div class="lab a-fade" style="${at(rx, R.r2.y + 66)}--d:${T.move}ms">${book(R.r2.c, "Основи віри", "12:00–14:00")}</div>
      </div>

      <span class="rn a-up" style="${at(rx, R.kids.y + 22)}--d:1100ms">Дитяча</span>
      <div class="lab a-up" style="${at(rx, R.kids.y + 66)}--d:${T.kids}ms">${book(R.kids.c, "Дитяче служіння", "10:00–13:00")}</div>

      <div class="nb" id="rm-nb" style="opacity:0"><div class="cd">
        ${span(T.hover, T.move, `<i class="bad"></i>`)}
        ${TV.avatar("Андрій", 40)}<span class="tx"><b>Мала група «Надія»</b><span>13:00–15:00</span></span>
      </div></div>
    </div>
    ${TV.tap(PZ.x + GRAB.x, PZ.y + GRAB.y, T.drop, "#f97316")}
    ${TV.cursor("Андрій", "#f97316", "rm-c")}
  </div></div>
</div>`,
    tick(t, el) {
      // Картка в руці Андрія: летить до Кімнати 2, здригається «ні», переїжджає в Залу №3 і тоне в ній.
      let p;
      if (t < T.hover) p = TV.path(t, [[T.drag, P0.x, P0.y], [T.hover, PR.x, PR.y]]);
      else if (t < T.move) p = { x: PR.x, y: PR.y };
      else p = TV.path(t, [[T.move, PR.x, PR.y], [T.drop, PZ.x, PZ.y]]);
      const k = TV.clamp((t - T.hover) / 520);
      const shake = k > 0 && k < 1 ? 9 * Math.sin(k * Math.PI * 6) * (1 - k) : 0;
      const lift = Math.max(1 - TV.prog(t, T.hover - 200, T.hover + 60, TV.ease.decel), TV.prog(t, T.move, T.move + 200) * (1 - TV.prog(t, T.drop - 200, T.drop + 40)));
      const sink = TV.prog(t, T.drop + 60, T.drop + 420, TV.ease.accel);
      const b = el.querySelector("#rm-nb");
      if (b) {
        b.style.opacity = String(TV.prog(t, T.drag, T.drag + 240, TV.ease.decel) * (1 - sink));
        b.style.transform = `translate3d(${p.x + shake}px, ${p.y}px, 0) rotate(${-3 * lift}deg) scale(${1 + 0.03 * lift - 0.08 * sink})`;
      }
      const g = (q) => [q.x + GRAB.x - 10, q.y + GRAB.y - 6];
      TV.moveCursor(el.querySelector("#rm-c"), t, {
        keys: [[T.drag, ...g(P0)], [T.hover, ...g(PR)], [T.move, ...g(PR)], [T.drop, ...g(PZ)], [T.drop + 520, PZ.x + GRAB.x + 30, PZ.y + GRAB.y + 90]],
        show: [T.drag, T.drop + 580],
        clicks: [T.drop],
      });
    },
  });
})();
