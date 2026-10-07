/* Автоматизації — схема «ЯКЩО — ТО» великими блоками згори донизу (як на головній,
   automations.tsx; телефон із перепискою прибрано 2026-09-21).
   Два сценарії з i18n.ts → automations.recipes строго по черзі: «Новенька людина»
   і «Перед служінням» («Підсумок тижня» знято 2026-10-01 — петля коротша). Спершу лише подія — вона здригається; далі
   бурштиновий розряд біжить проводом, і кожен крок з'являється тоді, коли розряд до
   нього дійшов: схема будується сама. У кожного сценарію свій лічильник «Економить»;
   після другого — тихий рядок «Разом ≈ 65 хв на тиждень» (25 + 40). */
// icons: zap, bot, users, rocket, house, flame, megaphone, list-checks, check, x, plus, bell
(function () {
  const ID = "automations";
  const AMBER = "#f59e0b", INK = "#14100a", DEEP = "#10151f";
  const W = 820, H = 950;
  const TOP = 64, TRIG_H = 140, STEP_H = 100, WIRE = 38, AXIS = 72;
  const MOD = {
    "telegram-bot": { icon: "bot", c: "#229ed9" }, people: { icon: "users", c: "#0ea5e9" },
    onboarding: { icon: "rocket", c: "#7c5cf0" }, groups: { icon: "house", c: "#0d9488" },
    ministries: { icon: "flame", c: "#f97316" }, campaigns: { icon: "megaphone", c: "#d946ef" },
    "service-planning": { icon: "list-checks", c: "#ea580c" },
  };

  // ── обличчя з позначкою (усе, що праворуч у блоці, — ілюстрація підпису кроку)
  const badge = (color, icon, d) =>
    `<span class="bd a-pop" style="background:${color};--d:${d}ms">${icon === "?" ? "?" : TV.icon(icon, 18, "#fff", 3.4)}</span>`;
  const face = (name, extra = "", cls = "", d = null) =>
    `<span class="fc ${cls}" ${d !== null ? `style="--d:${d}ms"` : ""}>${TV.avatar(name, 50)}${extra}</span>`;
  const faces = (inner) => `<span class="faces">${inner}</span>`;
  const TEAM = ["Андрій", "Олена", "Дмитро", "Оксана", "Марко"];

  const RECIPES = [
    {
      name: "Новенька людина", when: "Нова анкета", saved: 25,
      steps: [
        { text: "Бот привітав", module: "telegram-bot", side: (l) => faces(face("Марко", badge("#229ed9", "check", l + 150))) },
        { text: "Картка створена", module: "people", side: (l) => faces(face("Марко", badge("#0ea5e9", "plus", l + 150))) },
        { text: "Задача лідеру", module: "onboarding", side: (l) => faces(face("Олена", badge("#7c5cf0", "bell", l + 150))) },
        { text: "У малій групі", module: "groups", side: (l) => faces(["Андрій", "Ірина", "Дмитро"].map((n) => face(n)).join("")
          + face("Марко", badge("#0d9488", "check", l + 260), "a-pop", l + 120)) },
      ],
    },
    {
      name: "Перед служінням", when: "Завтра служіння", saved: 40,
      steps: [
        { text: "Нагадав кожному", module: "telegram-bot", side: (l) => faces(TEAM.map((n, k) => face(n, badge("#229ed9", "check", l + 120 + k * 80))).join("")) },
        { text: "Двоє відмовились", module: "ministries", side: (l) => faces([2, 3].map((k, j) => face(TEAM[k], badge("#ef4444", "x", l + 140 + j * 110))).join("")) },
        { text: "Шукає заміну", module: "campaigns", side: () => faces(`<span class="fc slot"><i></i></span><span class="fc slot"><i></i></span>`) },
        { text: "Графік закритий", module: "service-planning", side: (l) => faces(["Ірина", "Василь"].map((n, j) => face(n, badge("#12a150", "check", l + 260 + j * 110), "a-pop", l + 120 + j * 110)).join("")) },
      ],
    },
  ];

  // ── час (повільніше, 2026-10-01: «йдуть дуже швидко»): подія здригається ≈0,9 с, пауза 0,6 с,
  // кроки падають раз на 1,2 с, лічильник рахує 1,5 с, готова схема стоїть ≈2,3 с, перехід 0,7 с.
  const SHAKE = 500, PAUSE = 600, WIRE_MS = 520, STEP_GAP = 1200, DROP = 700, HOLD = 2300, EXIT = 700, NEXT = 300, COUNT = 1500;
  const LEN = SHAKE + 900 + PAUSE + WIRE_MS + 3 * STEP_GAP + DROP + HOLD;
  const START = RECIPES.map((_, i) => i).map((i) => 300 + i * (LEN + NEXT));
  const at = (i) => {
    const s = START[i];
    const shake = s + SHAKE;
    const lit = [0, 1, 2, 3].map((k) => shake + 900 + PAUSE + WIRE_MS + k * STEP_GAP);
    return { s, shake, lit, wire: lit.map((l) => l - WIRE_MS), out: s + LEN, count: [lit[3], lit[3] + COUNT] };
  };
  const TIMES = RECIPES.map((_, i) => at(i));
  const SUM = TIMES[TIMES.length - 1].count[1] + 100;          // «Разом» під останньою схемою
  const DUR = SUM + 600 + 2500 + 520;

  const stepTop = (k) => TOP + TRIG_H + WIRE + k * (STEP_H + WIRE);

  function recipe(r, i) {
    const t = TIMES[i];
    const steps = r.steps.map((st, k) => {
      const m = MOD[st.module];
      return `
      <div class="wire" style="top:${stepTop(k) - WIRE}px"><i class="run" style="--d:${t.wire[k]}ms"></i><b class="spark" style="--d:${t.wire[k]}ms"></b></div>
      <div class="stp" style="top:${stepTop(k)}px;--d:${t.lit[k]}ms">
        <div class="blk" style="--d:${t.lit[k]}ms">
          <span class="lit" style="--c:${m.c}"></span>
          <span class="mi" style="background:${m.c}">${TV.icon(m.icon, 42, "#fff", 2.1)}</span>
          <span class="tx">${TV.esc(st.text)}</span>
          ${st.side(t.lit[k])}
        </div>
      </div>`;
    }).join("");
    const last = i === RECIPES.length - 1;
    return `
    <div class="out" style="--d:${last ? DUR + 1000 : t.out}ms"><div class="rcp" style="--d:${t.s}ms">
      <span class="name">${TV.esc(r.name)}</span>
      <div class="trig" style="top:${TOP}px">
        <span class="zap" style="--d:${t.shake}ms">${TV.icon("zap", 54, INK, 2)}<i class="wave" style="--d:${t.shake}ms"></i><i class="wave" style="--d:${t.shake + 380}ms"></i></span>
        <span><span class="lb">Якщо</span><span class="ev">${TV.esc(r.when)}</span></span>
      </div>
      ${steps}
      <div class="save a-up" style="top:${stepTop(3) + STEP_H + 42}px;--d:${t.lit[3] - 150}ms"><span class="e">Економить</span><span class="n">≈ <em class="sv" data-i="${i}">0</em> хв</span><span class="p">на тиждень</span></div>
    </div></div>`;
  }

  const S = `[data-scene="${ID}"]`;
  TV.scene({
    id: ID,
    dur: DUR,
    bg: "dark",
    css: `
${S} .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.08; }
/* смужки сценаріїв угорі — як сторіз: котрий зараз і скільки ще */
${S} .bars { position: absolute; right: 0; top: 14px; display: flex; gap: 10px; }
${S} .bars span { width: 70px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.16); overflow: hidden; }
${S} .bars b { display: block; height: 100%; background: ${AMBER}; transform-origin: 0 50%; animation: aut-bar var(--t) linear var(--d) both; }
@keyframes aut-bar { from { transform: scaleX(0); } }
/* перехід між сценаріями: новий в'їжджає справа, старий виїжджає вліво */
${S} .out { position: absolute; inset: 0; animation: aut-exit ${EXIT}ms var(--e-emph) var(--d) both; }
${S} .rcp { position: absolute; inset: 0; animation: aut-enter 700ms var(--e-emph) var(--d) both; }
@keyframes aut-enter { from { opacity: 0; transform: translate3d(90px, 0, 0); } }
@keyframes aut-exit { 0% { opacity: 1; transform: none; } 45% { opacity: 0; } 100% { opacity: 0; transform: translate3d(-120px, 0, 0); } }
${S} .name { position: absolute; left: 0; top: 0; height: 36px; display: inline-flex; align-items: center; gap: 12px; font-size: 25px; font-weight: 650; color: rgba(255,255,255,0.72); letter-spacing: -0.01em; }
${S} .name::before { content: ""; width: 12px; height: 12px; border-radius: 50%; background: ${AMBER}; box-shadow: 0 0 0 5px color-mix(in oklab, ${AMBER} 22%, transparent); }
/* подія */
${S} .trig { position: absolute; left: 0; right: 0; height: ${TRIG_H}px; border-radius: 32px; display: flex; align-items: center; gap: 28px; padding: 0 28px 0 ${AXIS - 52}px;
  background: color-mix(in oklab, ${AMBER} 11%, transparent); box-shadow: inset 0 0 0 2px color-mix(in oklab, ${AMBER} 45%, transparent); }
${S} .zap { position: relative; flex: none; width: 104px; height: 104px; border-radius: 28px; background: ${AMBER}; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 10px color-mix(in oklab, ${AMBER} 18%, transparent), 0 20px 50px -14px ${AMBER};
  animation: aut-shake 900ms var(--e-std) var(--d) both; }
${S} .zap svg path, ${S} .cz svg path { fill: ${INK}; }
${S} .zap .wave { position: absolute; inset: -10px; border-radius: 36px; box-shadow: 0 0 0 3px ${AMBER}; opacity: 0; animation: aut-wave 1000ms var(--e-decel) var(--d) both; }
@keyframes aut-shake {
  0%, 100% { transform: none; }
  12% { transform: rotate(-9deg) scale(1.1); }
  26% { transform: rotate(8deg) scale(1.1); }
  40% { transform: rotate(-6deg) scale(1.07); }
  54% { transform: rotate(4deg) scale(1.04); }
  68% { transform: rotate(-2deg) scale(1.02); }
}
@keyframes aut-wave { 0% { opacity: 0; transform: scale(0.9); } 12% { opacity: 0.9; } 100% { opacity: 0; transform: scale(1.35); } }
${S} .trig .lb { display: block; font-size: 23px; font-weight: 750; letter-spacing: 0.22em; text-transform: uppercase; color: ${AMBER}; }
${S} .trig .ev { display: block; margin-top: 6px; font-size: 52px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: #fff; white-space: nowrap; }
/* провід */
${S} .wire { position: absolute; left: ${AXIS - 2}px; width: 4px; height: ${WIRE}px; border-radius: 2px; }
${S} .wire .run { position: absolute; inset: 0; border-radius: 2px; background: ${AMBER}; transform-origin: 50% 0; animation: aut-run ${WIRE_MS}ms linear var(--d) both; }
@keyframes aut-run { from { transform: scaleY(0); } }
${S} .wire .spark { position: absolute; left: -8px; top: -10px; width: 20px; height: 20px; border-radius: 50%; background: #ffd27a;
  box-shadow: 0 0 0 5px color-mix(in oklab, ${AMBER} 40%, transparent), 0 0 24px 6px ${AMBER}; opacity: 0; animation: aut-spark ${WIRE_MS + 160}ms linear var(--d) both; }
@keyframes aut-spark { 0% { opacity: 0; transform: translateY(0); } 12% { opacity: 1; } 75% { opacity: 1; transform: translateY(${WIRE}px); } 100% { opacity: 0; transform: translateY(${WIRE + 8}px) scale(0.4); } }
/* кроки */
/* крок з'являється в мить, коли до нього добіг розряд: падає згори й осідає */
${S} .stp { position: absolute; left: 0; right: 0; height: ${STEP_H}px; animation: aut-drop 700ms var(--e-emph) var(--d) both; }
@keyframes aut-drop { 0% { opacity: 0; transform: translate3d(0, -26px, 0) scale(0.97); } 40% { opacity: 1; } 70% { transform: translate3d(0, 3px, 0) scale(1.005); } 100% { opacity: 1; transform: none; } }
${S} .blk { position: absolute; inset: 0; border-radius: 28px; display: flex; align-items: center; gap: 26px; padding: 0 24px 0 ${AXIS - 36}px;
  background: rgba(255,255,255,0.045); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.09); }
${S} .blk .lit { position: absolute; inset: 0; border-radius: inherit; background: color-mix(in oklab, var(--c) 13%, transparent);
  box-shadow: inset 0 0 0 2px color-mix(in oklab, var(--c) 60%, transparent), 0 24px 60px -30px var(--c); animation: a-fade 500ms var(--e-std) var(--d) both; }
${S} .blk .mi { position: relative; flex: none; width: 72px; height: 72px; border-radius: 21px; display: flex; align-items: center; justify-content: center; }
${S} .blk .tx { position: relative; flex: 1; font-size: 40px; font-weight: 750; letter-spacing: -0.025em; color: #fff; white-space: nowrap; }
${S} .faces { position: relative; flex: none; display: flex; }
${S} .fc { position: relative; width: 50px; height: 50px; margin-left: -2px; border-radius: 50%; box-shadow: 0 0 0 3px ${DEEP}; }
${S} .fc .avatar { box-shadow: none; }
${S} .bd { position: absolute; right: -7px; bottom: -6px; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 3px ${DEEP}; color: ${INK}; font-size: 19px; font-weight: 800; line-height: 1; }
${S} .slot { background: transparent; box-shadow: none; margin-left: 4px; }
${S} .slot i { position: absolute; inset: 0; border-radius: 50%; border: 3px dashed rgba(255,255,255,0.45); animation: aut-spin 3200ms linear infinite; }
@keyframes aut-spin { to { transform: rotate(360deg); } }
/* економія */
${S} .save { position: absolute; left: 0; right: 0; display: flex; align-items: baseline; gap: 20px; padding-left: ${AXIS - 36}px; white-space: nowrap; }
${S} .save .e { font-size: 24px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
${S} .save .n { font-size: 68px; font-weight: 800; letter-spacing: -0.035em; line-height: 1; color: #fff; font-variant-numeric: tabular-nums; }
${S} .save .n em { font-style: normal; color: ${AMBER}; }
${S} .save .p { font-size: 30px; font-weight: 550; color: rgba(255,255,255,0.55); }
/* разом за тиждень — тихий рядок під останньою схемою */
${S} .tot { position: absolute; left: 0; right: 0; top: ${H - 46}px; display: flex; align-items: baseline; gap: 14px; padding-left: ${AXIS - 36}px;
  white-space: nowrap; font-size: 32px; font-weight: 600; color: rgba(255,255,255,0.62); letter-spacing: -0.01em; }
${S} .tot b { font-weight: 800; color: #fff; }
${S} .tot b em { font-style: normal; color: ${AMBER}; }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Автоматизації", line: "Нагадування шле система — ви лише перевіряєте." })}
  <div class="vis"><div class="mock">
    <div class="bars a-fade" style="--d:${START[0] + 200}ms">${TIMES.map((t) => `<span><b style="--d:${t.s}ms;--t:${LEN + NEXT}ms"></b></span>`).join("")}</div>
    ${RECIPES.map(recipe).join("")}
    <div class="tot a-up" style="--d:${SUM}ms">Разом <b>≈ <em>${RECIPES.reduce((a, r) => a + r.saved, 0)}</em> хв</b> на тиждень</div>
  </div></div>
</div>`,
    tick(t, el) {
      const set = (node, v) => { if (node && node.textContent !== v) node.textContent = v; };
      el.querySelectorAll(".sv").forEach((n) => {
        const i = +n.dataset.i, c = TIMES[i].count;
        set(n, String(TV.count(t, c[0], c[1], 0, RECIPES[i].saved, TV.ease.inout)));
      });
    },
  });
})();
