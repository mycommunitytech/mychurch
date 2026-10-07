/* Розсилки — точний список отримувачів (дані з tools.ts → campaigns: features, highlights).
   Марко обирає «Мала група «Надія»»: у натовпі лишаються світитись лише її
   вісім людей, решта гасне, лічильник 24 → 8. «Надіслати» — повідомлення
   розлітається тільки до них; кожен отримує його у своєму каналі
   (Telegram, Viber, SMS), галочки доставки, Олена відповідає «Буду». */
// icons: users, send, check-check, check
(function () {
  const C = "#d946ef";
  const tint = (p) => `color-mix(in oklab, ${C} ${p}%, #fff)`;
  const W = 900, H = 900;
  const COLS = 6, ROWS = 4, CELL = 140, ROWH = 134, AV = 80;
  const GX0 = (W - COLS * CELL) / 2, GY0 = 98;
  const CH = { tg: ["Telegram", "#229ed9"], vb: ["Viber", "#7360f2"], sms: ["SMS", "#f59e0b"] };
  // Мала група «Надія»: хто в ній і де сидить у сітці (індекс = рядок × 6 + стовпець).
  const GROUP = [
    { i: 1, name: "Андрій", ch: "tg" }, { i: 4, name: "Оксана", ch: "tg" },
    { i: 8, name: "Олена", ch: "tg" }, { i: 11, name: "Ігор", ch: "vb" },
    { i: 13, name: "Наталя", ch: "tg" }, { i: 16, name: "Дмитро", ch: "sms" },
    { i: 20, name: "Ірина", ch: "tg" }, { i: 22, name: "Василь", ch: "vb" },
  ];
  const member = new Map(GROUP.map((g) => [g.i, g]));
  const cell = (i) => [GX0 + (i % COLS) * CELL + CELL / 2, GY0 + Math.floor(i / COLS) * ROWH + AV / 2 + 8];

  const PICK = 2250, SEND = 3550;
  const CHIP = [232, 46];              // середина чипа «Мала група «Надія»»
  const FLY = 820, STEP = 75;
  const COMP_Y = 680, BTN = [W - 24 - 100, COMP_Y + 166], CLK = [BTN[0] - 50, BTN[1]];
  const arrive = (k) => SEND + 80 + k * STEP + FLY;
  const ALL = arrive(GROUP.length - 1);
  const REPLY = ALL + 520;

  function crowd() {
    let out = "";
    for (let i = 0; i < COLS * ROWS; i++) {
      const [cx, cy] = cell(i);
      const g = member.get(i);
      const d0 = 520 + ((i % COLS) + Math.floor(i / COLS)) * 45;
      // Хвиля від обраного чипа: ближчі гаснуть раніше.
      const wave = PICK + 40 + Math.floor(i / COLS) * 70 + (i % COLS) * 25;
      if (g) {
        const k = GROUP.indexOf(g);
        out += `<div class="p on a-pop" style="left:${cx - AV / 2}px;top:${cy - AV / 2}px;--d:${d0}ms">
          <i class="glow" style="--d:${wave}ms"></i>
          <span class="ring" style="--d:${wave}ms"></span>
          ${TV.avatar(g.name, AV)}
          <span class="nm a-fade" style="--d:${wave + 80}ms">${g.name}</span>
          <span class="tick" style="background:${CH[g.ch][1]};--d:${arrive(k) - 30}ms">${TV.icon("check-check", 20, "#fff", 2.8)}</span>
        </div>`;
      } else {
        out += `<div class="p" style="left:${cx - AV / 2}px;top:${cy - AV / 2}px"><div class="a-pop" style="--d:${d0}ms"><div class="dim" style="--d:${wave}ms">${TV.avatar(TV.LOOKS[(i * 5 + 3) % 8], AV)}</div></div></div>`;
      }
    }
    return out;
  }

  // Літачок: з кнопки до людини (X і Y різними кривими — дуга), гасне на посадці.
  const planes = () => GROUP.map((g, k) => {
    const [tx, ty] = cell(g.i);
    const d = SEND + 80 + k * STEP;
    return `<span class="fx" style="left:${tx - 22}px;top:${ty - 22}px;--fx:${BTN[0] - tx}px;--d:${d}ms"><span class="fy" style="--fy:${BTN[1] - ty}px"><span class="fo">${TV.icon("send", 22, "#fff", 2.4)}</span></span></span>`;
  }).join("");

  const Ol = GROUP.find((g) => g.name === "Олена");
  const [olx, oly] = cell(Ol.i);

  TV.scene({
    id: "campaigns",
    dur: 8600,
    bg: "light",
    css: `
[data-scene="campaigns"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
[data-scene="campaigns"] .crowd { position: absolute; left: 0; top: 0; width: ${W}px; height: 656px; }
[data-scene="campaigns"] .hd { position: absolute; left: 24px; right: 24px; top: 20px; height: 52px; display: flex; align-items: center; gap: 12px; }
[data-scene="campaigns"] .chip { position: relative; height: 48px; padding: 0 20px; border-radius: 999px; display: inline-flex; align-items: center; white-space: nowrap;
  font-size: 22px; font-weight: 600; color: var(--ink-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.1); }
[data-scene="campaigns"] .chip .f { position: absolute; inset: 0; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-weight: 650; }
[data-scene="campaigns"] .chip .f.ink { background: var(--ink); color: #fff; }
[data-scene="campaigns"] .chip .f.acc { background: ${C}; color: #fff; }
[data-scene="campaigns"] .cnt { margin-left: auto; position: relative; width: 200px; height: 52px; }
[data-scene="campaigns"] .cnt > span { position: absolute; right: 0; top: 0; height: 52px; display: flex; align-items: baseline; gap: 10px; white-space: nowrap;
  font-size: 21px; font-weight: 550; color: var(--ink-3); padding-top: 8px; }
[data-scene="campaigns"] .cnt b { font-size: 34px; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
[data-scene="campaigns"] .cnt .dl b { color: var(--green); }
[data-scene="campaigns"] .p { position: absolute; width: ${AV}px; height: ${AV}px; }
[data-scene="campaigns"] .dim { animation: cp-dim 520ms var(--e-emph) var(--d) both; }
@keyframes cp-dim { to { opacity: 0.18; transform: scale(0.84); filter: grayscale(1); } }
[data-scene="campaigns"] .p.on .avatar { position: relative; }
[data-scene="campaigns"] .ring { position: absolute; inset: -7px; border-radius: 50%; box-shadow: 0 0 0 4px ${C}; animation: cp-ring 560ms var(--e-spring) var(--d) both; }
@keyframes cp-ring { from { opacity: 0; transform: scale(0.8); } }
[data-scene="campaigns"] .glow { position: absolute; inset: -26px; border-radius: 50%; background: radial-gradient(closest-side, ${tint(40)}, transparent);
  animation: a-fade 700ms var(--e-std) var(--d) both; }
[data-scene="campaigns"] .nm { position: absolute; left: 50%; top: ${AV + 8}px; transform: translateX(-50%); font-size: 20px; font-weight: 650; white-space: nowrap; }
[data-scene="campaigns"] .tick { position: absolute; right: -8px; bottom: -6px; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 3px #fff; animation: cp-tick 520ms var(--e-spring) var(--d) both; }
@keyframes cp-tick { from { opacity: 0; transform: scale(0.3); } }
[data-scene="campaigns"] .reply { position: absolute; z-index: 6; height: 54px; padding: 0 24px; border-radius: 24px 24px 24px 6px; background: #fff; display: flex; align-items: center;
  font-size: 26px; font-weight: 650; box-shadow: 0 0 0 1px var(--hairline), var(--shadow-pop); transform-origin: 0 100%; }

[data-scene="campaigns"] .comp { position: absolute; left: 0; top: ${COMP_Y}px; width: ${W}px; height: ${H - COMP_Y}px; }
[data-scene="campaigns"] .bub { position: absolute; left: 24px; right: 24px; top: 22px; padding: 18px 64px 20px 24px; white-space: nowrap; border-radius: 26px 26px 26px 8px; background: ${tint(9)};
  box-shadow: inset 0 0 0 2px ${tint(26)}; font-size: 25px; line-height: 1.38; font-weight: 550; letter-spacing: -0.01em; color: var(--ink); }
[data-scene="campaigns"] .tok { display: inline-block; padding: 0 10px; margin: 0 -2px; border-radius: 10px; background: ${C}; color: #fff; font-weight: 700; }
[data-scene="campaigns"] .sent { position: absolute; right: 22px; top: 50%; margin-top: -11px; display: flex; align-items: center; gap: 6px; font-size: 20px; font-weight: 600; color: ${C}; }
[data-scene="campaigns"] .chs { position: absolute; left: 24px; bottom: 34px; display: flex; gap: 12px; }
[data-scene="campaigns"] .ch { height: 40px; padding: 0 16px 0 12px; border-radius: 999px; background: var(--surface-3); display: inline-flex; align-items: center; gap: 10px;
  font-size: 20px; font-weight: 600; color: var(--ink-2); }
[data-scene="campaigns"] .ch i { width: 14px; height: 14px; border-radius: 50%; }
[data-scene="campaigns"] .send { position: absolute; left: ${BTN[0] - 100}px; top: ${BTN[1] - COMP_Y - 30}px; width: 200px; height: 60px; border-radius: 999px; background: ${C};
  display: flex; align-items: center; justify-content: center; gap: 12px; color: #fff; font-size: 24px; font-weight: 650; }

[data-scene="campaigns"] .fx { position: absolute; z-index: 8; animation: cp-fx ${FLY}ms cubic-bezier(0.3, 0, 0.3, 1) var(--d) both; }
[data-scene="campaigns"] .fy { display: block; animation: cp-fy ${FLY}ms cubic-bezier(0.55, 0, 0.2, 1) var(--d) both; }
[data-scene="campaigns"] .fo { width: 44px; height: 44px; border-radius: 50%; background: ${C}; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 22px -8px ${tint(80)}; animation: cp-fo ${FLY}ms linear var(--d) both; }
@keyframes cp-fx { from { transform: translateX(var(--fx)); } }
@keyframes cp-fy { from { transform: translateY(var(--fy)); } }
@keyframes cp-fo { 0% { opacity: 0; transform: scale(0.4); } 12% { opacity: 1; transform: scale(1.1); } 80% { opacity: 1; transform: scale(0.9); } 100% { opacity: 0; transform: scale(0.4); } }
`,
    html: (o) => `
<div class="split">
  ${TV.copy({ title: "Розсилки", line: "Повідомлення доходять саме тим, кому вони потрібні." })}
  <div class="vis"><div class="mock">
    <div class="crowd card a-rise" style="--d:250ms">
      <div class="hd">
        <span class="chip">Усі<span class="f ink a-outf" style="--d:${PICK + 40}ms">Усі</span></span>
        <span class="chip">Мала група «Надія»<span class="f acc a-pop" style="--d:${PICK + 40}ms">Мала група «Надія»</span></span>
        <span class="chip">Служителі</span>
        <span class="cnt">
          <span class="rc a-out" style="--d:${SEND + 60}ms">Отримувачів <b class="n1">24</b></span>
          <span class="dl a-fade" style="--d:${SEND + 120}ms">Доставлено <b><span class="n2">0</span> з ${GROUP.length}</b></span>
        </span>
      </div>
      ${crowd()}
      <span class="reply a-pop" style="left:${olx + 26}px;top:${oly - AV / 2 - 58}px;--d:${REPLY}ms">Буду</span>
    </div>
    <div class="comp card a-rise" style="--d:420ms">
      <div class="bub"><span class="tok">Олено</span>, у четвер ваша група збирається о 19:00 у кімнаті 3
        <span class="sent a-fade" style="--d:${SEND + 120}ms">${TV.icon("check-check", 22, "currentColor", 2.6)}</span></div>
      <div class="chs">${Object.values(CH).map(([n, c]) => `<span class="ch"><i style="background:${c}"></i>${n}</span>`).join("")}</div>
      <span class="send">${TV.icon("send", 26, "#fff", 2.4)}Надіслати</span>
    </div>
    ${planes()}
    ${TV.tap(CHIP[0], CHIP[1], PICK, C)}
    ${TV.tap(CLK[0], CLK[1], SEND, C)}
    ${TV.cursor("Марко", C, "cp-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      const n1 = String(TV.count(t, PICK + 40, PICK + 640, 24, GROUP.length));
      const a = el.querySelector(".n1");
      if (a && a.textContent !== n1) a.textContent = n1;
      const n2 = String(GROUP.filter((g, k) => t >= arrive(k) - 30).length);
      const b = el.querySelector(".n2");
      if (b && b.textContent !== n2) b.textContent = n2;
      const chip = CHIP;
      TV.moveCursor(el.querySelector("#cp-cur"), t, {
        keys: [
          [PICK - 760, chip[0] + 300, chip[1] + 420],
          [PICK - 40, chip[0] - 10, chip[1] - 6],
          [PICK + 380, chip[0] - 10, chip[1] - 6],
          [SEND - 40, CLK[0] - 10, CLK[1] - 6],
          [SEND + 120, CLK[0] - 10, CLK[1] - 6],
          [SEND + 600, CLK[0] - 40, CLK[1] + 200],
        ],
        show: [PICK - 760, SEND + 460],
        clicks: [PICK, SEND],
      });
    },
  });
})();
