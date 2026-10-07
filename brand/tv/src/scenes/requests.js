/* Запити — заміна на служінні (content/modules/hr.ts → requests.mock:
   «Заміна на 21 вер · Ірина Шевчук → Василь П.»; графік неділі 21 вересня —
   з mocks.serving). Запит летить від Ірини до керівника, той тисне «Погодити»,
   ляскає печатка, а в графіку неділі Ірину змінює Василь. */
// icons: check, arrow-right, calendar-days, send, repeat
(function () {
  const A = "#0891b2";
  const W = 880, H = 840, PAD = 24;
  const NODES = [150, 440, 730], NY = 148;
  const CARD = { x: 150, y: 250, w: 580, h: 318 };
  const BTN = { x: 212, y: 478, w: 250, h: 64 };
  const LEAD = TV.LOOKS[6]; // сивий керівник — не плутати з Василем
  const FLY = 1250, CLICK = 3150, OK = CLICK + 50, FILL2 = 3500, SWAP = 4350;
  const ROSTER = [
    { role: "Проповідь", who: "Іван", name: "Пастор Іван" },
    { role: "Прославлення", who: "Олена", name: "Олена" },
    { role: "Звук", who: "Дмитро", name: "Дмитро" },
    { role: "Чай-кава", who: "Ірина", name: "Ірина", to: "Василь" },
  ];
  const TW = (W - PAD * 2 - 16 * 3) / 4;
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const cx = CARD.x + CARD.w / 2, cyc = CARD.y + CARD.h / 2;

  const check = (d, size = 30) =>
    `<span class="ok a-pop" style="--d:${d}ms;width:${size}px;height:${size}px">${TV.icon("check", size * 0.62, "#fff", 3.4)}</span>`;

  function tile(r) {
    const face = (who, name, cls, d) =>
      `<div class="face ${cls}" style="--d:${d}ms">${TV.avatar(who, 76)}<b>${TV.esc(name)}</b></div>`;
    return `
<div class="tile">
  ${r.to ? `<i class="swap-bg a-fade" style="--d:${SWAP}ms"></i>` : ""}
  <span class="role">${TV.esc(r.role)}</span>
  <div class="faces">
    ${r.to ? face(r.who, r.name, "a-outf", SWAP) + face(r.to, r.to, "a-pop over", SWAP + 40) : face(r.who, r.name, "", 0)}
  </div>
  ${r.to ? `<span class="swap-ic a-pop" style="--d:${SWAP + 160}ms">${TV.icon("repeat", 20, "#fff", 2.6)}</span>` : ""}
</div>`;
  }

  TV.scene({
    id: "requests",
    dur: 8000,
    bg: "light",
    css: `
[data-o="port"] [data-scene="requests"] .split.flip { grid-template-columns: 1fr; padding: 170px 90px 110px; }
[data-scene="requests"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
[data-scene="requests"] .board { position: absolute; inset: 0; }
[data-scene="requests"] .head { position: absolute; left: 0; right: 0; top: 0; height: 80px; display: flex; align-items: center; padding: 0 32px;
  border-bottom: 1px solid var(--hairline); font-size: 27px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="requests"] .head .dot { width: 14px; height: 14px; border-radius: 50%; background: ${A}; margin-right: 16px; }
[data-scene="requests"] .q { margin-left: auto; position: relative; font-size: 24px; font-weight: 500; color: var(--ink-3); white-space: nowrap; }
[data-scene="requests"] .q b { color: var(--ink); font-weight: 700; }
[data-scene="requests"] .q .now { position: absolute; right: 0; top: 0; }
[data-scene="requests"] .rail { position: absolute; top: ${NY - 2}px; height: 4px; border-radius: 2px; background: rgba(11,11,15,0.1); }
[data-scene="requests"] .fill { position: absolute; top: ${NY - 3}px; height: 6px; border-radius: 3px; background: ${A}; transform-origin: 0 50%;
  animation: rq-x var(--t) cubic-bezier(0.5, 0, 0.1, 1) var(--d) both; }
@keyframes rq-x { from { transform: scaleX(0); } }
[data-scene="requests"] .node { position: absolute; top: ${NY - 38}px; width: 76px; height: 76px; margin-left: -38px; }
[data-scene="requests"] .node .avatar { box-shadow: 0 0 0 4px #fff, 0 8px 20px -8px rgba(10,30,70,0.4); }
[data-scene="requests"] .node .cal { width: 76px; height: 76px; border-radius: 50%; background: ${tint(A, 14)}; color: ${A};
  display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px #fff; }
[data-scene="requests"] .node .lbl { position: absolute; left: 50%; top: 88px; transform: translateX(-50%); white-space: nowrap;
  font-size: 22px; font-weight: 650; color: var(--ink-2); }
[data-scene="requests"] .node .ok { position: absolute; right: -6px; bottom: -4px; }
[data-scene="requests"] .ok { display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px #fff; }
[data-scene="requests"] .wait { position: absolute; inset: -8px; border-radius: 50%; border: 3px solid ${A};
  animation: rq-wait 520ms var(--e-decel) var(--d) 2 both; }
@keyframes rq-wait { 0% { opacity: 0; transform: scale(0.9); } 25% { opacity: 1; } 100% { opacity: 0; transform: scale(1.45); } }
[data-scene="requests"] .fly { position: absolute; left: ${CARD.x}px; top: ${CARD.y}px; width: ${CARD.w}px; height: ${CARD.h}px;
  animation: rq-fly 1000ms cubic-bezier(0.5, 0, 0.1, 1) ${FLY}ms both; }
@keyframes rq-fly {
  0% { opacity: 0; transform: translate(${NODES[0] - cx}px, ${NY - cyc}px) scale(0.14); }
  14% { opacity: 1; }
}
[data-scene="requests"] .req { position: absolute; inset: 0; border-radius: 26px; background: #fff; padding: 24px 26px;
  box-shadow: 0 0 0 1px var(--hairline-strong), 0 24px 50px -22px rgba(0,50,90,0.4); animation: rq-thud 380ms var(--e-decel) ${OK}ms both; }
@keyframes rq-thud { 30% { transform: scale(0.975); } }
[data-scene="requests"] .done-bg { position: absolute; inset: 0; border-radius: 26px; background: #f3fbf6; box-shadow: inset 0 0 0 3px rgba(18,161,80,0.55); }
[data-scene="requests"] .r1 { position: relative; display: flex; align-items: center; gap: 10px; height: 40px; }
[data-scene="requests"] .chip { font-size: 21px; font-weight: 650; padding: 6px 16px; border-radius: 999px; }
[data-scene="requests"] .date { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 550; color: var(--ink-3); }
[data-scene="requests"] .pair { position: relative; margin-top: 22px; display: flex; align-items: flex-start; justify-content: center; gap: 30px; height: 116px; }
[data-scene="requests"] .pair .p { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 170px; }
[data-scene="requests"] .pair b { font-size: 22px; font-weight: 650; white-space: nowrap; }
[data-scene="requests"] .pair .arr { margin-top: 22px; color: ${A}; }
[data-scene="requests"] .btns { position: absolute; left: ${BTN.x - CARD.x}px; top: ${BTN.y - CARD.y}px; display: flex; gap: 16px; }
[data-scene="requests"] .btn { height: ${BTN.h}px; font-size: 25px; }
[data-scene="requests"] .btn.yes { width: ${BTN.w}px; background: ${A}; }
[data-scene="requests"] .btn.no { width: 190px; background: #fff; color: var(--ink-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.14); }
[data-scene="requests"] .stamp-w { position: absolute; left: 0; right: 0; top: ${BTN.y - CARD.y + BTN.h / 2 - 40}px; height: 80px; display: flex; justify-content: center; }
[data-scene="requests"] .stamp { display: flex; align-items: center; gap: 12px; height: 80px; padding: 0 30px 0 22px; border: 5px solid var(--green); border-radius: 16px;
  color: var(--green); font-size: 38px; font-weight: 850; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; background: rgba(255,255,255,0.9);
  animation: rq-stamp 460ms cubic-bezier(0.3, 0, 0.2, 1.4) ${OK}ms both; }
@keyframes rq-stamp {
  0% { opacity: 0; transform: rotate(-7deg) scale(2.1); }
  55% { opacity: 1; }
  100% { opacity: 1; transform: rotate(-7deg) scale(1); }
}
[data-scene="requests"] .roster { position: absolute; left: ${PAD}px; right: ${PAD}px; top: 604px; }
[data-scene="requests"] .rh { display: flex; align-items: center; height: 32px; font-size: 22px; font-weight: 650; color: var(--ink-2); }
[data-scene="requests"] .rh .sent { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; color: ${A}; font-weight: 650; }
[data-scene="requests"] .tiles { margin-top: 14px; display: flex; gap: 16px; }
[data-scene="requests"] .tile { position: relative; width: ${TW}px; height: 176px; border-radius: 22px; background: var(--surface-2);
  box-shadow: inset 0 0 0 2px rgba(0,0,0,0.08); display: flex; flex-direction: column; align-items: center; padding-top: 16px; }
[data-scene="requests"] .swap-bg { position: absolute; inset: 0; border-radius: 22px; background: #f3fbf6; box-shadow: inset 0 0 0 3px rgba(18,161,80,0.55); }
[data-scene="requests"] .role { position: relative; font-size: 20px; font-weight: 600; color: var(--ink-3); }
[data-scene="requests"] .faces { position: relative; width: 100%; height: 118px; margin-top: 8px; }
[data-scene="requests"] .face { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; }
[data-scene="requests"] .face b { font-size: 23px; font-weight: 650; white-space: nowrap; }
[data-scene="requests"] .swap-ic { position: absolute; left: 50%; top: 50px; margin-left: 20px; width: 34px; height: 34px; border-radius: 50%;
  background: var(--green); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px #fff; }
`,
    html: () => `
<div class="split flip">
  ${TV.copy({ title: "Запити", line: "Відпустки, заміни й заявки погоджуються в один клік." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="head"><span class="dot"></span>Черга запитів
        <span class="q"><span class="a-outf" style="--d:${OK}ms"><b>7</b> відкритих · <b>2</b> чекають на вас</span>
          <span class="now a-fade" style="--d:${OK}ms"><b>6</b> відкритих · <b>1</b> чекає на вас</span></span></div>
      <i class="rail a-fade" style="left:${NODES[0]}px;width:${NODES[2] - NODES[0]}px;--d:500ms"></i>
      <i class="fill" style="left:${NODES[0]}px;width:${NODES[1] - NODES[0]}px;--d:${FLY}ms;--t:1000ms"></i>
      <i class="fill" style="left:${NODES[1]}px;width:${NODES[2] - NODES[1]}px;--d:${FILL2}ms;--t:700ms"></i>
      <div class="node a-pop" style="left:${NODES[0]}px;--d:500ms">${TV.avatar("Ірина", 76)}<span class="lbl">Ірина Шевчук</span>${check(FLY)}</div>
      <div class="node a-pop" style="left:${NODES[1]}px;--d:620ms"><i class="wait" style="--d:${FLY + 900}ms"></i>${TV.avatar(LEAD, 76)}<span class="lbl">Керівник</span>${check(OK)}</div>
      <div class="node a-pop" style="left:${NODES[2]}px;--d:740ms"><span class="cal">${TV.icon("calendar-days", 36, "currentColor", 2.2)}</span><span class="lbl">Графік</span>${check(FILL2 + 700)}</div>
      <div class="fly"><div class="req">
        <i class="done-bg a-fade" style="--d:${OK}ms"></i>
        <div class="r1"><span class="chip" style="background:${tint(A, 14)};color:${A}">Заміна</span>
          <span class="chip" style="background:var(--surface-3);color:var(--ink-2)">Чай-кава</span>
          <span class="date">${TV.icon("calendar-days", 22, "currentColor", 2.2)}нд, 21 вересня</span></div>
        <div class="pair">
          <div class="p">${TV.avatar("Ірина", 80)}<b>Ірина Шевчук</b></div>
          <span class="arr">${TV.icon("arrow-right", 40, "currentColor", 2.6)}</span>
          <div class="p">${TV.avatar("Василь", 80)}<b>Василь П.</b></div>
        </div>
        <div class="btns a-outf" style="--d:${OK}ms">
          <span class="btn yes">${TV.icon("check", 26, "#fff", 3)}Погодити</span><span class="btn no">Відхилити</span>
        </div>
        <div class="stamp-w"><div class="stamp">${TV.icon("check", 36, "currentColor", 3.6)}Погоджено</div></div>
      </div></div>
      <div class="roster a-up" style="--d:900ms">
        <div class="rh">Графік · неділя, 21 вересня
          <span class="sent a-fade" style="--d:${SWAP + 450}ms">${TV.icon("send", 22, "currentColor", 2.4)}Обом надіслано</span></div>
        <div class="tiles">${ROSTER.map(tile).join("")}</div>
      </div>
    </div>
    ${TV.tap(BTN.x + BTN.w / 2 - 20, BTN.y + BTN.h / 2, CLICK, "#8b5bf0")}
    ${TV.cursor(LEAD, "#8b5bf0", "rq-c", "Керівник")}
  </div></div>
</div>`,
    tick(t, el) {
      const tx = BTN.x + BTN.w / 2 - 30, ty = BTN.y + BTN.h / 2 - 6;
      TV.moveCursor(el.querySelector("#rq-c"), t, {
        keys: [[CLICK - 800, 980, 860], [CLICK - 40, tx, ty], [CLICK + 480, tx + 150, ty + 120]],
        show: [CLICK - 800, CLICK + 540],
        clicks: [CLICK],
      });
    },
  });
})();
