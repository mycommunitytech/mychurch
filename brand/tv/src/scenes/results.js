/* Що працює, а що ні — цілі церкви: план проти факту, дві колонки.
   Цілі й числа — src/content/modules/planning.ts → goals → copy.ua.mock («Цілі 2026»):
     «450 людей до літа» 428 · «У графіку», «25 активних груп» 23 · «У графіку»,
     «Явка 80% на служіннях» 74% · «Відстає», «Явка груп 85%» 79% · «Відстає».
   Причини — теж із контенту, дослівно:
     «+58 за пів року» — i18n.ts → features.mocks.analytics.growth.delta;
     «Домашня група» + «Росте» — activities.ts → groups → mock;
     «Троє зникли з поля зору» — i18n.ts → …attendance.alert;
     «Група «Кемпус Схід»» · 61% — activities.ts → groups → mock («Потребує уваги»).
   Картки падають по черзі, число рахується, смужка доростає і лягає зеленим чи червоним,
   на кінці смужки — позначка; далі під кожною — «Працює» / «Гальмує». */
// icons: check
(function () {
  const ID = "results";
  const G = "#12a150", R = "#e5484d";
  const W = 900, GAP = 24, CW = (W - GAP) / 2, CH = 356, HEAD = 70, H = HEAD + CH * 2 + 20;
  const BAR_W = CW - 52;
  const DROP = [900, 2100, 3300, 4500];         // картки — раз на 1,2 с
  const WHY = [6100, 6900, 7700, 8500];         // причини — раз на 0,8 с

  const CARDS = [
    { ok: true, name: "450 людей до літа", fact: 428, of: "з 450", frac: 428 / 450, why: "+58 за пів року" },
    { ok: true, name: "25 активних груп", fact: 23, of: "з 25", frac: 23 / 25, why: "Домашня група росте" },
    { ok: false, name: "Явка 80% на служіннях", fact: 74, unit: "%", of: "з 80%", frac: 74 / 80, why: "Троє зникли з поля зору" },
    { ok: false, name: "Явка груп 85%", fact: 79, unit: "%", of: "з 85%", frac: 79 / 85, why: "Група «Кемпус Схід» · 61%" },
  ].map((c, i) => ({ ...c, col: c.ok ? 0 : 1, row: i % 2, at: DROP[i], whyAt: WHY[i], c: c.ok ? G : R }));

  const card = (c, i) => {
    const x = c.col * (CW + GAP), y = HEAD + c.row * (CH + 20);
    const fillW = Math.round(BAR_W * c.frac);
    return `
    <div class="gc card a-down" style="left:${x}px;top:${y}px;--d:${c.at}ms">
      <div class="nm">${TV.esc(c.name)}</div>
      <div class="fv"><b class="big" data-i="${i}">0${c.unit || ""}</b><span class="of">${c.of}</span></div>
      <div class="bar"><span class="fill" style="width:${fillW}px;background:${c.c};--d:${c.at + 250}ms"></span>
        <span class="end a-pop" style="left:${fillW - 22}px;background:${c.c};--d:${c.at + 1250}ms">${c.ok ? TV.icon("check", 26, "#fff", 3.4) : "!"}</span></div>
      <div class="why a-up" style="--d:${c.whyAt}ms;background:color-mix(in oklab, ${c.c} 10%, #fff)">
        <b style="color:${c.ok ? "#0e7a3c" : "#c42b31"}">${c.ok ? "Працює" : "Гальмує"}</b><span>${TV.esc(c.why)}</span></div>
    </div>`;
  };

  const S = `[data-scene="${ID}"]`;
  TV.scene({
    id: ID,
    dur: 12400,
    bg: "light",
    css: `
${S} .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
${S} .colh { position: absolute; top: 0; height: 52px; display: inline-flex; align-items: center; gap: 14px; padding: 0 24px 0 18px; border-radius: 999px;
  font-size: 30px; font-weight: 750; letter-spacing: -0.02em; white-space: nowrap; }
${S} .colh i { width: 16px; height: 16px; border-radius: 50%; }
${S} .gc { position: absolute; width: ${CW}px; height: ${CH}px; border-radius: 32px; padding: 26px 26px 0; }
${S} .nm { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; white-space: nowrap; }
${S} .fv { display: flex; align-items: baseline; gap: 14px; margin-top: 8px; }
${S} .big { font-size: 118px; font-weight: 800; letter-spacing: -0.055em; line-height: 0.95; font-variant-numeric: tabular-nums; }
${S} .of { font-size: 36px; font-weight: 650; color: var(--ink-3); letter-spacing: -0.02em; white-space: nowrap; }
${S} .bar { position: relative; margin-top: 18px; width: ${BAR_W}px; height: 22px; border-radius: 11px; background: #eef0f3; }
${S} .fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 11px; transform-origin: 0 50%; animation: rs-fill 1000ms var(--e-emph) var(--d) both; }
@keyframes rs-fill { from { transform: scaleX(0); } }
${S} .end { position: absolute; top: -11px; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 30px; font-weight: 900; line-height: 1; box-shadow: 0 0 0 4px #fff, 0 8px 18px -8px rgba(0,0,0,0.35); }
${S} .why { position: absolute; left: 26px; right: 26px; bottom: 24px; height: 84px; border-radius: 18px; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 0 20px;
  font-size: 24px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
${S} .why b { font-size: 18px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
/* «Що працює,» — одним рядком: плеєр сам зменшить кегль, щоб він уліз у колонку. */
${S} .t { white-space: nowrap; }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: ["Що працює,", "а що ні"], accent: "а що ні" })}
  <div class="vis"><div class="mock">
    <span class="colh a-fade" style="left:0;--d:500ms;color:#0e7a3c;background:color-mix(in oklab, ${G} 12%, #fff)"><i style="background:${G}"></i>Досягаємо</span>
    <span class="colh a-fade" style="left:${CW + GAP}px;--d:640ms;color:#c42b31;background:color-mix(in oklab, ${R} 11%, #fff)"><i style="background:${R}"></i>Не досягаємо</span>
    ${CARDS.map(card).join("")}
  </div></div>
</div>`,
    tick(t, el) {
      el.querySelectorAll(".big").forEach((b) => {
        const c = CARDS[+b.dataset.i];
        const v = TV.count(t, c.at + 250, c.at + 1250, 0, c.fact) + (c.unit || "");
        if (b.textContent !== v) b.textContent = v;
      });
    },
  });
})();
