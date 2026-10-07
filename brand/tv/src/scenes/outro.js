/* Фінал петлі — три спокійні кроки, без недомовок:
   1) «Час — людям, а не рутині» і словесний знак (2026-10-02 власник обрав замість «Досягай людей»;
      це стиснутий рядок зі сторінки «Про нас»: «…витрачали час на людей, а не на рутину»);
   2) «Що далі?» — чотири етапи з i18n.ts → consultingPage.stages: назва і `result` дослівно,
      жодних строків і цін;
   3) етапи стискаються в рядок, уперед виходить біла картка з QR «Запланувати зустріч» —
      і стоїть понад 5 с, щоб люди встигли навести телефон. Гасло лишається малим угорі. */
// icons: chevron-right
(function () {
  const STAGES = [
    ["Знайомство", "Спільне розуміння, з чого починати"],
    ["Рішення", "План впровадження, який можна показати раді церкви"],
    ["Впровадження", "Система працює на ваших реальних даних"],
    ["Супровід", "Команда працює самостійно"],
  ];
  const SHRINK = 3000, Q = 3600, S0 = 4200, STEP = 800, T3 = 9700, DUR = 16200;
  const sd = (i) => S0 + i * STEP;

  const X = `[data-scene="outro"]`;
  TV.scene({
    id: "outro",
    dur: DUR,
    bg: "blue",
    css: `
/* ── 1 · гасло: спершу велике по центру, потім мале вгорі */
${X} .hero { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
${X} .shrink { display: flex; flex-direction: column; align-items: center; text-align: center; --ty: -458px; --sc: 0.3;
  animation: outro-shrink 900ms var(--e-emph) ${SHRINK}ms both; }
@keyframes outro-shrink { to { transform: translate3d(0, var(--ty), 0) scale(var(--sc)); } }
${X} .wm { overflow: hidden; padding: 6px 8px 18px; margin: -6px -8px 26px; }
${X} .wm > div { animation: outro-wm 1000ms var(--e-emph) 150ms both; }
@keyframes outro-wm { from { transform: translate3d(0, 130%, 0); } }
${X} .t { font-size: 200px; line-height: 0.96; letter-spacing: -0.05em; color: #fff; white-space: nowrap; }

/* ── 2 · що далі */
${X} .q { position: absolute; left: 0; right: 0; top: 300px; text-align: center; font-size: 110px; font-weight: 800; letter-spacing: -0.045em; line-height: 1; color: #fff; }
${X} .steps { position: absolute; left: 130px; right: 130px; top: 500px; display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 34px; }
${X} .stp { position: relative; }
${X} .num { display: flex; width: 92px; height: 92px; border-radius: 50%; background: #fff; color: var(--brand); align-items: center; justify-content: center;
  font-size: 46px; font-weight: 800; letter-spacing: -0.03em; }
${X} .ln { position: absolute; left: 112px; right: -14px; top: 44px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.35); transform-origin: 0 50%;
  animation: outro-grow 700ms var(--e-emph) var(--d) both; }
@keyframes outro-grow { from { transform: scaleX(0); } }
${X} .stp b { display: block; margin-top: 30px; font-size: 46px; font-weight: 800; letter-spacing: -0.03em; color: #fff; white-space: nowrap; }
${X} .stp p { margin-top: 12px; font-size: 29px; line-height: 1.3; font-weight: 500; color: rgba(255,255,255,0.84); max-width: 380px; }

/* ── 3 · QR і стиснутий рядок етапів */
${X} .qc { position: absolute; left: 50%; top: 232px; transform: translateX(-50%); }
${X} .qin { animation: outro-come 900ms var(--e-spring) ${T3 + 250}ms both; }
@keyframes outro-come { from { opacity: 0; transform: translate3d(0, 90px, 0) scale(0.82); } }
${X} .qin > div { display: flex; flex-direction: column; align-items: center; padding: 40px 40px 34px; border-radius: 46px; background: #fff;
  box-shadow: 0 2px 4px rgba(0, 20, 60, 0.18), 0 40px 80px -30px rgba(0, 20, 70, 0.55); }
${X} .qr-w { position: relative; width: 420px; height: 420px; }
${X} .qr-w svg.qr { display: block; width: 100%; height: 100%; }
${X} .fr { position: absolute; inset: -14px; animation: outro-breathe 1600ms ease-in-out ${T3 + 1300}ms infinite both; }
${X} .fr i { position: absolute; width: 50px; height: 50px; border: 0 solid var(--brand); }
${X} .fr i:nth-child(1) { left: 0; top: 0; border-width: 6px 0 0 6px; border-top-left-radius: 16px; }
${X} .fr i:nth-child(2) { right: 0; top: 0; border-width: 6px 6px 0 0; border-top-right-radius: 16px; }
${X} .fr i:nth-child(3) { left: 0; bottom: 0; border-width: 0 0 6px 6px; border-bottom-left-radius: 16px; }
${X} .fr i:nth-child(4) { right: 0; bottom: 0; border-width: 0 6px 6px 0; border-bottom-right-radius: 16px; }
@keyframes outro-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.035); } }
${X} .cap { margin-top: 30px; font-size: 40px; font-weight: 750; letter-spacing: -0.02em; color: var(--ink); white-space: nowrap; }
${X} .url { margin-top: 6px; font-size: 32px; font-weight: 600; letter-spacing: -0.01em; color: var(--brand); white-space: nowrap; }
${X} .row { position: absolute; left: 0; right: 0; top: 930px; display: flex; justify-content: center; align-items: center; gap: 18px; white-space: nowrap; }
${X} .row span { display: inline-flex; align-items: center; gap: 12px; font-size: 30px; font-weight: 700; color: #fff; }
${X} .row span i { display: flex; width: 46px; height: 46px; border-radius: 50%; background: #fff; color: var(--brand); align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; font-style: normal; }
${X} .row .sep { color: rgba(255,255,255,0.55); }

/* ── портрет: усе стовпчиком */
[data-o="port"] ${X} .shrink { --ty: -800px; --sc: 0.34; }
[data-o="port"] ${X} .t { font-size: 168px; }
[data-o="port"] ${X} .q { top: 420px; font-size: 112px; }
[data-o="port"] ${X} .steps { left: 100px; right: 70px; top: 620px; grid-template-columns: 1fr; row-gap: 70px; }
[data-o="port"] ${X} .stp { display: grid; grid-template-columns: 100px 1fr; column-gap: 34px; align-items: start; }
[data-o="port"] ${X} .num { width: 100px; height: 100px; font-size: 50px; }
[data-o="port"] ${X} .stp b { margin-top: 8px; font-size: 56px; }
[data-o="port"] ${X} .stp p { grid-column: 2; margin-top: 10px; font-size: 35px; max-width: none; }
[data-o="port"] ${X} .stp .num { grid-row: 1 / span 2; }
[data-o="port"] ${X} .ln { left: 48px; right: auto; top: 118px; width: 4px; height: calc(100% - 50px); transform-origin: 50% 0;
  animation-name: outro-grow-v; }
@keyframes outro-grow-v { from { transform: scaleY(0); } }
[data-o="port"] ${X} .qc { top: 560px; }
[data-o="port"] ${X} .qr-w { width: 580px; height: 580px; }
[data-o="port"] ${X} .cap { font-size: 46px; }
[data-o="port"] ${X} .url { font-size: 36px; }
[data-o="port"] ${X} .row { top: 1490px; gap: 12px; }
[data-o="port"] ${X} .row span { font-size: 25px; gap: 8px; }
[data-o="port"] ${X} .row span i { width: 38px; height: 38px; font-size: 20px; }
`,
    html: (o) => {
      const slogan = o === "port"
        ? `${TV.words("Час —", 380)}<br>${TV.words("людям,", 480, 70, "acc")}<br>${TV.words("а не рутині", 580)}`
        : `${TV.words("Час —", 380)} ${TV.words("людям,", 480, 70, "acc")}<br>${TV.words("а не рутині", 580)}`;
      const steps = STAGES.map(([title, result], i) => `
        <div class="stp">
          ${i < 3 ? `<i class="ln" style="--d:${sd(i) + 500}ms"></i>` : ""}
          <span class="num a-pop" style="--d:${sd(i)}ms">${i + 1}</span>
          <b class="a-up" style="--d:${sd(i) + 80}ms">${title}</b>
          <p class="a-up" style="--d:${sd(i) + 200}ms">${result}</p>
        </div>`).join("");
      const row = STAGES.map(([title], i) =>
        `<span><i>${i + 1}</i>${title}</span>${i < 3 ? `<span class="sep">${TV.icon("chevron-right", 30, "currentColor", 2.6)}</span>` : ""}`).join("");
      return `
<div class="hero"><div class="shrink">
  <div class="wm"><div>${TV.wordmark(o === "port" ? 96 : 88, "#fff", "#fff")}</div></div>
  <h1 class="t">${slogan}</h1>
</div></div>
<div class="next"><div class="a-out" style="--d:${T3}ms">
  <h2 class="q a-up" style="--d:${Q}ms">Що далі?</h2>
  <div class="steps">${steps}</div>
</div></div>
<div class="row a-up" style="--d:${T3 + 450}ms">${row}</div>
<div class="qc"><div class="qin"><div>
  <div class="qr-w">${window.TV_QR || ""}<div class="fr"><i></i><i></i><i></i><i></i></div></div>
  <div class="cap">Запланувати зустріч</div>
  <div class="url">mychurch.com.ua</div>
</div></div></div>`;
    },
  });
})();
