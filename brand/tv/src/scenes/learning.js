/* Навчання — курс як доріжка з десяти уроків (дані: content/modules/activities.ts →
   learning: features «Прогрес кожного», «Явка на заняттях», «Сертифікати», pipeline
   «Відстає» і «Завершив»; у картці людини — «Основи віри», 8 з 10 уроків). Двічі минає
   урок: Олена доходить до фінішу, і система сама формує сертифікат (pipeline
   «Завершив») — великий, з печаткою; він стоїть на екрані, а потім летить у лічильник
   «Сертифікатів 38 → 39». Андрій — на восьмому, Тарас іде далі, а Петро стоїть на
   третьому — два пропуски поспіль, і система його підсвічує та сама надсилає
   матеріали пропущеного уроку. */
// icons: award, flag, send, check, graduation-cap
(function () {
  const IND = "#4f46e5", AMBER = "#f59e0b";
  const W = 880, H = 770;
  const Y1 = 236, Y2 = 510, XS = [110, 260, 410, 560, 710], RC = (Y2 - Y1) / 2, FIN_Y = 664;
  const st = (i) => (i <= 5 ? [XS[i - 1], Y1] : i <= 10 ? [XS[10 - i], Y2] : [XS[0], FIN_Y]);
  // ── час: дії щонайменше за 1,2 с одна від одної
  const HOPS = [2600, 4200], HOP = 600;
  const LAND = HOPS[1] + HOP;                           // Олена на фініші
  const CIN = LAND + 150, CIN_T = 720;                  // сертифікат розгортається з фінішу
  const CF = CIN + CIN_T + 1700, CF_T = 680;            // стоїть 1,7 с і летить у лічильник
  const COUNT = CF + CF_T - 80;                         // 38 → 39
  const FLAG = COUNT + 1200, SENT = FLAG + 1200;
  const PEOPLE = [
    { name: "Олена", path: [9, 10, 11], lag: 0 },
    { name: "Андрій", path: [6, 7, 8], lag: 110 },
    { name: "Тарас", path: [4, 5, 6], lag: 220 },
    { name: "Петро", path: [3, 3, 3], lag: 0, stall: true },
  ];
  const AV = 64;
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const TRACK = `M${XS[0]} ${Y1} H${XS[4]} A${RC} ${RC} 0 0 1 ${XS[4]} ${Y2} H${XS[0]} V${FIN_Y}`;
  // Сертифікат: центр і розмір у дошці; звідки з'являється і куди летить.
  const CX = W / 2, CY = 410, CWD = 770, CHT = 450;
  const KPI = [W - 36 - 34, 82];
  const FROM = [XS[0] - CX, FIN_Y - CY], TO = [KPI[0] - CX, KPI[1] - CY];

  // Печатка-розетка: зубчасте коло, стрічки й іконка нагороди.
  const seal = (() => {
    const pts = Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2, r = i % 2 ? 50 : 58;
      return `${(64 + Math.cos(a) * r).toFixed(1)},${(64 + Math.sin(a) * r).toFixed(1)}`;
    }).join(" ");
    return `<svg class="seal-svg" width="128" height="170" viewBox="0 0 128 170" aria-hidden="true">
      <path d="M38 100 L22 166 L44 152 L58 170 L66 108 Z" fill="${tint(IND, 70)}"/>
      <path d="M90 100 L106 166 L84 152 L70 170 L62 108 Z" fill="${tint(IND, 70)}"/>
      <polygon points="${pts}" fill="${IND}"/>
      <circle cx="64" cy="64" r="40" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="2.5" stroke-dasharray="3 5"/>
    </svg>`;
  })();

  function station(i) {
    const [x, y] = st(i);
    return `<span class="st a-pop" style="left:${x}px;top:${y}px;--d:${560 + i * 70}ms">${i}</span>`;
  }

  function person(p, k) {
    const [x, y] = st(p.path[0]);
    const miss = p.stall
      ? `<span class="miss a-pop" style="--d:${HOPS[0] + HOP}ms"><span class="a-outf" style="--d:${HOPS[1] + HOP}ms">1</span><span class="m2 a-fade" style="--d:${HOPS[1] + HOP}ms">2</span></span>`
      : "";
    const award = p.path[2] === 11 ? `<span class="aw a-pop" style="--d:${COUNT}ms">${TV.icon("award", 20, "#fff", 2.4)}</span>` : "";
    return `
<div class="pp" id="ln-p${k}" style="transform:translate(${x}px,${y}px)">
  <div class="in a-pop" style="--d:${1250 + k * 90}ms">
    <span class="face">${TV.avatar(p.name, AV)}${p.stall ? `<span class="warn a-fade" style="--d:${FLAG}ms"></span>` : ""}</span>
    ${miss}${award}
    <span class="nm">${p.name}</span>
  </div>
</div>`;
  }

  const S = '[data-scene="learning"]';
  TV.scene({
    id: "learning",
    dur: 13400,
    bg: "light",
    css: `
${S} .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1.02; }
${S} .board { position: absolute; inset: 0; }
${S} .hd { position: absolute; left: 36px; top: 30px; }
${S} .hd b { display: block; font-size: 32px; font-weight: 750; letter-spacing: -0.025em; }
${S} .hd span { display: block; margin-top: 6px; font-size: 22px; font-weight: 500; color: var(--ink-3); }
${S} .kpi { position: absolute; right: 36px; top: 26px; text-align: right; z-index: 9; }
${S} .kpi > span { display: block; font-size: 21px; font-weight: 550; color: var(--ink-3); }
${S} .kpi b { position: relative; display: flex; align-items: center; justify-content: flex-end; gap: 10px; font-size: 44px; font-weight: 800; letter-spacing: -0.02em; color: ${IND}; font-variant-numeric: tabular-nums; line-height: 1.1; }
${S} .kpi .hit { position: absolute; right: -14px; top: -6px; width: 96px; height: 64px; border-radius: 999px; background: ${tint(IND, 18)}; z-index: -1;
  animation: ln-hit 1100ms var(--e-decel) ${COUNT}ms both; }
@keyframes ln-hit { 0% { opacity: 0; transform: scale(0.5); } 25% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0; transform: scale(1.5); } }
${S} .rule { position: absolute; left: 0; right: 0; top: 122px; height: 1px; background: var(--hairline); }
${S} svg.trk { position: absolute; left: 0; top: 0; overflow: visible; }
${S} .trk path { stroke-dasharray: 1; animation: ln-draw 1300ms var(--e-emph) 480ms both; }
@keyframes ln-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
${S} .st { position: absolute; width: 50px; height: 50px; margin: -25px 0 0 -25px; border-radius: 50%; background: #fff;
  box-shadow: inset 0 0 0 3px ${tint(IND, 35)}; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 750; color: ${IND}; }
${S} .fin { position: absolute; left: ${XS[0] - 40}px; top: ${FIN_Y - 40}px; width: 80px; height: 80px; border-radius: 50%; background: ${tint(IND, 12)};
  box-shadow: inset 0 0 0 3px ${tint(IND, 45)}; display: flex; align-items: center; justify-content: center; }
${S} .fin-l { position: absolute; left: ${XS[0] + 62}px; top: ${FIN_Y - 17}px; display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 700; color: ${IND}; white-space: nowrap; }
${S} .pp { position: absolute; left: 0; top: 0; width: 0; height: 0; z-index: 5; }
${S} .pp .in { position: absolute; left: 0; top: 0; }
${S} .face { position: absolute; left: -${AV / 2 + 4}px; top: -${AV / 2 + 4}px; width: ${AV + 8}px; height: ${AV + 8}px; border-radius: 50%; padding: 4px; background: #fff;
  box-shadow: 0 0 0 3px ${IND}, 0 10px 20px -8px rgba(20,20,80,0.45); }
${S} .face .warn { position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 4px ${AMBER}; }
${S} .face .warn::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; box-shadow: 0 0 0 4px ${AMBER}; opacity: 0;
  animation: ln-ping 1800ms var(--e-decel) ${FLAG + 600}ms infinite both; }
@keyframes ln-ping { 0% { opacity: 0; transform: scale(1); } 15% { opacity: 0.7; } 100% { opacity: 0; transform: scale(1.45); } }
${S} .nm { position: absolute; left: -80px; width: 160px; top: ${AV / 2 + 12}px; text-align: center; font-size: 22px; font-weight: 650; letter-spacing: -0.01em; }
${S} .miss { position: absolute; left: 18px; top: -52px; width: 34px; height: 34px; border-radius: 50%; background: ${AMBER}; color: #fff;
  box-shadow: 0 0 0 3px #fff; font-size: 20px; font-weight: 800; }
${S} .miss span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
${S} .aw { position: absolute; left: 16px; top: -50px; width: 36px; height: 36px; border-radius: 50%; background: ${IND}; box-shadow: 0 0 0 3px #fff;
  display: flex; align-items: center; justify-content: center; }
${S} .flag { position: absolute; left: ${XS[2] - 190}px; top: ${Y1 + 90}px; width: 470px; height: 138px; border-radius: 22px; background: var(--amber-soft);
  box-shadow: inset 0 0 0 2px rgba(245,158,11,0.4), 0 12px 26px -14px rgba(120,70,0,0.35); padding: 16px 20px; z-index: 3; }
${S} .flag::before { content: ""; position: absolute; left: 176px; top: -11px; width: 24px; height: 24px; background: var(--amber-soft);
  transform: rotate(45deg); border-radius: 4px; box-shadow: inset 2px 2px 0 0 rgba(245,158,11,0.4); }
${S} .flag .t1 { position: relative; display: flex; align-items: center; gap: 10px; font-size: 23px; font-weight: 700; letter-spacing: -0.01em; }
${S} .flag .t2 { position: relative; margin: 4px 0 0 34px; font-size: 21px; font-weight: 500; color: var(--ink-2); }
${S} .flag .sent { position: absolute; left: 54px; bottom: 14px; }
${S} .chip { display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 16px 0 12px; border-radius: 999px; background: #fff;
  box-shadow: 0 0 0 1.5px rgba(245,158,11,0.35); font-size: 20px; font-weight: 600; color: var(--ink-2); white-space: nowrap; }
/* Сертифікат: пелена фокусу, розгортання з фінішу, політ у лічильник. */
${S} .veil { position: absolute; inset: 0; border-radius: 32px; z-index: 7; animation: a-outf 420ms var(--e-std) ${CF + 120}ms both; }
${S} .veil i { position: absolute; inset: 0; border-radius: 32px; background: rgba(250,250,255,0.82); animation: a-fade 500ms var(--e-std) ${CIN}ms both; }
${S} .cert-o { position: absolute; left: ${CX - CWD / 2}px; top: ${CY - CHT / 2}px; width: ${CWD}px; height: ${CHT}px; z-index: 8;
  animation: ln-fly ${CF_T}ms cubic-bezier(0.5, 0, 0.75, 0.3) ${CF}ms both; }
@keyframes ln-fly { 0% { transform: none; opacity: 1; } 80% { opacity: 1; } 100% { transform: translate(${TO[0]}px, ${TO[1]}px) scale(0.07); opacity: 0; } }
${S} .cert { position: absolute; inset: 0; border-radius: 30px; background: #fff; box-shadow: 0 0 0 1px var(--hairline), 0 40px 80px -30px rgba(40,30,140,0.45);
  animation: ln-open ${CIN_T}ms var(--e-emph) ${CIN}ms both; }
@keyframes ln-open { 0% { opacity: 0; transform: translate(${FROM[0]}px, ${FROM[1]}px) scale(0.12); } 18% { opacity: 1; } 100% { opacity: 1; transform: none; } }
${S} .cert .frame { position: absolute; inset: 16px; border-radius: 20px; box-shadow: inset 0 0 0 2px ${tint(IND, 30)}; }
${S} .cert .cap { position: absolute; left: 0; right: 0; top: 46px; display: flex; align-items: center; justify-content: center; gap: 12px;
  font-size: 22px; font-weight: 750; letter-spacing: 0.2em; color: ${IND}; }
${S} .cert h4 { position: absolute; left: 0; right: 0; top: 86px; text-align: center; font-size: 54px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.1; }
${S} .cert .sub { position: absolute; left: 0; right: 0; top: 156px; text-align: center; font-size: 23px; font-weight: 550; color: var(--ink-3); }
${S} .cert .line { position: absolute; left: ${CWD / 2 - 60}px; width: 120px; top: 210px; height: 3px; border-radius: 2px; background: ${tint(IND, 35)}; }
${S} .cert .who { position: absolute; left: 64px; top: 252px; display: flex; align-items: center; gap: 22px; }
${S} .cert .who .avatar { box-shadow: 0 0 0 5px #fff, 0 0 0 7px ${tint(IND, 40)}; }
${S} .cert .who b { display: block; font-size: 36px; font-weight: 780; letter-spacing: -0.025em; }
${S} .cert .who span { display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 23px; font-weight: 600; color: ${IND}; }
${S} .cert .sl { position: absolute; right: 56px; top: 226px; width: 128px; height: 170px; }
${S} .cert .sl .seal-svg { position: absolute; inset: 0; }
${S} .cert .sl .ic { position: absolute; left: 44px; top: 44px; }
${S} .cert .sl.a-pop { animation-name: ln-seal; animation-duration: 760ms; }
@keyframes ln-seal { 0% { opacity: 0; transform: scale(1.8) rotate(-25deg); } 60% { opacity: 1; } 100% { opacity: 1; transform: none; } }
`,
    html: () => `
<div class="split">
  ${TV.copy({ title: "Навчання" })}
  <div class="vis"><div class="mock">
    <div class="board card a-rise" style="--d:250ms">
      <div class="hd"><b>Основи віри</b><span>Весняний потік · 10 уроків</span></div>
      <div class="kpi"><span>Сертифікатів</span><b><span class="hit"></span>${TV.icon("award", 36, IND, 2.4)}<span class="n">38</span></b></div>
      <div class="rule"></div>
      <svg class="trk" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <path d="${TRACK}" pathLength="1" fill="none" stroke="${tint(IND, 16)}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      ${Array.from({ length: 10 }, (_, i) => station(i + 1)).join("")}
      <span class="fin a-pop" style="--d:1300ms">${TV.icon("graduation-cap", 38, IND, 2.2)}</span>
      <span class="fin-l a-fade" style="--d:1400ms">Фініш курсу</span>
      <div class="flag a-pop" style="--d:${FLAG}ms">
        <div class="t1">${TV.icon("flag", 24, AMBER, 2.4)}Петро зупинився на 3-му уроці</div>
        <div class="t2">Пропустив два заняття поспіль</div>
        <div class="sent a-up" style="--d:${SENT}ms"><span class="chip">${TV.icon("send", 20, IND, 2.4)}Надіслано матеріали уроку 3</span></div>
      </div>
      ${PEOPLE.map(person).join("")}
      <div class="veil"><i></i></div>
      <div class="cert-o"><div class="cert">
        <span class="frame"></span>
        <div class="cap">${TV.icon("award", 26, IND, 2.4)}СЕРТИФІКАТ</div>
        <h4>Основи віри</h4>
        <div class="sub">Весняний потік</div>
        <span class="line"></span>
        <div class="who">${TV.avatar("Олена", 104)}<div><b>Олена Ковальчук</b><span>${TV.icon("check", 24, IND, 3)}10 з 10 уроків</span></div></div>
        <div class="sl a-pop" style="--d:${CIN + 520}ms">${seal}${TV.icon("award", 40, "#fff", 2.4)}</div>
      </div></div>
    </div>
  </div></div>
</div>`,
    tick(t, el) {
      const n = t >= COUNT ? 39 : 38;
      const b = el.querySelector(".kpi .n");
      if (b && b.textContent !== String(n)) b.textContent = n;

      PEOPLE.forEach((p, k) => {
        const e = el.querySelector(`#ln-p${k}`);
        if (!e || p.stall) return;
        let pos = st(p.path[0]);
        HOPS.forEach((h0, j) => {
          const a = st(p.path[j]), z = st(p.path[j + 1]);
          const q = TV.prog(t, h0 + p.lag, h0 + p.lag + HOP, TV.ease.inout);
          if (q <= 0) return;
          // Дуга стрибка: на тому самому рядку — вгору, на повороті — дугою праворуч,
          // до фінішу — ліворуч униз.
          let c;
          if (a[1] === z[1]) c = [(a[0] + z[0]) / 2, a[1] - 110];
          else if (p.path[j + 1] === 11) c = [a[0] - 60, (a[1] + z[1]) / 2];
          else c = [a[0] + RC * 1.7, (a[1] + z[1]) / 2];
          pos = [(1 - q) * (1 - q) * a[0] + 2 * (1 - q) * q * c[0] + q * q * z[0], (1 - q) * (1 - q) * a[1] + 2 * (1 - q) * q * c[1] + q * q * z[1]];
        });
        e.style.transform = `translate(${pos[0].toFixed(1)}px, ${pos[1].toFixed(1)}px)`;
      });
    },
  });
})();
