/* Кастомізація — «система підлаштується під вас» (той самий сюжет і копія, що в блоці
   на головній: src/components/sections/customization.tsx, i18n.ts → customization).
   Від малих до великих: курсор тягне повзунок «Розмір церкви» 40 → 200 → 1 200 людей, і на
   кожній зупинці картинка інша: коло облич довкола «Домашньої групи» → три служіння → три
   кемпуси-натовпи. Зліва модулі розгортаються 3 → 5 → 8, «Домашні групи» стають «Малі групи» —
   система росте разом із церквою.
   Усе, що рухається разом із повзунком, ставить tick() (лише style/textContent). */
// icons: users, building-2, flame, house, ticket, network, calculator, door-open
(function () {
  const W = 880, H = 700;
  const CUR = "#7c3aed";

  // ── час: кожна зупинка тримається ≥ 2 с
  const ENTER = 2700, GRAB1 = 3500, D1 = [3700, 5300], GRAB2 = 7900, D2 = [8000, 9600], OUT = 10400;
  const DUR = 14000;

  // ── повзунок (координати картки)
  const TX0 = 48, TW = 752, TY = 152;
  const thumbX = (p) => TX0 + p * TW;
  const pAt = (t) => {
    if (t < D1[0]) return 0;
    if (t < D1[1]) return 0.5 * TV.prog(t, D1[0], D1[1], TV.ease.inout);
    if (t < D2[0]) return 0.5;
    return 0.5 + 0.5 * TV.prog(t, D2[0], D2[1], TV.ease.inout);
  };
  // Логарифмічна шкала як на сайті: 1 200 → 200 → 40, кругло до 5/10/50.
  const peopleAt = (p) => {
    const v = 40 * Math.pow(30, p);
    const step = v >= 200 ? 50 : v >= 100 ? 10 : 5;
    return Math.round(v / step) * step;
  };
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // ── церква: 84 крапки, що перебудовуються між трьома розкладками
  const CX0 = 284, CXW = W - CX0, CY = 440;
  const XB = [0.18, 0.5, 0.82].map((f) => CX0 + f * CXW);
  const XM = [0.19, 0.5, 0.81].map((f) => CX0 + f * CXW);
  const RB = 82, RM = 56, NB = 28, NM = 12, NF = 8, DOTS = NB * 3, BASE = 80;
  const RING = { x: CX0 + CXW / 2, y: CY + 20, rx: 190, ry: 150 };
  const sun = (i, n, r) => { const rr = r * Math.sqrt((i + 0.5) / n), a = i * 2.39996; return [rr * Math.cos(a), rr * Math.sin(a)]; };
  const layout = (size, d) => {
    const cl = d % 3, k = Math.floor(d / 3);
    if (size === 0) { const [dx, dy] = sun(k, NB, RB); return { x: XB[cl] + dx, y: CY + dy, s: 20, o: 1 }; }
    if (size === 1) {
      if (k >= NM) return { x: XM[cl], y: CY, s: 0, o: 0 };
      const [dx, dy] = sun(k, NM, RM); return { x: XM[cl] + dx, y: CY + dy, s: 26, o: 1 };
    }
    if (d >= NF) return { x: RING.x, y: RING.y, s: 0, o: 0 };
    const a = (d / NF) * Math.PI * 2 - Math.PI / 2;
    return { x: RING.x + Math.cos(a) * RING.rx, y: RING.y + Math.sin(a) * RING.ry, s: BASE, o: 1 };
  };
  const L = [0, 1, 2].map((s) => Array.from({ length: DOTS }, (_, d) => layout(s, d)));
  const FACES = ["Оксана", "Марія", "Тарас", "Ніна", "Петро", "Софія", "Андрій", "Олена"];

  const SIZES = [
    { label: "Велика церква", clusters: ["Кемпус Центр", "Кемпус Схід", "Кемпус Захід"], xs: XB, y: CY + RB + 46 },
    { label: "Середня церква", clusters: ["Діти", "Молодь", "Прославлення"], xs: XM, y: CY + RM + 46 },
    { label: "Мала церква", clusters: ["Домашня група"] },
  ];

  // ── модулі збоку: у середній лишається 5, у малій — 3
  const MODS = [
    ["people", "Люди", "users", "#0ea5e9"], ["campuses", "Кемпуси", "building-2", "#0f766e"],
    ["ministries", "Служіння", "flame", "#f97316"], ["groups", "Малі групи", "house", "#0d9488"],
    ["events", "Події", "ticket", "#f59e0b"], ["org", "Оргструктура", "network", "#7c5cf0"],
    ["accounting", "Бухгалтерія", "calculator", "#059669"], ["rooms", "Кімнати", "door-open", "#8b5e3c"],
  ];
  const ON_MID = new Set(["people", "ministries", "groups", "events", "accounting"]);
  const ON_SMALL = new Set(["people", "groups", "events"]);
  const ROWH = 56;

  const cursor = {
    keys: [[ENTER, 300, 800], [GRAB1 - 40, thumbX(0) - 10, TY - 6], [D1[0], thumbX(0) - 10, TY - 6], [D1[1], thumbX(0.5) - 10, TY - 6],
      [D2[0], thumbX(0.5) - 10, TY - 6], [D2[1], thumbX(1) - 10, TY - 6], [D2[1] + 200, thumbX(1) - 10, TY - 6], [OUT, 1000, 780]],
    show: [ENTER, OUT + 60], clicks: [GRAB1, GRAB2],
  };

  const X = `[data-scene="customization"]`;
  TV.scene({
    id: "customization",
    dur: DUR,
    bg: "light",
    css: `
${X} .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
${X} .win { position: absolute; inset: 0; overflow: hidden; }
${X} .top { position: absolute; left: 0; right: 0; top: 0; height: 222px; border-bottom: 1px solid var(--hairline); }
${X} .cap { position: absolute; left: 48px; top: 26px; font-size: 22px; font-weight: 600; color: var(--ink-3); }
${X} .sz { position: absolute; left: 48px; top: 58px; font-size: 44px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; white-space: nowrap; }
${X} .cnt { position: absolute; right: 48px; top: 38px; display: flex; align-items: baseline; gap: 12px; white-space: nowrap; }
${X} .cnt b { font-size: 66px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
${X} .cnt span { font-size: 28px; font-weight: 600; color: var(--ink-2); }
${X} .trk { position: absolute; left: ${TX0}px; top: ${TY - 6}px; width: ${TW}px; height: 12px; border-radius: 6px; background: var(--hairline-strong); }
${X} .fill { position: absolute; left: 0; top: 0; bottom: 0; width: ${TW}px; border-radius: 6px; background: var(--brand); transform-origin: 0 50%; }
${X} .th { position: absolute; left: 0; top: ${TY - 24}px; width: 48px; height: 48px; margin-left: -24px; }
${X} .th i { position: absolute; inset: -10px; border-radius: 50%; background: rgba(0, 105, 224, 0.18); opacity: 0; }
${X} .th b { position: absolute; inset: 0; border-radius: 50%; background: #fff; border: 7px solid var(--brand); box-shadow: 0 6px 14px -4px rgba(0,0,0,0.35); }
${X} .ends { position: absolute; left: ${TX0}px; width: ${TW}px; top: ${TY + 26}px; display: flex; justify-content: space-between; font-size: 22px; font-weight: 600; color: var(--ink-3); }
${X} .side { position: absolute; left: 0; top: 222px; bottom: 0; width: ${CX0}px; background: var(--surface-2); border-right: 1px solid var(--hairline); padding: 14px 14px 0; }
${X} .md { position: relative; overflow: hidden; height: ${ROWH}px; }
${X} .md > div { position: absolute; left: 0; right: 0; top: 0; height: ${ROWH}px; display: flex; align-items: center; gap: 14px; padding: 0 10px; border-radius: 14px; }
${X} .md .ic-b { position: relative; flex: none; width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; }
${X} .md .nm { position: relative; flex: 1; height: 30px; font-size: 23px; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
${X} .md .nm span { position: absolute; left: 0; top: 0; }
${X} .md .nm .new { color: var(--brand); font-weight: 750; }
${X} .md .hi { position: absolute; inset: 4px 0; border-radius: 14px; background: var(--brand-soft); opacity: 0; }
${X} .dt { position: absolute; left: 0; top: 0; width: ${BASE}px; height: ${BASE}px; margin: -${BASE / 2}px 0 0 -${BASE / 2}px; border-radius: 50%; }
${X} .dt .fc { position: absolute; inset: 0; border-radius: 50%; opacity: 0; box-shadow: 0 0 0 4px #fff, 0 10px 22px -8px rgba(0,0,0,0.4); }
${X} .dt .fc .avatar { width: 100%; height: 100%; }
${X} .lb { position: absolute; left: 0; top: 0; transform: translate(-50%, -50%); font-size: 23px; font-weight: 650; color: var(--ink-2); white-space: nowrap; opacity: 0; }
${X} .pill { position: absolute; left: ${RING.x}px; top: ${RING.y}px; transform: translate(-50%, -50%); padding: 12px 24px; border-radius: 999px;
  background: var(--brand-soft); color: var(--brand); font-size: 28px; font-weight: 750; white-space: nowrap; opacity: 0; }
`,
    html: () => {
      const sizes = SIZES.map((s, i) => `<span class="sz" data-s="${i}" style="opacity:${i === 2 ? 1 : 0}">${s.label}</span>`).join("");
      const mods = MODS.map(([id, name, icon, c]) => `
        <div class="md" data-id="${id}"><div><i class="hi"></i><span class="ic-b" style="background:${c}">${TV.icon(icon, 22, "#fff", 2.3)}</span>
          <span class="nm"><span class="old">${name}</span>${id === "groups" ? `<span class="new" style="opacity:0">Домашні групи</span>` : ""}</span></div></div>`).join("");
      const dots = Array.from({ length: DOTS }, (_, d) => `
        <i class="dt" style="background:color-mix(in oklab, var(--brand) ${40 + ((d * 37) % 5) * 8}%, #fff);opacity:0">${d < NF ? `<span class="fc">${TV.avatar(FACES[d], BASE)}</span>` : ""}</i>`).join("");
      const labels = SIZES.slice(0, 2).map((s, i) => s.clusters.map((c, k) =>
        `<span class="lb" data-s="${i}" style="left:${s.xs[k]}px;top:${s.y}px">${c}</span>`).join("")).join("");
      return `
<div class="split">
  ${TV.copy({ title: "Кастомізація", line: "Система підлаштується під вас." })}
  <div class="vis"><div class="mock">
    <div class="win card a-rise" style="--d:250ms">
      <div class="top">
        <span class="cap">Розмір церкви</span>${sizes}
        <span class="cnt"><b class="n">40</b><span>людей</span></span>
        <div class="trk"><i class="fill"></i></div>
        <div class="th"><i></i><b></b></div>
        <div class="ends"><span>мала</span><span>велика</span></div>
      </div>
      <div class="side">${mods}</div>
      ${dots}${labels}
      <span class="pill">Домашня група</span>
    </div>
    ${TV.tap(thumbX(0), TY, GRAB1, CUR)}${TV.tap(thumbX(0.5), TY, GRAB2, CUR)}
    ${TV.cursor("Андрій", CUR, "cz-c", "Ви")}
  </div></div>
</div>`;
    },
    tick(t, el) {
      const p = pAt(t);
      const m1 = TV.prog(t, D1[0], D1[1], TV.ease.inout);
      const m2 = TV.prog(t, D2[0], D2[1], TV.ease.inout);
      const cl = TV.clamp;
      // Поява церкви на старті: крапки виростають одна за одною.
      const intro = (d) => TV.prog(t, 600 + (d % 28) * 22, 1100 + (d % 28) * 22, TV.ease.decel);

      // Повзунок і число людей.
      const n = el.querySelector(".n"), v = fmt(peopleAt(p));
      if (n && n.textContent !== v) n.textContent = v;
      const fill = el.querySelector(".fill"), th = el.querySelector(".th");
      if (fill) fill.style.transform = `scaleX(${p})`;
      if (th) {
        th.style.transform = `translate3d(${thumbX(p)}px, 0, 0)`;
        const grab = (t >= GRAB1 && t < D1[1] + 120) || (t >= GRAB2 && t < D2[1] + 120);
        th.firstElementChild.style.opacity = grab ? "1" : "0";
      }
      const szo = [cl((p - 0.64) / 0.08), cl((0.72 - p) / 0.08) * cl((p - 0.26) / 0.08), cl((0.34 - p) / 0.08)];
      el.querySelectorAll(".sz").forEach((s) => { s.style.opacity = String(szo[+s.dataset.s]); });

      // Модулі: висота рядка = чи лишається модуль у цій церкві.
      el.querySelectorAll(".md").forEach((r) => {
        const id = r.dataset.id;
        const f = m2 > 0 ? TV.mix(+ON_MID.has(id), 1, m2) : TV.mix(+ON_SMALL.has(id), +ON_MID.has(id), m1);
        r.style.height = `${ROWH * f}px`;
        r.style.opacity = String(f * f);
        if (id === "groups") {
          const k = 1 - cl((m1 - 0.2) / 0.3);   // «Домашні групи» у малій → «Малі групи» в середній
          r.querySelector(".old").style.opacity = String(1 - k);
          r.querySelector(".new").style.opacity = String(k);
          r.querySelector(".hi").style.opacity = String(k);
        }
      });

      // Крапки: велика → середня → мала (з легким розкидом у часі).
      el.querySelectorAll(".dt").forEach((dt, d) => {
        const lag = (d % 12) * 0.015;
        const k1 = TV.ease.inout(cl((m1 - lag) / (1 - 0.18))), k2 = TV.ease.inout(cl((m2 - lag) / (1 - 0.18)));
        const a = m2 > 0 ? L[1][d] : L[2][d], b = m2 > 0 ? L[0][d] : L[1][d], k = m2 > 0 ? k2 : k1;
        const x = TV.mix(a.x, b.x, k), y = TV.mix(a.y, b.y, k), s = TV.mix(a.s, b.s, k);
        const o = TV.mix(a.o, b.o, k) * intro(d);
        dt.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${(s * (0.4 + 0.6 * intro(d))) / BASE})`;
        dt.style.opacity = String(o);
        if (d < NF) dt.firstElementChild.style.opacity = String(1 - cl(m1 / 0.4));
      });

      // Підписи груп крапок.
      const lo = [cl((m2 - 0.65) / 0.35), cl((m1 - 0.65) / 0.35) * (1 - cl(m2 / 0.35))];
      el.querySelectorAll(".lb").forEach((l) => { l.style.opacity = String(lo[+l.dataset.s]); });
      const pill = el.querySelector(".pill");
      if (pill) pill.style.opacity = String((1 - cl(m1 / 0.35)) * TV.prog(t, 1000, 1500));

      TV.moveCursor(el.querySelector("#cz-c"), t, cursor);
    },
  });
})();
