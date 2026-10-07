/* Передача служіння — «Залиш після себе» (activities.ts → ministries «Історія та
   передача», groups «Передача групи»; команда прославлення з i18n.ts: Олена — лідер
   прославлення, Марія — клавіші, Тарас — барабани, Андрій — кахон; пісні з пісенника).
   Олена тисне «Передати служіння», обирає Марію — і вся справа по одній плитці
   перелітає до Марії з галочкою. Олена — «Передано», Марія — лідер з першого дня. */
// icons: music, arrow-right, check, users-round, calendar-days, chart-column, notebook-pen, book-open, user
(function () {
  const C = "#f97316";
  const tint = (p) => `color-mix(in oklab, ${C} ${p}%, #fff)`;
  const W = 900, H = 840;
  const LX = 0, RX = 480, CY = 140, CW = 420, CH = H - CY;
  const TY = CY + 132, TH = 80, TG = 12, TW = CW - 32;
  const T = { btn: 2200, pop: 2300, pick: 3550, t0: 4700, step: 480, fly: 820, done: 8350, count: 9600 };
  const land = (k) => T.t0 + k * T.step + T.fly;

  const TEAM = [["Олена", "Вокал"], ["Марія", "Клавіші"], ["Тарас", "Барабани"], ["Андрій", "Кахон"]];
  const bars = [5, 7, 6, 8, 7, 9, 6, 8, 9, 7, 8, 9].map((v) => `<i style="height:${v * 3}px"></i>`).join("");
  const ITEMS = [
    { icon: "users-round", c: "#0ea5e9", label: "Склад і ролі",
      vis: `<span class="avs">${TEAM.map(([n]) => TV.avatar(n, 30)).join("")}</span>` },
    { icon: "calendar-days", c: "#3b82f6", label: "Графік на жовтень",
      vis: `<span class="dts">${[4, 11, 18, 25].map((d) => `<b>${d}</b>`).join("")}</span>` },
    { icon: "chart-column", c: "#12a150", label: "Явка й навантаження", vis: `<span class="brs">${bars}</span>` },
    { icon: "music", c: "#f05b8b", label: "Пісні й тональності", vis: `<span class="sg">Величний Бог<b>G</b></span>` },
    { icon: "notebook-pen", c: "#8b5bf0", label: "Нотатки лідера", vis: `<span class="nts"><i></i><i></i></span>` },
    { icon: "book-open", c: "#b45309", label: "Інструкції", vis: `<span class="nts"><i></i><i style="width:60%"></i></span>` },
  ];

  const tile = (it, k) => `
    <div class="tl a-up" style="left:${LX + 16}px;top:${TY + k * (TH + TG)}px;--d:${560 + k * 70}ms">
      <div class="fx" style="--d:${T.t0 + k * T.step}ms"><div class="fh" style="--d:${T.t0 + k * T.step}ms">
        <div class="tli">
          <span class="ti" style="color:${it.c};background:color-mix(in oklab, ${it.c} 14%, #fff)">${TV.icon(it.icon, 26, "currentColor", 2.2)}</span>
          <span class="tlab">${it.label}</span>
          <span class="tvis">${it.vis}</span>
          <span class="tok a-pop" style="--d:${land(k) - 40}ms">${TV.icon("check", 20, "#fff", 3.4)}</span>
        </div>
      </div></div>
    </div>`;
  const slots = (x, cls, d, d0) => `<div class="sls a-fade" style="--d:${d0}ms">${ITEMS.map((_, k) => `<i class="slot ${cls}" style="left:${x + 16}px;top:${TY + k * (TH + TG)}px;--d:${d(k)}ms"></i>`).join("")}</div>`;

  const who = (x, name, full, role, extra = "") => `
    <div class="pc card a-rise" style="left:${x}px;top:${CY}px;--d:${x ? 520 : 400}ms">
      ${extra}
      <div class="pav">${name === "?" ? "" : TV.avatar(name, 72)}</div>
      <div class="pn">${full}</div>
      <div class="pr">${role}</div>
    </div>`;

  const picker = () => `
    <div class="pk a-pop" style="--d:${T.pop}ms"><div class="a-out" style="--d:${T.pick + 150}ms">
      <div class="pkt">Кому передати?</div>
      ${TEAM.slice(1).map(([n, r], k) => `<div class="pkr" style="top:${64 + k * 66}px">${k === 0 ? `<i class="pkh a-fade" style="--d:${T.pick - 500}ms"></i>` : ""}${TV.avatar(n, 46)}<b>${n}</b><span>${r}</span></div>`).join("")}
    </div></div>`;

  const CLICKS = [[T.btn, W - 24 - 125, 55], [T.pick, W - 360 - 24 + 150, 100 + 64 + 33]];

  TV.scene({
    id: "handover",
    dur: 12600,
    bg: "light",
    css: `
[data-scene="handover"] .t { font-size: 128px; }
[data-scene="handover"] .sls { position: absolute; inset: 0; z-index: 1; }
[data-scene="handover"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
[data-scene="handover"] .hd { position: absolute; left: 0; top: 0; width: ${W}px; height: 110px; display: flex; align-items: center; gap: 18px; padding: 0 24px; }
[data-scene="handover"] .hi { width: 62px; height: 62px; border-radius: 18px; background: ${tint(14)}; color: ${C}; display: flex; align-items: center; justify-content: center; }
[data-scene="handover"] .hn { font-size: 34px; font-weight: 800; letter-spacing: -0.025em; }
[data-scene="handover"] .hs { font-size: 21px; font-weight: 500; color: var(--ink-3); margin-top: 2px; }
[data-scene="handover"] .hr { margin-left: auto; position: relative; width: 250px; height: 60px; }
[data-scene="handover"] .btn { position: absolute; inset: 0; height: 60px; padding: 0; background: ${C}; font-size: 23px; }
[data-scene="handover"] .ok { position: absolute; right: 0; top: 0; height: 60px; padding: 0 22px 0 16px; border-radius: 999px; background: var(--green); color: #fff;
  display: flex; align-items: center; gap: 10px; white-space: nowrap; font-size: 22px; font-weight: 650; }
[data-scene="handover"] .ok b { font-variant-numeric: tabular-nums; opacity: 0.85; font-weight: 600; }
[data-scene="handover"] .pc { position: absolute; width: ${CW}px; height: ${CH}px; }
[data-scene="handover"] .pav { position: absolute; left: 22px; top: 22px; width: 72px; height: 72px; border-radius: 50%; }
[data-scene="handover"] .pn { position: absolute; left: 110px; top: 28px; font-size: 27px; font-weight: 750; letter-spacing: -0.015em; white-space: nowrap; }
[data-scene="handover"] .pr { position: absolute; left: 110px; top: 66px; font-size: 21px; font-weight: 500; color: var(--ink-3); white-space: nowrap; }
[data-scene="handover"] .ph { position: absolute; left: 22px; top: 22px; width: 72px; height: 72px; border-radius: 50%; border: 3px dashed rgba(11,11,15,0.22);
  display: flex; align-items: center; justify-content: center; color: rgba(11,11,15,0.3); }
[data-scene="handover"] .grey { position: absolute; left: ${LX}px; top: ${CY}px; width: ${CW}px; height: ${CH}px; border-radius: 32px; background: rgba(250,250,251,0.74); z-index: 7; }
[data-scene="handover"] .stamp { position: absolute; left: ${LX + CW / 2}px; top: ${CY + CH / 2}px; z-index: 8; transform: translate(-50%, -50%); }
[data-scene="handover"] .stamp > span { display: flex; align-items: center; gap: 10px; height: 64px; padding: 0 28px 0 20px; border-radius: 999px; background: #fff;
  color: var(--green); font-size: 28px; font-weight: 750; white-space: nowrap; box-shadow: inset 0 0 0 3px var(--green), var(--shadow-pop); }
[data-scene="handover"] .lead { position: absolute; left: 108px; top: 62px; height: 34px; padding: 0 12px; border-radius: 999px; background: ${C}; color: #fff;
  display: inline-flex; align-items: center; font-size: 18px; font-weight: 650; white-space: nowrap; }
[data-scene="handover"] .arr { position: absolute; left: ${(CW + RX) / 2 - 26}px; top: ${CY + CH / 2 - 26}px; width: 52px; height: 52px; border-radius: 50%; background: #fff;
  box-shadow: 0 0 0 1px var(--hairline), var(--shadow-pop); display: flex; align-items: center; justify-content: center; color: ${C}; z-index: 2; }
[data-scene="handover"] .slot { position: absolute; width: ${TW}px; height: ${TH}px; border-radius: 18px; border: 2.5px dashed rgba(11,11,15,0.14); z-index: 1; }
[data-scene="handover"] .slot.l { opacity: 0; animation: a-fade 400ms var(--e-std) var(--d) both; }
[data-scene="handover"] .slot.r { animation: a-outf 300ms var(--e-std) var(--d) both; }
[data-scene="handover"] .tl { position: absolute; width: ${TW}px; height: ${TH}px; z-index: 6; }
[data-scene="handover"] .fx { position: absolute; inset: 0; animation: hn-x ${T.fly}ms cubic-bezier(0.55, 0, 0.3, 1) var(--d) both; }
@keyframes hn-x { to { transform: translateX(${RX - LX}px); } }
[data-scene="handover"] .fh { position: absolute; inset: 0; animation: hn-h ${T.fly}ms ease-in-out var(--d) both; }
@keyframes hn-h { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-44px) scale(1.05); } 100% { transform: translateY(0) scale(1); } }
[data-scene="handover"] .tli { position: absolute; inset: 0; border-radius: 18px; background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 8px 20px -12px rgba(10,30,70,0.3); }
[data-scene="handover"] .ti { position: absolute; left: 14px; top: 16px; width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
[data-scene="handover"] .tlab { position: absolute; left: 76px; top: 12px; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; }
[data-scene="handover"] .tvis { position: absolute; left: 76px; top: 44px; height: 26px; display: flex; align-items: center; }
[data-scene="handover"] .avs { display: flex; }
[data-scene="handover"] .avs .avatar { margin-right: -8px; box-shadow: 0 0 0 2px #fff; }
[data-scene="handover"] .dts { display: flex; gap: 6px; }
[data-scene="handover"] .dts b { min-width: 30px; height: 24px; padding: 0 5px; border-radius: 7px; background: color-mix(in oklab, #3b82f6 13%, #fff); color: #1d4ed8;
  display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; }
[data-scene="handover"] .brs { display: flex; align-items: flex-end; gap: 4px; height: 26px; }
[data-scene="handover"] .brs i { width: 8px; border-radius: 2px; background: color-mix(in oklab, #12a150 55%, #fff); }
[data-scene="handover"] .sg { display: flex; align-items: center; gap: 8px; font-size: 19px; font-weight: 600; color: var(--ink-2); }
[data-scene="handover"] .sg b { width: 26px; height: 24px; border-radius: 7px; background: #f05b8b; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; }
[data-scene="handover"] .nts { display: flex; flex-direction: column; gap: 7px; width: 170px; }
[data-scene="handover"] .nts i { height: 7px; border-radius: 4px; background: rgba(11,11,15,0.12); }
[data-scene="handover"] .tok { position: absolute; right: 16px; top: 22px; width: 36px; height: 36px; border-radius: 50%; background: var(--green); display: flex; align-items: center; justify-content: center; }
[data-scene="handover"] .pk { position: absolute; left: ${W - 360 - 24}px; top: 100px; width: 360px; height: 280px; z-index: 12; transform-origin: 75% 0; }
[data-scene="handover"] .pk > div { position: absolute; inset: 0; border-radius: 24px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), 0 30px 60px -20px rgba(10,30,70,0.4); }
[data-scene="handover"] .pkt { position: absolute; left: 22px; top: 20px; font-size: 22px; font-weight: 700; color: var(--ink-2); }
[data-scene="handover"] .pkr { position: absolute; left: 10px; right: 10px; height: 60px; display: flex; align-items: center; gap: 14px; padding: 0 12px; border-radius: 16px; }
[data-scene="handover"] .pkr b { position: relative; font-size: 24px; font-weight: 700; }
[data-scene="handover"] .pkr span { position: relative; margin-left: auto; font-size: 20px; font-weight: 500; color: var(--ink-3); }
[data-scene="handover"] .pkr .avatar { position: relative; }
[data-scene="handover"] .pkh { position: absolute; inset: 0; border-radius: 16px; background: ${tint(14)}; }
`,
    html: (o) => `
<div class="split${o === "port" ? "" : " flip"}">
  ${TV.copy({ title: ["Залиш", "після себе"], accent: "після себе", line: "Лідер пішов — наступний бачить усе з першого дня." })}
  <div class="vis"><div class="mock">
    <div class="hd card a-rise" style="--d:250ms">
      <span class="hi">${TV.icon("music", 32, "currentColor", 2.2)}</span>
      <div><div class="hn">Прославлення</div><div class="hs">Служіння · 4 ролі</div></div>
      <div class="hr">
        <span class="btn a-outf" style="--d:${T.count}ms">Передати служіння</span>
        <span class="ok a-pop" style="--d:${T.count}ms">${TV.icon("check", 24, "#fff", 3)}Нічого не загубилось<b>6 з 6</b></span>
      </div>
    </div>
    ${who(LX, "Олена", "Олена Ковальчук", "Лідер прославлення")}
    ${who(RX, "?", "", "", `
      <span class="ph a-outf" style="--d:${T.pick + 60}ms">${TV.icon("user", 34, "currentColor", 2)}</span>
      <span class="pav a-pop" style="--d:${T.pick + 60}ms">${TV.avatar("Марія", 72)}</span>
      <span class="pn a-fade" style="--d:${T.pick + 120}ms">Марія</span>
      <span class="pr"><span class="a-outf" style="--d:${T.pick + 60}ms">Новий лідер</span></span>
      <span class="pr a-fade" style="--d:${T.pick + 120}ms"><span class="a-outf" style="--d:${T.done}ms">Клавіші</span></span>
      <span class="lead a-pop" style="--d:${T.done + 60}ms">Лідер: Марія · з першого дня</span>`)}
    ${slots(LX, "l", (k) => T.t0 + k * T.step + 200, 0)}
    ${slots(RX, "r", (k) => land(k) - 60, 700)}
    <i class="grey a-fade" style="--d:${T.done}ms"></i>
    <span class="stamp"><span class="a-pop" style="--d:${T.done + 120}ms">${TV.icon("check", 30, "currentColor", 3)}Передано</span></span>
    <span class="arr a-pop" style="--d:${T.pick + 300}ms">${TV.icon("arrow-right", 28, "currentColor", 2.6)}</span>
    ${ITEMS.map(tile).join("")}
    ${picker()}
    ${CLICKS.map(([t, x, y]) => TV.tap(x, y, t, C)).join("")}
    ${TV.cursor("Олена", C, "hn-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      const k = CLICKS.map(([ct, x, y]) => [ct, x - 10, y - 6]);
      TV.moveCursor(el.querySelector("#hn-cur"), t, {
        keys: [
          [T.btn - 760, k[0][1] - 260, k[0][2] + 420],
          [T.btn - 40, k[0][1], k[0][2]],
          [T.btn + 500, k[0][1], k[0][2]],
          [T.pick - 560, k[1][1], k[1][2]],
          [T.pick + 160, k[1][1], k[1][2]],
          [T.pick + 800, k[1][1] - 120, k[1][2] + 360],
        ],
        show: [T.btn - 760, T.pick + 700],
        clicks: CLICKS.map((c) => c[0]),
      });
    },
  });
})();
