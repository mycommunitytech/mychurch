/* Серії проповідей — місяць неділь як одна серія (i18n.ts → ministries.sermons:
   «Жовтень»: 5 «Хліб життя» Пастор Іван, 12 «Сіль землі» Пастор Іван,
   19 «Дім на камені» Андрій М., 26 — «Вільно»; servicePlanning: «Хліб життя» ·
   Івана 6:35 · слайди додано; рядок — knowledge: «Матеріали й проповіді в одному місці»).
   Пастор Іван заливає слайди до 5-го, потім ставить на вільне 26-те Андрія М. —
   неділя стає «Заплановано» (теми не вигадуємо). Наприкінці лінія серії
   проходить крізь усі чотири неділі. */
// icons: book-open, upload, check, plus
(function () {
  const W = 900, HEAD = 96;
  const ACC = "#007aff";
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const deep = (c) => `color-mix(in oklab, ${c} 72%, #0b0b0f)`;
  const SUN = [
    { d: 5, theme: "«Хліб життя»", ref: "Івана 6:35", who: "Пастор Іван" },
    { d: 12, theme: "«Сіль землі»", who: "Пастор Іван" },
    { d: 19, theme: "«Дім на камені»", who: "Андрій М." },
    { d: 26, free: true },
  ];
  const face = (w) => (w.startsWith("Пастор") ? "Іван" : "Андрій");

  // ── хронометраж
  const I_IN = 1500, UP0 = 2100, UP1 = 3000, PK = 4300, SEL = 5300, PLAN = 5400, I_OUT = 6100;
  const LINE0 = 6800, LINE1 = 8000;

  // ── геометрія: альбом — стрічка неділь у ряд, портрет — стовпчиком
  const geo = (o) => {
    if (o === "port") {
      const KW = W - 116 - 24, KH = 214, GAP = 20, top = HEAD + 24;
      const cards = SUN.map((_, i) => ({ x: 116, y: top + i * (KH + GAP), w: KW, h: KH }));
      return {
        port: true, cards, H: top + 4 * KH + 3 * GAP + 24,
        node: (i) => ({ x: 58, y: cards[i].y + 52 }),
        frame: (c) => ({ x: c.x + c.w - 20 - 140, y: c.y + 18 + 79 }),
        prch: (c) => ({ x: c.x + 20 + 80, y: c.y + 88 + 20 }),
        pick: (c) => ({ x: c.x + 20, y: c.y + 88 - 8 - 168 }),
      };
    }
    const KW = (W - 48 - 48) / 4, KH = 324, top = 222;
    const cards = SUN.map((_, i) => ({ x: 24 + i * (KW + 16), y: top, w: KW, h: KH }));
    return {
      port: false, cards, H: top + KH + 24,
      node: (i) => ({ x: cards[i].x + KW / 2, y: HEAD + 30 + 34 }),
      frame: (c) => ({ x: c.x + 16 + (KW - 32) / 2, y: c.y + 164 + 47 }),
      prch: (c) => ({ x: c.x + 16 + 76, y: c.y + 110 + 20 }),
      pick: (c) => ({ x: W - 24 - 260, y: c.y + 110 + 40 + 8 }),
    };
  };

  function card(s, i, G) {
    const c = G.cards[i];
    const pre = !s.free;
    const theme = pre ? `<div class="th">${s.theme}</div>`
      : `<div class="th free a-outf" style="--d:${PLAN}ms">Вільно</div><div class="th"><span class="plan a-pop" style="--d:${PLAN + 60}ms">${TV.icon("check", 18, "currentColor", 3.2)}Заплановано</span></div>`;
    const who = pre ? `<div class="pr">${TV.avatar(face(s.who), 40)}<span>${s.who}</span></div>`
      : `<div class="pr a-outf" style="--d:${SEL + 60}ms"><span class="need">${TV.icon("plus", 18, "currentColor", 2.8)}Проповідник</span></div>
         <div class="pr a-fade" style="--d:${SEL + 60}ms">${TV.avatar("Андрій", 40)}<span>Андрій М.</span></div>`;
    const frame = i === 0
      ? `<div class="fr"><div class="up a-outf" style="--d:${UP1}ms">${TV.icon("upload", 22, "currentColor", 2.4)}слайди<i class="bar"><b style="--d:${UP0 + 60}ms"></b></i></div>
          <div class="slide a-fade" style="--d:${UP1}ms"><b>${s.theme}</b><span>${s.ref}</span></div>
          <span class="okb a-pop" style="--d:${UP1 + 120}ms">${TV.icon("check", 16, "#fff", 3.4)}</span></div>`
      : `<div class="fr"><div class="up">${TV.icon("upload", 22, "currentColor", 2.4)}слайди</div></div>`;
    return `
<div class="sc a-up" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;--d:${480 + i * 110}ms">
  ${s.free ? `<div class="dash a-outf" style="--d:${PLAN}ms"></div><div class="solid a-fade" style="--d:${PLAN}ms"></div><div class="hl" style="--d:${PLAN}ms"></div>` : `<div class="solid"></div>`}
  ${theme}
  <div class="sr">${s.ref || ""}</div>
  ${who}
  ${frame}
  <div class="tx">${TV.icon("plus", 16, "currentColor", 2.8)}текст</div>
</div>`;
  }

  TV.scene({
    id: "sermons",
    dur: 10200,
    bg: "light",
    css: `
[data-scene="sermons"] .mock { position: relative; width: ${W}px; --vs: 1; --vs-port: 1; }
[data-scene="sermons"] .board { position: absolute; inset: 0; }
[data-scene="sermons"] .head { position: absolute; left: 0; right: 0; top: 0; height: ${HEAD}px; display: flex; align-items: center; gap: 18px; padding: 0 26px; border-bottom: 1px solid var(--hairline); }
[data-scene="sermons"] .hico { width: 54px; height: 54px; border-radius: 16px; background: ${tint(ACC, 14)}; display: flex; align-items: center; justify-content: center; }
[data-scene="sermons"] .h1 { font-size: 29px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
[data-scene="sermons"] .h2 { font-size: 22px; font-weight: 500; color: var(--ink-3); margin-top: 4px; }
[data-scene="sermons"] .cnt { margin-left: auto; height: 48px; padding: 0 20px; border-radius: 999px; display: flex; align-items: center; background: ${tint(ACC, 12)}; color: ${deep(ACC)};
  font-size: 23px; font-weight: 650; white-space: nowrap; font-variant-numeric: tabular-nums; }
[data-scene="sermons"] .ln, [data-scene="sermons"] .lf { position: absolute; border-radius: 3px; }
[data-scene="sermons"] .ln { background: rgba(0, 0, 0, 0.1); }
[data-scene="sermons"] .lf { background: ${ACC}; animation: sm-fx ${LINE1 - LINE0}ms linear ${LINE0}ms both; transform-origin: 0 0; }
@keyframes sm-fx { from { transform: scaleX(0); } }
@keyframes sm-fy { from { transform: scaleY(0); } }
[data-scene="sermons"] .nd { position: absolute; width: 68px; height: 68px; margin: -34px 0 0 -34px; border-radius: 50%; }
[data-scene="sermons"] .nd > span { position: absolute; inset: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; letter-spacing: -0.03em; }
[data-scene="sermons"] .nd .n0 { background: #fff; box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.14); color: var(--ink); }
[data-scene="sermons"] .nd .n0.free { box-shadow: none; border: 3px dashed rgba(0, 0, 0, 0.22); color: var(--ink-3); }
[data-scene="sermons"] .nd .n1 { background: ${ACC}; color: #fff; box-shadow: 0 8px 20px -8px ${ACC}; }
[data-scene="sermons"] .sc { position: absolute; }
[data-scene="sermons"] .sc > * { position: absolute; }
[data-scene="sermons"] .solid { inset: 0; border-radius: 20px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), 0 10px 26px -16px rgba(10, 30, 70, 0.3); }
[data-scene="sermons"] .dash { inset: 0; border-radius: 20px; border: 2.5px dashed rgba(0, 0, 0, 0.18); background: rgba(255, 255, 255, 0.5); }
[data-scene="sermons"] .hl { inset: -5px; border-radius: 25px; box-shadow: 0 0 0 3px ${ACC}, 0 16px 36px -14px ${ACC}; animation: sm-hl 1200ms var(--e-std) var(--d) both; }
@keyframes sm-hl { 0% { opacity: 0; } 18% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
[data-scene="sermons"] .th { left: 16px; right: 12px; top: 18px; font-size: 26px; line-height: 30px; font-weight: 750; letter-spacing: -0.025em; }
[data-scene="sermons"] .th.free { color: var(--ink-3); font-weight: 650; }
[data-scene="sermons"] .plan { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px 0 10px; border-radius: 999px; background: var(--green); color: #fff; font-size: 21px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="sermons"] .sr { left: 16px; top: 80px; font-size: 20px; font-weight: 600; color: ${deep(ACC)}; }
[data-scene="sermons"] .pr { left: 16px; right: 8px; top: 110px; height: 40px; display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
[data-scene="sermons"] .need { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 12px 0 8px; border-radius: 12px; border: 2px dashed ${tint(ACC, 55)}; color: ${deep(ACC)}; font-size: 20px; font-weight: 650; }
[data-scene="sermons"] .fr { left: 16px; right: 16px; top: 164px; height: 95px; }
[data-scene="sermons"] .fr > div { position: absolute; inset: 0; border-radius: 12px; }
[data-scene="sermons"] .up { border: 2px dashed rgba(0, 0, 0, 0.16); display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--ink-3); font-size: 20px; font-weight: 600; overflow: hidden; }
[data-scene="sermons"] .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; background: transparent; }
[data-scene="sermons"] .bar b { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: ${ACC}; transform-origin: 0 0; animation: sm-up ${UP1 - UP0 - 120}ms linear var(--d) both; }
@keyframes sm-up { 0% { opacity: 0; transform: scaleX(0); } 2% { opacity: 1; } 100% { opacity: 1; transform: scaleX(1); } }
[data-scene="sermons"] .slide { background: #12151d; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: #fff; }
[data-scene="sermons"] .slide b { font-size: 21px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="sermons"] .slide span { font-size: 20px; font-weight: 500; color: rgba(255, 255, 255, 0.7); }
[data-scene="sermons"] .okb { position: absolute; right: -8px; top: -8px; width: 30px; height: 30px; border-radius: 50%; background: var(--green); border: 3px solid #fff; display: flex; align-items: center; justify-content: center; }
[data-scene="sermons"] .tx { left: 16px; top: 274px; height: 32px; display: inline-flex; align-items: center; gap: 5px; padding: 0 12px 0 8px; border-radius: 10px; border: 2px dashed rgba(0, 0, 0, 0.16); color: var(--ink-3); font-size: 20px; font-weight: 600; }
[data-scene="sermons"] .mock.port .th { left: 20px; right: 330px; }
[data-scene="sermons"] .mock.port .sr { left: 20px; top: 54px; }
[data-scene="sermons"] .mock.port .pr { left: 20px; top: 88px; }
[data-scene="sermons"] .mock.port .fr { left: auto; right: 20px; top: 18px; width: 280px; height: 158px; }
[data-scene="sermons"] .mock.port .tx { left: 20px; top: 146px; }
[data-scene="sermons"] .mock.port .slide b { font-size: 26px; }
[data-scene="sermons"] .mock.port .slide span { font-size: 21px; }
[data-scene="sermons"] .pick { position: absolute; z-index: 10; width: 260px; border-radius: 20px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), var(--shadow-pop); padding: 6px 0;
  animation: sm-open 320ms var(--e-decel) ${PK + 40}ms both, sm-close 240ms var(--e-accel) ${SEL + 80}ms both; }
@keyframes sm-open { from { opacity: 0; transform: translate3d(0, -10px, 0) scale(0.95); } }
@keyframes sm-close { to { opacity: 0; transform: scale(0.97); } }
[data-scene="sermons"] .pick .pl { height: 38px; padding: 0 18px; display: flex; align-items: center; font-size: 20px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ink-3); }
[data-scene="sermons"] .pick .op { position: relative; height: 58px; padding: 0 14px; display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 600; }
[data-scene="sermons"] .pick .op i { position: absolute; left: 6px; right: 6px; top: 3px; bottom: 3px; border-radius: 12px; background: ${tint(ACC, 12)}; }
[data-scene="sermons"] .pick .op > :not(i) { position: relative; }
`,
    html: (o) => {
      const G = geo(o);
      const n0 = G.node(0), n3 = G.node(3);
      const line = G.port
        ? `<div class="ln" style="left:${n0.x - 3}px;top:${n0.y}px;width:6px;height:${n3.y - n0.y}px"></div><div class="lf" style="left:${n0.x - 3}px;top:${n0.y}px;width:6px;height:${n3.y - n0.y}px;animation-name:sm-fy"></div>`
        : `<div class="ln" style="left:${n0.x}px;top:${n0.y - 3}px;width:${n3.x - n0.x}px;height:6px"></div><div class="lf" style="left:${n0.x}px;top:${n0.y - 3}px;width:${n3.x - n0.x}px;height:6px"></div>`;
      const nodes = SUN.map((s, i) => {
        const p = G.node(i);
        return `<div class="nd a-pop" style="left:${p.x}px;top:${p.y}px;--d:${420 + i * 110}ms">
          <span class="n0 ${s.free ? "free a-outf" : ""}" style="--d:${PLAN}ms">${s.d}</span>${s.free ? `<span class="n0 a-fade" style="--d:${PLAN}ms">${s.d}</span>` : ""}
          <span class="n1 a-pop" style="--d:${LINE0 + (i / 3) * (LINE1 - LINE0) - 60}ms">${s.d}</span></div>`;
      }).join("");
      const c3 = G.cards[3], pk = G.pick(c3);
      const f0 = G.frame(G.cards[0]), pr = G.prch(c3);
      const opt = (k) => ({ x: pk.x + 90, y: pk.y + 6 + 38 + k * 58 + 29 });
      const pick = `<div class="pick" style="left:${pk.x}px;top:${pk.y}px"><div class="pl">Проповідник</div>
        <div class="op">${TV.avatar("Іван", 38)}<span>Пастор Іван</span></div>
        <div class="op"><i class="a-fade" style="--d:${SEL - 350}ms"></i>${TV.avatar("Андрій", 38)}<span>Андрій М.</span></div></div>`;
      return `
<div class="split">
  ${TV.copy({ title: "Серії проповідей", line: "Матеріали й проповіді в одному місці." })}
  <div class="vis"><div class="mock ${o}" style="height:${G.H}px">
    <div class="board card a-rise" style="--d:250ms">
      <div class="head">
        <span class="hico">${TV.icon("book-open", 28, ACC, 2.3)}</span>
        <div><div class="h1">Проповіді</div><div class="h2">Жовтень · 4 неділі</div></div>
        <span class="cnt">Заплановано 3 з 4</span>
      </div>
      ${line}
      ${SUN.map((s, i) => card(s, i, G)).join("")}
      ${nodes}
      ${pick}
    </div>
    ${TV.tap(f0.x, f0.y, UP0, ACC)}
    ${TV.tap(pr.x, pr.y, PK, ACC)}
    ${TV.tap(opt(1).x, opt(1).y, SEL, ACC)}
    ${TV.cursor("Іван", ACC, "sm-c", "Пастор Іван")}
  </div></div>
</div>`;
    },
    tick(t, el, o) {
      const G = geo(o);
      const cnt = el.querySelector(".cnt"), ct = `Заплановано ${t >= PLAN ? 4 : 3} з 4`;
      if (cnt && cnt.textContent !== ct) cnt.textContent = ct;
      const c3 = G.cards[3], pk = G.pick(c3), f0 = G.frame(G.cards[0]), pr = G.prch(c3);
      const op = { x: pk.x + 90, y: pk.y + 6 + 38 + 58 + 29 };
      const at = (p) => [p.x - 10, p.y - 6];
      TV.moveCursor(el.querySelector("#sm-c"), t, {
        keys: [[I_IN, f0.x - 120, G.H - 30], [UP0 - 60, ...at(f0)], [UP0 + 250, ...at(f0)], [UP1 + 300, f0.x + 30, f0.y + 60],
          [PK - 60, ...at(pr)], [PK + 200, ...at(pr)], [SEL - 60, ...at(op)], [SEL + 150, ...at(op)], [I_OUT, op.x - 160, G.H - 20]],
        show: [I_IN, I_OUT],
        clicks: [UP0, PK, SEL],
      });
    },
  });
})();
