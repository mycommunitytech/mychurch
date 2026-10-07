/* Таблиці — «звикли до таблиць? не проблема» (tools.ts → tables: кілька виглядів,
   сортування, колонка «Людина»; люди — з people.ts → mock і сталих імен сайту).
   Той самий список людей: Картки → Таблиця → Компактний. Кожна людина — один
   елемент, що перетікає між виглядами (контейнер міняє місце й розмір, аватар
   і ім'я їдуть, зайве гасне). У таблиці — сортування за «Остання явка». */
// icons: users, user, layout-grid, table-2, rows-3, arrow-down
(function () {
  const C = "#64748b";
  const W = 920, H = 860;
  const CX0 = 20, CY0 = 160, IW = W - 40;            // область списку
  const SEG = [[386, 150], [536, 158], [694, 196]];  // перемикач виглядів: x, ширина
  const SEG_Y = 14;
  const COL = { phone: 248, group: 392, status: 526, last: 716 };

  const ST = {
    m: ["Член церкви", "#12a150"], new: ["Новенький", "#0069e0"],
    att: ["Потребує уваги", "#d97706"], guest: ["Гість", "#64748b"],
  };
  const DATE = { 0: "27 вер", 7: "20 вер", 14: "13 вер", 28: "30 серп" };
  // Перші вісім — таблиця; ще вісім з'являються в компактному вигляді.
  const P = [
    ["Олена Ковальчук", "067 ··· 12 40", "Північ", "m", 0],
    ["Дмитро Лис", "063 ··· 58 21", "—", "new", 14],
    ["Наталя Рудь", "050 ··· 33 07", "Центр", "m", 0],
    ["Василь Панченко", "097 ··· 41 96", "Надія", "att", 28],
    ["Марія Іщенко", "067 ··· 45 67", "—", "guest", 0],
    ["Андрій Ковальчук", "067 ··· 12 41", "Північ", "m", 0],
    ["Оксана Мельник", "093 ··· 76 18", "Надія", "m", 7],
    ["Ігор Лисенко", "066 ··· 20 55", "Центр", "new", 7],
    ["Галина Ковальчук", "067 ··· 90 12", "Центр", "m", 0],
    ["Тарас Бойко", "098 ··· 14 63", "—", "guest", 0],
    ["Ольга Сич", "050 ··· 71 30", "Центр", "m", 0],
    ["Оксана Гриценко", "073 ··· 25 84", "Надія", "m", 0],
    ["Ірина Ш.", "067 ··· 38 02", "Північ", "m", 0],
    ["Павло К.", "095 ··· 60 47", "Центр", "m", 0],
    ["Ніна Т.", "068 ··· 17 93", "Надія", "m", 0],
    ["Андрій С.", "063 ··· 82 16", "Північ", "m", 0],
  ].map(([n, ph, g, s, d], i) => ({ i, n, ph, g, s, d }));
  // Сортування «Остання явка»: хто довше не був — угорі (стабільно).
  const sorted = P.slice(0, 8).sort((a, b) => b.d - a.d || a.i - b.i).map((p) => p.i);
  const rankOf = (i) => (i < 8 ? sorted.indexOf(i) : i);

  // Моменти. Кожна дія — щонайменше 1,2 с після попередньої, кожен вигляд тримається ≥ 1,5 с.
  const K1 = 2500, SORT = 4100, K2 = 5700, MORPH = 950, SORTD = 720;

  const CARD_W = (IW - 34) / 3, CARD_H = 282;
  const box = {
    card: (i) => [(i % 3) * (CARD_W + 17), Math.floor(i / 3) * (CARD_H + 18), CARD_W, CARD_H],
    row: (slot) => [0, 52 + slot * 66, IW, 66],
    mini: (slot) => [0, 38 + slot * 40, IW, 40],
  };
  const AV = 96;
  const mix = (a, b, p) => a + (b - a) * p;
  const mixA = (a, b, p) => a.map((v, k) => mix(v, b[k], p));
  const sm = (a, b, x) => { const u = TV.clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };

  const chip = (s) => `<span class="chip" style="color:${ST[s][1]};background:color-mix(in oklab, ${ST[s][1]} 13%, #fff)">${ST[s][0]}</span>`;
  const person = (p) => `
<div class="pp" id="tb-${p.i}">
  <div class="in${p.i < 6 ? " a-pop" : ""}" style="--d:${620 + p.i * 60}ms">
    <i class="bg"></i><i class="dc"></i><i class="dr"></i>
    <span class="av">${TV.avatar(p.n, AV)}</span>
    <span class="nm">${TV.esc(p.n)}</span>
    <div class="cx">
      <span class="cg">${p.g === "—" ? "Без групи" : `Група «${p.g}»`}</span>
      <span class="cs">${chip(p.s)}</span>
    </div>
    <div class="rx">
      <span class="c num" style="left:${COL.phone}px">${p.ph}</span>
      <span class="c${p.g === "—" ? " mute" : ""}" style="left:${COL.group}px">${p.g}</span>
      <span class="c st1" style="left:${COL.status}px">${chip(p.s)}</span>
      <span class="c st2" style="left:${COL.status}px"><i style="background:${ST[p.s][1]}"></i>${ST[p.s][0]}</span>
      <span class="c num${p.d >= 28 ? " late" : ""}" style="left:${COL.last}px">${DATE[p.d]}</span>
    </div>
  </div>
</div>`;

  const segs = [["layout-grid", "Картки"], ["table-2", "Таблиця"], ["rows-3", "Компактний"]];
  const CLICKS = [
    [K1, SEG[1][0] + SEG[1][1] / 2, SEG_Y + 28],
    [SORT, CX0 + COL.last + 20, CY0 + 26],
    [K2, SEG[2][0] + SEG[2][1] / 2 - 30, SEG_Y + 28],
  ];

  TV.scene({
    id: "tables",
    dur: 10000,
    bg: "light",
    css: `
[data-scene="tables"] .t { font-size: 128px; }
[data-scene="tables"] .mock { position: relative; width: ${W}px; height: ${H}px; --vs: 1; --vs-port: 0.978; }
[data-scene="tables"] .win { position: absolute; inset: 0; overflow: hidden; }
[data-scene="tables"] .tb { position: absolute; left: 0; right: 0; top: 0; height: 84px; display: flex; align-items: center; gap: 12px; padding: 0 0 0 28px;
  border-bottom: 1px solid var(--hairline); font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
[data-scene="tables"] .tb .ic { color: ${C}; }
[data-scene="tables"] .tb .cnt { font-size: 22px; font-weight: 500; color: var(--ink-3); letter-spacing: 0; margin-left: 4px; }
[data-scene="tables"] .sw { position: absolute; left: ${SEG[0][0] - 6}px; top: ${SEG_Y}px; width: ${SEG[2][0] + SEG[2][1] - SEG[0][0] + 12}px; height: 56px;
  border-radius: 16px; background: var(--surface-3); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
[data-scene="tables"] .pill { position: absolute; top: ${SEG_Y + 5}px; height: 46px; border-radius: 12px; background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(10,30,70,0.2); }
[data-scene="tables"] .sg { position: absolute; top: ${SEG_Y}px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 21px; font-weight: 600; color: var(--ink-2); letter-spacing: -0.01em; }
[data-scene="tables"] .sg .ic { color: ${C}; }
[data-scene="tables"] .fl { position: absolute; left: 28px; top: 96px; display: flex; gap: 10px; }
[data-scene="tables"] .fl span { height: 42px; padding: 0 18px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 20px; font-weight: 600;
  color: var(--ink-2); box-shadow: inset 0 0 0 2px rgba(0,0,0,0.09); }
[data-scene="tables"] .fl span.on { background: var(--ink); color: #fff; box-shadow: none; }
[data-scene="tables"] .list { position: absolute; left: ${CX0}px; top: ${CY0}px; width: ${IW}px; height: ${H - CY0 - 16}px; }
[data-scene="tables"] .th { position: absolute; left: 0; right: 0; top: 0; height: 52px; border-radius: 12px; background: var(--surface-3); opacity: 0; }
[data-scene="tables"] .th span { position: absolute; top: 0; display: flex; align-items: center; gap: 6px; height: 24px; font-size: 20px; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
[data-scene="tables"] .th .srt { color: var(--ink); }
[data-scene="tables"] .th .srt i { position: relative; width: 20px; height: 20px; }
[data-scene="tables"] .th .srt i .ic { position: absolute; left: 0; top: 0; }
[data-scene="tables"] .pp { position: absolute; left: 0; top: 0; }
[data-scene="tables"] .in { position: absolute; inset: 0; }
[data-scene="tables"] .bg { position: absolute; inset: 0; border-radius: 22px; background: #fff; }
[data-scene="tables"] .dc { position: absolute; inset: 0; border-radius: 22px; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.08), 0 6px 16px -10px rgba(10,30,70,0.2); }
[data-scene="tables"] .dr { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: rgba(0,0,0,0.08); opacity: 0; }
[data-scene="tables"] .av { position: absolute; left: 0; top: 0; width: ${AV}px; height: ${AV}px; transform-origin: 0 0; }
[data-scene="tables"] .nm { position: absolute; left: 0; top: 0; transform-origin: 0 0; white-space: nowrap; font-size: 26px; font-weight: 700; letter-spacing: -0.015em; line-height: 30px; }
[data-scene="tables"] .cx { position: absolute; inset: 0; }
[data-scene="tables"] .cg { position: absolute; left: 20px; top: 172px; font-size: 21px; font-weight: 500; color: var(--ink-3); white-space: nowrap; }
[data-scene="tables"] .cs { position: absolute; left: 20px; top: 218px; }
[data-scene="tables"] .chip { display: inline-flex; align-items: center; height: 34px; padding: 0 13px; border-radius: 999px; font-size: 20px; font-weight: 650; white-space: nowrap; }
[data-scene="tables"] .rx { position: absolute; left: 0; right: 0; top: 0; height: 24px; opacity: 0; }
[data-scene="tables"] .c { position: absolute; top: 0; height: 24px; display: flex; align-items: center; gap: 8px; white-space: nowrap; font-size: 20px; font-weight: 500; color: var(--ink-2); }
[data-scene="tables"] .c.num { font-variant-numeric: tabular-nums; }
[data-scene="tables"] .c.mute { color: rgba(11,11,15,0.35); }
[data-scene="tables"] .c.late { color: #b45309; font-weight: 650; }
[data-scene="tables"] .st1 { top: -5px; height: 34px; }
[data-scene="tables"] .st2 { opacity: 0; font-weight: 600; color: var(--ink); }
[data-scene="tables"] .st2 i { width: 12px; height: 12px; border-radius: 50%; }
`,
    html: (o) => `
<div class="split${o === "port" ? "" : " flip"}">
  ${TV.copy({ title: ["Звикли до", "таблиць?"], line: "Не проблема — табличний і компактний вигляд." })}
  <div class="vis"><div class="mock">
    <div class="win card a-rise" style="--d:250ms">
      <div class="tb">${TV.icon("users", 30, "currentColor", 2.2)}Люди<span class="cnt">428 людей</span></div>
      <div class="sw"></div><i class="pill"></i>
      ${segs.map(([ic, l], k) => `<span class="sg" style="left:${SEG[k][0]}px;width:${SEG[k][1]}px">${TV.icon(ic, 22, "currentColor", 2.2)}${l}</span>`).join("")}
      <div class="fl"><span class="on">Усі</span><span>Новенькі</span><span>Без групи</span></div>
      <div class="list">
        <div class="th">
          <span style="left:16px">${TV.icon("user", 20, "currentColor", 2.3)}Людина</span>
          <span style="left:${COL.phone}px">Телефон</span>
          <span style="left:${COL.group}px">Група</span>
          <span style="left:${COL.status}px">Статус</span>
          <span style="left:${COL.last}px"><span class="a-outf" style="position:static;--d:${SORT + 40}ms">Остання явка</span></span>
          <span class="srt a-fade" style="left:${COL.last}px;--d:${SORT + 40}ms">Остання явка<i><span class="a-pop" style="--d:${SORT + 60}ms">${TV.icon("arrow-down", 20, "currentColor", 2.6)}</span></i></span>
        </div>
        ${P.map(person).join("")}
      </div>
    </div>
    ${CLICKS.map(([t, x, y]) => TV.tap(x, y, t, C)).join("")}
    ${TV.cursor("Оксана", C, "tb-cur")}
  </div></div>
</div>`,
    tick(t, el) {
      const e = TV.ease.emph;
      const p1 = TV.prog(t, K1 + 40, K1 + 40 + MORPH, e);
      const p2 = TV.prog(t, K2 + 40, K2 + 40 + MORPH, e);
      const ps = TV.prog(t, SORT + 40, SORT + 40 + SORTD, e);
      for (const p of P) {
        const node = el.querySelector(`#tb-${p.i}`);
        if (!node) continue;
        const r = rankOf(p.i);
        // Кожна картка стартує трохи пізніше за попередню — потік, а не стрибок.
        const q = p.i < 6 ? TV.prog(t, K1 + 40 + p.i * 45, K1 + 40 + p.i * 45 + MORPH, e) : 1;
        const q2 = TV.prog(t, K2 + 40 + Math.min(r, 8) * 18, K2 + 40 + Math.min(r, 8) * 18 + MORPH, e);
        const row = box.row(mix(p.i, r, ps)), mini = box.mini(r);
        let b, op = 1, rise = 0;
        if (p.i < 6) b = mixA(mixA(box.card(p.i), row, q), mini, q2);
        else if (p.i < 8) {
          b = mixA(row, mini, q2);
          op = TV.prog(t, K1 + 40 + MORPH * 0.6 + (p.i - 6) * 90, K1 + 40 + MORPH * 0.6 + (p.i - 6) * 90 + 360, TV.ease.decel);
          rise = 16 * (1 - op);
        } else {
          b = mini;
          const a0 = K2 + 40 + MORPH * 0.7 + (p.i - 8) * 55;
          op = TV.prog(t, a0, a0 + 340, TV.ease.decel);
          rise = 16 * (1 - op);
        }
        // Картки → рядок → компактний рядок: той самий елемент, інший розмір.
        node.style.transform = `translate3d(${b[0]}px, ${b[1] + rise}px, 0)`;
        node.style.width = b[2] + "px";
        node.style.height = b[3] + "px";
        node.style.opacity = String(op);
        // Під час сортування ті, хто піднімається, їдуть поверх інших.
        const up = r < p.i && p.i < 8;
        node.style.zIndex = p.i >= 8 ? "0" : up ? "3" : "1";
        const av = [mix(mix(20, 16, q), 12, q2), mix(mix(20, 15, q), 6, q2), mix(mix(1, 36 / AV, q), 28 / AV, q2)];
        const nm = [mix(mix(20, 64, q), 50, q2), mix(mix(134, 21, q), 8, q2), mix(20 / 26 + (1 - 20 / 26) * (1 - q), 20 / 26, q2)];
        const $ = (sel) => node.querySelector(sel);
        $(".av").style.transform = `translate(${av[0]}px, ${av[1]}px) scale(${av[2]})`;
        $(".nm").style.transform = `translate(${nm[0]}px, ${nm[1]}px) scale(${nm[2]})`;
        $(".cx").style.opacity = String(p.i < 6 ? 1 - sm(0, 0.3, q) : 0);
        const lift = up ? Math.sin(Math.PI * ps) : 0;
        const bg = $(".bg");
        bg.style.borderRadius = mix(22, 10, q) + "px";
        bg.style.boxShadow = lift > 0.01 ? `0 ${14 * lift}px ${30 * lift}px -${12 * lift}px rgba(10,30,70,${0.35 * lift})` : "none";
        const dc = $(".dc");
        dc.style.opacity = String(p.i < 6 ? 1 - sm(0.55, 0.95, q) : 0);
        dc.style.borderRadius = mix(22, 10, q) + "px";
        $(".dr").style.opacity = String(p.i < 6 ? sm(0.7, 1, q) : 1);
        const rx = $(".rx");
        rx.style.opacity = String(p.i < 6 ? sm(0.72, 1, q) : 1);
        rx.style.transform = `translateY(${mix(21, 8, q2)}px)`;
        $(".st1").style.opacity = String(1 - sm(0, 0.5, q2));
        $(".st2").style.opacity = String(sm(0.45, 1, q2));
      }
      const th = el.querySelector(".th");
      if (th) {
        th.style.opacity = String(sm(0.5, 1, p1));
        th.style.height = mix(52, 36, p2) + "px";
        th.querySelectorAll(":scope > span").forEach((s) => { s.style.top = mix(14, 6, p2) + "px"; });
      }
      // Біла «таблетка» перемикача їде під обраний вигляд.
      const k1 = TV.prog(t, K1, K1 + 380, e), k2 = TV.prog(t, K2, K2 + 380, e);
      const px = mix(mix(SEG[0][0], SEG[1][0], k1), SEG[2][0], k2);
      const pw = mix(mix(SEG[0][1], SEG[1][1], k1), SEG[2][1], k2);
      const pill = el.querySelector(".pill");
      if (pill) { pill.style.left = px + "px"; pill.style.width = pw + "px"; }
      const k = CLICKS.map(([ct, x, y]) => [ct, x - 10, y - 6]);
      TV.moveCursor(el.querySelector("#tb-cur"), t, {
        keys: [
          [K1 - 760, k[0][1] - 120, k[0][2] + 420],
          [K1 - 40, k[0][1], k[0][2]],
          [K1 + 700, k[0][1], k[0][2]],
          [SORT - 40, k[1][1], k[1][2]],
          [SORT + 700, k[1][1], k[1][2]],
          [K2 - 40, k[2][1], k[2][2]],
          [K2 + 160, k[2][1], k[2][2]],
          [K2 + 760, k[2][1] + 90, k[2][2] - 120],
        ],
        show: [K1 - 760, K2 + 640],
        clicks: CLICKS.map((c) => c[0]),
      });
    },
  });
})();
