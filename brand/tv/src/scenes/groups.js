/* Малі групи — лідер веде зустріч у телефоні, а ви бачите всі групи разом
   (дані: i18n.ts → features.mocks.groups: «Група Андрія», «Чт, 19:00 · у Ніни»,
   «Филип'янам 2 · Один розум», учасники з днем народження й молитвою, «не був»,
   nudge «Ігор не був два тижні поспіль · Написати»; «23 групи · 312 учасників ·
   явка 84%» — модуль groups → mock; назви груп — homeGroups.groups).
   Кожна людина — свій рядок. Андрій відмічає Ніну (3 → 4 з 5) і зберігає явку —
   позначка летить на мапу, кільце його групи заповнюється. Далі кожен факт має
   свою мить: Марія — «День народження завтра», Тарас — «Молимось — співбесіда в
   середу», Ігор — «не був два тижні поспіль · Написати». Рядки нижче плавно
   розступаються під плашку. Дії щонайменше за 1,2 с одна від одної. */
// icons: chevron-left, book-open, check, send, cake, heart-handshake
(function () {
  const TEAL = "#0d9488", AMBER = "#f59e0b", AMBER_D = "#b45309", BLUE = "#0069e0";
  const W = 900, H = 960;
  const PW = 440, PH = 954, BZ = 11, PY = 3;
  const SX = BZ, SY = PY + BZ, SW = PW - 2 * BZ; // екран телефону в координатах макета
  const TAP = 1700, SAVE = 2900, FLY = [2990, 3630], FILL = 3630;
  const B1 = 4000, B2 = 5500, B3 = 7000; // Марія, Тарас, Ігор
  const DUR = 10000;
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;

  // Рядки учасників (у координатах екрана). Плашки розсувають рядки нижче.
  const R0 = 250, RH = 70, S1 = 62, S2 = 84;
  const TICK_AT = [SX + SW - 36, SY + R0 + 3 * RH + RH / 2]; // галочка Ніни (до розсування)
  const SAVE_AT = [SX + SW / 2, SY + 622 + 29];
  // Мапа: менша картка праворуч, телефон — головний.
  const MX = 480, MW = 420, MH = 520, MY = (H - MH) / 2, MAPY = 104;
  const PIN = [210, 190];
  const PIN_AT = [MX + PIN[0], MY + MAPY + PIN[1]];
  const R = 43, C = 2 * Math.PI * R;
  const OTHERS = [
    { name: "Молодіжна", day: "Вт", x: 20, y: 40 },
    { name: "Жіноча", day: "Ср", x: 228, y: 100 },
    { name: "Сімейна", day: "Пт", x: 20, y: 376 },
    { name: "Чоловіча", day: "Сб", x: 206, y: 376 },
  ];

  const box = (on, d) => `<span class="bx">${on ? `<span class="bx on a-pop" style="--d:${d}ms">${TV.icon("check", 24, "#fff", 3.2)}</span>` : ""}</span>`;
  const row = (name, y, extra = "") => `<div class="row" style="top:${y}px">${extra}</div>`;
  const person = (name, y, { d = -400, tick = true, away = false, cake = false } = {}) => row(name, y, `
    <span class="pa${away ? " gone" : ""}" style="--d:${SAVE + 80}ms">${TV.avatar(name, 52)}${cake ? `<span class="cake">${TV.icon("cake", 16, "#fff", 2.6)}</span>` : ""}</span>
    <span class="pn${away ? " gone" : ""}" style="--d:${SAVE + 80}ms">${name}</span>
    ${away ? `<span class="aw a-fade" style="--d:${SAVE + 120}ms">не був</span>` : ""}
    ${tick ? box(true, d) : `<span class="bx"></span>`}`);
  // Підсвітка рядка на свою мить: зовнішній шар гасне, внутрішній з'являється.
  const glow = (y, h, c, from, to) => `<span class="gl a-outf" style="top:${y}px;height:${h}px;--d:${to || DUR}ms"><i class="a-fade" style="--d:${from}ms;background:${tint(c, 12)};box-shadow:inset 0 0 0 2.5px ${tint(c, 55)}"></i></span>`;

  const MAP = `
<svg class="map-bg" width="${MW}" height="${MH - MAPY}" viewBox="0 0 ${MW} ${MH - MAPY}" aria-hidden="true">
  <rect width="${MW}" height="${MH - MAPY}" fill="#f4f6f5"/>
  <path d="M-30 280 C 80 240, 160 310, 250 272 S 390 216, 460 244" stroke="#deeef6" stroke-width="34" fill="none"/>
  <path d="M-10 150 C 130 132, 280 172, 440 138" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"/>
</svg>`;

  TV.scene({
    id: "groups",
    dur: DUR,
    bg: "light",
    css: `
[data-scene="groups"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 1; }
[data-scene="groups"] .phone { position: absolute; left: 0; top: ${PY}px; width: ${PW}px; height: ${PH}px; padding: ${BZ}px; border-radius: 67px;
  background: #101114; box-shadow: inset 0 0 0 2px #2b2d33, 0 2px 4px rgba(10,20,40,0.1), 0 30px 60px -18px rgba(10,30,70,0.35), 0 60px 90px -40px rgba(0,60,150,0.3); }
[data-scene="groups"] .scr { position: relative; width: 100%; height: 100%; border-radius: 56px; background: var(--surface); overflow: hidden; }
[data-scene="groups"] .island { position: absolute; left: 50%; top: 12px; width: 124px; height: 36px; margin-left: -62px; border-radius: 20px; background: #101114; }
[data-scene="groups"] .home { position: absolute; left: 50%; bottom: 9px; width: 140px; height: 5px; margin-left: -70px; border-radius: 3px; background: #101114; }
[data-scene="groups"] .back { position: absolute; left: 12px; top: 58px; display: flex; align-items: center; gap: 2px; font-size: 23px; font-weight: 550; color: ${TEAL}; }
[data-scene="groups"] .gname { position: absolute; left: 20px; top: 92px; font-size: 34px; font-weight: 750; letter-spacing: -0.025em; }
[data-scene="groups"] .when { position: absolute; left: 20px; top: 138px; font-size: 22px; font-weight: 500; color: var(--ink-3); }
[data-scene="groups"] .cnt { position: absolute; right: 20px; top: 96px; text-align: right; }
[data-scene="groups"] .cnt span { display: block; font-size: 20px; font-weight: 600; color: var(--ink-3); }
[data-scene="groups"] .cnt b { display: block; font-size: 34px; font-weight: 750; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1; }
[data-scene="groups"] .cnt b i { font-style: normal; color: ${TEAL}; font-weight: 800; }
[data-scene="groups"] .topic { position: absolute; left: 14px; right: 14px; top: 180px; height: 56px; border-radius: 18px; background: ${tint(TEAL, 9)};
  display: flex; align-items: center; gap: 12px; padding: 0 14px; font-size: 21px; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; }
[data-scene="groups"] .topic .bk { width: 36px; height: 36px; border-radius: 11px; background: ${tint(TEAL, 18)}; display: flex; align-items: center; justify-content: center; flex: none; }
[data-scene="groups"] .sh { position: absolute; left: 0; right: 0; top: 0; height: 0; animation: groups-sh 560ms var(--e-emph) var(--d) both; }
@keyframes groups-sh { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(0, var(--dy), 0); } }
[data-scene="groups"] .row { position: absolute; left: 0; width: ${SW}px; height: ${RH}px; }
[data-scene="groups"] .pa { position: absolute; left: 16px; top: 9px; width: 52px; height: 52px; }
[data-scene="groups"] .pa .cake { position: absolute; right: -6px; top: -4px; width: 26px; height: 26px; border-radius: 50%; background: ${AMBER};
  display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 2.5px #fff; }
[data-scene="groups"] .pn { position: absolute; left: 82px; top: 0; line-height: ${RH}px; font-size: 25px; font-weight: 650; letter-spacing: -0.015em; }
[data-scene="groups"] .aw { position: absolute; left: 150px; top: 0; line-height: ${RH}px; font-size: 22px; font-weight: 550; color: var(--ink-3); }
[data-scene="groups"] .gone { animation: groups-gone 520ms var(--e-std) var(--d) both; }
@keyframes groups-gone { to { filter: grayscale(1); opacity: 0.4; } }
[data-scene="groups"] .bx { position: absolute; right: 16px; top: 15px; width: 40px; height: 40px; border-radius: 12px; background: #fff; box-shadow: inset 0 0 0 2.5px rgba(0,0,0,0.16); }
[data-scene="groups"] .bx.on { right: 0; top: 0; inset: 0; background: ${TEAL}; box-shadow: none; display: flex; align-items: center; justify-content: center; }
[data-scene="groups"] .gl { position: absolute; left: 8px; right: 8px; }
[data-scene="groups"] .gl i { position: absolute; inset: 0; border-radius: 22px; }
[data-scene="groups"] .chip { position: absolute; left: 16px; right: 16px; display: flex; align-items: center; gap: 10px; padding: 10px 16px 10px 12px; border-radius: 16px;
  font-size: 22px; font-weight: 650; line-height: 1.25; letter-spacing: -0.01em; transform-origin: 30px 50%; }
[data-scene="groups"] .chip .ci { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex: none; }
[data-scene="groups"] .save { position: absolute; left: 16px; right: 16px; top: 622px; height: 58px; border-radius: 999px; background: ${TEAL}; color: #fff;
  font-size: 24px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="groups"] .save > span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 10px; }
[data-scene="groups"] .nudge { position: absolute; left: 14px; right: 14px; top: 756px; height: 148px; border-radius: 26px; background: var(--amber-soft);
  box-shadow: inset 0 0 0 2px rgba(245,158,11,0.4); padding: 14px 16px; }
[data-scene="groups"] .nrow { display: flex; align-items: center; gap: 14px; }
[data-scene="groups"] .nrow p { font-size: 22px; line-height: 1.22; font-weight: 600; color: var(--ink); letter-spacing: -0.01em; }
[data-scene="groups"] .nbtn { position: relative; margin-top: 12px; height: 54px; border-radius: 999px; background: ${TEAL}; color: #fff;
  display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 24px; font-weight: 650; }
[data-scene="groups"] .nbtn i { position: absolute; inset: 0; border-radius: 999px; box-shadow: 0 0 0 3px ${TEAL}; opacity: 0;
  animation: groups-pulse 1700ms var(--e-decel) ${B3 + 900}ms infinite both; }
@keyframes groups-pulse { 0% { opacity: 0; transform: scale(1); } 15% { opacity: 0.55; } 100% { opacity: 0; transform: scale(1.08, 1.5); } }
[data-scene="groups"] .mapc { position: absolute; left: ${MX}px; top: ${MY}px; width: ${MW}px; height: ${MH}px; overflow: hidden; }
[data-scene="groups"] .mapc .hd { position: absolute; left: 24px; top: 22px; right: 16px; }
[data-scene="groups"] .mapc .hd b { display: block; font-size: 28px; font-weight: 750; letter-spacing: -0.02em; }
[data-scene="groups"] .mapc .hd span { display: block; margin-top: 6px; font-size: 20px; font-weight: 500; color: var(--ink-3); white-space: nowrap; }
[data-scene="groups"] .map { position: absolute; left: 0; top: ${MAPY}px; width: ${MW}px; height: ${MH - MAPY}px; }
[data-scene="groups"] .map-bg { position: absolute; inset: 0; display: block; }
[data-scene="groups"] .pin { position: absolute; height: 46px; display: flex; align-items: center; gap: 10px; padding: 0 16px 0 12px; border-radius: 999px; background: #fff;
  white-space: nowrap; box-shadow: 0 0 0 1px var(--hairline), 0 8px 18px -8px rgba(0,30,70,0.3); }
[data-scene="groups"] .pin .pd { width: 22px; height: 22px; border-radius: 50%; background: ${tint(TEAL, 22)}; flex: none; }
[data-scene="groups"] .pin b { font-size: 21px; font-weight: 650; letter-spacing: -0.01em; }
[data-scene="groups"] .pin .dy { font-size: 20px; font-weight: 500; color: var(--ink-3); }
[data-scene="groups"] .me { position: absolute; left: ${PIN[0]}px; top: ${PIN[1]}px; }
[data-scene="groups"] .halo { position: absolute; left: -60px; top: -60px; width: 120px; height: 120px; border-radius: 50%; background: ${tint(TEAL, 30)}; opacity: 0;
  animation: groups-halo 1800ms var(--e-decel) 900ms infinite both; }
@keyframes groups-halo { 0% { opacity: 0; transform: scale(0.6); } 20% { opacity: 0.8; } 100% { opacity: 0; transform: scale(1.35); } }
[data-scene="groups"] .me svg.rg { position: absolute; left: -52px; top: -52px; width: 104px; height: 104px; transform: rotate(-90deg); }
[data-scene="groups"] .me .base { position: absolute; left: -48px; top: -48px; width: 96px; height: 96px; border-radius: 50%; background: #fff; box-shadow: 0 8px 20px -6px rgba(0,30,70,0.35); }
[data-scene="groups"] .me .avatar { position: absolute; left: -36px; top: -36px; }
[data-scene="groups"] .me .arc { stroke-dasharray: ${C.toFixed(1)}; animation: groups-ring 900ms var(--e-emph) ${FILL}ms both; }
@keyframes groups-ring { from { stroke-dashoffset: ${C.toFixed(1)}; } to { stroke-dashoffset: ${(C * 0.2).toFixed(1)}; } }
[data-scene="groups"] .callout { position: absolute; left: -104px; top: 62px; width: 208px; height: 82px; border-radius: 20px; background: #fff; text-align: center;
  box-shadow: 0 0 0 1px var(--hairline), 0 12px 26px -10px rgba(0,30,70,0.3); }
[data-scene="groups"] .callout b { display: block; margin-top: 11px; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
[data-scene="groups"] .callout .sw { position: relative; height: 28px; margin-top: 3px; }
[data-scene="groups"] .callout .sw span { position: absolute; left: 0; right: 0; top: 0; display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 21px; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
[data-scene="groups"] .callout .sw .now { color: ${TEAL}; font-weight: 700; }
[data-scene="groups"] .pkt { position: absolute; left: 0; top: 0; width: 44px; height: 44px; border-radius: 50%; background: ${TEAL}; z-index: 25;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px #fff, 0 10px 22px -6px rgba(0,60,50,0.5); }
`,
    html: () => `
<div class="split flip">
  ${TV.copy({ title: "Малі групи", line: "Увага до ближніх." })}
  <div class="vis"><div class="mock">
    <div class="mapc card a-up" style="--d:650ms">
      <div class="hd"><b>Усі групи</b><span>23 групи · 312 учасників · явка 84%</span></div>
      <div class="map">
        ${MAP}
        ${OTHERS.map((p, i) => `<div class="pin a-pop" style="left:${p.x}px;top:${p.y - 23}px;--d:${1000 + i * 110}ms"><span class="pd"></span><b>${p.name}</b><span class="dy">${p.day}</span></div>`).join("")}
        <div class="me a-pop" style="--d:900ms">
          <span class="a-outf" style="--d:${FILL}ms;position:absolute"><span class="halo"></span></span>
          <span class="base"></span>
          <svg class="rg" viewBox="0 0 104 104"><circle cx="52" cy="52" r="${R}" stroke="#e8ecee" stroke-width="7" fill="none"/>
            <circle class="arc" cx="52" cy="52" r="${R}" stroke="${TEAL}" stroke-width="7" fill="none" stroke-linecap="round"/></svg>
          ${TV.avatar("Андрій", 72)}
          <div class="callout"><b>Група Андрія</b>
            <div class="sw"><span class="a-outf" style="--d:${FILL}ms">Чт, 19:00</span>
              <span class="now a-fade" style="--d:${FILL + 60}ms">${TV.icon("check", 20, TEAL, 3)}Були 4 з 5</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="phone a-rise" style="--d:250ms"><div class="scr">
      <span class="island"></span>
      <div class="back">${TV.icon("chevron-left", 30, TEAL, 2.6)}Групи</div>
      <div class="gname">Група Андрія</div>
      <div class="when">Чт, 19:00 · у Ніни</div>
      <div class="cnt"><span>Були</span><b><i class="n">3</i> з 5</b></div>
      <div class="topic"><span class="bk">${TV.icon("book-open", 22, TEAL, 2.2)}</span>Филип'янам 2 · Один розум</div>

      ${glow(R0 + RH - 6, RH + 54 + 12, AMBER, B1, B2)}
      ${person("Оксана", R0)}
      ${person("Марія", R0 + RH, { cake: true })}
      <div class="chip a-pop" style="top:${R0 + 2 * RH}px;--d:${B1 + 80}ms;background:${tint(AMBER, 20)};color:${AMBER_D}">
        <span class="ci" style="background:${AMBER}">${TV.icon("cake", 20, "#fff", 2.4)}</span>День народження завтра</div>
      <div class="sh" style="--dy:${S1}px;--d:${B1}ms">
        ${glow(R0 + 2 * RH - 6, RH + 76 + 12, BLUE, B2, B3)}
        ${person("Тарас", R0 + 2 * RH)}
        <div class="chip a-pop" style="top:${R0 + 3 * RH}px;--d:${B2 + 80}ms;background:${tint(BLUE, 12)};color:${BLUE}">
          <span class="ci" style="background:${BLUE}">${TV.icon("heart-handshake", 20, "#fff", 2.2)}</span>Молимось — співбесіда в\u00a0середу</div>
        <div class="sh" style="--dy:${S2}px;--d:${B2}ms">
          ${glow(R0 + 4 * RH - 6, RH + 4, AMBER, B3)}
          ${person("Ніна", R0 + 3 * RH, { d: TAP + 40 })}
          ${person("Ігор", R0 + 4 * RH, { tick: false, away: true })}
        </div>
      </div>

      <div class="save a-out" style="--d:${B1 - 260}ms">
        <span class="a-outf" style="--d:${SAVE + 60}ms">Зберегти явку</span>
        <span class="a-fade" style="--d:${SAVE + 60}ms">${TV.icon("check", 26, "#fff", 3)}Збережено</span>
      </div>
      <div class="nudge a-up" style="--d:${B3 + 60}ms">
        <div class="nrow">${TV.avatar("Ігор", 56)}<p>Ігор не був два тижні поспіль</p></div>
        <div class="nbtn"><i></i>${TV.icon("send", 22, "#fff", 2.4)}Написати</div>
      </div>
      <span class="home"></span>
    </div></div>

    ${TV.tap(TICK_AT[0], TICK_AT[1], TAP, TEAL)}
    ${TV.tap(SAVE_AT[0], SAVE_AT[1], SAVE, TEAL)}
    <div class="pkt" id="gr-pkt" style="opacity:0">${TV.icon("check", 24, "#fff", 3.2)}</div>
    ${TV.cursor("Андрій", TEAL, "gr-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      const n = t >= TAP + 60 ? "4" : "3";
      const b = el.querySelector(".n");
      if (b && b.textContent !== n) b.textContent = n;

      TV.moveCursor(el.querySelector("#gr-cur"), t, {
        keys: [[900, 330, 1040], [TAP - 50, TICK_AT[0] - 10, TICK_AT[1] - 6], [TAP + 110, TICK_AT[0] - 4, TICK_AT[1] - 2],
          [SAVE - 50, SAVE_AT[0] - 10, SAVE_AT[1] - 6], [SAVE + 150, SAVE_AT[0] - 4, SAVE_AT[1] - 2], [SAVE + 760, 240, 1080]],
        show: [900, SAVE + 700],
        clicks: [TAP, SAVE],
      });

      // Позначка явки летить дугою з кнопки в телефоні на пін групи на мапі.
      const pk = el.querySelector("#gr-pkt");
      if (pk) {
        const p = TV.prog(t, FLY[0], FLY[1], TV.ease.inout);
        const [x0, y0] = SAVE_AT, [x2, y2] = PIN_AT, cx = 470, cy = 380;
        const x = (1 - p) * (1 - p) * x0 + 2 * (1 - p) * p * cx + p * p * x2;
        const y = (1 - p) * (1 - p) * y0 + 2 * (1 - p) * p * cy + p * p * y2;
        const vis = Math.min(TV.prog(t, FLY[0] - 40, FLY[0] + 120, TV.ease.decel), 1 - TV.prog(t, FLY[1] - 120, FLY[1], TV.ease.accel));
        const s = 0.6 + 0.4 * TV.prog(t, FLY[0], FLY[0] + 200, TV.ease.spring) - 0.3 * TV.prog(t, FLY[1] - 160, FLY[1]);
        pk.style.opacity = String(vis);
        pk.style.transform = `translate3d(${x - 22}px, ${y - 22}px, 0) scale(${s})`;
      }
    },
  });
})();
