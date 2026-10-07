/* Заявки — канбан звернень (дані з tools.ts → applications: mock, pipeline).
   Три звернення прилітають у «Нові» з бота, сайту й Instagram; кожне за типом
   отримує відповідального — аватарка лягає печаткою, лічильник «без
   відповідального» падає до нуля. Андрій тягне свою «Зустріч із пастором»
   у «У роботі», а потім — у «Закриті». */
// icons: inbox, send, globe, camera, check
(function () {
  const C = "#6366f1";
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const W = 912, H = 772;
  const PAD = 14, GAP = 10, LW = (W - PAD * 2 - GAP * 2) / 3;
  const LY = 100, CH = 184, SG = 12;
  const lx = (col) => PAD + col * (LW + GAP);
  const pos = (col, slot) => [lx(col) + 8, LY + 62 + slot * (CH + SG)];
  const COLS = ["Нові", "У роботі", "Закриті"];

  // Руки Андрія: взяв → поклав. Час у мс від старту сцени.
  const G1 = 4000, D1 = 4700, G2 = 5350, D2 = 6050;
  const TONE = { meet: C, pray: "#8b5bf0", serve: "#f59e0b", bapt: "#0ea5e9", done: "#12a150" };
  const SRC = { bot: ["send", "#229ed9"], site: ["globe", "#64748b"], insta: ["camera", "#e1306c"] };
  const CARDS = [
    { id: "e1", title: "Хрещення", who: "Марія Іщенко", tone: "bapt", resp: "Андрій М.", due: "до пт",
      moves: [[0, 1, 0], [D1 - 180, 1, 1], [G2 + 120, 1, 0]] },
    { id: "e2", title: "Вінчання 14 листопада", who: "Дмитро та Олена", tone: "done", done: true,
      moves: [[0, 2, 0], [D2 - 180, 2, 1]] },
    { id: "b", title: "Молитва за маму", who: "Ігор Лисенко", tone: "pray", src: "site", resp: "Наталя Р.", arr: 1480, stamp: 2640,
      moves: [[1480, 0, 1], [G1 + 160, 0, 0]] },
    { id: "c", title: "Хочу служити на звуці", who: "Тарас Бойко", tone: "serve", src: "insta", resp: "Дмитро", arr: 1760, stamp: 3000,
      moves: [[1760, 0, 2], [G1 + 240, 0, 1]] },
    { id: "a", title: "Зустріч із пастором", who: "Оксана Гриценко", tone: "meet", src: "bot", resp: "Андрій М.", arr: 1200, stamp: 2280,
      moves: [[1200, 0, 0], [G1, 1, 0, D1 - G1, TV.ease.inout], [G2, 2, 0, D2 - G2, TV.ease.inout]], drag: true },
  ];
  const A = CARDS.find((c) => c.id === "a");

  function cardHTML(c) {
    const tone = TONE[c.tone];
    const src = c.src ? `<span class="src" style="background:${tint(SRC[c.src][1], 14)};color:${SRC[c.src][1]}">${TV.icon(SRC[c.src][0], 20, "currentColor", 2.3)}</span>` : "";
    let foot;
    if (c.done) {
      foot = `<span class="okc">${TV.icon("check", 20, "#fff", 3.2)}</span><span class="rn ok">Готово</span>`;
    } else if (!c.stamp) {
      foot = `${TV.avatar(c.resp.split(" ")[0], 44)}<span class="rn">${c.resp}</span>${c.due ? `<span class="due">${c.due}</span>` : ""}`;
    } else {
      const s = c.stamp;
      foot = `<span class="slot"><span class="nobody a-outf" style="--d:${s}ms"></span>
          <i class="pulse" style="--d:${s + 120}ms;--c:${tone}"></i>
          <span class="stamp" style="--d:${s}ms">${TV.avatar(c.resp.split(" ")[0], 44)}</span></span>
        <span class="rn"><span class="ghost a-outf" style="--d:${s}ms">не призначено</span><span class="nm a-fade" style="--d:${s + 160}ms">${c.resp}</span></span>`;
    }
    // Картка «Зустріч» у «Закритих» отримує зелену галочку в мить, коли її поклали.
    const closed = c.drag
      ? `<i class="bar a-fade" style="background:${TONE.done};--d:${D2 + 40}ms"></i><span class="src ok a-pop" style="--d:${D2 + 40}ms">${TV.icon("check", 22, "#fff", 3.2)}</span>` : "";
    return `
<div class="cw" id="ap-${c.id}"><div class="cd">
  <i class="bar" style="background:${tone}"></i>
  <div class="ttl">${TV.esc(c.title)}</div>
  <div class="who">${TV.esc(c.who)}</div>
  ${src}
  <div class="ft">${foot}</div>
  ${closed}
</div></div>`;
  }

  const lanes = COLS.map((n, i) => `
    <div class="lane" style="left:${lx(i)}px;top:${LY}px;width:${LW}px;height:${H - LY - 14}px">
      <div class="lh">${n}<span class="cnt" data-col="${i}">0</span></div>
    </div>`).join("");

  // Скільки карток у колонці в мить t (картка «переїжджає» на середині руху).
  function colOf(c, t) {
    if (c.arr && t < c.arr) return -1;
    let col = c.moves[0][1];
    for (let i = 1; i < c.moves.length; i++) {
      const [mt, cc, , d = 520] = c.moves[i];
      if (t >= mt + d / 2) col = cc;
    }
    return col;
  }
  function place(c, t) {
    let [x, y] = pos(c.moves[0][1], c.moves[0][2]);
    for (let i = 1; i < c.moves.length; i++) {
      const [mt, cc, ss, d = 520, e = TV.ease.emph] = c.moves[i];
      if (t <= mt) break;
      const p = e(TV.clamp((t - mt) / d));
      const [nx, ny] = pos(cc, ss);
      x += (nx - x) * p;
      y += (ny - y) * p;
    }
    return [x, y];
  }
  const GX = 176, GY = 34; // де Андрій тримає картку

  TV.scene({
    id: "applications",
    dur: 8800,
    bg: "light",
    css: `
[data-scene="applications"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 0.985; }
[data-scene="applications"] .board { position: absolute; inset: 0; }
[data-scene="applications"] .hd { position: absolute; left: 0; right: 0; top: 0; height: 84px; display: flex; align-items: center; gap: 14px; padding: 0 22px 0 28px;
  border-bottom: 1px solid var(--hairline); font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
[data-scene="applications"] .hd .ic { color: ${C}; }
[data-scene="applications"] .free { margin-left: auto; position: relative; display: inline-flex; align-items: center; gap: 12px; height: 50px; padding: 0 22px 0 18px;
  border-radius: 999px; background: var(--surface-3); font-size: 23px; font-weight: 550; color: var(--ink-2); letter-spacing: -0.01em; }
[data-scene="applications"] .free b { font-size: 26px; font-weight: 750; color: var(--ink); font-variant-numeric: tabular-nums; min-width: 16px; text-align: center; }
[data-scene="applications"] .free .dot { position: relative; width: 14px; height: 14px; border-radius: 50%; background: var(--amber); }
[data-scene="applications"] .free .dot i { position: absolute; inset: 0; border-radius: 50%; background: var(--green); }
[data-scene="applications"] .lane { position: absolute; border-radius: 22px; background: #f3f4f8; }
[data-scene="applications"] .lh { position: absolute; left: 20px; right: 16px; top: 14px; height: 36px; display: flex; align-items: center; gap: 10px;
  font-size: 24px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="applications"] .cnt { min-width: 34px; height: 30px; padding: 0 10px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.08);
  display: inline-flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 650; color: var(--ink-2); font-variant-numeric: tabular-nums; }
[data-scene="applications"] .cw { position: absolute; left: 0; top: 0; width: ${LW - 16}px; height: ${CH}px; }
[data-scene="applications"] #ap-a { z-index: 5; }
[data-scene="applications"] .cd { position: absolute; inset: 0; border-radius: 18px; background: #fff; overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.07), 0 6px 16px -8px rgba(10,30,70,0.18); }
[data-scene="applications"] .bar { position: absolute; left: 0; top: 0; bottom: 0; width: 6px; }
[data-scene="applications"] .ttl { position: absolute; left: 22px; right: 58px; top: 16px; font-size: 24px; font-weight: 700; line-height: 1.2; letter-spacing: -0.015em; }
[data-scene="applications"] .who { position: absolute; left: 22px; right: 14px; top: 84px; font-size: 20px; font-weight: 500; color: var(--ink-3); white-space: nowrap; }
[data-scene="applications"] .src { position: absolute; right: 14px; top: 14px; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
[data-scene="applications"] .ft { position: absolute; left: 20px; right: 14px; bottom: 16px; height: 48px; display: flex; align-items: center; gap: 10px; }
[data-scene="applications"] .rn { position: relative; flex: 1; min-width: 0; font-size: 21px; font-weight: 650; white-space: nowrap; height: 28px; }
[data-scene="applications"] .rn > span { position: absolute; left: 0; top: 0; }
[data-scene="applications"] .rn.ok { color: var(--green); }
[data-scene="applications"] .ghost { color: var(--ink-3); font-weight: 550; }
[data-scene="applications"] .due { flex: none; height: 32px; padding: 0 12px; border-radius: 999px; background: var(--surface-3); display: inline-flex; align-items: center;
  font-size: 20px; font-weight: 600; color: var(--ink-2); }
[data-scene="applications"] .okc { flex: none; width: 40px; height: 40px; border-radius: 50%; background: var(--green); display: flex; align-items: center; justify-content: center; }
[data-scene="applications"] .slot { position: relative; flex: none; width: 44px; height: 44px; }
[data-scene="applications"] .nobody { position: absolute; inset: 0; border-radius: 50%; border: 2.5px dashed rgba(11,11,15,0.3); }
[data-scene="applications"] .stamp { position: absolute; inset: 0; animation: ap-stamp 560ms var(--e-emph) var(--d) both; }
[data-scene="applications"] .stamp .avatar { box-shadow: 0 0 0 3px #fff, 0 6px 14px -4px rgba(0,0,0,0.35); }
@keyframes ap-stamp {
  0% { opacity: 0; transform: scale(2.1) rotate(-14deg); }
  55% { opacity: 1; transform: scale(0.9) rotate(2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}
[data-scene="applications"] .pulse { position: absolute; inset: -4px; border-radius: 50%; box-shadow: 0 0 0 3px var(--c); opacity: 0;
  animation: ap-pulse 800ms var(--e-decel) var(--d) both; }
@keyframes ap-pulse { 0% { opacity: 0; transform: scale(0.9); } 15% { opacity: 0.9; } 100% { opacity: 0; transform: scale(1.9); } }
[data-scene="applications"] .src.ok { background: var(--green); }
`,
    html: (o) => `
<div class="split${o === "port" ? "" : " flip"}">
  ${TV.copy({ title: "Заявки", line: "Жодне звернення не губиться: у кожного є відповідальний." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="hd">${TV.icon("inbox", 30, "currentColor", 2.2)}Заявки
        <span class="free a-fade" style="--d:900ms"><span class="dot"><i class="a-pop" style="--d:${CARDS.find((c) => c.id === "c").stamp + 80}ms"></i></span>Без відповідального <b class="n">0</b></span>
      </div>
      ${lanes}
      ${CARDS.map(cardHTML).join("")}
    </div>
    ${TV.tap(pos(0, 0)[0] + GX, pos(0, 0)[1] + GY, G1 - 20, C)}
    ${TV.tap(pos(1, 0)[0] + GX, pos(1, 0)[1] + GY, G2 - 20, C)}
    ${TV.cursor("Андрій", C, "ap-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      for (const c of CARDS) {
        const w = el.querySelector(`#ap-${c.id}`);
        if (!w) continue;
        let [x, y] = place(c, t);
        let op = 1, extra = "";
        if (c.arr) {
          const p = TV.prog(t, c.arr, c.arr + 520, TV.ease.decel);
          op = TV.prog(t, c.arr, c.arr + 200, TV.ease.linear);
          y -= 70 * (1 - p);
          extra = ` scale(${0.94 + 0.06 * p})`;
        }
        if (c.drag) {
          const lift = Math.max(
            TV.prog(t, G1 - 60, G1 + 120) * (1 - TV.prog(t, D1 - 60, D1 + 160)),
            TV.prog(t, G2 - 60, G2 + 120) * (1 - TV.prog(t, D2 - 60, D2 + 160)));
          extra += ` rotate(${2.2 * lift}deg) scale(${1 + 0.04 * lift})`;
          const cd = w.firstElementChild;
          if (cd) cd.style.boxShadow = `0 0 0 1px rgba(0,0,0,0.07), 0 ${6 + 26 * lift}px ${16 + 36 * lift}px -${8 + 8 * lift}px rgba(20,30,90,${0.18 + 0.3 * lift})`;
        }
        w.style.transform = `translate3d(${x}px, ${y}px, 0)${extra}`;
        w.style.opacity = String(op);
      }
      // Лічильники колонок і «без відповідального».
      el.querySelectorAll(".cnt").forEach((n) => {
        const k = String(CARDS.filter((c) => colOf(c, t) === +n.dataset.col).length);
        if (n.textContent !== k) n.textContent = k;
      });
      const free = String(CARDS.filter((c) => c.stamp && t >= c.arr && t < c.stamp).length);
      const b = el.querySelector(".free .n");
      if (b && b.textContent !== free) b.textContent = free;
      // Андрій: з-за краю до картки, тягне її двічі, відпускає.
      const [a0x, a0y] = pos(0, 0), [a1x, a1y] = pos(1, 0), [a2x, a2y] = pos(2, 0);
      TV.moveCursor(el.querySelector("#ap-cur"), t, {
        keys: [
          [G1 - 760, a0x + GX + 260, a0y + GY + 520],
          [G1 - 60, a0x + GX - 10, a0y + GY - 6],
          [G1, a0x + GX - 10, a0y + GY - 6],
          [D1, a1x + GX - 10, a1y + GY - 6],
          [G2, a1x + GX - 10, a1y + GY - 6],
          [D2, a2x + GX - 10, a2y + GY - 6],
          [D2 + 600, a2x + GX + 40, a2y + GY + 260],
        ],
        show: [G1 - 760, D2 + 560],
        clicks: [G1 - 20, G2 - 20],
      });
    },
  });
})();
