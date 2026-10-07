/* Дитяча реєстрація (модуль «Дитяче містечко» на сайті) — чотири кадри однієї неділі (дані: content/modules/clubs.ts →
   kids-town: mock «Відмітка приходу · Нд, 21 квітня · 64 дитини в залах», «Марко
   Ковальчук · 9 років», «7–10 · Кімната 3», «Олена Ковальчук · мама», «Горіхи»,
   код «48-21», «Відмітити і надрукувати бейдж», «Надіслати код у Telegram»; FAQ —
   бейджі на етикетковому принтері; pipeline «Видача». Родина та сама, що в «Сім'ї»:
   Софія, 5 років, група 4–6).
   1) Оксана на вході шукає «Ковальчук» і відмічає обох дітей.
   2) Принтер друкує два великі бейджі; корінець «48-21» для мами відривається.
   3) Корінець летить у телефон мами — повідомлення в Telegram.
   4) Після служіння: телефон відсувається, поруч — екран учителя «Видача · Кімната 3»;
      код збігся, «Віддано мамі».
   Щонайбільше дві панелі в кадрі. */
// icons: search, check, printer, triangle-alert, shield-check, baby
(function () {
  const ROSE = "#e11d48", GREEN = "#12a150", AMBER = "#b45309", TGB = "#229ed9";
  const W = 900, H = 900;
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const KIDS = [
    { name: "Марко", full: "Марко Ковальчук", age: "9 років", grp: "7–10", room: "Кімната 3", allergy: "Горіхи" },
    { name: "Софія", full: "Софія Ковальчук", age: "5 років", grp: "4–6", room: "Кімната 2", allergy: "" },
  ];
  const CODE = "48-21";

  // ── час (мс)
  const T = {
    tab: 250, type: [800, 1450], fam: 1650, tick: [2350, 3550], btn: 4650, tabOut: 5050,
    prn: 5000, roll: [[5500, 6400], [6750, 7650]], shift: 6450, tear: 8150, prnOut: 8850,
    fly: [8850, 9550], phone: 8750, bub: 9550,
    slide: 10950, desk: 11150, digits: 11950, match: 12600, give: 13000,
  };

  // ── 1. планшет на вході (координати макета)
  const TB = { x: 10, y: 50, w: 880, h: 800, bz: 18 };
  const SX = TB.x + TB.bz, SY = TB.y + TB.bz;           // початок екрана планшета
  const FAM_Y = 238, ROW = [SY + FAM_Y + 104, SY + FAM_Y + 244], ROW_H = 128, CB_X = SX + 12 + 20 + 27;  // рядки дітей і їхні галочки
  const BTN = [SX + 422, SY + 662 + 45];
  // Оксана спершу відмічає Софію (нижній рядок), потім Марка, потім друк: бірка курсора
  // падає в проміжки під рядком, а не на ім'я сусіда.
  const TAP = [[CB_X, ROW[1] + ROW_H / 2], [CB_X, ROW[0] + 34], [SX + 64, BTN[1] + 26]];
  const kidRow = (k, i) => `
<div class="kr" style="top:${ROW[i] - SY - FAM_Y}px">
  <span class="cb"><span class="cb on a-pop" style="--d:${T.tick[1 - i] + 40}ms">${TV.icon("check", 32, "#fff", 3.4)}</span></span>
  ${TV.avatar(k.name, 80)}
  <div class="kt"><b>${k.full}</b><span>${k.age} · група ${k.grp} · ${k.room}</span></div>
  ${k.allergy ? `<span class="alg">${TV.icon("triangle-alert", 22, "currentColor", 2.4)}${k.allergy}</span>` : ""}
</div>`;
  const tablet = `
<div class="tab-o"><div class="tablet a-rise" style="left:${TB.x}px;top:${TB.y}px;width:${TB.w}px;height:${TB.h}px;--d:${T.tab}ms"><div class="scr">
  <div class="th"><b>Відмітка приходу · Нд, 21 квітня</b><span>Дитяча реєстрація · 64 дитини в залах</span></div>
  <div class="srch">${TV.icon("search", 34, "var(--ink-3)", 2.4)}<span class="q"></span><i class="caret"></i><span class="ph">Прізвище або телефон батьків</span></div>
  <div class="fam a-up" style="--d:${T.fam}ms">
    <div class="par">${TV.avatar("Олена", 72)}<div class="kt"><b>Олена Ковальчук</b><span>мама · двоє дітей</span></div>
      <span class="tr">${TV.icon("shield-check", 22, GREEN, 2.4)}може забирати</span></div>
    ${KIDS.map(kidRow).join("")}
  </div>
  <div class="go"><span class="off">${TV.icon("printer", 30, "currentColor", 2.2)}Відмітити і надрукувати бейдж</span>
    <span class="on a-fade" style="--d:${T.tick[0] + 40}ms">${TV.icon("printer", 30, "#fff", 2.2)}Відмітити і надрукувати бейдж</span>
    <span class="press" style="--d:${T.btn}ms"></span></div>
</div></div></div>`;

  // ── 2. принтер і бейджі
  const SLIT = 716, BW = 820, BH = 214, BX = (W - BW) / 2, STUB = 196;
  const B_TOP = SLIT - BH - 14, B_UP = 250;             // де бейдж зупиняється і куди відсувається
  const badge = (k, i) => `
<div class="bd-o" style="top:${B_TOP}px;--y0:${SLIT - B_TOP + 6}px;--d:${T.roll[i][0]}ms;--t:${T.roll[i][1] - T.roll[i][0]}ms">
  <div class="bd ${i === 0 ? "up" : ""}" style="--up:${B_UP - B_TOP}px">
    <div class="kid" style="width:${i ? BW - STUB : BW}px">
      <span class="strip"></span>${TV.avatar(k.name, 116)}
      <div class="bt"><b>${k.full}</b>
        <div class="chips"><span class="ch">${k.grp}</span><span class="ch">${k.room}</span>${k.allergy ? `<span class="ch al">${TV.icon("triangle-alert", 22, "currentColor", 2.4)}${k.allergy}</span>` : ""}</div>
      </div>
      <span class="cd">${CODE}</span>
    </div>
    ${i ? `<div class="stub" id="kt-stub"><div class="stub-in"><span>Батькам</span><b>${CODE}</b></div></div>` : ""}
  </div>
</div>`;
  const printer = `
<div class="prn-o">
  <div class="roll">${KIDS.map(badge).join("")}</div>
  <div class="prn a-rise" style="--d:${T.prn}ms"><span class="slit"></span><span class="led"></span>
    <span class="pl">${TV.icon("printer", 30, "var(--ink-3)", 2.2)}Етикетковий принтер</span></div>
</div>`;

  // ── 3–4. телефон мами і екран учителя
  const PH = { x: 250, y: 17, w: 400, h: 866 }, SLIDE = -250;
  const BUB = [PH.x + 190, PH.y + 640];                 // куди прилітає корінець
  const phone = `
<div class="ph-o"><div class="phone a-rise" style="left:${PH.x}px;top:${PH.y}px;width:${PH.w}px;height:${PH.h}px;--d:${T.phone}ms">
  <div class="bezel"><div class="screen">
    <div class="sb"><span>10:40</span><span class="bat"></span></div><div class="island"></div>
    <div class="tgh"><span class="bot">${TV.mark(30, "#fff")}</span><div><b>Бот церкви</b><span>бот</span></div></div>
    <div class="chat"><span class="day">Неділя, 21 квітня</span>
      <div class="bub a-up" style="--d:${T.bub}ms">
        <b class="bh">${TV.icon("baby", 22, ROSE, 2.4)}Дитяча реєстрація</b>
        <span>Марко — Кімната 3</span><span>Софія — Кімната 2</span>
        <span class="lb">Код для видачі</span><b class="code">${CODE}<i class="glow"></i></b>
      </div>
    </div>
    <div class="inp"><span>Повідомлення</span></div>
  </div></div>
</div></div>`;
  const DK = { x: 424, y: 96, w: 470, h: 708 };
  const GIVE_BTN = [DK.x + 60, DK.y + 594 + 64];       // лівий нижній край кнопки: бірка — під кнопкою
  const digits = [..."4821"].map((c, i) => `<span class="dg">${i === 2 ? "<i class='dash'>–</i>" : ""}<b class="a-pop" style="--d:${T.digits + i * 130}ms">${c}</b></span>`).join("");
  const desk = `
<div class="desk a-right" style="left:${DK.x}px;top:${DK.y}px;width:${DK.w}px;height:${DK.h}px;--d:${T.desk}ms">
  <div class="dh"><b>Видача · Кімната 3</b><span>Група 7–10 · після служіння</span></div>
  <div class="kid2">${TV.avatar("Марко", 84)}<div class="kt"><b>Марко Ковальчук</b>
    <span class="alg sm">${TV.icon("triangle-alert", 20, "currentColor", 2.4)}Горіхи</span></div></div>
  <div class="pick">${TV.avatar("Олена", 52)}<div class="kt"><b>Олена Ковальчук · мама</b>
    <span class="okl">${TV.icon("shield-check", 20, GREEN, 2.4)}у списку довірених</span></div></div>
  <div class="cl">Код від батьків</div>
  <div class="dgs">${digits}</div>
  <div class="match a-pop" style="--d:${T.match}ms">${TV.icon("check", 24, "#fff", 3.4)}Код збігся</div>
  <div class="give"><span class="g0 a-outf" style="--d:${T.give + 40}ms">Віддати дитину</span>
    <span class="g1 a-fade" style="--d:${T.give + 40}ms">${TV.icon("check", 28, "#fff", 3.4)}Віддано мамі</span></div>
</div>`;

  const S = '[data-scene="kids-town"]';
  TV.scene({
    id: "kids-town",
    dur: 15000,
    bg: "light",
    css: `
${S} .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
${S} .kt { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
${S} .kt b { font-size: 29px; font-weight: 700; letter-spacing: -0.02em; white-space: nowrap; line-height: 1.1; }
${S} .kt span { font-size: 22px; color: var(--ink-3); white-space: nowrap; }
${S} .alg { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px 0 12px; border-radius: 999px; background: #fef3c7; color: ${AMBER};
  font-size: 22px; font-weight: 700; white-space: nowrap; }
${S} .alg.sm { align-self: flex-start; height: 34px; font-size: 20px; }
/* 1 — планшет */
${S} .tab-o { position: absolute; inset: 0; animation: a-outf 360ms var(--e-std) ${T.tabOut}ms both; }
${S} .tablet { position: absolute; border-radius: 44px; background: #0b0d12; padding: ${TB.bz}px; box-shadow: 0 50px 90px -50px rgba(0,40,100,0.55), 0 0 0 2px #2a2f37; }
${S} .scr { position: relative; width: 100%; height: 100%; border-radius: 28px; background: #fff; overflow: hidden; }
${S} .th { position: absolute; left: 30px; top: 26px; display: flex; flex-direction: column; gap: 8px; }
${S} .th b { font-size: 34px; font-weight: 780; letter-spacing: -0.025em; }
${S} .th span { font-size: 22px; color: var(--ink-3); }
${S} .srch { position: absolute; left: 28px; right: 28px; top: 124px; height: 88px; border-radius: 20px; background: var(--surface-3);
  box-shadow: inset 0 0 0 2.5px ${tint(ROSE, 45)}; display: flex; align-items: center; gap: 16px; padding: 0 24px; }
${S} .srch .q { font-size: 36px; font-weight: 650; letter-spacing: -0.01em; white-space: pre; }
${S} .srch .caret { width: 3px; height: 38px; margin-left: -12px; background: ${ROSE}; animation: kt-caret 1000ms steps(1) infinite; }
@keyframes kt-caret { 50% { opacity: 0; } }
${S} .srch .ph { position: absolute; left: 76px; font-size: 27px; color: var(--ink-3); animation: a-outf 160ms linear ${T.type[0]}ms both; }
${S} .fam { position: absolute; left: 28px; right: 28px; top: ${FAM_Y}px; height: 392px; border-radius: 24px; box-shadow: inset 0 0 0 2px var(--hairline-strong); }
${S} .par { position: absolute; left: 20px; right: 20px; top: 16px; height: 80px; display: flex; align-items: center; gap: 18px; }
${S} .tr { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 21px; font-weight: 600; color: ${GREEN}; white-space: nowrap; }
${S} .kr { position: absolute; left: 12px; right: 12px; height: ${ROW_H}px; border-radius: 18px; background: var(--surface-2);
  display: flex; align-items: center; gap: 18px; padding: 0 20px 0 20px; }
${S} .cb { position: relative; flex: none; width: 54px; height: 54px; border-radius: 14px; background: #fff; box-shadow: inset 0 0 0 3px rgba(0,0,0,0.2); }
${S} .cb.on { position: absolute; inset: 0; background: ${ROSE}; box-shadow: none; display: flex; align-items: center; justify-content: center; }
${S} .kr .alg { margin-left: auto; }
${S} .go { position: absolute; left: 28px; right: 28px; top: 662px; height: 90px; border-radius: 22px; overflow: hidden; }
${S} .go > span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 14px; font-size: 29px; font-weight: 650; }
${S} .go .off { background: var(--surface-3); color: var(--ink-3); }
${S} .go .on { background: ${ROSE}; color: #fff; }
${S} .go .press { background: rgba(0,0,0,0.18); opacity: 0; animation: kt-press 500ms ease-out var(--d) both; }
@keyframes kt-press { 0%, 100% { opacity: 0; } 30% { opacity: 1; } }
/* 2 — принтер */
${S} .prn-o { position: absolute; inset: 0; animation: a-outf 380ms var(--e-std) ${T.prnOut}ms both; }
${S} .roll { position: absolute; left: 0; top: 0; width: ${W}px; height: ${SLIT}px; overflow: hidden; }
${S} .bd-o { position: absolute; left: ${BX}px; width: ${BW}px; height: ${BH}px; animation: kt-roll var(--t) cubic-bezier(0.35, 0, 0.55, 1) var(--d) both; }
@keyframes kt-roll { from { transform: translateY(var(--y0)); } }
${S} .bd { position: absolute; inset: 0; }
${S} .bd.up { animation: kt-up 700ms var(--e-emph) ${T.shift}ms both; }
@keyframes kt-up { to { transform: translateY(var(--up)); } }
${S} .kid { position: absolute; left: 0; top: 0; height: ${BH}px; border-radius: 20px 0 0 20px; background: #fff; overflow: hidden;
  box-shadow: 0 0 0 1.5px rgba(0,0,0,0.1), 0 18px 34px -20px rgba(60,10,30,0.45); display: flex; align-items: center; gap: 24px; padding: 0 26px 0 44px; }
${S} .bd-o:first-child .kid { border-radius: 20px; }
${S} .kid .strip { position: absolute; left: 0; top: 0; bottom: 0; width: 18px; background: ${ROSE}; }
${S} .bt { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
${S} .bt b { font-size: 42px; font-weight: 800; letter-spacing: -0.03em; white-space: nowrap; line-height: 1; }
${S} .chips { display: flex; gap: 10px; }
${S} .ch { display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 18px; border-radius: 12px; background: var(--surface-3);
  font-size: 25px; font-weight: 700; white-space: nowrap; }
${S} .ch.al { background: #fef3c7; color: ${AMBER}; padding-left: 12px; }
${S} .kid .cd { position: absolute; right: 22px; top: 18px; font-size: 22px; font-weight: 700; color: var(--ink-3); font-variant-numeric: tabular-nums; }
${S} .stub { position: absolute; left: ${BW - STUB}px; top: 0; width: ${STUB}px; height: ${BH}px; }
${S} .stub-in { position: absolute; inset: 0; border-radius: 0 20px 20px 0; background: #fff; border-left: 3px dashed rgba(0,0,0,0.25);
  box-shadow: 0 0 0 1.5px rgba(0,0,0,0.1), 0 18px 34px -20px rgba(60,10,30,0.45);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
${S} .stub-in span { font-size: 21px; font-weight: 650; color: var(--ink-3); }
${S} .stub-in b { font-size: 46px; font-weight: 800; letter-spacing: -0.01em; color: ${ROSE}; font-variant-numeric: tabular-nums; }
${S} .prn { position: absolute; left: 30px; top: ${SLIT - 22}px; width: 840px; height: 176px; border-radius: 30px;
  background: linear-gradient(180deg, #f7f8fa, #e7e9ee); box-shadow: 0 0 0 1.5px rgba(0,0,0,0.1), 0 34px 60px -34px rgba(0,30,80,0.5); }
${S} .slit { position: absolute; left: 60px; right: 60px; top: 16px; height: 14px; border-radius: 7px; background: #2b2f37; box-shadow: inset 0 3px 4px rgba(0,0,0,0.5); }
${S} .led { position: absolute; right: 44px; bottom: 36px; width: 16px; height: 16px; border-radius: 50%; background: ${GREEN}; box-shadow: 0 0 0 5px ${tint(GREEN, 25)}; }
${S} .pl { position: absolute; left: 44px; bottom: 30px; display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 600; color: var(--ink-3); }
/* 3–4 — телефон мами (пропорції iPhone 390 × 844) */
${S} .ph-o { position: absolute; inset: 0; animation: kt-slide 800ms var(--e-emph) ${T.slide}ms both; }
@keyframes kt-slide { to { transform: translateX(${SLIDE}px); } }
${S} .phone { position: absolute; border-radius: 60px; padding: 3px; background: linear-gradient(100deg, #8a919c 0%, #454c56 12%, #2a2f37 50%, #454c56 88%, #8a919c 100%);
  box-shadow: 0 60px 100px -60px rgba(0,50,120,0.6), 0 24px 44px -30px rgba(0,30,80,0.45); }
${S} .bezel { width: 100%; height: 100%; border-radius: 57px; background: #05080d; padding: 10px; }
${S} .screen { position: relative; width: 100%; height: 100%; border-radius: 47px; overflow: hidden; background: #fff; display: flex; flex-direction: column; }
${S} .sb { flex: none; height: 54px; padding: 8px 34px 0 42px; display: flex; align-items: center; justify-content: space-between; font-size: 20px; font-weight: 650; }
${S} .sb .bat { width: 32px; height: 15px; border-radius: 4px; box-shadow: inset 0 0 0 2px var(--ink); position: relative; }
${S} .sb .bat::after { content: ""; position: absolute; left: 3px; top: 3px; bottom: 3px; width: 20px; border-radius: 2px; background: var(--ink); }
${S} .island { position: absolute; top: 11px; left: 50%; width: 120px; height: 34px; margin-left: -60px; border-radius: 18px; background: #05080d; }
${S} .tgh { flex: none; height: 76px; display: flex; align-items: center; gap: 12px; padding: 0 18px; border-bottom: 1px solid var(--hairline); }
${S} .tgh .bot { width: 50px; height: 50px; border-radius: 50%; background: var(--brand); display: flex; align-items: center; justify-content: center; }
${S} .tgh div { display: flex; flex-direction: column; gap: 4px; }
${S} .tgh b { font-size: 22px; font-weight: 650; }
${S} .tgh div span { font-size: 20px; color: var(--ink-3); }
${S} .chat { position: relative; flex: 1; background: linear-gradient(160deg, #d6e8f9 0%, #a9cbe9 100%); }
${S} .bub { position: absolute; left: 14px; right: 30px; bottom: 18px; background: #fff; border-radius: 20px 20px 20px 6px; padding: 18px 20px 20px;
  box-shadow: 0 1px 2px rgba(16,35,60,0.18); display: flex; flex-direction: column; gap: 8px; font-size: 26px; line-height: 1.25; color: var(--ink); }
${S} .chat .day { position: absolute; left: 50%; top: 18px; transform: translateX(-50%); padding: 6px 16px; border-radius: 999px; background: rgba(40,80,120,0.28);
  color: #fff; font-size: 20px; font-weight: 600; white-space: nowrap; }
${S} .bub .bh { display: flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 700; color: ${ROSE}; margin-bottom: 4px; }
${S} .bub .lb { margin-top: 8px; font-size: 20px; color: var(--ink-3); }
${S} .bub .code { position: relative; margin-top: 6px; align-self: flex-start; font-size: 62px; font-weight: 800; letter-spacing: 0.02em; line-height: 1; font-variant-numeric: tabular-nums; }
${S} .bub .glow { position: absolute; inset: -4px -12px -6px; border-radius: 16px; box-shadow: 0 0 0 4px ${GREEN}; opacity: 0; animation: kt-glow 1400ms ease-in-out ${T.digits - 300}ms 2 both; }
@keyframes kt-glow { 0%, 100% { opacity: 0; } 40% { opacity: 1; } }
${S} .inp { flex: none; height: 76px; display: flex; align-items: center; padding: 0 18px; border-top: 1px solid var(--hairline); }
${S} .inp span { flex: 1; height: 46px; border-radius: 23px; box-shadow: inset 0 0 0 1.5px var(--hairline-strong); display: flex; align-items: center; padding: 0 18px; font-size: 20px; color: var(--ink-3); }
${S} .fly { position: absolute; left: 0; top: 0; z-index: 20; opacity: 0; }
/* 4 — екран учителя */
${S} .desk { position: absolute; border-radius: 30px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), var(--shadow-card); }
${S} .dh { position: absolute; left: 28px; top: 26px; display: flex; flex-direction: column; gap: 8px; }
${S} .dh b { font-size: 31px; font-weight: 780; letter-spacing: -0.025em; }
${S} .dh span { font-size: 21px; color: var(--ink-3); }
${S} .kid2 { position: absolute; left: 24px; right: 24px; top: 118px; height: 118px; border-radius: 22px; background: var(--surface-2); display: flex; align-items: center; gap: 18px; padding: 0 18px; }
${S} .pick { position: absolute; left: 28px; right: 24px; top: 256px; display: flex; align-items: center; gap: 16px; }
${S} .pick .kt b { font-size: 23px; }
${S} .okl { display: inline-flex; align-items: center; gap: 6px; color: ${GREEN} !important; font-weight: 600; }
${S} .cl { position: absolute; left: 28px; top: 346px; font-size: 22px; font-weight: 600; color: var(--ink-2); }
${S} .dgs { position: absolute; left: 28px; right: 28px; top: 386px; height: 96px; display: flex; gap: 14px; }
${S} .dg { position: relative; flex: 1; border-radius: 18px; background: var(--surface-3); box-shadow: inset 0 0 0 2px var(--hairline-strong);
  display: flex; align-items: center; justify-content: center; }
${S} .dg b { font-size: 54px; font-weight: 800; font-variant-numeric: tabular-nums; }
${S} .dg .dash { position: absolute; left: -16px; top: 50%; margin-top: -24px; font-style: normal; font-size: 40px; font-weight: 800; color: var(--ink-3); }
${S} .dgs .dg:nth-child(3) { margin-left: 20px; }
${S} .match { position: absolute; left: 28px; top: 500px; height: 48px; display: flex; align-items: center; gap: 10px; padding: 0 20px 0 12px; border-radius: 999px;
  background: ${GREEN}; color: #fff; font-size: 23px; font-weight: 700; }
${S} .give { position: absolute; left: 24px; right: 24px; top: 594px; height: 86px; border-radius: 22px; overflow: hidden; }
${S} .give > span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 28px; font-weight: 700; color: #fff; }
${S} .give .g0 { background: var(--brand); }
${S} .give .g1 { background: ${GREEN}; }
`,
    html: (o) => `
<div class="split${o === "port" ? "" : " flip"}">
  ${TV.copy({ title: "Дитяча реєстрація", line: "Дитину віддають лише своїм." })}
  <div class="vis"><div class="mock">
    ${tablet}
    ${printer}
    ${phone}
    ${desk}
    <div class="fly" id="kt-fly"><div class="stub-in" style="position:relative;width:${STUB}px;height:${BH}px;border-radius:20px"><span>Батькам</span><b>${CODE}</b></div></div>
    ${TAP.map(([x, y], i) => TV.tap(x, y, i < 2 ? T.tick[i] : T.btn, "#f59e0b")).join("")}
    ${TV.tap(GIVE_BTN[0], GIVE_BTN[1], T.give, "#12a150")}
    ${TV.cursor("Оксана", "#f59e0b", "kt-c1")}
    ${TV.cursor("Ірина", "#12a150", "kt-c2", "Учителька")}
  </div></div>
</div>`,
    tick(t, el) {
      // Набір прізвища в пошуку.
      const q = el.querySelector(".srch .q");
      const word = "Ковальчук";
      const n = Math.round(word.length * TV.prog(t, T.type[0], T.type[1], TV.ease.linear));
      const s = word.slice(0, n);
      if (q && q.textContent !== s) q.textContent = s;
      // Оксана: дві галочки і кнопка друку.
      const k1 = (x, y, tt) => [tt, x - 10, y - 6];
      TV.moveCursor(el.querySelector("#kt-c1"), t, {
        keys: [[T.tick[0] - 700, 40, 640], k1(...TAP[0], T.tick[0] - 40), k1(TAP[0][0] + 4, TAP[0][1] + 6, T.tick[0] + 300),
          k1(...TAP[1], T.tick[1] - 40), k1(TAP[1][0] + 4, TAP[1][1] + 6, T.tick[1] + 300), k1(...TAP[2], T.btn - 40), k1(TAP[2][0] + 4, TAP[2][1] + 6, T.btn + 360)],
        show: [T.tick[0] - 700, T.btn + 420], clicks: [...T.tick, T.btn],
      });
      // Учителька натискає «Віддати дитину».
      TV.moveCursor(el.querySelector("#kt-c2"), t, {
        keys: [[T.give - 900, DK.x + 150, DK.y + DK.h + 50], [T.give - 40, GIVE_BTN[0] - 10, GIVE_BTN[1] - 6], [T.give + 500, GIVE_BTN[0] - 4, GIVE_BTN[1] + 10]],
        show: [T.give - 900, T.give + 560], clicks: [T.give],
      });
      // Корінець: відривається від бейджа Софії і летить у телефон мами.
      const stub = el.querySelector("#kt-stub");
      const x0 = BX + BW - STUB, y0 = B_TOP;
      const lift = TV.prog(t, T.tear, T.tear + 380, TV.ease.spring);
      if (stub) {
        stub.style.transform = `translate(${(24 * lift).toFixed(1)}px, ${(-26 * lift).toFixed(1)}px) rotate(${(7 * lift).toFixed(2)}deg)`;
        stub.style.opacity = t >= T.fly[0] ? "0" : "1";
      }
      const fly = el.querySelector("#kt-fly");
      if (fly) {
        const p = TV.prog(t, T.fly[0], T.fly[1], TV.ease.inout);
        const on = t >= T.fly[0] && t < T.fly[1] + 60;
        const ax = x0 + 24, ay = y0 - 26, bx = BUB[0] - STUB / 2, by = BUB[1] - BH / 2;
        const x = TV.mix(ax, bx, p), y = TV.mix(ay, by, p) - Math.sin(p * Math.PI) * 120;
        const sc = 1 - 0.55 * p;
        fly.style.opacity = on ? String(1 - TV.prog(t, T.fly[1] - 200, T.fly[1] + 60, TV.ease.linear)) : "0";
        fly.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(7 * (1 - p)).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      }
    },
  });
})();
