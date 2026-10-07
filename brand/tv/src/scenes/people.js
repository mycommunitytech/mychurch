/* Люди — як PeopleExplorer на сайті (people-explorer.tsx, дані — i18n.ts →
   features.mocks.people): над карткою ряд людей. Пастор натискає обличчя —
   картка розгортається з нього; далі натискає друге, третє — картка щоразу
   показує іншу людину: явку за 8 тижнів, сім'ю, групу, служіння, навчання,
   статус і відсоток заповнення. Марко — новенький: без групи й служіння;
   пастор пришпилює йому «Шукає малу групу». */
// icons: check, plus, mouse-pointer-click, heart, users-round, heart-handshake, graduation-cap, sparkles
(function () {
  const W = 880, C = "#0ea5e9";                          // MODULE_ACCENTS.people
  const tint = (p, c = C) => `color-mix(in oklab, ${c} ${p}%, #fff)`;
  const PR = [
    { name: "Андрій Пилипенко", first: "Андрій", role: "Член церкви", status: "Активний", base: 55, look: 0,
      family: [["Олена", "дружина"], ["Марко", "син"], ["Софія", "донька"]],
      group: ["Сімейна група №2", "Учасник · четвер, 19:00"], ministry: ["Зустріч гостей", "Наступне — нд, 21 квітня"],
      learning: ["Основи віри", 80, "8 з 10 уроків"], att: [1, 1, 0, 1, 1, 1, 1, 1], pins: ["Хоче служити"],
      bank: ["Бажає вивчати Біблію", "Шукає малу групу"] },
    { name: "Олена Ковальчук", first: "Олена", role: "Лідер групи", status: "Активна", base: 70, look: 1,
      family: [["Андрій", "чоловік"]],
      group: ["Молодіжна група", "Лідер · субота, 17:00"], ministry: ["Прославлення", "Вокал · нд, 10:00"],
      learning: ["Школа лідерів", 100, "Завершено"], att: [1, 1, 1, 1, 1, 0, 1, 1], pins: ["Хоче служити"],
      bank: ["Бажає вивчати Біблію", "Шукає малу групу"] },
    { name: "Марко Лис", first: "Марко", role: "Новенький", status: "Гість", base: 30, look: 2,
      family: [], group: null, ministry: null,
      learning: ["Основи віри", 20, "2 з 10 уроків"], att: [0, 0, 0, 0, 0, 1, 1, 1], pins: ["Перший візит"],
      bank: ["Шукає малу групу", "Бажає вивчати Біблію"] },
  ];
  // Ще двоє з того ж демо (content/modules/people.ts → mock.items) — щоб ряд читався як «багато людей».
  const MORE = [["Наталя", "Член церкви", null], ["Марія", "Гість", 5]];
  const FACE = (first) => { const i = PR.findIndex((p) => p.first === first); return i >= 0 ? TV.LOOKS[PR[i].look] : null; };

  // ── час: кліки пастора ≥ 1,5 с один від одного, кожна людина стоїть ≥ 2 с
  const CL = [1800, 5000, 8200], CP = 10400;
  const OUT = [CL[1], CL[2], 99999];
  // Заповненість — формула сайту: base + (100 − base) · додані / (6 − пришпилені).
  const DONE3 = Math.round(PR[2].base + (100 - PR[2].base) * (1 / 5));
  const RING = [[CL[0] + 250, PR[0].base], [CL[1] + 200, PR[1].base], [CL[2] + 200, PR[2].base], [CP + 60, DONE3]];

  // ── геометрія (px макета)
  const TILE_Y = 68, TILE_H = 176, TG = 14, TW = (W - TG * 4) / 5;
  const faceX = (i) => i * (TW + TG) + TW / 2, FACE_Y = TILE_Y + 16 + 40;
  const CY = 264, PAD = 26, IN = W - PAD * 2, CH = 746;
  const BW = (IN - 14) / 2, BH = 168, BY = 262;
  const PIN_Y = CY + 694, PIN_X = PAD + 280;

  const chip = (txt, c, bg) => `<span class="chip" style="color:${c};background:${bg}">${txt}</span>`;
  const box = (x, y, icon, col, label, body, d, empty) => `
<div class="bx a-up ${empty ? "empty" : ""}" style="left:${x}px;top:${y}px;width:${BW}px;height:${BH}px;--d:${d}ms">
  <div class="lb"><span class="lbi" style="background:${tint(14, col)};color:${col}">${TV.icon(icon, 20, "currentColor", 2.4)}</span>${label}</div>${body}
</div>`;

  function layer(p, i, t0) {
    const guest = p.status === "Гість";
    const fam = p.family.length
      ? `<div class="fam">${p.family.map(([n, rel], k) => {
        const lk = FACE(n);
        const face = lk ? TV.avatar(lk, 44) : `<span class="letter">${n[0]}</span>`;
        return `<div class="fm a-pop" style="--d:${t0 + 330 + k * 70}ms">${face}<b>${n}</b><small>${rel}</small></div>`;
      }).join("")}</div>`
      : `<div class="none">Ще не вказано</div>`;
    const two = (v, none) => v ? `<div class="big">${v[0]}</div><div class="sub">${v[1]}</div>` : `<div class="none">${none}</div>`;
    const [ln, pct, lm] = p.learning;
    const learn = `<div class="big">${ln}</div><div class="bar"><i style="width:${pct}%;--d:${t0 + 520}ms"></i></div><div class="sub">${lm}<b>${pct}%</b></div>`;
    const present = p.att.reduce((a, b) => a + b, 0);
    return `
<div class="ly" style="--d:${OUT[i] + 30}ms">
  <div class="hd a-up" style="--d:${t0}ms">${TV.avatar(TV.LOOKS[p.look], 92)}
    <div class="nm"><h3>${p.name}</h3><div class="chips">${guest ? chip(p.status, "var(--ink-2)", "var(--surface-3)") : chip(p.status, "#0e7a3c", "#e3f6ea")}${chip(p.role, C, tint(13))}</div></div>
  </div>
  <div class="sec a-fade" style="top:144px;--d:${t0 + 100}ms"><span>Відвідуваність за 8 тижнів</span><span><b>${present}</b> з 8</span></div>
  <div class="weeks">${p.att.map((a, k) => `<span class="wk ${a ? "" : "miss"} a-pop" style="--d:${t0 + 140 + k * 40}ms">${a ? TV.icon("check", 28, "#fff", 3) : ""}</span>`).join("")}</div>
  ${box(PAD, BY, "heart", "#f05b8b", "Сім'я", fam, t0 + 240, !p.family.length)}
  ${box(PAD + BW + 14, BY, "users-round", "#007aff", "Мала група", two(p.group, "Ще без групи"), t0 + 300, !p.group)}
  ${box(PAD, BY + BH + 14, "heart-handshake", "#8b5bf0", "Служіння", two(p.ministry, "Ще не служить"), t0 + 360, !p.ministry)}
  ${box(PAD + BW + 14, BY + BH + 14, "graduation-cap", "#12a150", "Навчання", learn, t0 + 420, false)}
  <div class="sec a-fade" style="top:630px;justify-content:flex-start;gap:10px;--d:${t0 + 480}ms">${TV.icon("sparkles", 24, C, 2.2)}Прагнення та потреби</div>
  <div class="pins a-up" style="--d:${t0 + 520}ms">
    ${p.pins.map((x) => `<span class="pn on">${TV.icon("check", 20, "#fff", 3)}${x}</span>`).join("")}
    ${p.bank.map((x, k) => `<span class="pn">${TV.icon("plus", 20, "currentColor", 3)}${x}${i === 2 && k === 0 ? `<span class="pn on fill a-pop" style="--d:${CP + 40}ms">${TV.icon("check", 20, "#fff", 3)}${x}</span>` : ""}</span>`).join("")}
  </div>
</div>`;
  }

  const tiles = [...PR.map((p, i) => [p.first, p.role, p.look, i]), ...MORE.map(([n, r, lk]) => [n, r, lk, -1])].map(([n, r, lk, i], k) => `
<div class="tl a-up" style="left:${k * (TW + TG)}px;--d:${420 + k * 70}ms">
  ${i >= 0 ? `<span class="sel a-fade" style="--d:${CL[i] + 20}ms"><span class="a-outf" style="--d:${OUT[i] + 20}ms"></span></span>` : ""}
  <span class="fc">${TV.avatar(lk == null ? n : TV.LOOKS[lk], 80)}</span><b>${n}</b><small>${r}</small>
</div>`).join("");

  // Курсор зникає між кліками й повертається до наступного обличчя.
  const WIN = [[800, CL[0] + 520], [CL[1] - 900, CL[1] + 520], [CL[2] - 900, CL[2] + 520], [CP - 1000, CP + 640]];
  const fx = (i) => faceX(i) - 10, fy = FACE_Y - 6;
  const KEYS = [
    [800, 400, 400], [CL[0] - 40, fx(0), fy], [CL[0] + 520, fx(0) + 50, fy - 60],
    [CL[1] - 900, fx(1) + 70, fy - 70], [CL[1] - 40, fx(1), fy], [CL[1] + 520, fx(1) + 50, fy - 60],
    [CL[2] - 900, fx(2) + 70, fy - 70], [CL[2] - 40, fx(2), fy], [CL[2] + 520, fx(2) + 50, fy - 60],
    [CP - 1000, PIN_X + 140, PIN_Y + 110], [CP - 40, PIN_X - 10, PIN_Y - 6], [CP + 640, PIN_X + 50, PIN_Y + 70],
  ];

  const S = '[data-scene="people"]';
  TV.scene({
    id: "people",
    dur: 14000,
    bg: "light",
    css: `
${S} .mock { position: relative; width: ${W}px; height: ${CY + CH + 4}px; --vs: 1; --vs-port: 1.02; }
${S} .hint { position: absolute; left: 50%; top: 0; transform: translateX(-50%); height: 52px; display: flex; align-items: center; gap: 12px; padding: 0 24px 0 18px;
  border-radius: 999px; background: #fff; box-shadow: 0 0 0 1.5px var(--hairline-strong), 0 12px 28px -14px rgba(0,50,120,0.4); font-size: 23px; font-weight: 600; white-space: nowrap; }
${S} .hint.a-down { animation-name: people-hint; }
@keyframes people-hint { from { opacity: 0; transform: translate(-50%, -30px); } }
${S} .hint-out { position: absolute; inset: 0; animation: a-outf 300ms var(--e-std) ${CL[0]}ms both; }
${S} .tl { position: absolute; top: ${TILE_Y}px; width: ${TW}px; height: ${TILE_H}px; border-radius: 24px; background: #fff;
  box-shadow: 0 0 0 1.5px var(--hairline), 0 10px 24px -16px rgba(0,40,90,0.35); display: flex; flex-direction: column; align-items: center; padding-top: 16px; }
${S} .tl .sel { position: absolute; inset: -3px; border-radius: 27px; }
${S} .tl .sel > span { position: absolute; inset: 0; border-radius: 27px; box-shadow: 0 0 0 4px ${C}, 0 18px 36px -14px ${tint(80)}; background: ${tint(8)}; }
${S} .tl .fc { position: relative; border-radius: 50%; }
${S} .tl b { position: relative; margin-top: 10px; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
${S} .tl small { position: relative; margin-top: 4px; font-size: 20px; color: var(--ink-3); white-space: nowrap; }
${S} .card { position: absolute; left: 0; top: ${CY}px; width: ${W}px; height: ${CH}px; border-radius: 30px;
  transform-origin: 0 0; animation: people-open 700ms var(--e-emph) ${CL[0] + 30}ms both; }
/* Картка розгортається з обличчя Андрія (container transform). */
@keyframes people-open {
  0% { opacity: 0; border-radius: 50%; transform: translate(${faceX(0) - 40}px, ${FACE_Y - 40 - CY}px) scale(${(80 / W).toFixed(4)}, ${(80 / CH).toFixed(4)}); }
  12% { opacity: 1; }
  100% { opacity: 1; border-radius: 30px; transform: none; }
}
${S} .ly { position: absolute; inset: 0; animation: a-outf 280ms var(--e-std) var(--d) both; }
${S} .hd { position: absolute; left: ${PAD}px; right: 150px; top: 28px; height: 96px; display: flex; align-items: center; gap: 22px; }
${S} .hd .avatar { box-shadow: 0 0 0 5px #fff, 0 0 0 7px ${tint(35)}; }
${S} .nm { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
${S} .nm h3 { font-size: 38px; font-weight: 780; letter-spacing: -0.03em; line-height: 1; white-space: nowrap; }
${S} .chips { display: flex; gap: 10px; }
${S} .chip { font-size: 21px; font-weight: 650; padding: 6px 14px; border-radius: 999px; white-space: nowrap; }
${S} .ring { position: absolute; right: ${PAD}px; top: 24px; width: 104px; height: 104px; }
${S} .ring svg { display: block; }
${S} .ring circle { fill: none; stroke-width: 10; }
${S} .ring .trk { stroke: var(--surface-3); }
${S} .ring .val { stroke: ${C}; stroke-linecap: round; }
${S} .ring b { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 750; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
${S} .sec { position: absolute; left: ${PAD}px; right: ${PAD}px; height: 30px; display: flex; align-items: center; justify-content: space-between; font-size: 22px; font-weight: 600; color: var(--ink-2); }
${S} .sec b { color: var(--ink); font-weight: 750; }
${S} .weeks { position: absolute; left: ${PAD}px; right: ${PAD}px; top: 184px; height: 58px; display: flex; gap: 12px; }
${S} .wk { flex: 1; border-radius: 16px; background: ${C}; display: flex; align-items: center; justify-content: center; }
${S} .wk.miss { background: repeating-linear-gradient(135deg, var(--surface-3) 0 8px, #fff 8px 16px); box-shadow: inset 0 0 0 1.5px var(--hairline); }
${S} .bx { position: absolute; border-radius: 22px; background: var(--surface-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.07); padding: 16px 20px; }
/* Порожнє поле новенького — пунктиром: видно, чого ще бракує. */
${S} .bx.empty { background: #fff; box-shadow: none; outline: 2.5px dashed rgba(0,0,0,0.16); outline-offset: -2px; }
${S} .lb { display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; color: var(--ink-3); }
${S} .lbi { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
${S} .big { margin-top: 14px; font-size: 27px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; white-space: nowrap; }
${S} .sub { margin-top: 8px; font-size: 21px; color: var(--ink-3); display: flex; justify-content: space-between; white-space: nowrap; }
${S} .sub b { color: #12a150; font-weight: 700; font-variant-numeric: tabular-nums; }
${S} .none { margin-top: 26px; font-size: 25px; font-weight: 600; color: var(--ink-3); }
${S} .bar { margin-top: 14px; height: 14px; border-radius: 7px; background: var(--surface-3); overflow: hidden; }
${S} .bar i { display: block; height: 100%; border-radius: 7px; background: #12a150; transform-origin: 0 50%; animation: people-bar 800ms var(--e-emph) var(--d) both; }
@keyframes people-bar { from { transform: scaleX(0); } }
${S} .fam { display: flex; gap: 22px; margin-top: 8px; }
${S} .fm { display: flex; flex-direction: column; align-items: center; min-width: 70px; }
${S} .fm .avatar, ${S} .fm .letter { box-shadow: 0 0 0 3px #fff; }
${S} .fm .letter { width: 44px; height: 44px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: var(--ink-3); }
${S} .fm b { margin-top: 4px; font-size: 21px; font-weight: 650; line-height: 1.15; }
${S} .fm small { font-size: 20px; color: var(--ink-3); line-height: 1.1; }
${S} .pins { position: absolute; left: ${PAD}px; right: 0; top: 668px; height: 52px; display: flex; gap: 12px; }
${S} .pn { position: relative; height: 52px; display: flex; align-items: center; gap: 8px; padding: 0 18px 0 14px; border-radius: 999px; white-space: nowrap;
  font-size: 21px; font-weight: 600; color: var(--ink-2); background: #fff; box-shadow: inset 0 0 0 2px var(--hairline-strong); }
${S} .pn.on { background: ${C}; color: #fff; box-shadow: 0 10px 22px -12px ${C}; }
${S} .pn.fill { position: absolute; inset: 0; }
`,
    html: (o) => `
<div class="split${o === "port" ? "" : " flip"}">
  ${TV.copy({ title: "Люди" })}
  <div class="vis"><div class="mock">
    <div class="hint-out"><div class="hint a-down" style="--d:300ms">${TV.icon("mouse-pointer-click", 26, "var(--brand)", 2.2)}Натисніть на профіль — він відкриється</div></div>
    ${tiles}
    <div class="card">
      ${PR.map((p, i) => layer(p, i, (i ? CL[i] + 120 : CL[0] + 260))).join("")}
      <div class="ring a-fade" style="--d:${CL[0] + 260}ms"><svg width="104" height="104" viewBox="0 0 104 104"><circle cx="52" cy="52" r="44" class="trk"/>
        <circle cx="52" cy="52" r="44" class="val" stroke-dasharray="276.46" stroke-dashoffset="276.46" transform="rotate(-90 52 52)"/></svg><b>0%</b></div>
    </div>
    ${CL.map((c, i) => TV.tap(faceX(i), FACE_Y, c, C)).join("")}${TV.tap(PIN_X, PIN_Y, CP, C)}
    ${TV.cursor("Іван", "#8b5bf0", "pp-cur", "Пастор Іван")}
  </div></div>
</div>`,
    tick(t, el) {
      // Відсоток заповнення: від людини до людини, за формулою сайту.
      let v = 0;
      RING.forEach(([t0, to], i) => { if (t >= t0) v = TV.mix(i ? RING[i - 1][1] : 0, to, TV.prog(t, t0, t0 + 600)); });
      const val = el.querySelector(".ring .val");
      if (val) val.setAttribute("stroke-dashoffset", (276.46 * (1 - v / 100)).toFixed(2));
      const b = el.querySelector(".ring b");
      const s = Math.round(v) + "%";
      if (b && b.textContent !== s) b.textContent = s;
      const cur = el.querySelector("#pp-cur");
      TV.moveCursor(cur, t, { keys: KEYS, show: [0, 1e9], clicks: [...CL, CP] });
      if (cur) {
        const op = Math.max(...WIN.map(([a, z]) => Math.min(TV.prog(t, a, a + 260, TV.ease.decel), 1 - TV.prog(t, z - 260, z, TV.ease.accel))));
        cur.style.opacity = String(op);
      }
    },
  });
})();
