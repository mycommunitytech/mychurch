/* Організатор подій — квиток конференції і стіна учасників (planning.ts →
   events.mock: «Конференція «Разом»», «186 зареєстровано», учасники й типи
   квитків: Стандарт, Студент, Сімейний ×3, Волонтер; нагадування — features).
   Стіна облич наповнюється, лічильник біжить до 186; четверо реєструються
   на очах — картка з квитком летить у свою клітинку. Наприкінці хвиля:
   кожен отримав нагадування в Telegram. */
// icons: ticket, send
(function () {
  const W = 900;
  const ACC = "#f59e0b";
  const TG = "#229ed9";
  const TYPE = {
    std: { name: "Стандарт", c: "#f59e0b" },
    stu: { name: "Студент", c: "#8b5bf0" },
    fam: { name: "Сімейний", c: "#f05b8b" },
    vol: { name: "Волонтер", c: "#12a150" },
  };
  // Квиток угорі, стіна облич під ним. У портреті стіна вища — більше облич.
  const TH = 320, PW = 606;
  const WY = 350, WHEAD = 86, FS = 66, GAP = 16, COLS = 10;
  const GXF = (W - (COLS * FS + (COLS - 1) * GAP)) / 2;
  const GYF = WY + WHEAD;
  const rowsFor = (o) => (o === "port" ? 6 : 4);
  const heightFor = (o) => GYF + rowsFor(o) * FS + (rowsFor(o) - 1) * GAP + 40;
  const slot = (i) => ({ x: GXF + (i % COLS) * (FS + GAP) + FS / 2, y: GYF + Math.floor(i / COLS) * (FS + GAP) + FS / 2 });

  // Фаза 1: зареєстровані раніше — обличчя злітаються врозкид, лічильник 0 → 180.
  // Імена тут лише задають, яке намальоване обличчя стоїть у клітинці.
  const NAMES = ["Оксана", "Марко", "Ірина", "Тарас", "Наталя", "Петро", "Софія", "Ігор", "Ніна", "Олег", "Аня",
    "Василь", "Катерина", "Богдан", "Юлія", "Роман", "Галина", "Максим", "Віра", "Сергій", "Людмила", "Павло",
    "Олександра", "Денис", "Тетяна", "Микола", "Інна", "Артем", "Лариса", "Остап", "Дарина", "Євген", "Вікторія"];
  const typeOf = (i) => (i % 7 === 2 ? "stu" : i % 9 === 5 ? "fam" : i % 11 === 7 ? "vol" : "std");
  const P0 = 900, P1 = 2800, BASE = 180;

  // Фаза 2: четверо реєструються на очах (імена й квитки — з макета модуля).
  const LIVE = [
    { who: "Олена Ковальчук", type: "std", faces: ["Олена"], at: 3000 },
    { who: "Дмитро Лис", type: "stu", faces: ["Дмитро"], at: 3650 },
    { who: "Марія Іщенко", type: "fam", label: "Сімейний ×3", faces: ["Марія", "Петро", "Софія"], at: 4300 },
    { who: "Андрій Мельник", type: "vol", faces: ["Андрій"], at: 4950 },
  ];
  const LIVE_N = LIVE.reduce((a, r) => a + r.faces.length, 0);
  const TOTAL = BASE + LIVE_N; // 186
  const FLY = 1080;
  const BUBBLE = LIVE[3].at + FLY + 120;
  const WAVE = BUBBLE + 250;
  const LANE = { x: W / 2 - 90, y: WY - 14 };
  // Скільки облич уміщає стіна: останні клітинки — живі реєстрації і «+N».
  const plan = (o) => {
    const crowd = rowsFor(o) * COLS - LIVE_N - 1;
    let k = crowd;
    const slots = LIVE.map((r) => r.faces.map(() => k++));
    const pop = (i) => P0 + ((i * 7) % crowd) * ((P1 - P0 - 200) / crowd);
    return { crowd, slots, last: k, rest: TOTAL - k, pop };
  };

  const ring = (c) => `box-shadow: 0 0 0 3px #fff, 0 0 0 6px ${c}`;
  const waveAt = (i) => WAVE + ((i % COLS) + Math.floor(i / COLS)) * 45;

  function face(name, i, d, type) {
    const p = slot(i);
    return `<div class="face" style="left:${p.x - FS / 2}px;top:${p.y - FS / 2 - WY}px">
      <div class="a-pop" style="--d:${d}ms;border-radius:50%;${ring(TYPE[type].c)}">${TV.avatar(name, FS)}</div>
      <span class="tg a-pop" style="--d:${waveAt(i)}ms">${TV.icon("send", 15, "#fff", 2.6)}</span></div>`;
  }

  TV.scene({
    id: "events",
    dur: 8400,
    bg: "light",
    css: `
[data-scene="events"] .mock { position: relative; width: ${W}px; --vs: 1; --vs-port: 1; }
[data-scene="events"] .ticket { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TH}px; display: flex; filter: drop-shadow(0 24px 40px rgba(10, 30, 70, 0.18)); }
[data-scene="events"] .poster { position: relative; width: ${PW}px; height: 100%; border-radius: 32px 18px 18px 32px; background: #121317; overflow: hidden; padding: 40px 44px; color: #fff;
  -webkit-mask: radial-gradient(circle 22px at 100% 0, transparent 21px, #000 22px) top / 100% 51% no-repeat, radial-gradient(circle 22px at 100% 100%, transparent 21px, #000 22px) bottom / 100% 51% no-repeat;
          mask: radial-gradient(circle 22px at 100% 0, transparent 21px, #000 22px) top / 100% 51% no-repeat, radial-gradient(circle 22px at 100% 100%, transparent 21px, #000 22px) bottom / 100% 51% no-repeat; }
[data-scene="events"] .poster .rings { position: absolute; right: -150px; top: -150px; width: 400px; height: 400px; }
[data-scene="events"] .poster .rings i { position: absolute; inset: var(--i); border-radius: 50%; border: 2px solid rgba(251, 191, 36, var(--a)); }
[data-scene="events"] .kind { position: relative; display: inline-flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 600; color: rgba(255, 255, 255, 0.72); letter-spacing: -0.01em; }
[data-scene="events"] .name { position: relative; margin-top: 10px; font-size: 128px; line-height: 1; font-weight: 800; letter-spacing: -0.05em; color: #fbbf24; }
[data-scene="events"] .types { position: absolute; left: 44px; right: 30px; bottom: 36px; display: flex; gap: 22px; flex-wrap: nowrap; }
[data-scene="events"] .types span { display: inline-flex; align-items: center; gap: 9px; font-size: 20px; font-weight: 600; color: rgba(255, 255, 255, 0.78); white-space: nowrap; }
[data-scene="events"] .types i { width: 12px; height: 12px; border-radius: 50%; }
[data-scene="events"] .stub { position: relative; flex: 1; height: 100%; border-radius: 18px 32px 32px 18px; background: #fff; display: flex; flex-direction: column; justify-content: center; padding: 0 34px;
  -webkit-mask: radial-gradient(circle 22px at 0 0, transparent 21px, #000 22px) top / 100% 51% no-repeat, radial-gradient(circle 22px at 0 100%, transparent 21px, #000 22px) bottom / 100% 51% no-repeat;
          mask: radial-gradient(circle 22px at 0 0, transparent 21px, #000 22px) top / 100% 51% no-repeat, radial-gradient(circle 22px at 0 100%, transparent 21px, #000 22px) bottom / 100% 51% no-repeat; }
[data-scene="events"] .perf { position: absolute; left: ${PW}px; top: 30px; bottom: 30px; border-left: 3px dashed rgba(0, 0, 0, 0.14); z-index: 2; }
[data-scene="events"] .stub .ico { width: 56px; height: 56px; border-radius: 16px; background: color-mix(in oklab, ${ACC} 16%, #fff); display: flex; align-items: center; justify-content: center; }
[data-scene="events"] .stub .lbl { margin-top: 22px; font-size: 24px; font-weight: 550; color: var(--ink-3); }
[data-scene="events"] .stub .n { font-size: 104px; line-height: 1; font-weight: 800; letter-spacing: -0.05em; font-variant-numeric: tabular-nums; margin-top: 6px; }
[data-scene="events"] .wall { position: absolute; left: 0; top: ${WY}px; width: ${W}px; bottom: 0; }
[data-scene="events"] .wall .hd { position: absolute; left: 36px; right: 28px; top: 0; height: ${WHEAD}px; display: flex; align-items: center; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
[data-scene="events"] .st { position: absolute; right: 0; top: 50%; margin-top: -25px; height: 50px; display: flex; align-items: center; gap: 10px; padding: 0 22px 0 18px; border-radius: 999px;
  font-size: 22px; font-weight: 650; white-space: nowrap; }
[data-scene="events"] .st.open { background: var(--green-soft); color: #0e7a3c; }
[data-scene="events"] .st.open i { width: 12px; height: 12px; border-radius: 50%; background: var(--green); animation: ev-live 1400ms ease-in-out infinite; }
@keyframes ev-live { 50% { box-shadow: 0 0 0 7px rgba(18, 161, 80, 0.18); } }
[data-scene="events"] .st.sent { background: ${TG}; color: #fff; }
[data-scene="events"] .face { position: absolute; width: ${FS}px; height: ${FS}px; }
[data-scene="events"] .face .avatar { display: block; }
[data-scene="events"] .tg { position: absolute; right: -9px; bottom: -9px; width: 32px; height: 32px; border-radius: 50%; background: ${TG}; border: 3px solid #fff;
  display: flex; align-items: center; justify-content: center; }
[data-scene="events"] .more { position: absolute; width: ${FS}px; height: ${FS}px; border-radius: 50%; background: var(--surface-3); box-shadow: inset 0 0 0 2px var(--hairline-strong);
  display: flex; align-items: center; justify-content: center; font-size: 21px; font-weight: 700; color: var(--ink-2); letter-spacing: -0.03em; }
[data-scene="events"] .toast { position: absolute; z-index: 10; display: flex; align-items: center; gap: 14px; padding: 10px 14px 10px 10px; border-radius: 999px; background: #fff; white-space: nowrap;
  box-shadow: 0 0 0 1px var(--hairline), var(--shadow-pop); animation: ev-toast ${FLY}ms var(--e-emph) var(--d) both; }
@keyframes ev-toast {
  0% { opacity: 0; transform: translate(-50%, -50%) translate3d(0, 34px, 0) scale(0.9); }
  16% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  52% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) translate3d(var(--tx), var(--ty), 0) scale(0.2); }
}
[data-scene="events"] .toast b { font-size: 25px; font-weight: 650; letter-spacing: -0.015em; }
[data-scene="events"] .toast em { font-style: normal; font-size: 21px; font-weight: 650; padding: 7px 14px; border-radius: 999px; }
`,
    html: (o) => {
      const P = plan(o);
      const crowd = Array.from({ length: P.crowd }, (_, i) => face(NAMES[i % NAMES.length] + (i >= NAMES.length ? i : ""), i, P.pop(i), typeOf(i))).join("");
      const live = LIVE.map((r, j) => r.faces.map((n, k) => face(n, P.slots[j][k], r.at + FLY - 60 + k * 90, r.type)).join("")).join("");
      const toasts = LIVE.map((r, j) => {
        const a = slot(P.slots[j][0]), b = slot(P.slots[j][r.faces.length - 1]);
        const tx = (a.x + b.x) / 2 - LANE.x, ty = a.y - LANE.y;
        const t = TYPE[r.type];
        return `<div class="toast" style="left:${LANE.x}px;top:${LANE.y}px;--d:${r.at}ms;--tx:${tx}px;--ty:${ty}px">${TV.avatar(r.faces[0], 52)}<b>${TV.esc(r.who)}</b>
          <em style="color:color-mix(in oklab, ${t.c} 75%, #0b0b0f);background:color-mix(in oklab, ${t.c} 15%, #fff)">${TV.esc(r.label || t.name)}</em></div>`;
      }).join("");
      const more = slot(P.last);
      const types = Object.values(TYPE).map((t) => `<span><i style="background:${t.c}"></i>${t.name}</span>`).join("");
      return `
<div class="split ${o === "port" ? "" : "flip"}">
  ${TV.copy({ title: "Організатор подій", line: "Реєстрація, списки учасників і нагадування — самі." })}
  <div class="vis"><div class="mock" style="height:${heightFor(o)}px">
    <div class="ticket a-rise" style="--d:250ms">
      <div class="poster"><div class="rings">${[0, 50, 100, 150].map((i, k) => `<i style="--i:${i}px;--a:${0.1 + k * 0.07}"></i>`).join("")}</div>
        <div class="kind">${TV.icon("ticket", 26, "#fbbf24", 2.2)}Конференція</div>
        <div class="name">«Разом»</div>
        <div class="types">${types}</div>
      </div>
      <div class="perf"></div>
      <div class="stub">
        <span class="ico">${TV.icon("ticket", 30, ACC, 2.2)}</span>
        <div class="lbl">Зареєстровано</div>
        <div class="n">0</div>
      </div>
    </div>
    <div class="wall card a-rise" style="--d:420ms">
      <div class="hd">Учасники
        <span class="st open a-outf" style="--d:${WAVE}ms"><i></i>Реєстрація відкрита</span>
        <span class="st sent a-pop" style="--d:${WAVE}ms">${TV.icon("send", 22, "#fff", 2.4)}Нагадування надіслано</span>
      </div>
      ${crowd}${live}
      <div class="more a-pop" style="left:${more.x - FS / 2}px;top:${more.y - FS / 2 - WY}px;--d:${BUBBLE}ms">+${P.rest}</div>
    </div>
    ${toasts}
  </div></div>
</div>`;
    },
    tick(t, el) {
      let n = TV.count(t, P0, P1, 0, BASE, TV.ease.decel);
      LIVE.forEach((r) => r.faces.forEach((_, k) => { if (t >= r.at + FLY - 60 + k * 90) n++; }));
      const b = el.querySelector(".stub .n");
      if (b && b.textContent !== String(n)) b.textContent = n;
    },
  });
})();
