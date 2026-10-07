/* Планування служіння — план неділі на стрічці часу (i18n.ts → servicePlanning.plan:
   «Недільне служіння», «Нд, 21 вересня · 10:00», 1:40, блоки 10:00 → 11:32,
   пісенник, «Чекає на відповідального», «План зібрано — команда бачить його в боті»).
   Кожен заповнює свою частину, по черзі: Олена кидає пісні з пісенника в
   прославлення, Дмитро вставляє відео, пастор Іван друкує тему проповіді.
   Наприкінці по готовому плану біжить курсор часу 10:00 → 11:40. */
// icons: list-checks, clock, music-4, sparkles, video, book-open, megaphone, wine, check, plus, play, search
(function () {
  const W = 900;
  const ACC = "#ea580c";
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const deep = (c) => `color-mix(in oklab, ${c} 74%, #0b0b0f)`;
  const ITEMS = [
    { kind: "worship", time: "10:00", name: "Прославлення", min: 35, who: "Олена", c: "#f05b8b", icon: "music-4" },
    { kind: "prayer", time: "10:35", name: "Молитва", min: 7, who: "Андрій", c: "#8b5bf0", icon: "sparkles", value: "Молитва за місто й за нових людей" },
    { kind: "video", time: "10:42", name: "Відео", min: 5, who: "Дмитро", c: "#0ea5e9", icon: "video" },
    { kind: "sermon", time: "10:47", name: "Проповідь", min: 38, who: "Пастор Іван", c: "#007aff", icon: "book-open" },
    { kind: "announce", time: "11:25", name: "Оголошення", min: 7, who: "Марія", c: "#f59e0b", icon: "megaphone", value: "Табір, збір на ремонт, хрещення 5 жовтня" },
    { kind: "communion", time: "11:32", name: "Причастя", min: 8, who: "Пастор Іван", c: "#12a150", icon: "wine", value: "Хліб і чаша · четверо служителів на роздачу", today: true },
  ];
  const SONGS = [["Величний Бог", "G"], ["Ти вірний", "D"], ["Свята присутність", "A"], ["Алілуя", "E"]];
  const TOPIC = "«Хліб життя» · Івана 6:35";
  const face = (who) => who.replace("Пастор ", "");

  // ── хронометраж
  // Рухи швидкі, але між людьми — пауза ≥1,5 с, щоб встигнути побачити внесок кожного;
  // готовий блок підсвічується ≈1 с, курсор часу йде ≈3 с, фінал стоїть ≥2 с.
  // Спокійно: кожен хід ≈3 с — курсор підлітає ≈0,9 с, одна дія, блок світиться ≈1,5 с,
  // і лише тоді з'являється наступна людина. Курсор часу — 4 с, фінал стоїть ≥3 с.
  const O_IN = 1200, O_OPEN = 2150, O_PICK = [2900, 3600], O_CLOSE = 4000, O_OUT = 4700;
  const LAND = 430; // скільки летить пісня з пісенника в блок
  const D_IN = 5550, D_TAP = 6500, D_OUT = 7300;
  const I_IN = 8100, I_TAP = 9050, TYPE0 = 9150, TYPE1 = 10150, SLIDES = 10300, I_OUT = 11000;
  const READY = 10900, PH0 = 12350, PH1 = 16350;
  const FILL = { worship: O_PICK[0] + LAND, video: D_TAP + 60, sermon: TYPE1 };
  // Мить, коли внесок завершено, — блок підсвічується кольором власника.
  const DONE = { worship: O_PICK[O_PICK.length - 1] + LAND, video: D_TAP + 60, sermon: SLIDES };

  // ── геометрія: блоки заввишки за тривалістю (короткі — не нижчі за рядок з двох рядків)
  const HEAD = 92, FOOT = 78, PADY = 16, GAPB = 8, BX = 138, BR = 24;
  const geo = (o) => {
    const SHORT = o === "port" ? 100 : 92;
    const BODY = o === "port" ? 860 : 668;
    const shorts = ITEMS.filter((i) => i.min < 20);
    const talls = ITEMS.filter((i) => i.min >= 20);
    const tallH = BODY - shorts.length * SHORT - (ITEMS.length - 1) * GAPB;
    const tallMin = talls.reduce((a, i) => a + i.min, 0);
    let y = HEAD + PADY;
    const rows = ITEMS.map((it) => {
      const h = it.min < 20 ? SHORT : Math.round((tallH * it.min) / tallMin);
      const r = { ...it, y, h };
      y += h + GAPB;
      return r;
    });
    const end = rows[rows.length - 1];
    return { rows, H: HEAD + PADY + BODY + PADY + FOOT, top: rows[0].y, bottom: end.y + end.h };
  };
  const BW = W - BX - BR;
  const CX = 82; // лівий край тексту всередині блоку

  // Пісенник відкривається під прославленням.
  const POP = { x: 300, w: 430, head: 66, row: 60 };

  function block(r, o) {
    const pre = !!r.value;
    const at = FILL[r.kind];
    const val = (() => {
      if (r.kind === "worship") {
        return `<div class="chips">${O_PICK.map((d, k) => {
          const [n, tone] = SONGS[k];
          const cx = o === "port" ? BX + CX : BX + CX + k * 190, cy = o === "port" ? r.y + 76 + k * 46 : r.y + 76;
          return `<span class="chip" style="--d:${d}ms;--fx:${POP.x + 40 - cx}px;--fy:${popRowY(r, k) - cy}px">${n}<i>${tone}</i></span>`;
        }).join("")}</div>`;
      }
      if (r.kind === "video") return `<div class="val a-pop" style="--d:${at}ms"><span class="thumb">${TV.icon("play", 16, "#fff", 2.6)}</span>YouTube · 3:10</div>`;
      if (r.kind === "sermon") return `<div class="val topic"><span class="typed"></span><span class="a-outf" style="--d:${TYPE1 + 150}ms"><span class="caret a-fade" style="--d:${TYPE0}ms"></span></span>
        <span class="slides a-pop" style="--d:${SLIDES}ms">${TV.icon("check", 18, "currentColor", 3)}слайди додано</span></div>`;
      return `<div class="val">${TV.esc(r.value)}</div>`;
    })();
    const gone = r.kind === "sermon" ? TYPE0 : r.kind === "worship" ? O_PICK[0] : at;
    const empty = pre ? "" : `<div class="empty a-outf" style="--d:${gone}ms">${TV.icon("plus", 18, "currentColor", 2.6)}Чекає на відповідального</div>`;
    return `
<div class="blk" style="top:${r.y}px;height:${r.h}px${r.kind === "worship" ? ";z-index:3" : ""}">
  <div class="ring"></div>
  ${DONE[r.kind] ? `<div class="hl" style="--d:${DONE[r.kind]}ms;--c:${r.c}"></div>` : ""}
  <div class="fill ${pre ? "" : "a-fade"}" style="--d:${at}ms;background:${tint(r.c, 9)};box-shadow:inset 5px 0 0 ${r.c}"></div>
  <span class="ic0">${TV.icon(r.icon, 24, "rgba(11,11,15,0.38)", 2.2)}</span>
  <span class="ic1 ${pre ? "" : "a-fade"}" style="--d:${at}ms;background:${tint(r.c, 16)}">${TV.icon(r.icon, 24, r.c, 2.2)}</span>
  <div class="nm">${r.name}<small>${r.min} хв</small>${r.today ? `<em>цієї неділі</em>` : ""}</div>
  <div class="own">${TV.avatar(face(r.who), 40)}<span>${r.who}</span><b class="${pre ? "" : "a-pop"}" style="--d:${at}ms">${TV.icon("check", 14, "#fff", 3.6)}</b></div>
  <div class="r2">${empty}${r.kind === "worship" || pre ? val : `<div class="a-fade" style="--d:${r.kind === "sermon" ? TYPE0 : at}ms">${val}</div>`}</div>
</div>`;
  }
  const popTop = (r) => r.y + r.h + 6;
  const popRowY = (r, k) => popTop(r) + POP.head + POP.row * k + POP.row / 2;

  TV.scene({
    id: "service-planning",
    dur: 19900,
    bg: "light",
    css: `
[data-scene="service-planning"] .mock { position: relative; width: ${W}px; --vs: 1; --vs-port: 1; }
[data-scene="service-planning"] .board { position: absolute; inset: 0; overflow: hidden; }
[data-scene="service-planning"] .head { position: absolute; left: 0; right: 0; top: 0; height: ${HEAD}px; display: flex; align-items: center; gap: 18px; padding: 0 26px;
  border-bottom: 1px solid var(--hairline); }
[data-scene="service-planning"] .hico { width: 54px; height: 54px; border-radius: 16px; background: ${ACC}; display: flex; align-items: center; justify-content: center; }
[data-scene="service-planning"] .h1 { font-size: 29px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
[data-scene="service-planning"] .h2 { font-size: 22px; font-weight: 500; color: var(--ink-3); margin-top: 4px; }
[data-scene="service-planning"] .now { margin-left: auto; height: 48px; padding: 0 18px 0 16px; border-radius: 999px; display: flex; align-items: center; gap: 10px;
  background: ${ACC}; color: #fff; font-size: 24px; font-weight: 700; font-variant-numeric: tabular-nums; }
[data-scene="service-planning"] .now i { width: 10px; height: 10px; border-radius: 50%; background: #fff; animation: sp-live 1200ms ease-in-out infinite; }
@keyframes sp-live { 50% { opacity: 0.35; } }
[data-scene="service-planning"] .dur { margin-left: 12px; height: 48px; padding: 0 20px 0 16px; border-radius: 999px; display: flex; align-items: center; gap: 8px;
  background: var(--surface-3); font-size: 24px; font-weight: 650; color: var(--ink-2); font-variant-numeric: tabular-nums; }
[data-scene="service-planning"] .axis { position: absolute; left: 118px; width: 3px; border-radius: 2px; background: ${tint(ACC, 22)}; }
[data-scene="service-planning"] .tm { position: absolute; left: 0; width: 100px; text-align: right; font-size: 22px; font-weight: 600; color: var(--ink-3); font-variant-numeric: tabular-nums; transform: translateY(-50%); }
[data-scene="service-planning"] .node { position: absolute; left: 112px; width: 15px; height: 15px; border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 3px rgba(0,0,0,0.18); }
[data-scene="service-planning"] .node i { position: absolute; inset: 0; border-radius: 50%; }
[data-scene="service-planning"] .blk > .ring { position: absolute; inset: -5px; border-radius: 21px; box-shadow: 0 0 0 3px ${ACC}; opacity: 0; pointer-events: none; }
[data-scene="service-planning"] .blk { position: absolute; left: ${BX}px; width: ${BW}px; border-radius: 16px; background: var(--surface-2); box-shadow: inset 5px 0 0 rgba(0,0,0,0.14), inset 0 0 0 1px var(--hairline); }
[data-scene="service-planning"] .fill { position: absolute; inset: 0; border-radius: 16px; }
[data-scene="service-planning"] .hl { position: absolute; inset: -5px; border-radius: 21px; pointer-events: none;
  box-shadow: 0 0 0 3px var(--c), 0 16px 36px -14px var(--c); animation: sp-hl 1900ms var(--e-std) var(--d) both; }
@keyframes sp-hl {
  0% { opacity: 0; transform: scale(0.985); }
  12% { opacity: 1; transform: none; }
  88% { opacity: 1; }
  100% { opacity: 0; }
}
[data-scene="service-planning"] .ic0, [data-scene="service-planning"] .ic1 { position: absolute; left: 20px; top: 12px; width: 46px; height: 46px; border-radius: 13px; display: flex; align-items: center; justify-content: center; }
[data-scene="service-planning"] .ic0 { background: var(--surface-3); }
[data-scene="service-planning"] .nm { position: absolute; left: ${CX}px; top: 17px; display: flex; align-items: baseline; gap: 12px; font-size: 26px; line-height: 34px; font-weight: 650; letter-spacing: -0.015em; white-space: nowrap; }
[data-scene="service-planning"] .nm small { font-size: 21px; font-weight: 550; color: var(--ink-3); }
[data-scene="service-planning"] .nm em { font-style: normal; align-self: center; font-size: 20px; font-weight: 650; color: #0e7a3c; background: var(--green-soft); padding: 3px 12px; border-radius: 999px; }
[data-scene="service-planning"] .own { position: absolute; right: 16px; top: 14px; display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 550; color: var(--ink-2); }
[data-scene="service-planning"] .own .avatar { order: 2; }
[data-scene="service-planning"] .own b { position: absolute; right: -4px; top: 26px; width: 22px; height: 22px; border-radius: 50%; background: var(--green); border: 2.5px solid #fff; display: flex; align-items: center; justify-content: center; }
[data-scene="service-planning"] .r2 { position: absolute; left: ${CX}px; right: 16px; top: 56px; }
[data-scene="service-planning"] .r2 > * { position: absolute; left: 0; top: 0; }
[data-scene="service-planning"] .val { display: flex; align-items: center; gap: 10px; height: 30px; font-size: 21px; font-weight: 500; color: var(--ink-2); white-space: nowrap; }
[data-scene="service-planning"] .empty { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px 0 10px; border-radius: 10px; border: 2px dashed rgba(0,0,0,0.18);
  font-size: 20px; font-weight: 550; color: var(--ink-3); white-space: nowrap; }
[data-scene="service-planning"] .thumb { width: 54px; height: 32px; border-radius: 7px; background: #0b0b0f; display: flex; align-items: center; justify-content: center; }
[data-scene="service-planning"] .topic { font-size: 25px; font-weight: 650; color: var(--ink); gap: 0; height: 36px; }
[data-scene="service-planning"] .caret { display: inline-block; width: 3px; height: 28px; margin-left: 2px; background: #007aff; animation: sp-blink 900ms steps(2) infinite; }
[data-scene="service-planning"] .caret.a-fade { animation: a-fade 200ms var(--e-std) var(--d) both, sp-blink 900ms steps(2) var(--d) infinite; }
@keyframes sp-blink { 50% { opacity: 0; } }
[data-scene="service-planning"] .slides { margin-left: 16px; display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px 0 10px; border-radius: 999px;
  background: var(--green-soft); color: #0e7a3c; font-size: 20px; font-weight: 650; }
[data-scene="service-planning"] .chips { display: flex; gap: 8px; }
[data-scene="service-planning"] .mock.port .chips { flex-direction: column; align-items: flex-start; gap: 6px; }
[data-scene="service-planning"] .chip { display: inline-flex; align-items: center; gap: 9px; height: 40px; padding: 0 9px 0 14px; border-radius: 12px; background: #fff;
  box-shadow: 0 0 0 1.5px ${tint("#f05b8b", 40)}; font-size: 20px; font-weight: 600; color: var(--ink); white-space: nowrap;
  animation: sp-fly ${LAND}ms var(--e-emph) var(--d) both; }
[data-scene="service-planning"] .chip i { font-style: normal; font-size: 18px; font-weight: 700; color: #f05b8b; background: ${tint("#f05b8b", 14)}; border-radius: 7px; padding: 2px 6px; }
@keyframes sp-fly {
  0% { opacity: 0; transform: translate3d(var(--fx), var(--fy), 0) scale(0.9); }
  20% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}
[data-scene="service-planning"] .pop { position: absolute; left: ${POP.x}px; width: ${POP.w}px; z-index: 2; border-radius: 22px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), var(--shadow-pop);
  animation: sp-pop 380ms var(--e-decel) ${O_OPEN}ms both, sp-close 260ms var(--e-accel) ${O_CLOSE}ms both; transform-origin: 20% 0; }
@keyframes sp-pop { from { opacity: 0; transform: translate3d(0, -12px, 0) scale(0.94); } }
@keyframes sp-close { to { opacity: 0; transform: translate3d(0, -8px, 0) scale(0.97); } }
[data-scene="service-planning"] .pop .ph { height: ${POP.head}px; display: flex; align-items: center; gap: 12px; padding: 0 20px; border-bottom: 1px solid var(--hairline); font-size: 24px; font-weight: 700; }
[data-scene="service-planning"] .pop .ph small { font-size: 20px; font-weight: 500; color: var(--ink-3); }
[data-scene="service-planning"] .pop .ph span { width: 36px; height: 36px; border-radius: 10px; background: ${tint("#f05b8b", 14)}; display: flex; align-items: center; justify-content: center; }
[data-scene="service-planning"] .song { position: relative; height: ${POP.row}px; display: flex; align-items: center; gap: 12px; padding: 0 20px; font-size: 23px; font-weight: 600; }
[data-scene="service-planning"] .song + .song { border-top: 1px solid var(--hairline); }
[data-scene="service-planning"] .song .k { margin-left: auto; font-size: 20px; font-weight: 700; color: var(--ink-3); }
[data-scene="service-planning"] .song .in { position: absolute; right: 16px; top: 13px; height: 34px; display: flex; align-items: center; gap: 6px; padding: 0 12px 0 10px; border-radius: 999px;
  background: var(--green); color: #fff; font-size: 20px; font-weight: 650; }
[data-scene="service-planning"] .foot { position: absolute; left: 0; right: 0; bottom: 0; height: ${FOOT}px; display: flex; align-items: center; gap: 14px; padding: 0 26px;
  border-top: 1px solid var(--hairline); background: var(--surface-2); font-size: 23px; font-weight: 600; color: var(--ink-2); }
[data-scene="service-planning"] .st { position: relative; width: 34px; height: 34px; flex: none; }
[data-scene="service-planning"] .st > span { position: absolute; inset: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
[data-scene="service-planning"] .msg { position: relative; flex: 1; height: 34px; }
[data-scene="service-planning"] .msg > span { position: absolute; left: 0; top: 0; line-height: 34px; white-space: nowrap; font-variant-numeric: tabular-nums; }
[data-scene="service-planning"] .msg .ok { color: #0e7a3c; }
[data-scene="service-planning"] .pile { display: flex; }
[data-scene="service-planning"] .pile .avatar { margin-left: -10px; box-shadow: 0 0 0 3px var(--surface-2); }
[data-scene="service-planning"] .play { position: absolute; left: 0; right: ${BR}px; top: 0; height: 0; z-index: 6; opacity: 0; }
[data-scene="service-planning"] .play .ln { position: absolute; left: 120px; width: ${BX - 120 + 2}px; top: -1.5px; height: 3px; background: ${ACC}; border-radius: 2px; }
[data-scene="service-planning"] .play .dot { position: absolute; left: 110px; top: -10px; width: 20px; height: 20px; border-radius: 50%; background: ${ACC}; box-shadow: 0 0 0 4px #fff, 0 4px 12px rgba(234, 88, 12, 0.5); }
`,
    html: (o) => {
      const G = geo(o);
      const w = G.rows[0];
      const times = G.rows.map((r) => `<div class="tm" style="top:${r.y + 29}px">${r.time}</div>
        <div class="node" style="top:${r.y + 22}px"><i class="${r.value ? "" : "a-pop"}" style="--d:${FILL[r.kind] || 0}ms;background:${r.c}"></i></div>`).join("");
      const songs = SONGS.map(([n, k], i) => `<div class="song">${TV.icon("music-4", 22, "rgba(11,11,15,0.45)", 2.2)}${n}<span class="k">${k}</span>
        ${i < O_PICK.length ? `<span class="in a-pop" style="--d:${O_PICK[i] + 60}ms">${TV.icon("check", 16, "#fff", 3.4)}у плані</span>` : ""}</div>`).join("");
      const owners = ["Олена", "Андрій", "Дмитро", "Іван", "Марія"].map((n) => TV.avatar(n, 40)).join("");
      const clicks = [
        TV.tap(BX + CX + 60, w.y + 73, O_OPEN, "#f05b8b"),
        ...O_PICK.map((d, k) => TV.tap(POP.x + 70, popRowY(w, k), d, "#f05b8b")),
        TV.tap(BX + CX + 60, G.rows[2].y + 73, D_TAP, "#0ea5e9"),
        TV.tap(BX + CX + 60, G.rows[3].y + 73, I_TAP, "#007aff"),
      ].join("");
      return `
<div class="split">
  ${TV.copy({ title: "Планування служіння", line: "Кожен знає свою частину." })}
  <div class="vis"><div class="mock ${o}" style="height:${G.H}px">
    <div class="board card a-rise" style="--d:250ms">
      <div class="head">
        <span class="hico">${TV.icon("list-checks", 28, "#fff", 2.4)}</span>
        <div><div class="h1">Недільне служіння</div><div class="h2">Нд, 21 вересня · 10:00</div></div>
        <span class="now a-fade" style="--d:${PH0 - 250}ms"><i></i><span class="nt">10:00</span></span>
        <span class="dur">${TV.icon("clock", 24, "currentColor", 2.2)}1:40</span>
      </div>
      <div class="axis" style="top:${G.top + 29}px;height:${G.bottom - G.top - 29}px"></div>
      ${times}
      <div class="tm" style="top:${G.bottom}px">11:40</div>
      ${G.rows.map((r) => block(r, o)).join("")}
      <div class="foot">
        <div class="st"><span class="a-outf" style="--d:${READY}ms;background:${tint(ACC, 14)}">${TV.icon("clock", 20, ACC, 2.6)}</span>
          <span class="a-pop" style="--d:${READY}ms;background:var(--green)">${TV.icon("check", 20, "#fff", 3.4)}</span></div>
        <div class="msg"><span class="a-outf cnt" style="--d:${READY}ms">Заповнено блоків: 3 з 6</span>
          <span class="ok a-fade" style="--d:${READY}ms">План зібрано — команда бачить його в боті</span></div>
        <div class="pile">${owners}</div>
      </div>
      <div class="play"><div class="ln"></div><div class="dot"></div></div>
      <div class="pop" style="top:${popTop(w)}px">
      <div class="ph"><span>${TV.icon("music-4", 20, "#f05b8b", 2.4)}</span>Пісенник<small>240 пісень</small></div>
      ${songs}
    </div>
    </div>
    ${clicks}
    ${TV.cursor("Олена", "#f05b8b", "sp-o")}
    ${TV.cursor("Дмитро", "#0ea5e9", "sp-d")}
    ${TV.cursor("Іван", "#007aff", "sp-i", "Пастор Іван")}
  </div></div>
</div>`;
    },
    tick(t, el, o) {
      const G = geo(o);
      const w = G.rows[0], v = G.rows[2], s = G.rows[3];
      const n = 3 + ["worship", "video", "sermon"].filter((k) => t >= FILL[k]).length;
      const cnt = el.querySelector(".msg .cnt"), txt = `Заповнено блоків: ${n} з 6`;
      if (cnt && cnt.textContent !== txt) cnt.textContent = txt;

      // Тема проповіді друкується літера за літерою.
      const typed = el.querySelector(".typed");
      if (typed) {
        const k = Math.round(TOPIC.length * TV.prog(t, TYPE0, TYPE1, TV.ease.linear));
        const str = TOPIC.slice(0, k);
        if (typed.textContent !== str) typed.textContent = str;
      }

      // Курсор часу: крапка на осі їде рівно (за пікселями, з м'якими краями), без тексту —
      // час 10:00 → 11:40 читається в шапці й виводиться з позиції крапки. Рамка блоку
      // не перемикається, а плавно спалахує/гасне за відстанню до крапки.
      const play = el.querySelector(".play");
      if (play) {
        const pts = [[0, G.rows[0].y]];
        let acc = 0;
        G.rows.forEach((r, i) => {
          acc += r.min;
          pts.push([acc, i < G.rows.length - 1 ? r.y + r.h + GAPB / 2 : r.y + r.h]);
        });
        const y = TV.mix(pts[0][1], pts[pts.length - 1][1], TV.prog(t, PH0, PH1, TV.ease.inout));
        let m = 100;
        for (let i = 1; i < pts.length; i++) {
          if (y <= pts[i][1]) { m = TV.mix(pts[i - 1][0], pts[i][0], (y - pts[i - 1][1]) / (pts[i][1] - pts[i - 1][1])); break; }
        }
        const vis = Math.min(TV.prog(t, PH0 - 250, PH0, TV.ease.linear), 1);
        play.style.opacity = String(vis);
        play.style.transform = `translate3d(0, ${y}px, 0)`;
        const mm = 600 + Math.round(m), lbl = `${Math.floor(mm / 60)}:${String(mm % 60).padStart(2, "0")}`;
        const nt = el.querySelector(".nt");
        if (nt && nt.textContent !== lbl) nt.textContent = lbl;
        // Рамка блоку: яскравість — від відстані крапки до блоку (0 px → 1, 28 px → 0).
        el.querySelectorAll(".blk > .ring").forEach((ring, i) => {
          const r = G.rows[i], d = y < r.y ? r.y - y : y > r.y + r.h ? y - r.y - r.h : 0;
          const o = (vis * TV.clamp(1 - d / 28)).toFixed(3);
          if (ring.style.opacity !== o) ring.style.opacity = o;
        });
      }

      const at = (x, y) => [x - 10, y - 6];
      const slot = (r) => at(BX + CX + 60, r.y + 73);
      const row = (k) => at(POP.x + 70, popRowY(w, k));
      TV.moveCursor(el.querySelector("#sp-o"), t, {
        keys: [[O_IN, 180, G.H - 50], [O_OPEN - 50, ...slot(w)], [O_OPEN + 250, ...slot(w)],
          [O_PICK[0] - 60, ...row(0)], [O_PICK[0] + 250, ...row(0)], [O_PICK[1] - 60, ...row(1)], [O_PICK[1] + 350, ...row(1)],
          [O_OUT, POP.x + 300, popRowY(w, 3) + 140]],
        show: [O_IN, O_OUT], clicks: [O_OPEN, ...O_PICK],
      });
      TV.moveCursor(el.querySelector("#sp-d"), t, {
        keys: [[D_IN, BX + 40, G.H - 40], [D_TAP - 50, ...slot(v)], [D_TAP + 300, ...slot(v)], [D_OUT, BX + CX + 140, G.H - 30]],
        show: [D_IN, D_OUT], clicks: [D_TAP],
      });
      const [sx, sy] = slot(s);
      TV.moveCursor(el.querySelector("#sp-i"), t, {
        keys: [[I_IN, 80, G.H + 20], [I_TAP - 50, sx, sy], [TYPE0, sx, sy], [TYPE1, sx + 60, sy + 40], [I_OUT, sx + 160, G.H + 10]],
        show: [I_IN, I_OUT], clicks: [I_TAP],
      });
    },
  });
})();
