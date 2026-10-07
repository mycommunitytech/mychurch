/* Telegram-бот — телефон із чатом бота церкви «Нове Життя».
   Уся копія дослівно з src/content/telegram.ts (а там — з my-church-backend/src/telegram):
   спершу служіння — «Будете?» → «✅ Буду» → «✅ Ви будете» (serving-text.util.ts);
   бот «друкує…» і шле явку — «Присутніх: 9/13» → «✅ Були всі» → 13/13 (attendance.handler.ts).
   Один курсор — Андрій: лідер домашньої групи і звукорежисер (привітання в герої /telegram). */
// icons: bot, chevron-left, ellipsis-vertical, menu, smile, paperclip
(function () {
  const ID = "telegram-bot";
  const C = "#229ed9";
  // Корпус — пропорції iPhone (390 × 844), збільшені до 440 × 952; радіус ≈ 56 → 63.
  const PW = 440, PH = 952;
  // Екран: грань 3 + рамка 10. Статусбар 54, шапка 74, поле вводу 64, смужка Home 26.
  const CHAT_BOTTOM = 13 + 54 + 74 + (PH - 26 - 54 - 74 - 64 - 26) - 14; // 835 — низ стрічки
  const G2 = 100 + 8 + 50 * 3 + 8 * 2 + 8 + 50; // висота повідомлення про явку з кнопками = 332
  const SHIFT = G2 + 14;

  const T = { b1: 1000, tap1: 2400, type: 3100, b2: 3900, tap2: 5300 };
  const X0 = 13 + 14, XW = PW - 26 - 28; // ліва межа стрічки і її ширина (386)
  const TAP1 = { x: X0 + (XW - 8) / 4, y: CHAT_BOTTOM - 26 };   // «✅ Буду»
  const TAP2 = { x: X0 + XW / 2, y: CHAT_BOTTOM - 25 };         // «✅ Були всі»

  const PEOPLE = [
    { name: "Ірина Гнатюк", icon: "✅" },
    { name: "Олег Сердюк", icon: "❌" },
    { name: "Марія Ткачук", icon: "✅" },
    { name: "Павло Кравець", icon: "⏰" },
    { name: "Ніна Лисенко", icon: "📗" },
    { name: "Тарас Бойко", icon: "❓" },
  ];
  const flipAt = (i) => T.tap2 + 60 + i * 90;
  const flips = PEOPLE.map((p, i) => (p.icon === "✅" ? null : flipAt(i))).filter(Boolean);
  const ALL_DONE = flipAt(PEOPLE.length - 1) + 120;

  const person = (p, i) => {
    const d = flipAt(i);
    const on = p.icon === "✅";
    return `<span class="ib nm">
      <span class="lit a-fade" style="--d:${d}ms"></span>
      <span class="ico">${on ? "✅" : `<span class="a-outf" style="--d:${d}ms">${p.icon}</span><span class="new a-pop" style="--d:${d}ms">✅</span>`}</span>
      <span class="lbl">${TV.esc(p.name)}</span>
    </span>`;
  };

  const status = `<svg width="19" height="13" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
    <svg width="18" height="13" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M1 4.2a10 10 0 0 1 14 0"/><path d="M3.6 7a6.4 6.4 0 0 1 8.8 0"/><path d="M6.3 9.7a2.6 2.6 0 0 1 3.4 0"/></svg>
    <svg width="28" height="13" viewBox="0 0 26 12"><rect x="0.6" y="0.6" width="21" height="10.8" rx="3.2" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.2"/><rect x="2.2" y="2.2" width="17.8" height="7.6" rx="2" fill="currentColor"/><path d="M23.4 4.2v3.6a2 2 0 0 0 0-3.6z" fill="currentColor" fill-opacity="0.5"/></svg>`;
  const plane = `<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#fff" d="M3.2 10.7c3.6-1.6 6-2.6 7.2-3.1 3.4-1.4 4.1-1.7 4.6-1.7.1 0 .3 0 .4.2.1.1.1.2.1.3v.4c-.2 1.7-.9 5.9-1.3 7.8-.2.8-.5 1.1-.8 1.1-.7.1-1.2-.4-1.8-.8-1-.7-1.6-1.1-2.6-1.7-1.1-.7-.4-1.1.2-1.8.2-.2 3-2.7 3-2.9 0-.1 0-.1-.1-.2h-.2c-.1 0-1.6 1-4.4 2.9-.4.3-.8.4-1.1.4-.4 0-1.1-.2-1.6-.4-.6-.2-1.1-.3-1.1-.7.1-.2.5-.5 1.5-.8z"/></svg>`;
  // Шпалери Telegram — ті самі, що на сайті (.tg-wallpaper у globals.css).
  const WALL = "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27148%27%20height%3D%27148%27%20viewBox%3D%270%200%20148%20148%27%20fill%3D%27none%27%20stroke%3D%27rgba%28255%2C255%2C255%2C0.34%29%27%20stroke-width%3D%271.6%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27M26%2044s-10-6.5-10-13a6%206%200%200%201%2010-4.4A6%206%200%200%201%2036%2031c0%206.5-10%2013-10%2013z%27%2F%3E%3Cpath%20d%3D%27M92%2022h26a6%206%200%200%201%206%206v13a6%206%200%200%201-6%206h-14l-9%207v-7h-3a6%206%200%200%201-6-6V28a6%206%200%200%201%206-6z%27%2F%3E%3Cpath%20d%3D%27M112%2084l4%208.4%209.2%201.2-6.7%206.4%201.7%209-8.2-4.4-8.2%204.4%201.7-9-6.7-6.4%209.2-1.2z%27%2F%3E%3Cpath%20d%3D%27M28%20104l24-9-8%2025-5-9-5.5%204%20.6-8z%27%2F%3E%3Cpath%20d%3D%27M39%20111l13-16%27%2F%3E%3Cpath%20d%3D%27M76%2062v24M67%2070h18%27%2F%3E%3Ccircle%20cx%3D%27130%27%20cy%3D%2734%27%20r%3D%273.5%27%2F%3E%3Ccircle%20cx%3D%2756%27%20cy%3D%2770%27%20r%3D%272.5%27%2F%3E%3Ccircle%20cx%3D%2720%27%20cy%3D%27128%27%20r%3D%273%27%2F%3E%3Cpath%20d%3D%27M96%20124h18M105%20115v18%27%2F%3E%3C%2Fsvg%3E";

  const S = `[data-scene="${ID}"]`;
  TV.scene({
    id: ID,
    dur: 8400,
    bg: "light",
    css: `
/* «Telegram-бот» не рветься на дефісі: слово цілим, а плеєр сам зменшить кегль. */
${S} .t .w { white-space: nowrap; }
${S} .mock { position: relative; width: ${PW}px; height: ${PH}px; --vs: 1; --vs-port: 1.2; }
${S} .phone { position: absolute; inset: 0; border-radius: 63px; padding: 3px;
  background: linear-gradient(100deg, #8a919c 0%, #454c56 12%, #2a2f37 50%, #454c56 88%, #8a919c 100%);
  box-shadow: 0 70px 110px -60px rgba(0, 50, 120, 0.6), 0 24px 44px -30px rgba(0, 30, 80, 0.45); }
${S} .key { position: absolute; width: 4px; border-radius: 2px; background: linear-gradient(180deg, #7d848f, #30363f); }
${S} .key.l { left: -3px; } ${S} .key.r { right: -3px; }
${S} .bezel { width: 100%; height: 100%; border-radius: 60px; background: #05080d; padding: 10px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07); }
${S} .screen { position: relative; width: 100%; height: 100%; border-radius: 50px; overflow: hidden; background: #fff; display: flex; flex-direction: column;
  font-family: "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif; }
${S} .sb { flex: none; height: 54px; padding: 6px 30px 0 40px; display: flex; align-items: center; justify-content: space-between; font-size: 20px; font-weight: 650; }
${S} .sb .ics { display: flex; align-items: center; gap: 7px; }
${S} .island { position: absolute; top: 11px; left: 50%; width: 124px; height: 36px; margin-left: -62px; border-radius: 20px; background: #05080d; }
${S} .hd { flex: none; height: 74px; display: flex; align-items: center; gap: 10px; padding: 0 16px 0 8px; border-bottom: 1px solid var(--hairline); }
${S} .bot { flex: none; width: 50px; height: 50px; border-radius: 50%; background: var(--brand); display: flex; align-items: center; justify-content: center; }
${S} .who { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
${S} .who b { font-size: 21px; font-weight: 650; letter-spacing: -0.015em; white-space: nowrap; }
${S} .sub { position: relative; height: 22px; font-size: 20px; color: var(--ink-3); white-space: nowrap; }
${S} .sub span { position: absolute; left: 0; top: 0; }
${S} .sub .typ { color: ${C}; animation: tgb-typ 900ms linear ${T.type}ms both; }
${S} .sub .onl { animation: tgb-onl 900ms linear ${T.type}ms both; }
@keyframes tgb-typ { 0% { opacity: 0; } 12%, 86% { opacity: 1; } 100% { opacity: 0; } }
@keyframes tgb-onl { 0% { opacity: 1; } 12%, 86% { opacity: 0; } 100% { opacity: 1; } }
${S} .chat { position: relative; flex: 1; overflow: hidden; background-color: #b6d4ec;
  background-image: url("${WALL}"), radial-gradient(ellipse 60% 55% at 18% 18%, rgba(255,255,255,0.55), transparent 70%),
    radial-gradient(ellipse 65% 60% at 85% 85%, rgba(86,150,206,0.55), transparent 70%), linear-gradient(160deg, #d3e6f9 0%, #a9cbe9 100%);
  background-size: 170px 170px, auto, auto, auto; background-repeat: repeat, no-repeat, no-repeat, no-repeat; }
${S} .col { position: absolute; left: 14px; right: 14px; bottom: 14px; display: flex; flex-direction: column; gap: 14px;
  animation: tgb-shift 700ms var(--e-emph) ${T.b2}ms both; }
@keyframes tgb-shift { from { transform: translate3d(0, ${SHIFT}px, 0); } }
${S} .grp { display: flex; flex-direction: column; gap: 8px; }
${S} .g2 { height: ${G2}px; animation: tgb-in 620ms var(--e-decel) ${T.b2 + 80}ms both; }
@keyframes tgb-in { from { opacity: 0; transform: translate3d(0, 28px, 0) scale(0.97); } }
${S} .bub { position: relative; background: #fff; border-radius: 18px 18px 18px 5px; padding: 13px 16px 14px; box-shadow: 0 1px 2px rgba(16,35,60,0.18);
  display: flex; flex-direction: column; gap: 5px; font-size: 20px; line-height: 1.32; color: var(--ink-2); }
${S} .bub::before { content: ""; position: absolute; left: -7px; bottom: 0; width: 13px; height: 14px; background: #fff; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
${S} .bub b { font-size: 21px; font-weight: 650; color: var(--ink); letter-spacing: -0.012em; white-space: nowrap; }
${S} .b2 { height: 100px; justify-content: center; }
${S} .ask { position: relative; height: 27px; }
${S} .ask span { position: absolute; left: 0; top: 0; white-space: nowrap; }
${S} .ask .q { color: var(--ink-3); }
${S} .ask .yes { font-weight: 650; color: var(--ink); }
${S} .cnt b { font-size: 20px; font-variant-numeric: tabular-nums; }
${S} .cnt .n { animation: tgb-green 500ms var(--e-std) ${ALL_DONE}ms both; }
@keyframes tgb-green { from { color: var(--ink-2); } to { color: #0f8a45; } }
${S} .row { display: flex; gap: 8px; }
${S} .ib { position: relative; flex: 1; min-width: 0; height: 52px; border-radius: 13px; display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 20px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden;
  background: rgba(255,255,255,0.92); box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.08); color: var(--ink-2); }
${S} .ib > * { position: relative; }
${S} .ib.yes { background: color-mix(in oklab, #12a150 13%, #fff); box-shadow: inset 0 0 0 1.5px color-mix(in oklab, #12a150 38%, transparent); color: #0f8a45; }
${S} .ib.no { background: color-mix(in oklab, #f05b8b 12%, #fff); box-shadow: inset 0 0 0 1.5px color-mix(in oklab, #f05b8b 36%, transparent); color: #d1376b; }
${S} .ib .fill { position: absolute; inset: 0; border-radius: inherit; background: #12a150; color: #fff; display: flex; align-items: center; justify-content: center; }
${S} .ib.nm { height: 50px; justify-content: flex-start; padding: 0 6px 0 8px; gap: 4px; font-weight: 550; letter-spacing: -0.02em; }
${S} .ib.nm .lit { position: absolute; inset: 0; background: color-mix(in oklab, #12a150 10%, #fff); box-shadow: inset 0 0 0 1.5px color-mix(in oklab, #12a150 32%, transparent); border-radius: inherit; }
${S} .ib.nm .lbl { color: var(--ink); }
${S} .ico { position: relative; flex: none; width: 25px; height: 26px; display: inline-flex; align-items: center; justify-content: center; font-size: 19px; }
${S} .ico span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
${S} .ib.all { height: 50px; background: var(--brand); color: #fff; box-shadow: none; font-weight: 650; animation: tgb-press 360ms var(--e-std) ${T.tap2 - 60}ms both; }
@keyframes tgb-press { 0%, 100% { transform: none; } 40% { transform: scale(0.95); filter: brightness(0.9); } }
${S} .ib.yes { animation: tgb-press 360ms var(--e-std) ${T.tap1 - 60}ms both; }
${S} .inp { flex: none; height: 64px; display: flex; align-items: center; gap: 10px; padding: 0 12px; border-top: 1px solid var(--hairline); background: #fff; }
${S} .inp .cir { flex: none; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--surface-3); }
${S} .inp .fld { flex: 1; height: 42px; border-radius: 999px; background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--hairline); display: flex; align-items: center; justify-content: space-between; padding: 0 14px; }
${S} .inp .send { background: #2aabee; }
${S} .home { flex: none; height: 26px; position: relative; background: #fff; }
${S} .home i { position: absolute; left: 50%; bottom: 9px; width: 134px; height: 5px; margin-left: -67px; border-radius: 3px; background: rgba(11,11,15,0.28); }
`,
    html: () => `
<div class="split flip">
  ${TV.copy({ title: "Telegram-бот", line: "Усе — просто в чаті." })}
  <div class="vis"><div class="mock">
    <div class="phone a-rise" style="--d:250ms">
      <span class="key l" style="top:17%;height:4.3%"></span><span class="key l" style="top:23.7%;height:7.7%"></span>
      <span class="key l" style="top:34.1%;height:7.7%"></span><span class="key r" style="top:27.4%;height:12.7%"></span>
      <div class="bezel"><div class="screen">
        <div class="sb"><span>9:41</span><span class="ics">${status}</span></div>
        <div class="island"></div>
        <div class="hd">
          ${TV.icon("chevron-left", 30, "var(--brand)", 2.4)}
          <span class="bot">${TV.icon("bot", 27, "#fff", 2.1)}</span>
          <span class="who"><b>Бот церкви «Нове Життя»</b><span class="sub"><span class="onl">бот · онлайн</span><span class="typ">друкує…</span></span></span>
          ${TV.icon("ellipsis-vertical", 24, "var(--ink-3)", 2)}
        </div>
        <div class="chat"><div class="col">
          <div class="grp a-up" style="--d:${T.b1}ms">
            <div class="bub">
              <b>🙌 Служіння: неділя, 12 жовт.</b>
              <span>Недільне служіння · 10:00</span>
              <span>Ваша роль: Звукорежисер</span>
              <span>📍 Велика зала</span>
              <span class="ask"><span class="q a-outf" style="--d:${T.tap1 + 60}ms">Будете?</span><span class="yes a-fade" style="--d:${T.tap1 + 60}ms">✅ Ви будете</span></span>
            </div>
            <div class="row">
              <span class="ib yes"><span>✅ Буду</span><span class="fill a-fade" style="--d:${T.tap1 + 40}ms">✅ Буду</span></span>
              <span class="ib no"><span>❌ Не зможу</span></span>
            </div>
          </div>
          <div class="grp g2">
            <div class="bub b2">
              <b>📋 Відвідуваність — 12 жовтня</b>
              <span class="cnt">Присутніх: <b class="n">9/13</b></span>
            </div>
            <div class="row">${person(PEOPLE[0], 0)}${person(PEOPLE[1], 1)}</div>
            <div class="row">${person(PEOPLE[2], 2)}${person(PEOPLE[3], 3)}</div>
            <div class="row">${person(PEOPLE[4], 4)}${person(PEOPLE[5], 5)}</div>
            <div class="row"><span class="ib all">✅ Були всі</span></div>
          </div>
        </div></div>
        <div class="inp">
          <span class="cir">${TV.icon("menu", 22, "var(--ink-3)", 2.2)}</span>
          <span class="fld">${TV.icon("smile", 22, "var(--ink-3)", 2)}${TV.icon("paperclip", 22, "var(--ink-3)", 2)}</span>
          <span class="cir send">${plane}</span>
        </div>
        <div class="home"><i></i></div>
      </div></div>
    </div>
    ${TV.tap(TAP1.x, TAP1.y, T.tap1, C)}
    ${TV.tap(TAP2.x, TAP2.y, T.tap2, "var(--brand)")}
    ${TV.cursor("Андрій", C, "tgb-c")}
  </div></div>
</div>`,
    tick(t, el) {
      const n = 9 + flips.filter((d) => t >= d).length;
      const b = el.querySelector(".cnt .n");
      const s = `${n}/13`;
      if (b && b.textContent !== s) b.textContent = s;
      const a = { x: TAP1.x - 10, y: TAP1.y - 6 }, z = { x: TAP2.x - 10, y: TAP2.y - 6 };
      TV.moveCursor(el.querySelector("#tgb-c"), t, {
        keys: [[T.tap1 - 850, 620, 1010], [T.tap1 - 40, a.x, a.y], [T.tap1 + 500, a.x + 14, a.y + 12],
          [T.b2 + 500, a.x + 14, a.y + 12], [T.tap2 - 40, z.x, z.y], [T.tap2 + 460, z.x + 12, z.y + 10]],
        show: [T.tap1 - 850, T.tap2 + 620],
        clicks: [T.tap1, T.tap2],
      });
    },
  });
})();
