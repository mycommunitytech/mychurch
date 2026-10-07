/* Служіння — дошка підготовки до неділі (дані з i18n.ts → mocks.serving).
   Кожна команда закриває свою справу: курсор людини її кольору прилітає з-за
   краю, ставить галочку і гасне. Лічильник 2 → 6, салют — «Усе готове до неділі». */
// icons: book-open, music, sliders-horizontal, camera, coffee, hand-heart, check, clock
(function () {
  const W = 880, PAD = 24, GAP = 16, CW = (W - PAD * 2 - GAP) / 2;
  const TEAMS = [
    { kind: "sermon", icon: "book-open", c: "#007aff", who: "Пастор Іван", title: "Дописати проповідь і залити слайди", due: "до сб, 20:00", chips: ["Слайди 12"], done: true, x: PAD, y: 100, w: W - PAD * 2, h: 164 },
    { kind: "worship", icon: "music", c: "#f05b8b", who: "Олена", title: "Зібрати сет і відрепетирувати", due: "до сб, 18:00", chips: ["Ти вірний", "Величний Бог"], x: PAD, y: 280, w: CW, h: 196, click: 2000, from: [-160, 980] },
    { kind: "sound", icon: "sliders-horizontal", c: "#8b5bf0", who: "Дмитро", title: "Налаштувати пульт, саундчек", due: "нд, 9:00", chips: ["4 мікрофони"], x: PAD + CW + GAP, y: 280, w: CW, h: 196, click: 3500, from: [1080, 120] },
    { kind: "photo", icon: "camera", c: "#0ea5e9", who: "Оксана", title: "Зарядити камери, план зйомки", due: "до сб, 21:00", chips: [], x: PAD, y: 492, w: CW, h: 160, click: 5000, from: [260, 1000] },
    { kind: "cafe", icon: "coffee", c: "#f59e0b", who: "Ірина", title: "Купити каву на 60 чашок", due: "до сб, 12:00", chips: [], done: true, x: PAD + CW + GAP, y: 492, w: CW, h: 160 },
    { kind: "order", icon: "hand-heart", c: "#12a150", who: "Василь", title: "Прибрати залу, четверо на вхід", due: "нд, 8:30", chips: [], x: PAD, y: 668, w: W - PAD * 2, h: 108, click: 6500, from: [1060, 900] },
  ];
  const H = 800;
  const ALL = 6500 + 380;
  const clicks = TEAMS.filter((t) => t.click);
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;

  function tile(t, i) {
    const d = t.click ? t.click + 60 : 0;
    // Готова з самого початку — стан «після» стоїть одразу; решта перемикається в мить кліку.
    const was = t.done ? `style="--d:-400ms"` : `style="--d:${d}ms"`;
    const now = t.done ? "" : "a-fade";
    const chips = t.chips.map((c) => `<span class="chip" style="color:${t.c};background:${tint(t.c, 12)}">${TV.esc(c)}</span>`).join("")
      + (t.more ? `<span class="more">${t.more}</span>` : "");
    return `
<div class="tile a-up" style="left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;--d:${420 + i * 70}ms">
  <div class="done-bg ${now}" style="--d:${d}ms"></div>
  <div class="row">
    <span class="box"><span class="box on ${t.done ? "" : "a-pop"}" style="--d:${d}ms">${TV.icon("check", 24, "#fff", 3.2)}</span></span>
    <div class="ttl"><span class="a-outf" ${was}>${TV.esc(t.title)}</span><span class="struck ${now}" style="--d:${d}ms">${TV.esc(t.title)}</span></div>
    <span class="badge" style="background:${tint(t.c, 14)};color:${t.c}">${TV.icon(t.icon, 24, "currentColor", 2.2)}</span>
  </div>
  ${chips ? `<div class="chips">${chips}</div>` : ""}
  <div class="who">${TV.avatar(t.who.replace("Пастор ", ""), 38)}<span>${TV.esc(t.who)}</span>
    <span class="due">${TV.icon("clock", 20, "currentColor", 2.2)}<span class="a-outf" ${was}>${t.due}</span><span class="due-on ${now}" style="--d:${d}ms">${t.due}</span></span>
  </div>
</div>`;
  }

  // Салют із центру дошки, коли готові всі (як на сайті).
  const CONF = ["#f97316", "#12a150", "#007aff", "#f05b8b", "#8b5bf0", "#0ea5e9"];
  const confetti = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2 + (i % 5) * 0.13;
    const reach = 240 + (i % 4) * 70;
    return `<i style="background:${CONF[i % 6]};width:${10 + (i % 3) * 4}px;height:${18 + (i % 4) * 6}px;--dx:${Math.cos(a) * reach * 1.4}px;--dy:${Math.sin(a) * reach + 140}px;--spin:${(420 + (i % 6) * 170) * (i % 2 ? -1 : 1)}deg;--d:${ALL + 40 + (i % 4) * 50}ms;--t:${1300 + (i % 5) * 160}ms"></i>`;
  }).join("");

  TV.scene({
    id: "ministries",
    dur: 10000,
    bg: "light",
    css: `
[data-scene="ministries"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
[data-scene="ministries"] .board { position: absolute; inset: 0; }
[data-scene="ministries"] .head { position: absolute; left: 0; right: 0; top: 0; height: 80px; display: flex; align-items: center; padding: 0 32px;
  border-bottom: 1px solid var(--hairline); font-size: 27px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="ministries"] .head .dot { width: 14px; height: 14px; border-radius: 50%; background: var(--orange); margin-right: 16px; position: relative; }
[data-scene="ministries"] .head .dot i { position: absolute; inset: 0; border-radius: 50%; background: var(--green); }
[data-scene="ministries"] .ready { margin-left: auto; position: relative; font-size: 24px; font-weight: 500; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-scene="ministries"] .ready b { color: var(--ink); font-weight: 700; }
[data-scene="ministries"] .allok { position: absolute; right: 22px; top: 16px; height: 48px; display: flex; align-items: center; gap: 10px; padding: 0 22px 0 16px;
  border-radius: 999px; background: var(--green); color: #fff; font-size: 23px; font-weight: 650; white-space: nowrap; }
[data-scene="ministries"] .tile { position: absolute; border-radius: 22px; background: var(--surface-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.09);
  display: flex; flex-direction: column; padding: 20px 20px 16px 22px; }
[data-scene="ministries"] .done-bg { position: absolute; inset: 0; border-radius: 22px; background: #f3fbf6; box-shadow: inset 0 0 0 2.5px rgba(18,161,80,0.5); }
[data-scene="ministries"] .row { position: relative; display: flex; align-items: flex-start; gap: 16px; }
[data-scene="ministries"] .box { position: relative; flex: none; margin-top: 1px; width: 34px; height: 34px; border-radius: 10px; background: #fff; box-shadow: inset 0 0 0 2.5px rgba(0,0,0,0.18); }
[data-scene="ministries"] .box.on { position: absolute; inset: 0; margin: 0; background: var(--green); box-shadow: none; display: flex; align-items: center; justify-content: center; }
[data-scene="ministries"] .ttl { position: relative; flex: 1; font-size: 26px; line-height: 1.25; font-weight: 650; letter-spacing: -0.015em; }
[data-scene="ministries"] .ttl span { display: block; }
[data-scene="ministries"] .ttl .struck { position: absolute; inset: 0; color: var(--ink-3); text-decoration: line-through; text-decoration-thickness: 2px; }
[data-scene="ministries"] .badge { flex: none; width: 48px; height: 48px; margin: -4px 0 0; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
[data-scene="ministries"] .chips { position: relative; margin: 10px 0 0 50px; display: flex; gap: 10px; align-items: center; white-space: nowrap; overflow: hidden; }
[data-scene="ministries"] .chip { font-size: 20px; font-weight: 600; padding: 6px 14px; border-radius: 999px; }
[data-scene="ministries"] .more { font-size: 20px; font-weight: 600; color: var(--ink-3); }
[data-scene="ministries"] .who { position: relative; margin-top: auto; display: flex; align-items: center; gap: 12px; font-size: 23px; font-weight: 550; color: var(--ink-2); }
[data-scene="ministries"] .due { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 550; color: var(--ink-3); position: relative; font-variant-numeric: tabular-nums; }
[data-scene="ministries"] .due-on { position: absolute; left: 28px; color: var(--green); }
[data-scene="ministries"] .conf { position: absolute; left: 50%; top: 45%; z-index: 40; }
[data-scene="ministries"] .conf i { position: absolute; border-radius: 2px; opacity: 0; animation: serving-conf var(--t) cubic-bezier(0.1, 0.6, 0.3, 1) var(--d) both; }
@keyframes serving-conf {
  0% { opacity: 0; transform: translate(0, 0) rotate(0); }
  4%, 80% { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--spin)); }
}
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Служіння", line: "Спокій перед неділею." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="head"><span class="dot"><i class="a-pop" style="--d:${ALL}ms"></i></span>Неділя, 21 вересня
        <span class="ready a-out" style="--d:${ALL}ms">Зроблено <b class="n">2</b> з 6</span>
        <span class="allok a-pop" style="--d:${ALL + 60}ms">${TV.icon("check", 24, "#fff", 3)}Усе готове до неділі</span>
      </div>
      ${TEAMS.map(tile).join("")}
    </div>
    ${clicks.map((t) => TV.tap(t.x + 39, t.y + 39, t.click, t.c)).join("")}
    ${clicks.map((t, i) => TV.cursor(t.who, t.c, `sv-c${i}`)).join("")}
    <div class="conf">${confetti}</div>
  </div></div>
</div>`,
    tick(t, el) {
      const n = 2 + clicks.filter((c) => t >= c.click + 60).length;
      const b = el.querySelector(".n");
      if (b && b.textContent !== String(n)) b.textContent = n;
      clicks.forEach((c, i) => {
        const tx = c.x + 39 - 10, ty = c.y + 39 - 6;
        TV.moveCursor(el.querySelector(`#sv-c${i}`), t, {
          keys: [[c.click - 760, c.from[0], c.from[1]], [c.click - 40, tx, ty], [c.click + 420, tx + 10, ty + 8]],
          show: [c.click - 760, c.click + 480],
          clicks: [c.click],
        });
      });
    },
  });
})();
