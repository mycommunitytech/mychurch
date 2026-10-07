/* Цілі та метрики — «Цілі 2026» (src/content/modules/planning.ts → goals, copy.ua.mock).
   Угорі три цілі церкви кільцями, під ними цілі груп і служінь «склянками».
   Прогрес доростає тиждень за тижнем — чотири кроки; червоний прапорець — ціль.
   Явка не дотягує до позначки — «Відстає»; команда дитячого служіння впирається
   в прапорець — «Досягнуто» і салют. */
// icons: target, flag, check
(function () {
  const ID = "goals";
  const A = "#dc2626";                        // колір модуля — позначка цілі
  const G = "#12a150", AM = "#f59e0b", B = "#0069e0";
  const TONE = { green: { c: G, ink: "#0e7a3c", label: "У графіку" }, amber: { c: AM, ink: "#b45309", label: "Відстає" }, brand: { c: B, ink: B, label: "Досягнуто" } };
  const W = 880, H = 844;

  // Кроки «тиждень за тижнем»: спершу доростає до частини, потім чотири сходинки.
  const RING = { draw: [700, 1150], steps: [1500, 1950, 2400, 2850] };
  const COL = { draw: [2250, 2650], steps: [3000, 3450, 3900, 4350] };
  const STEP = 360;
  const RING_DONE = RING.steps[3] + STEP + 150, COL_DONE = COL.steps[3] + STEP + 120;
  // Кадри значення (частка від 0 до 1): [мс, частка].
  const frames = (plan, fin) => {
    const base = fin * 0.6, d = (fin - base) / plan.steps.length;
    const f = [[plan.draw[0], 0], [plan.draw[1], base]];
    plan.steps.forEach((s, k) => f.push([s, base + d * k], [s + STEP, base + d * (k + 1)]));
    return f;
  };
  const valueAt = (f, t) => {
    if (t <= f[0][0]) return f[0][1];
    for (let i = 1; i < f.length; i++) if (t <= f[i][0]) {
      const [ta, va] = f[i - 1], [tb, vb] = f[i];
      return va + (vb - va) * TV.ease.emph((t - ta) / (tb - ta));
    }
    return f[f.length - 1][1];
  };
  const kf = (name, f, val) => {
    const t0 = f[0][0], t1 = f[f.length - 1][0];
    const body = f.map(([t, v]) => `${(((t - t0) / (t1 - t0)) * 100).toFixed(3)}% { ${val(v)}; animation-timing-function: cubic-bezier(0.2, 0, 0, 1); }`).join(" ");
    return { css: `@keyframes ${name} { ${body} }`, anim: `${name} ${t1 - t0}ms linear ${t0}ms both` };
  };

  // ── цілі церкви
  const R = 78, CIRC = 2 * Math.PI * R;
  const RINGS = [
    { title: "450 людей до літа", fact: 428, of: 450, fin: 428 / 450, target: 1, tone: "green", unit: "" },
    { title: "40 хрещень за рік", fact: 27, of: 40, fin: 27 / 40, target: 1, tone: "green", unit: "" },
    { title: "Явка 80% на служіннях", fact: 74, of: 80, fin: 0.74, target: 0.8, tone: "amber", unit: "%" },
  ].map((r, i) => ({ ...r, f: frames(RING, r.fin), cx: 28 + i * (W - 56) / 3 + (W - 56) / 6 }));
  // ── цілі груп і служінь
  const COLS = [
    { title: "25 активних груп", fact: 23, of: 25, tone: "green", who: "Андрій Мельник" },
    { title: "Явка груп 85%", fact: 79, of: 85, tone: "amber", who: "Олена Ковальчук", unit: "%" },
    { title: "60 нових служителів", fact: 41, of: 60, tone: "green", who: "Ірина Шевчук" },
    { title: "Команда дитячого служіння — 20", fact: 20, of: 20, tone: "brand", who: "Наталя Рудь" },
  ].map((c, i) => ({ ...c, f: frames(COL, c.fact / c.of), x: 28 + i * 211 }));
  const CW = 190, TR = { y: 134, h: 136 };

  const kfs = [
    ...RINGS.map((r, i) => kf(`goals-r${i}`, r.f, (v) => `stroke-dasharray: ${(v * CIRC).toFixed(2)} ${CIRC.toFixed(2)}`)),
    ...COLS.map((c, i) => kf(`goals-c${i}`, c.f, (v) => `transform: scaleY(${v.toFixed(4)})`)),
  ];

  const pill = (tone, d, extra = "") => {
    const t = TONE[tone];
    return `<span class="pill2 a-pop ${extra}" style="--d:${d}ms;color:${t.ink};--c:${t.c}">${tone === "brand" ? TV.icon("check", 20, "currentColor", 3) : "<i></i>"}${t.label}</span>`;
  };
  const tickAt = (frac) => {
    const a = frac * 2 * Math.PI - Math.PI / 2;
    const x1 = 90 + Math.cos(a) * (R - 16), y1 = 90 + Math.sin(a) * (R - 16);
    const x2 = 90 + Math.cos(a) * (R + 16), y2 = 90 + Math.sin(a) * (R + 16);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${A}" stroke-width="5" stroke-linecap="round"/>`;
  };

  const ring = (r, i) => `
    <div class="ring" style="left:${r.cx - 90}px">
      ${RING.steps.map((s) => `<span class="pulse" style="--d:${s + 120}ms;--c:${TONE[r.tone].c}"></span>`).join("")}
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r="${R}" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="20"/>
        <circle cx="90" cy="90" r="${R}" fill="none" stroke="${TONE[r.tone].c}" stroke-width="20" stroke-linecap="round" transform="rotate(-90 90 90)"
          style="animation:${kfs[i].anim}"/>
        ${tickAt(r.target)}
      </svg>
      <div class="rc"><b class="rv">0</b><span>з ${r.of}${r.unit}</span></div>
    </div>
    <div class="rt" style="left:${r.cx - 140}px">${TV.esc(r.title)}</div>
    <div class="rchip" style="left:${r.cx - 140}px">${pill(r.tone, RING_DONE + i * 90)}</div>`;

  const col = (c, i) => `
    <div class="col" style="left:${c.x}px">
      <div class="num"><b class="cv">0</b><span>з ${c.of}${c.unit || ""}</span></div>
      <div class="track">
        <span class="fill" style="background:${TONE[c.tone].c};animation:${kfs[3 + i].anim}"></span>
        <span class="flag">${TV.icon("flag", 22, A, 2.4)}</span>
        ${pill(c.tone, COL_DONE + i * 70, "in")}
      </div>
      <div class="ct">${TV.esc(c.title)}</div>
      <div class="own">${TV.avatar(c.who, 34)}<span>${TV.esc(c.who.split(" ")[0])}</span></div>
    </div>`;

  // Салют над «склянкою», що дійшла до прапорця.
  const CONF = ["#0069e0", "#12a150", "#f59e0b", "#dc2626", "#8b5bf0", "#0ea5e9"];
  const burst = Array.from({ length: 26 }, (_, i) => {
    const a = -Math.PI / 2 + ((i / 25) - 0.5) * Math.PI * 1.3;
    const reach = 90 + (i % 4) * 30;
    return `<i style="background:${CONF[i % 6]};width:${8 + (i % 3) * 3}px;height:${14 + (i % 4) * 4}px;--dx:${Math.cos(a) * reach * 0.9}px;--dy:${Math.sin(a) * reach * 1.1 + 30}px;--spin:${(360 + (i % 5) * 140) * (i % 2 ? -1 : 1)}deg;--d:${COL_DONE + 3 * 70 + (i % 4) * 40}ms;--t:${1200 + (i % 5) * 150}ms"></i>`;
  }).join("");

  const S = `[data-scene="${ID}"]`;
  TV.scene({
    id: ID,
    dur: 8600,
    bg: "light",
    css: `
${S} .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
${S} .pan { position: absolute; left: 0; width: ${W}px; border-radius: 28px; }
${S} .hd { position: absolute; left: 28px; right: 28px; top: 22px; display: flex; align-items: center; gap: 16px; }
${S} .badge { flex: none; width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: color-mix(in oklab, ${A} 11%, #fff); }
${S} .hd b { display: block; font-size: 29px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
${S} .hd small { display: block; margin-top: 4px; font-size: 21px; color: var(--ink-3); font-weight: 500; }
${S} .ring { position: absolute; top: 104px; width: 180px; height: 180px; }
${S} .ring svg { position: absolute; inset: 0; overflow: visible; }
${S} .pulse { position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 10px var(--c); opacity: 0; animation: goals-pulse 700ms var(--e-decel) var(--d) both; }
@keyframes goals-pulse { 0% { opacity: 0; transform: scale(0.9); } 15% { opacity: 0.22; } 100% { opacity: 0; transform: scale(1.14); } }
${S} .rc { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
${S} .rc b { font-size: 46px; font-weight: 800; letter-spacing: -0.035em; line-height: 1; font-variant-numeric: tabular-nums; }
${S} .rc span { margin-top: 4px; font-size: 20px; font-weight: 550; color: var(--ink-3); }
${S} .rt { position: absolute; top: 302px; width: 280px; text-align: center; font-size: 23px; font-weight: 650; letter-spacing: -0.015em; }
${S} .rchip { position: absolute; top: 344px; width: 280px; display: flex; justify-content: center; }
${S} .pill2 { display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 16px 0 13px; border-radius: 999px; white-space: nowrap;
  background: color-mix(in oklab, var(--c) 13%, #fff); font-size: 20px; font-weight: 650; }
${S} .pill2 i { width: 10px; height: 10px; border-radius: 50%; background: var(--c); }
/* цілі команд */
${S} .grp { position: absolute; top: 22px; width: ${CW * 2 + 21}px; padding-bottom: 10px; border-bottom: 2px solid var(--hairline); font-size: 22px; font-weight: 650; color: var(--ink-3); letter-spacing: -0.01em; }
${S} .col { position: absolute; top: 74px; width: ${CW}px; }
${S} .num { display: flex; align-items: baseline; gap: 8px; height: 50px; }
${S} .num b { font-size: 44px; font-weight: 800; letter-spacing: -0.035em; line-height: 1; font-variant-numeric: tabular-nums; }
${S} .num span { font-size: 21px; font-weight: 550; color: var(--ink-3); }
${S} .track { position: absolute; top: ${TR.y - 74}px; left: 0; width: ${CW}px; height: ${TR.h}px; border-radius: 20px; background: var(--surface-3); overflow: hidden;
  box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.05); }
${S} .track { margin-top: 0; }
${S} .fill { position: absolute; left: 0; right: 0; bottom: 0; height: 100%; transform-origin: 50% 100%; }
${S} .flag { position: absolute; right: 10px; top: 8px; width: 36px; height: 36px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
${S} .track .pill2 { position: absolute; left: 10px; bottom: 12px; background: #fff; box-shadow: 0 4px 12px -4px rgba(0,0,0,0.25); }
${S} .ct { position: absolute; top: ${TR.y - 74 + TR.h + 12}px; left: 0; width: ${CW + 8}px; font-size: 21px; font-weight: 650; line-height: 1.18; letter-spacing: -0.015em; }
${S} .own { position: absolute; top: ${TR.y - 74 + TR.h + 76}px; left: 0; width: ${CW + 20}px; display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 550; color: var(--ink-2); white-space: nowrap; }
${S} .conf { position: absolute; z-index: 40; }
${S} .conf i { position: absolute; border-radius: 2px; opacity: 0; animation: goals-conf var(--t) cubic-bezier(0.1, 0.6, 0.3, 1) var(--d) both; }
@keyframes goals-conf {
  0% { opacity: 0; transform: translate(0, 0) rotate(0); }
  4%, 80% { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--spin)); }
}
${kfs.map((k) => k.css).join("\n")}
`,
    html: () => `
<div class="split flip">
  ${TV.copy({ title: "Цілі та метрики", line: "Цілі церкви й служінь видно щотижня, а не в кінці року." })}
  <div class="vis"><div class="mock">
    <div class="pan card a-rise" style="top:0;height:410px;--d:250ms">
      <div class="hd"><span class="badge">${TV.icon("target", 30, A, 2.2)}</span>
        <span><b>Цілі 2026</b><small>9 цілей · 6 у графіку · 2 відстають</small></span></div>
      ${RINGS.map(ring).join("")}
    </div>
    <div class="pan card a-rise" style="top:430px;height:414px;--d:1900ms">
      <span class="grp" style="left:28px">Малі групи</span>
      <span class="grp" style="left:${28 + 2 * 211}px">Служіння</span>
      ${COLS.map(col).join("")}
    </div>
    <div class="conf" style="left:${COLS[3].x + CW / 2}px;top:${430 + TR.y + 4}px">${burst}</div>
  </div></div>
</div>`,
    tick(t, el) {
      const set = (node, v) => { if (node && node.textContent !== v) node.textContent = v; };
      el.querySelectorAll(".rv").forEach((n, i) => {
        const r = RINGS[i];
        const v = valueAt(r.f, t) / r.fin;
        set(n, Math.round(v * r.fact) + r.unit);
      });
      el.querySelectorAll(".cv").forEach((n, i) => {
        const c = COLS[i];
        set(n, Math.round(valueAt(c.f, t) * c.of) + (c.unit || ""));
      });
    },
  });
})();
