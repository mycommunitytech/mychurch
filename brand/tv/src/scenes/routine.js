/* Рутина — «Зніми з себе рутину» (i18n.ts → automations.title/titleStrike) і чеклист
   «Було — стало» (i18n.ts → solved.cases: routine, ministries, newcomers, requests).
   Бурштинова риска перекреслює «рутину», як на сайті. Далі чотири болі стають
   у стовпчик із порожніми квадратиками; по черзі кожен отримує зелену галочку,
   біль перекреслюється й гасне, а поруч (у портреті — під ним) виїжджає, як стало. */
// icons: check, arrow-right, corner-down-right
(function () {
  const AMBER = "#f59e0b";
  const CASES = [
    ["Пишемо ті самі нагадування руками", "Нагадування йдуть самі, з журналом."],
    ["Графік служінь зводимо руками щотижня", "Видно, хто служить і де дірка."],
    ["Губимо новеньких після першого разу", "Видно кожного новенького і його крок."],
    ["Губимо прохання і потреби в чатах", "У кожного прохання є власник і статус."],
  ];
  const STRIKE = 1150;                         // риска через «рутину»
  const SHOW = 1750;                           // болі з'являються
  const TICK = (k) => 2900 + k * 1600;         // галочка кожні 1,6 с

  const row = (o) => ([pain, res], k) => {
    const t = TICK(k);
    return `
    <div class="rw a-up" style="--d:${SHOW + k * 140}ms">
      <span class="cb"><span class="cb on a-pop" style="--d:${t}ms">${TV.icon("check", 32, "#fff", 3.4)}</span></span>
      <span class="pn"><span class="px" style="--d:${t + 60}ms">${pain}</span><i class="ps" style="--d:${t + 60}ms"></i></span>
      ${o === "port"
        ? `<span class="rs a-left" style="--d:${t + 260}ms">${TV.icon("corner-down-right", 30, "#12a150", 2.6)}${res}</span>`
        : `<span class="ar a-pop" style="--d:${t + 200}ms">${TV.icon("arrow-right", 34, "#12a150", 2.6)}</span><span class="rs a-left" style="--d:${t + 260}ms">${res}</span>`}
    </div>`;
  };

  TV.scene({
    id: "routine",
    dur: 11400,
    bg: "light",
    css: `
[data-scene="routine"] .t { font-size: 150px; }
[data-scene="routine"] .sw { position: relative; display: inline-block; }
[data-scene="routine"] .sl { position: absolute; left: -0.03em; right: -0.03em; top: 56%; height: 0.1em; margin-top: -0.05em; }
[data-scene="routine"] .sl i { display: block; width: 100%; height: 100%; border-radius: 999px; background: ${AMBER}; transform-origin: 0 50%;
  animation: rt-draw 620ms var(--e-emph) var(--d) both; }
@keyframes rt-draw { from { transform: scaleX(0); } }
[data-scene="routine"] .ls { margin-top: 96px; display: grid; row-gap: 30px; text-align: left; }
[data-scene="routine"] .rw { display: grid; grid-template-columns: 56px 815px 40px auto; column-gap: 22px; align-items: center; }
[data-scene="routine"] .cb { position: relative; width: 56px; height: 56px; border-radius: 16px; background: #fff; box-shadow: inset 0 0 0 3px rgba(11,11,15,0.2); }
[data-scene="routine"] .cb.on { position: absolute; inset: 0; background: var(--green); box-shadow: 0 10px 22px -10px rgba(18,161,80,0.7);
  display: flex; align-items: center; justify-content: center; }
[data-scene="routine"] .pn { position: relative; justify-self: start; white-space: nowrap; font-size: 40px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink); }
[data-scene="routine"] .px { display: inline-block; animation: rt-dim 500ms var(--e-std) var(--d) both; }
@keyframes rt-dim { to { color: rgba(11,11,15,0.38); } }
[data-scene="routine"] .ps { position: absolute; left: -4px; right: -4px; top: 55%; height: 5px; margin-top: -2.5px; border-radius: 3px; background: ${AMBER};
  transform-origin: 0 50%; animation: rt-draw 480ms var(--e-emph) var(--d) both; }
[data-scene="routine"] .ar { display: flex; justify-content: center; }
[data-scene="routine"] .rs { justify-self: start; white-space: nowrap; font-size: 40px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); }
[data-scene="routine"] .rt-port .t { font-size: 132px; }
[data-scene="routine"] .rt-port .ls { margin-top: 96px; row-gap: 46px; }
[data-scene="routine"] .rt-port .rw { grid-template-columns: 56px auto; row-gap: 12px; }
[data-scene="routine"] .rt-port .pn { font-size: 40px; }
[data-scene="routine"] .rt-port .rs { grid-column: 2; display: flex; align-items: center; gap: 12px; margin-left: -4px; font-size: 36px; }
`,
    html: (o) => `
<div class="center rt-${o}">
  <h1 class="t">${TV.words("Зніми з себе", 150)}${o === "port" ? "<br>" : " "}<span class="sw">${TV.words("рутину", 150 + 3 * 70)}<span class="sl"><i style="--d:${STRIKE}ms"></i></span></span></h1>
  <div class="ls">${CASES.map(row(o)).join("")}</div>
</div>`,
  });
})();
