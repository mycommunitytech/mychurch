/* Проєкти — дошка підготовки молодіжної конференції (tools.ts → projects.mock:
   «Молодіжна конференція», «12 жовтня · 48 задач · 71% готово», колонки
   «Зробити → У роботі → Готово», картки з відповідальними й дедлайнами).
   Кожен сам пересуває свою картку: Ірина бере банери в роботу, Марія й Андрій
   закривають свої задачі — сусідні картки розступаються, лічильники колонок
   і кільце прогресу 67% → 71% (32 → 34 з 48) оновлюються на очах. */
// icons: square-kanban, check
(function () {
  const W = 900;
  const ACC = "#2563eb";
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const deep = (c) => `color-mix(in oklab, ${c} 72%, #0b0b0f)`;
  const TONE = { violet: "#8b5bf0", brand: "#0069e0", amber: "#f59e0b", neutral: "#64748b", green: "#12a150" };
  const CARDS = {
    banners: { title: "Замовити банери", who: "Ірина", due: "до 3 жов", tag: "Реклама", tone: "violet" },
    volunteers: { title: "Волонтери на вхід", who: "Василь", due: "до 8 жов", tag: "Команда", tone: "brand" },
    regform: { title: "Реєстраційна форма", who: "Марія", due: "до 1 жов", tag: "Реєстрація", tone: "amber" },
    program: { title: "Програма й таймінг", who: "Андрій", due: "до 5 жов", tag: "Програма", tone: "brand" },
    sound: { title: "Звук і світло", who: "Дмитро", due: "до 10 жов", tag: "Техніка", tone: "neutral" },
    hall: { title: "Зала заброньована", who: "Наталя", tag: "Приміщення", tone: "green", done: true },
    budget: { title: "Бюджет затверджено", who: "Олена", tag: "Фінанси", tone: "green", done: true },
  };
  const COLS = [
    { title: "Зробити", c: "#94a3b8" },
    { title: "У роботі", c: "#f59e0b" },
    { title: "Готово", c: "#12a150" },
  ];
  // Стан дошки до і після кожного переміщення.
  const STAGES = [
    [["banners", "volunteers"], ["regform", "program", "sound"], ["hall", "budget"]],
    [["volunteers"], ["banners", "regform", "program", "sound"], ["hall", "budget"]],
    [["volunteers"], ["banners", "program", "sound"], ["regform", "hall", "budget"]],
    [["volunteers"], ["banners", "sound"], ["program", "regform", "hall", "budget"]],
  ];
  // Хто що тягне і коли.
  const MOVES = [
    { id: "banners", who: "Ірина", c: TONE.violet, show: [1100, 2800], grab: 1600, drop: 2350 },
    { id: "regform", who: "Марія", c: TONE.amber, show: [2950, 4650], grab: 3450, drop: 4200 },
    { id: "program", who: "Андрій", c: TONE.brand, show: [4800, 6500], grab: 5300, drop: 6050 },
  ];
  const TOTAL = 48, DONE0 = 32;

  // ── геометрія
  const HEAD = 104, PAD = 20, CGAP = 14, CW = (W - PAD * 2 - CGAP * 2) / 3;
  const CT = HEAD + 18, CHEAD = 58, IN = 12, KW = CW - IN * 2, KH = 166, KGAP = 12;
  const H = CT + CHEAD + 4 * KH + 3 * KGAP + IN + PAD;
  const colX = (c) => PAD + c * (CW + CGAP);
  const where = (stage, id) => {
    for (let c = 0; c < 3; c++) {
      const i = STAGES[stage][c].indexOf(id);
      if (i >= 0) return { x: colX(c) + IN, y: CT + CHEAD + i * (KH + KGAP) };
    }
  };
  const GRAB = { x: 56, y: 58 }; // куди в картці береться курсор

  const R = 27, CIRC = 2 * Math.PI * R;

  function card(id, i) {
    const k = CARDS[id], c = TONE[k.tone];
    const mv = MOVES.find((m) => m.id === id);
    const doneAt = mv && where(MOVES.indexOf(mv) + 1, id).x > colX(2) ? mv.drop : null;
    return `<div class="kc" data-id="${id}"><div class="in a-up" style="--d:${520 + i * 60}ms">
      <span class="ktag" style="color:${deep(c)};background:${tint(c, 14)}">${k.tag}</span>
      ${k.done ? `<b class="ok">${TV.icon("check", 16, "#fff", 3.4)}</b>` : doneAt ? `<b class="ok a-pop" style="--d:${doneAt + 60}ms">${TV.icon("check", 16, "#fff", 3.4)}</b>` : ""}
      <div class="tt">${k.title}</div>
      <div class="ft">${TV.avatar(k.who, 32)}<span>${k.who}</span>${k.due ? `<i>${k.due}</i>` : ""}</div>
    </div></div>`;
  }

  TV.scene({
    id: "projects",
    dur: 8200,
    bg: "light",
    css: `
[data-scene="projects"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
[data-scene="projects"] .board { position: absolute; inset: 0; overflow: hidden; }
[data-scene="projects"] .head { position: absolute; left: 0; right: 0; top: 0; height: ${HEAD}px; display: flex; align-items: center; gap: 18px; padding: 0 26px 0 28px; }
[data-scene="projects"] .hico { width: 56px; height: 56px; border-radius: 16px; background: ${tint(ACC, 14)}; display: flex; align-items: center; justify-content: center; }
[data-scene="projects"] .h1 { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
[data-scene="projects"] .h2 { font-size: 22px; font-weight: 500; color: var(--ink-3); margin-top: 4px; }
[data-scene="projects"] .prog { margin-left: auto; display: flex; align-items: center; gap: 14px; }
[data-scene="projects"] .prog svg { display: block; transform: rotate(-90deg); }
[data-scene="projects"] .pct { font-size: 34px; font-weight: 800; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1; }
[data-scene="projects"] .pct small { display: block; margin-top: 4px; font-size: 20px; font-weight: 550; color: var(--ink-3); letter-spacing: 0; }
[data-scene="projects"] .col { position: absolute; top: ${CT}px; width: ${CW}px; bottom: ${PAD}px; border-radius: 22px; background: var(--surface-3); }
[data-scene="projects"] .ch { position: absolute; left: 18px; right: 14px; top: 0; height: ${CHEAD}px; display: flex; align-items: center; gap: 10px; font-size: 23px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="projects"] .ch i { width: 12px; height: 12px; border-radius: 50%; }
[data-scene="projects"] .ch b { margin-left: auto; min-width: 36px; height: 32px; padding: 0 10px; border-radius: 999px; background: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700; color: var(--ink-2); font-variant-numeric: tabular-nums; }
[data-scene="projects"] .kc { position: absolute; left: 0; top: 0; width: ${KW}px; height: ${KH}px; }
[data-scene="projects"] .kc .in { position: absolute; inset: 0; border-radius: 16px; background: #fff; padding: 14px 16px; box-shadow: 0 0 0 1px var(--hairline), 0 2px 6px rgba(10, 20, 40, 0.06); }
[data-scene="projects"] .ktag { display: inline-block; height: 30px; line-height: 30px; padding: 0 12px; border-radius: 9px; font-size: 20px; font-weight: 650; }
[data-scene="projects"] .ok { position: absolute; right: 14px; top: 14px; width: 30px; height: 30px; border-radius: 50%; background: var(--green); display: flex; align-items: center; justify-content: center; }
[data-scene="projects"] .tt { margin-top: 9px; font-size: 23px; line-height: 27px; font-weight: 650; letter-spacing: -0.02em; height: 54px; }
[data-scene="projects"] .ft { position: absolute; left: 16px; right: 12px; bottom: 13px; display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 550; color: var(--ink-2); white-space: nowrap; }
[data-scene="projects"] .ft i { margin-left: auto; font-style: normal; color: var(--ink-3); font-variant-numeric: tabular-nums; }
`,
    html: (o) => {
      const cols = COLS.map((c, i) => `<div class="col" style="left:${colX(i)}px"><div class="ch"><i style="background:${c.c}"></i>${c.title}<b class="n${i}">${STAGES[0][i].length}</b></div></div>`).join("");
      const ids = [].concat(...STAGES[0]);
      const taps = MOVES.map((m, k) => {
        const a = where(k, m.id), b = where(k + 1, m.id);
        return TV.tap(a.x + GRAB.x, a.y + GRAB.y, m.grab, m.c) + TV.tap(b.x + GRAB.x, b.y + GRAB.y, m.drop, m.c);
      }).join("");
      return `
<div class="split ${o === "port" ? "" : "flip"}">
  ${TV.copy({ title: "Проєкти", line: "Задачі команди не губляться між чатами." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="head">
        <span class="hico">${TV.icon("square-kanban", 30, ACC, 2.2)}</span>
        <div><div class="h1">Молодіжна конференція</div><div class="h2">12 жовтня · ${TOTAL} задач</div></div>
        <div class="prog">
          <svg width="${R * 2 + 10}" height="${R * 2 + 10}" viewBox="0 0 ${R * 2 + 10} ${R * 2 + 10}">
            <circle cx="${R + 5}" cy="${R + 5}" r="${R}" fill="none" stroke="var(--surface-3)" stroke-width="8"/>
            <circle class="ring" cx="${R + 5}" cy="${R + 5}" r="${R}" fill="none" stroke="${ACC}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"/>
          </svg>
          <div class="pct"><span class="p">67%</span><small>готово</small></div>
        </div>
      </div>
      ${cols}
      ${ids.map(card).join("")}
    </div>
    ${taps}
    ${MOVES.map((m, k) => TV.cursor(m.who, m.c, `pj-c${k}`)).join("")}
  </div></div>
</div>`;
    },
    tick(t, el) {
      // Скільки переміщень уже завершено — від цього лічильники й прогрес.
      const passed = MOVES.filter((m) => t >= m.drop).length;
      for (let c = 0; c < 3; c++) {
        const b = el.querySelector(`.n${c}`), v = String(STAGES[passed][c].length);
        if (b && b.textContent !== v) b.textContent = v;
      }
      // Кільце: з'являється з нуля до 67%, далі +1 задача на кожну закриту картку.
      let done = TV.mix(0, DONE0, TV.prog(t, 700, 1700, TV.ease.emph));
      MOVES.forEach((m, k) => { if (where(k + 1, m.id).x > colX(2)) done += TV.prog(t, m.drop, m.drop + 500, TV.ease.emph); });
      const ring = el.querySelector(".ring");
      if (ring) ring.style.strokeDashoffset = String(CIRC * (1 - done / TOTAL));
      const p = el.querySelector(".pct .p"), pv = `${Math.round((done / TOTAL) * 100)}%`;
      if (p && p.textContent !== pv) p.textContent = pv;

      // Картки: активне переміщення — хто тягне, той їде за курсором; решта розступається.
      const k = MOVES.findIndex((m) => t < m.drop + 300);
      el.querySelectorAll(".kc").forEach((node) => {
        const id = node.dataset.id;
        let x, y, lift = 0;
        if (k < 0) ({ x, y } = where(MOVES.length, id));
        else {
          const m = MOVES[k], a = where(k, id), b = where(k + 1, id);
          if (id === m.id) {
            const q = TV.path(t, [[m.grab, a.x, a.y], [m.drop, b.x, b.y]]);
            x = q.x; y = q.y;
            lift = TV.prog(t, m.grab - 40, m.grab + 160, TV.ease.decel) * (1 - TV.prog(t, m.drop - 40, m.drop + 220, TV.ease.decel));
          } else {
            const q = TV.prog(t, m.grab + 150, m.drop - 60, TV.ease.inout);
            x = TV.mix(a.x, b.x, q); y = TV.mix(a.y, b.y, q);
          }
        }
        node.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${-2.5 * lift}deg) scale(${1 + 0.04 * lift})`;
        node.style.zIndex = lift > 0 ? "5" : "";
        const inner = node.firstElementChild;
        inner.style.boxShadow = lift > 0
          ? `0 0 0 1px var(--hairline), 0 ${24 * lift}px ${44 * lift}px -12px rgba(10, 30, 70, ${0.35 * lift})`
          : "";
      });

      // Курсори — по черзі, кожен тягне свою картку.
      MOVES.forEach((m, i) => {
        const a = where(i, m.id), b = where(i + 1, m.id);
        const gx = a.x + GRAB.x - 10, gy = a.y + GRAB.y - 6, dx = b.x + GRAB.x - 10, dy = b.y + GRAB.y - 6;
        const cur = el.querySelector(`#pj-c${i}`);
        TV.moveCursor(cur, t, {
          keys: [[m.show[0], gx - 60, H - 20], [m.grab - 60, gx, gy], [m.grab, gx, gy], [m.drop, dx, dy], [m.drop + 150, dx, dy], [m.show[1], dx + 40, H - 10]],
          show: m.show,
          clicks: [m.grab, m.drop],
        });
        if (cur && t > m.grab && t < m.drop - 90) cur.firstElementChild.style.transform = "scale(0.8)";
      });
    },
  });
})();
