/* Табори — заявки, оплати, загони (дані: content/modules/activities.ts → camps:
   mock «Молодіжний табір · 14–20 липня · Карпати», Софія Мельник і «Кімната з:
   Тетяна Бондар», оплати «повна / часткова / стипендія церкви», розселення
   перетягуванням; рецепт автоматизації «Табір зібрано»). Квитки-заявки
   прилітають, на кожен падає штамп оплати, Дмитро перетягує Софію до Тетяни,
   решта займає вільні місця — 12 з 12, «Табір зібрано». */
// icons: check
(function () {
  const GREEN = "#15803d", SKY = "#0ea5e9", AMB = "#f59e0b", VIOLET = "#8b5bf0";
  const W = 880, H = 720;
  const TK = { w: 400, h: 98, xs: [32, 448], ys: [200, 314], stub: 140 };
  const COLS = [32, 312, 592], CW = 256, SLOT = 56, SY = 574;
  const slotAt = (z, i) => [COLS[z] + 4 + SLOT / 2 + i * 64, SY + SLOT / 2];
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;

  const GRAB = 4150, DROP = 4950;
  // Квитки: хто, звідки заявка, штамп оплати і куди сідає.
  const TICKETS = [
    { name: "Софія Мельник", short: "Софія", sub: "Разом з Тетяною", pay: "Сплачено", pc: GREEN, to: [1, 1], land: DROP, drag: true },
    { name: "Марко Лис", short: "Марко", sub: "Заявка з бота", pay: "Сплачено", pc: GREEN, to: [2, 3], fly: 5350 },
    { name: "Ніна Рудь", short: "Ніна", sub: "Заявка з форми", pay: "Частково", pc: AMB, to: [1, 3], fly: 5600 },
    { name: "Петро Коваль", short: "Петро", sub: "Заявка з форми", pay: "Стипендія", pc: VIOLET, to: [0, 3], fly: 5850 },
  ];
  const FLY = 560;
  TICKETS.forEach((k, i) => {
    k.x = TK.xs[i % 2]; k.y = TK.ys[i >> 1];
    k.in = 1300 + i * 240;
    k.stamp = 2450 + i * 260;
    if (!k.drag) k.land = k.fly + FLY;
  });
  const TEAMS = [
    { name: "Загін 1", c: GREEN, seated: ["Тарас", "Ігор", "Василь", null] },
    { name: "Загін 2", c: SKY, seated: ["Тетяна", null, "Оксана", null] },
    { name: "Загін 3", c: AMB, seated: ["Андрій", "Лука", "Сава", null] },
  ];
  const FULL = Math.max(...TICKETS.map((k) => k.land)) + 120;
  // Підсумок для бухгалтера: 8 учасників, що вже сиділи в загонах, сплатили повністю.
  const PAYS = [...Array(10).fill(GREEN), AMB, VIOLET];
  const center = (k) => [k.x + TK.w / 2, k.y + TK.h / 2];
  const GRAB_AT = [TICKETS[0].x + 70, TICKETS[0].y + TK.h / 2];

  const tent = (c) => `<svg class="tent" width="240" height="150" viewBox="0 0 240 150" aria-hidden="true">
    <path d="M0 146 H240" stroke="#dfe6dd" stroke-width="4" stroke-linecap="round"/>
    <path d="M120 16 V2" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
    <path d="M122 2 L148 9 L122 16 Z" fill="${c}"/>
    <path d="M22 144 L120 18 L218 144 Z" fill="${tint(c, 26)}" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M120 60 L88 144 H152 Z" fill="${tint(c, 70)}"/>
    <path d="M120 18 L120 60" stroke="${c}" stroke-width="3"/></svg>`;

  function team(z) {
    const T = TEAMS[z];
    const x = COLS[z];
    const seats = T.seated.map((who, i) => {
      const [cx, cy] = slotAt(z, i);
      const tk = TICKETS.find((k) => k.to[0] === z && k.to[1] === i);
      const face = who
        ? `<span class="face a-pop" style="--d:${820 + z * 120 + i * 70}ms">${TV.avatar(who, SLOT)}</span>`
        : `<span class="face a-pop" style="--d:${tk.land}ms">${TV.avatar(tk.short, SLOT)}</span>`;
      return `<span class="slot a-fade" style="left:${cx - SLOT / 2}px;top:${cy - SLOT / 2}px;--d:${640 + z * 110}ms">${face}</span>`;
    }).join("");
    const tag = z === 1 ? `<span class="tname a-pop" style="left:${slotAt(1, 0)[0]}px;--d:1150ms">Тетяна</span>` : "";
    return `
<div class="team a-up" style="left:${x}px;--d:${600 + z * 110}ms">${tent(T.c)}</div>
${seats}${tag}
<div class="tl a-fade" style="left:${x}px;--d:${700 + z * 110}ms"><b>${T.name}</b><span class="tc" data-z="${z}">3 з 4</span>
  <span class="full a-pop" style="background:${T.c};--d:${Math.max(...TICKETS.filter((k) => k.to[0] === z).map((k) => k.land)) + 60}ms">${TV.icon("check", 18, "#fff", 3.4)}</span></div>`;
  }

  function ticket(k, i) {
    return `
<div class="tk" style="left:${k.x}px;top:${k.y}px;--d:${k.in}ms"><div class="tkm" id="cm-t${i}"><div class="tkb">
  ${TV.avatar(k.short, 52)}
  <div class="tx"><b>${k.name}</b><span>${k.sub}</span></div>
  <div class="stub"><span class="pl a-outf" style="--d:${k.stamp}ms">Оплата</span>
    <span class="stamp" style="color:${k.pc};--d:${k.stamp}ms">${k.pay}</span></div>
</div></div></div>`;
  }

  TV.scene({
    id: "camps",
    dur: 8800,
    bg: "light",
    css: `
[data-scene="camps"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
[data-scene="camps"] .board { position: absolute; inset: 0; overflow: hidden; }
[data-scene="camps"] .hd { position: absolute; left: 36px; top: 28px; }
[data-scene="camps"] .hd b { display: block; font-size: 32px; font-weight: 750; letter-spacing: -0.025em; }
[data-scene="camps"] .hd span { display: block; margin-top: 6px; font-size: 22px; font-weight: 500; color: var(--ink-3); }
[data-scene="camps"] .kpi { position: absolute; right: 36px; top: 24px; text-align: right; }
[data-scene="camps"] .kpi span { display: block; font-size: 21px; font-weight: 550; color: var(--ink-3); }
[data-scene="camps"] .kpi b { display: block; font-size: 40px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; font-variant-numeric: tabular-nums; }
[data-scene="camps"] .kpi b i { font-style: normal; color: ${GREEN}; }
[data-scene="camps"] .done { position: absolute; right: 28px; top: 30px; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 22px 0 16px;
  border-radius: 999px; background: ${GREEN}; color: #fff; font-size: 24px; font-weight: 650; white-space: nowrap; }
[data-scene="camps"] .mnt { position: absolute; left: 0; top: 96px; display: block; }
[data-scene="camps"] .tk { position: absolute; width: ${TK.w}px; height: ${TK.h}px; filter: drop-shadow(0 1px 1px rgba(10,20,40,0.12)) drop-shadow(0 8px 14px rgba(10,30,70,0.14));
  animation: cm-in 700ms var(--e-decel) var(--d) both; z-index: 6; }
@keyframes cm-in { from { opacity: 0; transform: translate3d(180px, -40px, 0) rotate(5deg); } }
[data-scene="camps"] .tkm { position: absolute; inset: 0; }
[data-scene="camps"] .tkb { position: absolute; inset: 0; border-radius: 18px; background: #fff; display: flex; align-items: center; gap: 12px; padding: 0 0 0 16px;
  --m1: radial-gradient(circle 12px at ${TK.w - TK.stub}px 0, #0000 98%, #000); --m2: radial-gradient(circle 12px at ${TK.w - TK.stub}px 100%, #0000 98%, #000);
  -webkit-mask: var(--m1), var(--m2); -webkit-mask-composite: source-in; mask: var(--m1), var(--m2); mask-composite: intersect; }
[data-scene="camps"] .tkb::after { content: ""; position: absolute; left: ${TK.w - TK.stub}px; top: 16px; bottom: 16px; border-left: 2.5px dashed #d8dde3; }
[data-scene="camps"] .tx { flex: 1; min-width: 0; }
[data-scene="camps"] .tx b { display: block; font-size: 23px; font-weight: 700; letter-spacing: -0.015em; white-space: nowrap; }
[data-scene="camps"] .tx span { display: block; margin-top: 4px; font-size: 20px; font-weight: 500; color: var(--ink-3); white-space: nowrap; }
[data-scene="camps"] .stub { position: relative; flex: none; width: ${TK.stub}px; height: 100%; display: flex; align-items: center; justify-content: center; }
[data-scene="camps"] .stub .pl { font-size: 20px; font-weight: 550; color: rgba(11,11,15,0.35); }
[data-scene="camps"] .stamp { position: absolute; left: 50%; top: 50%; margin: -21px 0 0 -62px; width: 124px; height: 42px; border-radius: 10px; border: 3px solid currentColor;
  display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; letter-spacing: 0.01em; background: #fff;
  animation: cm-stamp 520ms var(--e-emph) var(--d) both; }
@keyframes cm-stamp { 0% { opacity: 0; transform: rotate(-9deg) scale(1.9); } 55% { opacity: 1; transform: rotate(-9deg) scale(0.92); } 100% { opacity: 1; transform: rotate(-9deg) scale(1); } }
[data-scene="camps"] .sum { position: absolute; left: 32px; top: 236px; width: 816px; }
[data-scene="camps"] .sh { display: flex; align-items: baseline; gap: 14px; }
[data-scene="camps"] .sh b { font-size: 26px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="camps"] .sh span { font-size: 21px; font-weight: 500; color: var(--ink-3); }
[data-scene="camps"] .bar { margin-top: 18px; display: flex; gap: 6px; }
[data-scene="camps"] .bar i { flex: 1; height: 30px; border-radius: 9px; }
[data-scene="camps"] .lg { margin-top: 20px; display: flex; gap: 28px; font-size: 22px; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
[data-scene="camps"] .lg span { display: inline-flex; align-items: center; gap: 10px; }
[data-scene="camps"] .lg i { width: 16px; height: 16px; border-radius: 5px; }
[data-scene="camps"] .team { position: absolute; top: 452px; width: ${CW}px; display: flex; justify-content: center; }
[data-scene="camps"] .tent { display: block; }
[data-scene="camps"] .slot { position: absolute; width: ${SLOT}px; height: ${SLOT}px; border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 2.5px #d3d9d6; z-index: 2; }
[data-scene="camps"] .slot .face { position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 3px #fff; }
[data-scene="camps"] .tname { position: absolute; top: ${SY - 40}px; height: 34px; transform-origin: 50% 100%; margin-left: -48px; width: 96px; border-radius: 999px; background: #fff; z-index: 3;
  box-shadow: 0 0 0 1px var(--hairline), 0 6px 14px -6px rgba(0,30,70,0.3); font-size: 20px; font-weight: 650; display: flex; align-items: center; justify-content: center; }
[data-scene="camps"] .tl { position: absolute; top: 646px; width: ${CW}px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 22px; }
[data-scene="camps"] .tl b { font-weight: 750; }
[data-scene="camps"] .tl .tc { font-weight: 600; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-scene="camps"] .tl .full { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
`,
    html: () => `
<div class="split flip">
  ${TV.copy({ title: "Табори", line: "Табір збирається без таблиць: заявки, оплати, команди." })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <svg class="mnt a-up" style="--d:520ms" width="${W}" height="84" viewBox="0 0 ${W} 84" aria-hidden="true">
        <path d="M0 84 V62 L70 30 L130 52 L210 8 L290 50 L350 26 L430 64 L510 18 L590 54 L670 14 L750 48 L820 24 L880 52 V84 Z" fill="${tint(GREEN, 12)}"/>
        <path d="M0 84 V72 L90 46 L170 70 L260 40 L360 74 L450 46 L540 76 L640 48 L720 72 L800 44 L880 68 V84 Z" fill="${tint(GREEN, 22)}"/>
      </svg>
      <div class="hd"><b>Молодіжний табір</b><span>14–20 липня · Карпати</span></div>
      <div class="kpi a-out" style="--d:${FULL}ms"><span>Місць зайнято</span><b><i class="n">8</i> з 12</b></div>
      <div class="done a-pop" style="--d:${FULL + 60}ms">${TV.icon("check", 24, "#fff", 3)}Табір зібрано</div>
      <div class="sum">
        <div class="sh a-fade" style="--d:${FULL + 120}ms"><b>Оплати</b><span>12 учасників</span></div>
        <div class="bar">${PAYS.map((c, i) => `<i class="a-pop" style="background:${c};--d:${FULL + 180 + i * 45}ms"></i>`).join("")}</div>
        <div class="lg a-up" style="--d:${FULL + 520}ms">
          <span><i style="background:${GREEN}"></i>Сплачено 10</span><span><i style="background:${AMB}"></i>Частково 1</span><span><i style="background:${VIOLET}"></i>Стипендія церкви 1</span></div>
      </div>
      ${TEAMS.map((_, z) => team(z)).join("")}
      ${TICKETS.map(ticket).join("")}
    </div>
    ${TV.tap(GRAB_AT[0], GRAB_AT[1], GRAB, SKY)}
    ${TV.cursor("Дмитро", SKY, "cm-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      const seated = TICKETS.filter((k) => t >= k.land).length;
      const n = el.querySelector(".n");
      if (n && n.textContent !== String(8 + seated)) n.textContent = 8 + seated;
      TEAMS.forEach((T, z) => {
        const c = T.seated.filter(Boolean).length + TICKETS.filter((k) => k.to[0] === z && t >= k.land).length;
        const e = el.querySelector(`.tc[data-z="${z}"]`);
        const s = `${c} з 4`;
        if (e && e.textContent !== s) e.textContent = s;
      });

      // Дмитро бере квиток Софії й несе в Загін 2, до Тетяни.
      const [sx, sy] = slotAt(...TICKETS[0].to);
      const keys = [[GRAB - 700, 700, 760], [GRAB - 60, GRAB_AT[0] - 10, GRAB_AT[1] - 6], [GRAB + 120, GRAB_AT[0] - 8, GRAB_AT[1] - 4],
        [DROP - 40, sx - 10, sy - 6], [DROP + 160, sx - 6, sy - 2], [DROP + 800, 520, 780]];
      TV.moveCursor(el.querySelector("#cm-cur"), t, { keys, show: [GRAB - 700, DROP + 740], clicks: [GRAB, DROP] });

      TICKETS.forEach((k, i) => {
        const e = el.querySelector(`#cm-t${i}`);
        if (!e) return;
        let dx = 0, dy = 0, s = 1, o = 1;
        if (k.drag) {
          const p = TV.path(t, keys);
          const q = TV.prog(t, GRAB + 60, GRAB + 260, TV.ease.emph);
          const tip = [p.x + 10, p.y + 6];
          dx = (tip[0] - GRAB_AT[0]) * q; dy = (tip[1] - GRAB_AT[1]) * q;
          s = 1 - 0.1 * q - 0.45 * TV.prog(t, DROP - 520, DROP - 40, TV.ease.inout);
          o = 1 - TV.prog(t, DROP - 60, DROP + 60, TV.ease.linear);
          // Масштаб — навколо точки захоплення, а не центру квитка.
          e.style.transformOrigin = `${GRAB_AT[0] - k.x}px ${GRAB_AT[1] - k.y}px`;
        } else {
          const q = TV.prog(t, k.fly, k.fly + FLY, TV.ease.inout);
          const [x0, y0] = center(k), [x1, y1] = slotAt(...k.to);
          const lift = -90 * 4 * q * (1 - q);
          dx = (x1 - x0) * q; dy = (y1 - y0) * q + lift;
          s = 1 - 0.8 * q;
          o = 1 - TV.prog(t, k.fly + FLY - 140, k.fly + FLY, TV.ease.linear);
        }
        const up = k.drag ? t >= GRAB : t >= k.fly;
        if (e.parentElement) e.parentElement.style.zIndex = up ? "8" : "6";
        e.style.opacity = String(o);
        e.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${s})`;
      });
    },
  });
})();
