/* Календар — тиждень церкви на одній сітці (planning.ts → calendar.mock:
   «Календар церкви», «Тиждень 14–20 вересня · 11 подій»; групи й години —
   з i18n.ts → homeGroups, служіння 10:00–11:40 — з servicePlanning).
   Події падають у свої клітинки, кожне служіння своїм кольором, лічильник
   росте до 11. Андрій сам «малює» зустріч своєї групи в четвер 19:00,
   а червона лінія «зараз» доходить до неї — і група починається. */
// icons: calendar-days, repeat
(function () {
  const ACC = "#3b82f6";
  const NOW_C = "#ef4444";
  const W = 950, H0 = 9, H1 = 21, GX = 62, GY = 184;
  // У портреті місця вдвічі більше по висоті — година стає вищою.
  const geo = (o) => {
    const PPH = o === "port" ? 80 : 54;
    const GR = W - 12, CW = (GR - GX) / 7;
    return { PPH, GR, CW, H: GY + (H1 - H0) * PPH + 20 };
  };
  const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
  const DATES = [14, 15, 16, 17, 18, 19, 20];
  const TODAY = 3;
  const C = { service: "#0069e0", guests: "#f97316", lead: "#64748b", prayer: "#8b5bf0", worship: "#f05b8b", group: "#0d9488", room: "#f59e0b", youth: "#0ea5e9" };
  // [день, початок, кінець, назва, колір, рядків у назві]
  const EV = [
    [0, 19, 20.5, "Лідери", C.lead, 1],
    [1, 10, 11, "Молитва", C.prayer, 1],
    [2, 17, 19, "Репетиція", C.worship, 1],
    [2, 19.5, 21, "Жіноча група", C.group, 2],
    [3, 11, 13, "Бронь зали", C.room, 2],
    [4, 19, 21, "Сімейна група", C.group, 2],
    [5, 14, 16, "Молодіжка", C.youth, 1],
    [5, 17, 18.5, "Чоловіча група", C.group, 2],
    [6, 10, 11 + 40 / 60, "Служіння", C.service, 1],
    [6, 12, 14, "Зустріч гостей", C.guests, 2],
  ];
  // Порядок падіння — врозкид, як збирається справжній тиждень. Між діями — пауза
  // ≥1,2 с (падіння → Андрій → «Зараз»), фінал стоїть ≥1,5 с.
  const DROP = [8, 1, 4, 6, 0, 2, 9, 5, 3, 7];
  const D0 = 800, STEP = 220;
  const landAt = (i) => D0 + DROP.indexOf(i) * STEP;

  // Андрій малює свою групу: натискає в четвер о 19:00 і тягне до 21:00.
  const MINE = { day: 3, s: 19, e: 21, title: "Група Андрія", c: C.group };
  const PRESS = 5500, RELEASE = 6300;

  // Лінія «зараз»: четвер, 15:00 → 19:00, де й зупиняється — група почалась.
  const N0 = 1000, LIVE = 7600, NH0 = 15;
  const soft = TV.bezier(0.3, 0.1, 0.3, 1);
  const nowH = (t) => NH0 + (MINE.s - NH0) * soft(TV.clamp((t - N0) / (LIVE - N0)));

  const plural = (n) => {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return "подія";
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return "події";
    return "подій";
  };
  const hhmm = (h) => {
    const m = Math.round(h * 60);
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
  };
  const deep = (c) => `color-mix(in oklab, ${c} 72%, #0b0b0f)`;
  const tint = (c, p) => `color-mix(in oklab, ${c} ${p}%, #fff)`;

  TV.scene({
    id: "calendar",
    dur: 9800,
    bg: "light",
    css: `
[data-scene="calendar"] .mock { position: relative; width: ${W}px; --vs: 0.95; --vs-port: 0.945; }
[data-scene="calendar"] .board { position: absolute; inset: 0; overflow: hidden; }
[data-scene="calendar"] .head { position: absolute; left: 0; right: 0; top: 0; height: 100px; display: flex; align-items: center; gap: 18px; padding: 0 28px;
  border-bottom: 1px solid var(--hairline); }
[data-scene="calendar"] .ico { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: ${tint(ACC, 14)}; }
[data-scene="calendar"] .h1 { font-size: 29px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
[data-scene="calendar"] .h2 { font-size: 22px; font-weight: 500; color: var(--ink-3); margin-top: 4px; }
[data-scene="calendar"] .cnt { margin-left: auto; height: 50px; padding: 0 22px; border-radius: 999px; display: flex; align-items: center; gap: 8px;
  background: ${tint(ACC, 12)}; color: ${deep(ACC)}; font-size: 24px; font-weight: 600; font-variant-numeric: tabular-nums; }
[data-scene="calendar"] .cnt b { font-weight: 800; }
[data-scene="calendar"] .dh { position: absolute; top: 100px; height: 84px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
[data-scene="calendar"] .dh i { font-style: normal; font-size: 20px; font-weight: 600; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.04em; }
[data-scene="calendar"] .dh b { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 27px; font-weight: 650; letter-spacing: -0.02em; }
[data-scene="calendar"] .dh.today i { color: ${ACC}; }
[data-scene="calendar"] .dh.today b { background: ${ACC}; color: #fff; }
[data-scene="calendar"] .col { position: absolute; top: ${GY}px; border-left: 1px solid var(--hairline); }
[data-scene="calendar"] .col.today { background: ${tint(ACC, 5)}; }
[data-scene="calendar"] .hr { position: absolute; left: ${GX}px; right: 12px; height: 1px; background: var(--hairline); }
[data-scene="calendar"] .ax { position: absolute; left: 0; width: ${GX - 10}px; text-align: right; transform: translateY(-50%); font-size: 20px; font-weight: 500; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-scene="calendar"] .ev, [data-scene="calendar"] .mine { position: absolute; border-radius: 12px; padding: 7px 3px 0 11px; overflow: hidden; }
[data-scene="calendar"] .ev { box-shadow: inset 5px 0 0 var(--c); animation: cal-drop 720ms var(--e-spring) var(--d) both; }
@keyframes cal-drop {
  0% { opacity: 0; transform: translate3d(0, -40px, 0) scale(0.9); }
  45% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}
[data-scene="calendar"] .ev b, [data-scene="calendar"] .mine b { display: block; font-size: 20px; line-height: 23px; font-weight: 650; letter-spacing: -0.025em; white-space: nowrap; }
[data-scene="calendar"] .ev span { display: block; margin-top: 3px; font-size: 20px; line-height: 23px; font-weight: 500; color: var(--ink-3); font-variant-numeric: tabular-nums; }
[data-scene="calendar"] .mine { opacity: 0; background: ${tint(MINE.c, 22)}; }
[data-scene="calendar"] .mine b { color: ${deep(MINE.c)}; }
[data-scene="calendar"] .mine .tm { position: relative; margin-top: 3px; height: 23px; font-size: 20px; line-height: 23px; font-weight: 500; color: var(--ink-3); }
[data-scene="calendar"] .mine .tm > span, [data-scene="calendar"] .mine .tm > span > span { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 6px; white-space: nowrap; font-variant-numeric: tabular-nums; }
[data-scene="calendar"] .mine .live { color: ${NOW_C}; font-weight: 650; }
[data-scene="calendar"] .mine .live i { width: 10px; height: 10px; border-radius: 50%; background: ${NOW_C}; animation: cal-pulse 1100ms ease-in-out infinite; }
@keyframes cal-pulse { 50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.22); } }
[data-scene="calendar"] .ring { position: absolute; border-radius: 15px; box-shadow: 0 0 0 3px ${NOW_C}; }
[data-scene="calendar"] .now { position: absolute; left: 0; right: 12px; top: 0; height: 0; }
[data-scene="calendar"] .now .all { position: absolute; left: ${GX}px; right: 0; top: -1px; height: 2px; background: rgba(239, 68, 68, 0.3); }
[data-scene="calendar"] .now .seg { position: absolute; top: -1.5px; height: 3px; background: ${NOW_C}; }
[data-scene="calendar"] .now .dot { position: absolute; top: -7px; width: 14px; height: 14px; border-radius: 50%; background: ${NOW_C}; }
[data-scene="calendar"] .now .nowt { position: absolute; left: 4px; top: -16px; height: 32px; width: ${GX}px; z-index: 2; border-radius: 9px; background: ${NOW_C}; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 650; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
`,
    html: (o) => {
      const { PPH, CW, H } = geo(o);
      const y = (h) => GY + (h - H0) * PPH;
      const x = (d) => GX + d * CW;
      const mx = x(MINE.day) + 3, my = y(MINE.s) + 2, mw = CW - 6, mh = (MINE.e - MINE.s) * PPH - 4;
      const hours = [];
      for (let h = H0 + 1; h < H1; h++) {
        hours.push(`<div class="hr" style="top:${y(h)}px"></div>`);
        if (h % 2 === 0) hours.push(`<div class="ax" style="top:${y(h)}px">${h}:00</div>`);
      }
      const cols = DAYS.map((d, i) => `<div class="col ${i === TODAY ? "today" : ""}" style="left:${x(i)}px;width:${CW}px;height:${(H1 - H0) * PPH}px"></div>`).join("");
      const heads = DAYS.map((d, i) => `<div class="dh ${i === TODAY ? "today" : ""}" style="left:${x(i)}px;width:${CW}px"><i>${d}</i><b>${DATES[i]}</b></div>`).join("");
      const events = EV.map(([d, s, e, title, c, lines], i) => {
        const h = (e - s) * PPH - 4;
        const withTime = h >= 7 + lines * 23 + 30;
        return `<div class="ev" style="left:${x(d) + 3}px;top:${y(s) + 2}px;width:${CW - 6}px;height:${h}px;--c:${c};background:${tint(c, 16)};--d:${landAt(i)}ms">
      <b style="color:${deep(c)}">${TV.esc(title).replace(" ", "<br>")}</b>${withTime ? `<span>${hhmm(s)}</span>` : ""}</div>`;
      }).join("");
      const px = mx + 44, py = my + 12;
      return `
<div class="split">
  ${TV.copy({ title: "Календар", line: "Усе — в одному календарі." })}
  <div class="vis"><div class="mock" style="height:${H}px">
    <div class="board card a-rise" style="--d:250ms">
      <div class="head">
        <span class="ico">${TV.icon("calendar-days", 30, ACC, 2.2)}</span>
        <div><div class="h1">Календар церкви</div><div class="h2">Тиждень 14–20 вересня</div></div>
        <span class="cnt a-pop" style="--d:${D0 + 120}ms"><b class="n">0</b><span class="u">подій</span></span>
      </div>
      ${heads}
      ${cols}
      ${hours.join("")}
      <div class="now a-fade" style="--d:${N0 - 200}ms"><div class="all"></div>
        <div class="seg" style="left:${x(TODAY)}px;width:${CW}px"></div><div class="dot" style="left:${x(TODAY) - 7}px"></div><div class="nowt">15:00</div></div>
      ${events}
      <div class="ring a-fade" style="left:${mx - 4}px;top:${my - 4}px;width:${mw + 8}px;height:${mh + 8}px;--d:${LIVE}ms"></div>
      <div class="mine" style="left:${mx}px;top:${my}px;width:${mw}px">
        <b class="a-fade" style="--d:${RELEASE + 40}ms">Група<br>Андрія</b>
        <div class="tm">
          <span class="a-outf" style="--d:${LIVE}ms"><span class="a-fade" style="--d:${RELEASE + 120}ms">19:00 ${TV.icon("repeat", 18, "currentColor", 2.4)}</span></span>
          <span class="live a-pop" style="--d:${LIVE}ms"><i></i>Зараз</span>
        </div>
      </div>
    </div>
    ${TV.tap(px, py, PRESS, MINE.c)}
    ${TV.tap(px, my + mh - 10, RELEASE, MINE.c)}
    ${TV.cursor("Андрій", MINE.c, "cal-c")}
  </div></div>
</div>`;
    },
    tick(t, el, o) {
      const { PPH, CW, H } = geo(o);
      const y = (h) => GY + (h - H0) * PPH;
      const mx = GX + MINE.day * CW + 3, my = y(MINE.s) + 2, mh = (MINE.e - MINE.s) * PPH - 4;

      // Лічильник подій — скільки вже впало (плюс група Андрія).
      const n = EV.filter((_, i) => t >= landAt(i) + 220).length + (t >= RELEASE ? 1 : 0);
      const b = el.querySelector(".cnt .n"), w = el.querySelector(".cnt .u");
      if (b && b.textContent !== String(n)) { b.textContent = n; w.textContent = plural(n); }

      // Лінія «зараз».
      const now = el.querySelector(".now");
      if (now) {
        const h = nowH(t);
        now.style.transform = `translate3d(0, ${y(h)}px, 0)`;
        const lbl = now.querySelector(".nowt"), s = hhmm(Math.floor(h * 12 + 1e-6) / 12);
        if (lbl.textContent !== s) lbl.textContent = s;
      }

      // Андрій тягне блок від 19:00 до 21:00; відпустив — блок лягає пласко.
      const mine = el.querySelector(".mine");
      if (mine) {
        const grow = TV.prog(t, PRESS + 60, RELEASE, TV.ease.inout);
        mine.style.opacity = t < PRESS ? "0" : String(TV.prog(t, PRESS, PRESS + 120, TV.ease.linear));
        mine.style.height = `${TV.mix(PPH / 2 - 4, mh, grow)}px`;
        const lift = 1 - TV.prog(t, RELEASE, RELEASE + 300, TV.ease.decel);
        mine.style.boxShadow = `inset 5px 0 0 ${MINE.c}, 0 ${16 * lift}px ${32 * lift}px -14px rgba(13, 100, 90, ${0.55 * lift})`;
      }
      const px = mx + 44 - 10, py = my + 12 - 6;
      const cur = el.querySelector("#cal-c");
      TV.moveCursor(cur, t, {
        keys: [[PRESS - 800, mx + 300, H - 30], [PRESS - 60, px, py], [PRESS + 60, px, py], [RELEASE, px, my + mh - 16], [RELEASE + 500, px + 70, my + mh + 30]],
        show: [PRESS - 800, RELEASE + 560],
        clicks: [PRESS, RELEASE],
      });
      // Поки кнопка затиснута, стрілка лишається «натиснутою».
      if (cur && t > PRESS && t < RELEASE - 90) cur.firstElementChild.style.transform = "scale(0.8)";
    },
  });
})();
