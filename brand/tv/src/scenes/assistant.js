/* ШІ-асистенти — один чат з асистентом церкви (дані: i18n.ts → ai: chat, tryIt, scenarios,
   trust). Ім'я «Єва» — лише приклад: церква сама називає свого асистента (ai.chat.caption);
   фото Єви — єдине справжнє фото на сайті (public/eva.jpg).
   Два сценарії з каталогу: питання «Хто лідер медіа?» → коротка відповідь зі списком;
   потім дія «хто не був у групі вже місяць…» → план і картка «Підтвердити» (жодної дії
   без «так», ai.trust) → лідер підтверджує → «Надіслала 2 лідерам…».
   Текст набирається по літері в tick; стрічка чату прокручується сама. */
// icons: check, send, chevron-left, users
(function () {
  const C = "#a855f7";                                   // MODULE_ACCENTS.assistant
  const TG = "#229ed9";
  const Q1 = "Хто лідер медіа?";
  const Q2 = "Єво, хто не був у моїй групі вже місяць? Нагадай мені подзвонити їм і напиши лідерам";
  const ROWS1 = [["Лідер", "Богдан Р."], ["У служінні", "6 людей"], ["Найближча зміна", "неділя, 10:00"]];
  const LEADERS = [["Андрій К.", "Андрій", "Молодіжна група", "2 людини"], ["Оксана М.", "Оксана", "Сімейна група", "1 людина"]];
  const SENT = "Надіслала 2 лідерам ✅ Завтра о 10:00 нагадаю вам подзвонити Олі.";

  // ── час (мс)
  const T = {
    phone: 250,
    type1: [900, 1550], send1: 1700, dots1: [1850, 2650], a1: 2650,
    type2: [4300, 6350], send2: 6500, dots2: [6650, 7450], a2: 7450,
    tap: 9150, dots3: [9350, 9950], a3: 9950,
  };
  // ── стрічка: повідомлення йдуть потоком; кожне — у своєму слоті, де спершу
  // з'являються крапки «друкує», а потім сама відповідь. Прокрутку рахує tick з висот.
  const TOP = 14;
  const slot = (d, body, dotsAt) => `<div class="slot">${dotsAt ? `<div class="dots-o" style="--d:${dotsAt[1]}ms"><div class="msg in dots a-up" style="--d:${dotsAt[0]}ms"><i></i><i></i><i></i></div></div>` : ""}${body}</div>`;
  const inBub = (d, body, cls = "") => `<div class="msg in ${cls} a-up" style="--d:${d}ms">${body}</div>`;
  const outBub = (d, text) => `<div class="msg out a-up" style="--d:${d}ms"><span>${text}</span><i class="tick">${TV.icon("check", 18, TG, 2.6)}</i></div>`;
  // [мить появи, № слота, чи це крапки]
  const SHOW = [[T.send1, 0], [T.dots1[0], 1, true], [T.a1, 1], [T.send2, 2], [T.dots2[0], 3, true], [T.a2, 3], [T.dots3[0], 4, true], [T.a3, 4]];

  const feed = [
    slot(T.send1, outBub(T.send1, Q1)),
    slot(T.a1, inBub(T.a1, `<p>Медіа веде Богдан Р. Ось команда:</p>
      <div class="rows">${ROWS1.map(([k, v], j) => `<div class="rw a-fade" style="--d:${T.a1 + 150 + j * 120}ms"><span>${k}</span><b>${v}</b></div>`).join("")}</div>`), T.dots1),
    slot(T.send2, outBub(T.send2, Q2)),
    slot(T.a2, inBub(T.a2, `<b class="ok">Готово</b><p>3 людини, 2 лідери. Ось кому надсилаю:</p>
      ${LEADERS.map(([n, face, g, c], j) => `<div class="ld a-fade" style="--d:${T.a2 + 200 + j * 150}ms">${TV.avatar(face, 52)}<div><p class="l1"><b>${n}</b><em>${c}</em></p><span>${g}</span></div></div>`).join("")}
      <div class="ask a-fade" style="--d:${T.a2 + 550}ms">Дія — лише після вашого «так»</div>
      <div class="btns a-fade" style="--d:${T.a2 + 650}ms">
        <span class="bt yes" id="as-yes"><span class="l0">Підтвердити</span><span class="l1 a-fade" style="--d:${T.tap + 40}ms">${TV.icon("check", 24, "#fff", 3.2)}Підтвердити</span></span>
        <span class="bt no a-outf" style="--d:${T.tap + 40}ms"><span>Змінити</span></span>
      </div>`, "card"), T.dots2),
    slot(T.a3, inBub(T.a3, `<p>${SENT}</p>`), T.dots3),
  ].join("");

  const S = '[data-scene="assistant"]';
  const PW = 462, PH = 1000;                             // iPhone 390 × 844 — на всю висоту полотна
  TV.scene({
    id: "assistant",
    dur: 12400,
    bg: "light",
    css: `
${S} .t .w { white-space: nowrap; }
${S} .mock { position: relative; width: ${PW}px; height: ${PH + 44}px; --vs: 1; --vs-port: 1.1; }
${S} .phone { position: absolute; left: 0; top: 0; width: ${PW}px; height: ${PH}px; border-radius: 60px; padding: 3px;
  background: linear-gradient(100deg, #8a919c 0%, #454c56 12%, #2a2f37 50%, #454c56 88%, #8a919c 100%);
  box-shadow: 0 60px 100px -60px rgba(0,50,120,0.6), 0 24px 44px -30px rgba(0,30,80,0.45); }
${S} .bezel { width: 100%; height: 100%; border-radius: 57px; background: #05080d; padding: 10px; }
${S} .screen { position: relative; width: 100%; height: 100%; border-radius: 47px; overflow: hidden; background: #fff; display: flex; flex-direction: column;
  font-family: "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif; }
${S} .sb { flex: none; height: 56px; padding: 8px 36px 0 44px; display: flex; align-items: center; justify-content: space-between; font-size: 21px; font-weight: 650; }
${S} .sb .bat { width: 32px; height: 15px; border-radius: 4px; box-shadow: inset 0 0 0 2px var(--ink); position: relative; }
${S} .sb .bat::after { content: ""; position: absolute; left: 3px; top: 3px; bottom: 3px; width: 20px; border-radius: 2px; background: var(--ink); }
${S} .island { position: absolute; top: 11px; left: 50%; width: 120px; height: 34px; margin-left: -60px; border-radius: 18px; background: #05080d; }
${S} .hd { flex: none; height: 86px; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 6px; border-bottom: 1px solid var(--hairline); }
${S} .hd .ic { color: ${TG}; }
${S} .hd img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
${S} .hd b { display: block; font-size: 26px; font-weight: 650; letter-spacing: -0.01em; }
${S} .hd .st { display: block; margin-top: 3px; font-size: 21px; color: var(--ink-3); }
${S} .chat { position: relative; flex: 1; overflow: hidden; background: linear-gradient(160deg, #d6e8f9 0%, #b3d1ec 100%); }
${S} .feed { position: absolute; left: 0; right: 0; top: 0; padding: ${TOP}px 12px 0; display: flex; flex-direction: column; gap: 12px; }
${S} .slot { position: relative; display: flex; flex-direction: column; }
${S} .msg { position: relative; max-width: 392px; padding: 15px 20px; border-radius: 22px; font-size: 26px; line-height: 1.3; color: var(--ink);
  box-shadow: 0 1px 2px rgba(16,35,60,0.16); }
${S} .msg.in { align-self: flex-start; background: #fff; border-bottom-left-radius: 6px; }
${S} .msg.card { width: 412px; max-width: none; }
${S} .msg.out { align-self: flex-end; background: #e1f7cf; border-bottom-right-radius: 6px; padding-right: 44px; }
${S} .msg.out .tick { position: absolute; right: 12px; bottom: 10px; }
${S} .msg p { margin: 0; }
${S} .rows { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
${S} .rw { display: flex; justify-content: space-between; gap: 16px; padding-top: 10px; border-top: 1px solid var(--hairline); font-size: 24px; }
${S} .rw span { color: var(--ink-3); white-space: nowrap; }
${S} .rw b { font-weight: 650; white-space: nowrap; }
${S} .ok { display: block; font-size: 27px; font-weight: 750; color: ${C}; margin-bottom: 4px; }
${S} .ld { margin-top: 12px; display: flex; align-items: center; gap: 12px; }
${S} .ld div { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
${S} .ld .l1 { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
${S} .ld b { font-size: 25px; font-weight: 650; }
${S} .ld span { font-size: 22px; color: var(--ink-3); white-space: nowrap; }
${S} .ld em { font-style: normal; font-size: 23px; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
${S} .ask { margin-top: 14px; font-size: 23px; font-weight: 600; color: ${C}; }
${S} .btns { margin-top: 10px; display: flex; gap: 10px; }
${S} .bt { position: relative; flex: 1; height: 60px; border-radius: 15px; overflow: hidden; font-size: 24px; font-weight: 650; }
${S} .bt > span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px; }
${S} .bt.yes .l0 { background: ${C}; color: #fff; }
${S} .bt.yes .l1 { background: var(--green); color: #fff; }
${S} .bt.yes { flex: 1.5; }
${S} .bt.yes .l1 { gap: 6px; }
${S} .bt.no { box-shadow: inset 0 0 0 2px var(--hairline-strong); color: var(--ink-2); }
${S} .dots-o { position: absolute; left: 0; top: 0; animation: a-outf 120ms linear var(--d) both; }
${S} .msg.dots { display: flex; gap: 7px; padding: 20px 22px; }
${S} .msg.dots i { width: 11px; height: 11px; border-radius: 50%; background: #9aa3ad; animation: as-dot 900ms ease-in-out infinite both; }
${S} .msg.dots i:nth-child(2) { animation-delay: 150ms; } ${S} .msg.dots i:nth-child(3) { animation-delay: 300ms; }
@keyframes as-dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.45; } 30% { transform: translateY(-5px); opacity: 1; } }
${S} .inp { flex: none; height: 96px; display: flex; align-items: center; gap: 12px; padding: 0 14px 0 16px; border-top: 1px solid var(--hairline); background: #fff; }
${S} .field { position: relative; flex: 1; height: 58px; border-radius: 29px; box-shadow: inset 0 0 0 1.5px var(--hairline-strong); overflow: hidden;
  display: flex; align-items: center; justify-content: flex-end; padding: 0 16px; }
${S} .field .ph { position: absolute; left: 20px; font-size: 23px; color: var(--ink-3); white-space: nowrap; }
${S} .field .tx { font-size: 25px; white-space: pre; }
${S} .field .car { flex: none; width: 2px; height: 30px; margin-left: 1px; background: ${TG}; animation: as-car 1000ms steps(1) infinite; }
@keyframes as-car { 50% { opacity: 0; } }
${S} .sendb { flex: none; width: 58px; height: 58px; border-radius: 50%; background: ${TG}; display: flex; align-items: center; justify-content: center; }
${S} .cap { position: absolute; left: -160px; right: -160px; top: ${PH + 12}px; text-align: center; font-size: 20px; white-space: nowrap; color: var(--ink-3); }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "ШІ-асистенти", line: "Підкаже, кого давно не було, і збере зведення тижня." })}
  <div class="vis"><div class="mock">
    <div class="phone a-rise" style="--d:${T.phone}ms"><div class="bezel"><div class="screen">
      <div class="sb"><span>10:42</span><span class="bat"></span></div><div class="island"></div>
      <div class="hd">${TV.icon("chevron-left", 34, TG, 2.4)}<img src="${TV.asset("eva.jpg")}" alt=""><div><b>Єва Асистент</b><span class="st">бот · онлайн</span></div></div>
      <div class="chat"><div class="feed">${feed}</div></div>
      <div class="inp"><div class="field"><span class="ph">Напишіть, що зробити…</span><span class="tx"></span><i class="car"></i></div>
        <span class="sendb">${TV.icon("send", 24, "#fff", 2.4)}</span></div>
    </div></div></div>
    <div class="cap a-fade" style="--d:900ms">Єва — асистент церкви «Нове Життя». Ваш може називатися інакше.</div>
    ${TV.tap(0, 0, T.tap, C).replace('class="tap"', 'class="tap" id="as-tap"')}
    ${TV.cursor("Тарас", "#12a150", "as-cur", "Лідер")}
  </div></div>
</div>`,
    tick(t, el) {
      // Набір у полі: по літері; після «надіслати» поле порожнє.
      const draft = (q, [a, b], send) => (t >= a && t < send ? q.slice(0, Math.round(q.length * TV.prog(t, a, b, TV.ease.linear))) : null);
      const d = draft(Q1, T.type1, T.send1) ?? draft(Q2, T.type2, T.send2) ?? "";
      const tx = el.querySelector(".field .tx");
      if (tx && tx.textContent !== d) tx.textContent = d;
      const ph = el.querySelector(".field .ph");
      if (ph) ph.style.opacity = d ? "0" : "1";
      // «друкує…» у шапці, поки асистент відповідає.
      const typing = [T.dots1, T.dots2, T.dots3].some(([a, b]) => t >= a && t < b);
      const st = el.querySelector(".hd .st");
      const s = typing ? "друкує…" : "бот · онлайн";
      if (st && st.textContent !== s) { st.textContent = s; st.style.color = typing ? TG : ""; }
      // Прокрутка: низ останнього видимого повідомлення тримаємо над полем вводу.
      const chat = el.querySelector(".chat"), feed = el.querySelector(".feed");
      if (!chat || !feed) return;
      const VIEW = chat.clientHeight, slots = feed.children;
      let off = 0;
      for (const [t0, i, isDots] of SHOW) {
        if (t < t0) break;
        const sl = slots[i];
        const h = isDots ? sl.firstElementChild.offsetHeight : sl.offsetHeight;
        const target = Math.max(0, sl.offsetTop + h + TOP - VIEW);
        off = TV.mix(off, target, TV.prog(t, t0, t0 + 520));
      }
      feed.style.transform = `translateY(${(-off).toFixed(1)}px)`;
      // Лідер натискає «Підтвердити»: місце кнопки — з розкладки мінус прокрутка.
      const yes = el.querySelector("#as-yes"), mock = el.querySelector(".mock");
      if (!yes || !mock) return;
      let x = 0, y = 0;
      for (let n = yes; n && n !== mock; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
      // offsetTop не знає про transform стрічки: віднімаємо прокрутку.
      const bx = x + 64, by = y + 30 - off;
      const tap = el.querySelector("#as-tap");
      if (tap) { tap.style.left = bx + "px"; tap.style.top = by + "px"; }
      TV.moveCursor(el.querySelector("#as-cur"), t, {
        keys: [[T.tap - 800, PW - 30, PH - 30], [T.tap - 40, bx - 10, by - 6], [T.tap + 360, bx + 8, by + 30]],
        show: [T.tap - 800, T.tap + 420], clicks: [T.tap],
      });
    },
  });
})();
