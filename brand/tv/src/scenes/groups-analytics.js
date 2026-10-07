/* Аналітика груп — теплова карта явки за 8 тижнів по п'яти групах (назви й дні —
   i18n.ts → homeGroups.groups; «23 групи · 312 учасників · явка 84%», 79%, 88%, 90%,
   61% «Потребує уваги» і лідер Василь Панченко — модуль groups → mock; Група Андрія
   6 з 7 = 86% — homeGroups.open). Тижні заповнюються стовпчик за стовпчиком, середня
   явка рахується наживо, пастор сортує за явкою — Чоловіча злітає нагору як та, що
   згасає. Він відкриває її: у кожного учасника 8 крапок, двоє пропустили три зустрічі
   поспіль, і система пропонує подзвонити лідеру. */
// icons: arrow-up, arrow-down, arrow-up-down, arrow-up-narrow-wide, phone
(function () {
  const TEAL = "#0d9488", AMBER = "#f59e0b", BLUE = "#007aff";
  const W = 880, H = 880;
  const PAD = 32, NAME_W = 214, HEAT_X = PAD + NAME_W + 16, CELL = 46, CG = 8, PCT_X = HEAT_X + 8 * CELL + 7 * CG + 18;
  const Y0 = 168, RH = 116;
  const HEAT0 = 1300, STEP = 250, ARROWS = 3400;
  const SORTCLICK = 4600, SORT = 4700, PICK = 5900, DETAIL = 6100, DOTS0 = DETAIL + 420, FLAGS = 7600, NUDGE = 8900;
  const GROUPS = [
    { name: "Молодіжна", when: "Вт, 19:00", wk: [84, 80, 76, 82, 78, 74, 80, 78] },
    { name: "Жіноча", when: "Ср, 19:30", wk: [86, 90, 88, 84, 90, 88, 90, 88] },
    { name: "Група Андрія", when: "Чт, 19:00", wk: [86, 86, 71, 100, 86, 86, 86, 86] },
    { name: "Сімейна", when: "Пт, 19:00", wk: [80, 84, 86, 90, 92, 94, 96, 98] },
    { name: "Чоловіча", when: "Сб, 17:00", wk: [100, 86, 71, 57, 57, 43, 29, 43], pick: true },
  ];
  GROUPS.forEach((g) => {
    g.avg = g.wk.reduce((a, b) => a + b, 0) / 8;
    // Зміна: середнє останніх чотирьох тижнів проти перших чотирьох, у пунктах.
    g.delta = Math.round((g.wk.slice(4).reduce((a, b) => a + b, 0) - g.wk.slice(0, 4).reduce((a, b) => a + b, 0)) / 4);
  });
  // Сортування за середньою явкою знизу вгору: спершу ті, кому потрібна допомога.
  const order = GROUPS.map((g, i) => i).sort((a, b) => GROUPS[a].avg - GROUPS[b].avg);
  GROUPS.forEach((g, i) => { g.to = order.indexOf(i); });
  // Учасники Чоловічої: 1 — був, 0 — не був. Разом 34 з 56 = 61%.
  const MEMBERS = [
    { name: "Марко", wk: [1, 1, 1, 1, 1, 1, 1, 1] },
    { name: "Данило", wk: [1, 1, 1, 1, 0, 1, 0, 1] },
    { name: "Михайло", wk: [1, 1, 1, 0, 1, 0, 0, 1] },
    { name: "Сава", wk: [1, 1, 0, 1, 0, 0, 1, 0] },
    { name: "Ілля", wk: [1, 0, 1, 0, 0, 1, 0, 0] },
    { name: "Павло", wk: [1, 1, 1, 0, 1, 0, 0, 0], flag: true },
    { name: "Лука", wk: [1, 1, 0, 1, 1, 0, 0, 0], flag: true },
  ];
  const tint = (c, p) => `color-mix(in oklab, ${c} ${Math.round(p)}%, #fff)`;
  const heat = (v) => (v >= 80 ? tint(TEAL, 55 + (v - 80) * 2.25) : v >= 60 ? tint(TEAL, 22 + (v - 60) * 1.4) : tint(AMBER, 30 + (60 - v) * 2));
  const colX = (i) => HEAT_X + i * (CELL + CG);
  const DT = { x: 16, y: Y0 + RH + 10, w: W - 32, h: H - (Y0 + RH + 10) - 14 };
  const MRH = 52, MY0 = 72;
  const SORT_AT = [HEAT_X + 96, 140];
  const PICK_AT = [PAD + 90, Y0 + RH / 2];

  function row(g, i) {
    const cells = g.wk.map((v, w) =>
      `<span class="cell a-pop" style="left:${colX(w) - PAD}px;background:${heat(v)};color:${v >= 92 ? "#fff" : "var(--ink)"};--d:${HEAT0 + w * STEP + i * 30}ms">${v}</span>`).join("");
    const dc = g.delta > 0 ? "var(--green)" : g.delta <= -5 ? "#b45309" : "var(--ink-3)";
    const tr = `<span class="dl a-pop" style="color:${dc};--d:${ARROWS + i * 60}ms">${g.delta ? TV.icon(g.delta > 0 ? "arrow-up" : "arrow-down", 20, "currentColor", 2.8) : ""}${g.delta > 0 ? "+" : g.delta < 0 ? "−" : ""}${Math.abs(g.delta)}</span>`;
    return `
<div class="row" style="top:${Y0 + i * RH}px;--dy:${(g.to - i) * RH}px">
  <div class="ri a-up" style="--d:${620 + i * 70}ms">
    ${g.pick ? `<span class="sel a-fade" style="--d:${PICK + 60}ms"></span>` : ""}
    <div class="gn"><b>${g.name}</b><span>${g.when}</span></div>
    ${cells}
    <div class="pc"><b class="pv" data-g="${i}">—</b>${tr}</div>
  </div>
</div>`;
  }

  function member(m, k) {
    const y = MY0 + k * MRH;
    const dots = m.wk.map((v, w) => {
      const x = colX(w) - DT.x + CELL / 2 - 15;
      return `<span class="dot ${v ? "on" : ""} a-pop" style="left:${x}px;--d:${DOTS0 + w * 80 + k * 20}ms"></span>`;
    }).join("");
    const flag = m.flag
      ? `<span class="miss a-fade" style="left:${colX(5) - DT.x - 4}px;width:${3 * CELL + 2 * CG + 8}px;--d:${FLAGS}ms"></span>`
      : "";
    const cnt = `<span class="mc${m.flag ? " warn" : ""}" style="--d:${FLAGS}ms"><b class="mcn" data-m="${k}">0</b> з 8</span>`;
    return `
<div class="mem" style="top:${y}px">
  ${flag}
  <span class="ma ${m.flag ? "warn" : ""}" style="--d:${FLAGS}ms">${TV.avatar(m.name, 40)}</span>
  <span class="mn">${m.name}</span>
  ${dots}${cnt}
</div>`;
  }

  TV.scene({
    id: "groups-analytics",
    dur: 11600,
    bg: "light",
    css: `
[data-scene="groups-analytics"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
[data-scene="groups-analytics"] .board { position: absolute; inset: 0; overflow: hidden; }
[data-scene="groups-analytics"] .hd { position: absolute; left: ${PAD}px; top: 28px; }
[data-scene="groups-analytics"] .hd b { display: block; font-size: 32px; font-weight: 750; letter-spacing: -0.025em; }
[data-scene="groups-analytics"] .hd span { display: block; margin-top: 6px; font-size: 22px; font-weight: 500; color: var(--ink-3); }
[data-scene="groups-analytics"] .cols { position: absolute; left: 0; right: 0; top: 124px; height: 32px; font-size: 20px; font-weight: 600; color: var(--ink-3); }
[data-scene="groups-analytics"] .cols > span { position: absolute; top: 0; line-height: 32px; white-space: nowrap; }
[data-scene="groups-analytics"] .cols .srt { left: ${HEAT_X}px; display: flex; align-items: center; gap: 6px; }
[data-scene="groups-analytics"] .cols .srt .sw { position: relative; width: 24px; height: 24px; }
[data-scene="groups-analytics"] .cols .srt .sw > span { position: absolute; inset: 0; display: flex; }
[data-scene="groups-analytics"] .cols .srt .lbl { position: relative; }
[data-scene="groups-analytics"] .cols .srt .lbl > span { display: block; }
[data-scene="groups-analytics"] .cols .srt .lbl .on { position: absolute; left: 0; top: 0; color: ${TEAL}; }
[data-scene="groups-analytics"] .row { position: absolute; left: 0; width: ${W}px; height: ${RH}px; animation: ga-sort 820ms var(--e-emph) ${SORT}ms both; }
@keyframes ga-sort { to { transform: translate3d(0, var(--dy), 0); } }
[data-scene="groups-analytics"] .ri { position: absolute; inset: 0; }
[data-scene="groups-analytics"] .ri::after { content: ""; position: absolute; left: ${PAD}px; right: ${PAD}px; bottom: 0; height: 1px; background: var(--hairline); }
[data-scene="groups-analytics"] .sel { position: absolute; left: 14px; right: 14px; top: 6px; bottom: 6px; border-radius: 20px; background: ${tint(TEAL, 7)}; box-shadow: inset 0 0 0 2.5px ${TEAL}; }
[data-scene="groups-analytics"] .gn { position: absolute; left: ${PAD}px; top: 50%; transform: translateY(-50%); }
[data-scene="groups-analytics"] .gn b { display: block; font-size: 25px; font-weight: 700; letter-spacing: -0.015em; white-space: nowrap; }
[data-scene="groups-analytics"] .gn span { display: block; margin-top: 4px; font-size: 20px; font-weight: 500; color: var(--ink-3); }
[data-scene="groups-analytics"] .cell { position: absolute; top: ${(RH - CELL) / 2 - 2}px; margin-left: ${PAD}px; width: ${CELL}px; height: ${CELL + 4}px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 750; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
[data-scene="groups-analytics"] .pc { position: absolute; right: ${PAD}px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: flex-end; }
[data-scene="groups-analytics"] .pc b { font-size: 46px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
[data-scene="groups-analytics"] .dl { margin-top: 6px; display: flex; align-items: center; gap: 2px; font-size: 21px; font-weight: 700; font-variant-numeric: tabular-nums; }
[data-scene="groups-analytics"] .lg { position: absolute; left: ${HEAT_X}px; top: ${Y0 + 5 * RH + 22}px; display: flex; gap: 22px; font-size: 20px; font-weight: 550; color: var(--ink-3); }
[data-scene="groups-analytics"] .lg span { display: inline-flex; align-items: center; gap: 8px; }
[data-scene="groups-analytics"] .lg i { width: 20px; height: 20px; border-radius: 6px; }
[data-scene="groups-analytics"] .dt { position: absolute; left: ${DT.x}px; top: ${DT.y}px; width: ${DT.w}px; height: ${DT.h}px; z-index: 10; border-radius: 26px; }
[data-scene="groups-analytics"] .dt .dh { position: absolute; left: 24px; right: 24px; top: 22px; display: flex; align-items: baseline; gap: 12px; }
[data-scene="groups-analytics"] .dt .dh b { font-size: 23px; font-weight: 700; letter-spacing: -0.01em; }
[data-scene="groups-analytics"] .dt .dh span { font-size: 20px; font-weight: 500; color: var(--ink-3); }
[data-scene="groups-analytics"] .mem { position: absolute; left: 0; right: 0; height: ${MRH}px; }
[data-scene="groups-analytics"] .ma { position: absolute; left: 22px; top: ${(MRH - 40) / 2}px; width: 40px; height: 40px; border-radius: 50%; }
[data-scene="groups-analytics"] .ma.warn { animation: ga-warn 500ms var(--e-std) var(--d) both; }
@keyframes ga-warn { from { box-shadow: 0 0 0 0 ${AMBER}; } to { box-shadow: 0 0 0 3.5px ${AMBER}; } }
[data-scene="groups-analytics"] .mn { position: absolute; left: 76px; top: 0; line-height: ${MRH}px; font-size: 22px; font-weight: 600; }
[data-scene="groups-analytics"] .dot { position: absolute; top: ${(MRH - 30) / 2}px; width: 30px; height: 30px; border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 2.5px #d5dae0; }
[data-scene="groups-analytics"] .dot.on { background: ${TEAL}; box-shadow: none; }
[data-scene="groups-analytics"] .miss { position: absolute; top: 4px; height: ${MRH - 8}px; border-radius: 999px; background: ${tint(AMBER, 16)}; box-shadow: inset 0 0 0 2.5px ${AMBER}; }
[data-scene="groups-analytics"] .mc { position: absolute; right: 24px; top: 0; line-height: ${MRH}px; font-size: 22px; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
[data-scene="groups-analytics"] .mc b { font-size: 28px; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
[data-scene="groups-analytics"] .mc.warn b { animation: ga-amb 500ms var(--e-std) var(--d) both; }
@keyframes ga-amb { to { color: #b45309; } }
[data-scene="groups-analytics"] .dt .fl { position: absolute; right: 20px; top: 14px; height: 40px; display: flex; align-items: center; gap: 8px; padding: 0 16px; border-radius: 999px;
  background: ${tint(AMBER, 16)}; box-shadow: inset 0 0 0 2px ${AMBER}; font-size: 20px; font-weight: 700; color: #b45309; white-space: nowrap; }
[data-scene="groups-analytics"] .nudge { position: absolute; left: 16px; right: 16px; bottom: 16px; height: 104px; border-radius: 20px; background: var(--surface-3);
  display: flex; align-items: center; gap: 16px; padding: 0 16px 0 18px; }
[data-scene="groups-analytics"] .nudge .tx { flex: 1; min-width: 0; }
[data-scene="groups-analytics"] .nudge .tx b { display: block; font-size: 23px; font-weight: 700; letter-spacing: -0.01em; }
[data-scene="groups-analytics"] .nudge .tx span { display: block; margin-top: 4px; font-size: 20px; font-weight: 500; color: var(--ink-3); }
[data-scene="groups-analytics"] .call { position: relative; flex: none; height: 60px; padding: 0 28px 0 22px; border-radius: 999px; background: ${TEAL}; color: #fff;
  display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 650; }
[data-scene="groups-analytics"] .call i { position: absolute; inset: 0; border-radius: 999px; box-shadow: 0 0 0 3px ${TEAL}; opacity: 0;
  animation: ga-pulse 1700ms var(--e-decel) ${NUDGE + 900}ms infinite both; }
@keyframes ga-pulse { 0% { opacity: 0; transform: scale(1); } 15% { opacity: 0.55; } 100% { opacity: 0; transform: scale(1.1, 1.45); } }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Аналітика", line: "Реальна картина замість відчуттів." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="hd"><b>Малі групи</b><span>23 групи · 312 учасників · явка 84%</span></div>
      <div class="cols a-fade" style="--d:560ms">
        <span style="left:${PAD}px">Група</span>
        <span style="right:${PAD}px">Середня</span>
        <span class="srt"><span class="lbl"><span class="a-outf" style="--d:${SORTCLICK + 40}ms">Явка за 8 тижнів</span><span class="on a-fade" style="--d:${SORTCLICK + 40}ms">Явка за 8 тижнів</span></span>
          <span class="sw"><span class="a-outf" style="--d:${SORTCLICK + 40}ms">${TV.icon("arrow-up-down", 24, "currentColor", 2.2)}</span>
          <span class="a-fade" style="--d:${SORTCLICK + 40}ms">${TV.icon("arrow-up-narrow-wide", 24, TEAL, 2.4)}</span></span></span>
      </div>
      ${GROUPS.map(row).join("")}
      <div class="lg a-fade" style="--d:${HEAT0 + 8 * STEP}ms">
        <span><i style="background:${heat(95)}"></i>80–100%</span><span><i style="background:${heat(70)}"></i>60–80%</span><span><i style="background:${heat(40)}"></i>менше 60%</span>
      </div>
      <div class="dt card a-up" style="--d:${DETAIL}ms">
        <div class="dh"><b>Учасники</b><span>7 осіб · 8 тижнів</span></div>
        <div class="fl a-pop" style="--d:${FLAGS + 120}ms">Двоє — 3 зустрічі поспіль</div>
        ${MEMBERS.map(member).join("")}
        <div class="nudge a-up" style="--d:${NUDGE}ms">
          ${TV.avatar("Василь", 60)}
          <div class="tx"><b>Лідеру потрібна допомога</b><span>Василь Панченко, лідер групи</span></div>
          <span class="call"><i></i>${TV.icon("phone", 24, "#fff", 2.4)}Подзвонити</span>
        </div>
      </div>
    </div>
    ${TV.tap(SORT_AT[0], SORT_AT[1], SORTCLICK, BLUE)}
    ${TV.tap(PICK_AT[0], PICK_AT[1], PICK, BLUE)}
    ${TV.cursor("Іван", BLUE, "ga-cur", "Пастор Іван")}
  </div></div>
</div>`,
    tick(t, el) {
      GROUPS.forEach((g, i) => {
        const seen = g.wk.filter((_, w) => t >= HEAT0 + w * STEP + i * 30 + 80);
        const s = seen.length ? Math.round(seen.reduce((a, b) => a + b, 0) / seen.length) + "%" : "—";
        const b = el.querySelector(`.pv[data-g="${i}"]`);
        if (b && b.textContent !== s) b.textContent = s;
        const low = seen.length && Math.round(seen.reduce((a, b) => a + b, 0) / seen.length) < 70;
        if (b) b.style.color = low ? "#b45309" : "";
      });
      MEMBERS.forEach((m, k) => {
        const n = m.wk.filter((v, w) => v && t >= DOTS0 + w * 80 + k * 20 + 60).length;
        const b = el.querySelector(`.mcn[data-m="${k}"]`);
        if (b && b.textContent !== String(n)) b.textContent = n;
      });
      TV.moveCursor(el.querySelector("#ga-cur"), t, {
        keys: [[3900, 980, 620], [SORTCLICK - 60, SORT_AT[0] - 10, SORT_AT[1] - 6], [SORTCLICK + 160, SORT_AT[0] - 4, SORT_AT[1] - 2],
          [PICK - 60, PICK_AT[0] - 10, PICK_AT[1] - 6], [PICK + 160, PICK_AT[0] - 4, PICK_AT[1] - 2], [PICK + 900, -120, PICK_AT[1] + 40]],
        show: [3900, PICK + 760],
        clicks: [SORTCLICK, PICK],
      });
    },
  });
})();
