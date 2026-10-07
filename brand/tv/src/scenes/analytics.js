/* Аналітика та звіти — цифри як картинка (власник: «треба цифри»).
   Чотири великі числа, лише ті, що є на сайті, дослівно:
     • «Людей у церкві» 428 · «+12» «за місяць» — i18n.ts → preview.stats (+ app-preview.tsx) і audience…pastor.stats;
     • «Присутніх» 312 · «+8%», «Нових» 24 · «+18%» — features.mocks.analytics.attendance (+ analytics-showcase.tsx);
     • «Ріст церкви» «+58 за пів року» — features.blocks[].points і mocks.analytics.growth.delta.
   Під кожним — крихітна спарклайн-лінія чи стовпчики. Наостанок «Звіт для ради · квітень»:
   пастор Іван тисне PDF — «Готуємо…» → «Готово». */
// icons: file-text, file-down, loader-circle, check
(function () {
  const ID = "analytics";
  const A = "#0891b2";                          // колір модуля
  const G = "#12a150";
  const W = 880, CW = 430, CH = 330, GAP = 20, TOP = 60, H = 932;
  const IN = [450, 1350, 2250, 3150];           // поява карток, ≈ 0,9 с одна за одною
  const T = { report: 4550, tap: 5950, done: 7150 };

  // Спарклайни — лише форма (ряди з analytics-showcase.tsx), без підписів і чисел.
  const GROWTH = [254, 261, 270, 283, 297, 312];
  const SERV = [148, 156, 151, 167, 172];
  const NUMS = [
    { label: "Людей у церкві", to: 428, chip: "+12 за місяць", c: A, spark: { kind: "line", data: GROWTH } },
    { label: "Присутніх", to: 312, chip: "+8%", c: "#0069e0", spark: { kind: "bars", data: SERV } },
    { label: "Нових", to: 24, chip: "+18%", c: G, spark: { kind: "line", data: [8, 11, 10, 14, 17, 24] } },
    { label: "Ріст церкви", to: 58, plus: true, chip: "за пів року", c: "#8b5bf0", spark: { kind: "bars", data: GROWTH.map((v) => v - 240) } },
  ].map((n, i) => ({ ...n, x: (i % 2) * (CW + GAP), y: TOP + Math.floor(i / 2) * (CH + GAP), at: IN[i] }));

  const SW = 170, SH = 58;
  function spark(n) {
    const d = n.spark.data, lo = Math.min(...d), hi = Math.max(...d);
    const ny = (v) => SH - 4 - ((v - lo) / (hi - lo || 1)) * (SH - 10);
    if (n.spark.kind === "line") {
      const pts = d.map((v, k) => `${(k / (d.length - 1)) * (SW - 8) + 4},${ny(v).toFixed(1)}`);
      const last = pts[pts.length - 1].split(",");
      return `<svg class="sp" width="${SW}" height="${SH}" viewBox="0 0 ${SW} ${SH}">
        <polyline class="ln" points="${pts.join(" ")}" pathLength="1" fill="none" stroke="${n.c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="--d:${n.at + 250}ms"/>
        <circle class="a-pop" cx="${last[0]}" cy="${last[1]}" r="8" fill="#fff" stroke="${n.c}" stroke-width="4" style="--d:${n.at + 1250}ms"/></svg>`;
    }
    const bw = (SW - (d.length - 1) * 8) / d.length;
    return `<svg class="sp" width="${SW}" height="${SH}" viewBox="0 0 ${SW} ${SH}">${d.map((v, k) => {
      const h = 10 + ((v - lo) / (hi - lo || 1)) * (SH - 12);
      return `<rect class="br" x="${k * (bw + 8)}" y="${SH - h}" width="${bw}" height="${h}" rx="6" fill="${k === d.length - 1 ? n.c : `color-mix(in oklab, ${n.c} 38%, #fff)`}" style="--d:${n.at + 250 + k * 90}ms"/>`;
    }).join("")}</svg>`;
  }

  const card = (n, i) => `
    <div class="num card a-up" style="left:${n.x}px;top:${n.y}px;--d:${n.at}ms">
      <div class="hd"><span class="lb"><i style="background:${n.c}"></i>${n.label}</span></div>
      <b class="big" data-i="${i}">${n.plus ? "+" : ""}0</b>
      <span class="chip a-pop" style="--d:${n.at + 1150}ms;color:${n.plus ? n.c : "#0e7a3c"};background:color-mix(in oklab, ${n.plus ? n.c : G} 12%, #fff)">${n.chip}</span>
      ${spark(n)}
    </div>`;

  const PDF = { x: 474, y: 770 + 27, w: 210, h: 56 };
  const TAP = { x: PDF.x + PDF.w / 2 - 24, y: PDF.y + PDF.h / 2 };

  const S = `[data-scene="${ID}"]`;
  TV.scene({
    id: ID,
    dur: 10400,
    bg: "light",
    css: `
${S} .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
${S} .cap { position: absolute; left: 6px; top: 0; font-size: 26px; font-weight: 550; color: var(--ink-3); white-space: nowrap; }
${S} .num { position: absolute; width: ${CW}px; height: ${CH}px; border-radius: 32px; padding: 30px 30px 0 32px; }
${S} .num .hd { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
${S} .num .lb { display: flex; align-items: center; gap: 12px; font-size: 29px; font-weight: 650; letter-spacing: -0.015em; white-space: nowrap; }
${S} .num .lb i { width: 14px; height: 14px; border-radius: 50%; flex: none; }
${S} .chip { position: absolute; left: 30px; bottom: 32px; height: 48px; display: inline-flex; align-items: center; padding: 0 16px; border-radius: 999px; font-size: 24px; font-weight: 700; white-space: nowrap; }
${S} .big { display: block; margin-top: 18px; font-size: 156px; font-weight: 800; letter-spacing: -0.055em; line-height: 0.92; font-variant-numeric: tabular-nums; color: var(--ink); }
${S} .sp { position: absolute; right: 30px; bottom: 30px; overflow: visible; }
${S} .sp .ln { stroke-dasharray: 1; stroke-dashoffset: 1; animation: an-ln 1000ms var(--e-emph) var(--d) both; }
@keyframes an-ln { to { stroke-dashoffset: 0; } }
${S} .sp circle { transform-box: fill-box; transform-origin: center; }
${S} .sp .br { transform-box: fill-box; transform-origin: 50% 100%; animation: an-br 700ms var(--e-emph) var(--d) both; }
@keyframes an-br { from { transform: scaleY(0); } }
/* звіт для ради */
${S} .rep { position: absolute; left: 0; top: 770px; width: ${W}px; height: 110px; border-radius: 28px; display: flex; align-items: center; gap: 16px; padding: 0 24px 0 28px; }
${S} .rep .ic2 { flex: none; width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: color-mix(in oklab, ${A} 13%, #fff); }
${S} .rep .rt { font-size: 28px; font-weight: 700; letter-spacing: -0.015em; white-space: nowrap; }
${S} .btn2 { position: absolute; top: 27px; height: ${PDF.h}px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 10px;
  font-size: 24px; font-weight: 650; white-space: nowrap; }
${S} .pdf { left: ${PDF.x}px; width: ${PDF.w}px; }
${S} .pdf > span { position: absolute; inset: 0; border-radius: inherit; display: flex; align-items: center; justify-content: center; gap: 10px; background: var(--brand); color: #fff; }
${S} .pdf .busy { animation: an-busy ${T.done - T.tap + 60}ms linear ${T.tap}ms both; }
@keyframes an-busy { 0% { opacity: 0; } 6%, 92% { opacity: 1; } 100% { opacity: 0; } }
${S} .pdf .busy svg { animation: an-spin 800ms linear ${T.tap}ms infinite; }
@keyframes an-spin { to { transform: rotate(360deg); } }
${S} .pdf .ok { background: ${G}; }
${S} .xls { left: ${PDF.x + PDF.w + 14}px; width: 150px; color: var(--ink-2); box-shadow: inset 0 0 0 1.5px var(--hairline-strong); }
${S} .note { position: absolute; left: 6px; top: 896px; font-size: 24px; font-weight: 550; color: var(--ink-3); white-space: nowrap; }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: ["Аналітика", "та звіти"], line: "Цифрами, а не відчуттями." })}
  <div class="vis"><div class="mock">
    <span class="cap a-fade" style="--d:${IN[0] - 100}ms">Квітень · порівняно з березнем</span>
    ${NUMS.map(card).join("")}
    <div class="rep card a-up" style="--d:${T.report}ms">
      <span class="ic2">${TV.icon("file-text", 30, A, 2.2)}</span><span class="rt">Звіт для ради · квітень</span>
      <span class="btn2 pdf">
        <span class="a-outf" style="--d:${T.tap}ms">${TV.icon("file-down", 24, "#fff", 2.2)}PDF</span>
        <span class="busy">${TV.icon("loader-circle", 24, "#fff", 2.4)}Готуємо…</span>
        <span class="ok a-pop" style="--d:${T.done}ms">${TV.icon("check", 24, "#fff", 3)}Готово</span>
      </span>
      <span class="btn2 xls">${TV.icon("file-down", 24, "currentColor", 2.2)}Excel</span>
    </div>
    <span class="note a-up" style="--d:${T.done + 150}ms">5 хвилин замість вечора</span>
    ${TV.tap(TAP.x, TAP.y, T.tap, A)}
    ${TV.cursor("Іван", A, "an-c", "Пастор Іван")}
  </div></div>
</div>`,
    tick(t, el) {
      el.querySelectorAll(".big").forEach((b) => {
        const n = NUMS[+b.dataset.i];
        const v = (n.plus ? "+" : "") + TV.count(t, n.at + 200, n.at + 1250, 0, n.to);
        if (b.textContent !== v) b.textContent = v;
      });
      const p = { x: TAP.x - 10, y: TAP.y - 6 };
      TV.moveCursor(el.querySelector("#an-c"), t, {
        keys: [[T.tap - 950, 1000, 1060], [T.tap - 40, p.x, p.y], [T.tap + 480, p.x + 14, p.y + 12]],
        show: [T.tap - 950, T.done + 550],
        clicks: [T.tap],
      });
    },
  });
})();
